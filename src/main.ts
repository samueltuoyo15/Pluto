import plugin from '../plugin.json';
import { injectStyles, removeStyles } from './styles';
import { ChatView } from './ChatView';
import { Message, FileChange, Agent } from './types';
import { GroqClient } from './ai/groq';
import { getPendingChanges, clearPendingChanges, acceptChange, rejectChange, revertChange } from './ai/tools';

const sideBarApps = acode.require('sidebarApps');
const Url = acode.require('url');

const SETTINGS_KEY = 'pluto_groq_api_key';
const SETTINGS_MODEL = 'pluto_groq_model';

class PlutoPlugin {
  private static readonly SIDEBAR_ICON = 'pluto';
  private static readonly SIDEBAR_ICON_PATH = 'assets/pluto.svg';

  public baseUrl: string | undefined;
  private chatView: ChatView | null = null;
  private messages: Message[] = [];
  private groq: GroqClient;
  private settingsEl: HTMLElement | null = null;
  private panelHost: HTMLElement | null = null;
  private sidebarContainer: HTMLElement | null = null;

  constructor() {
    const savedKey = this.loadSetting(SETTINGS_KEY) || '';
    const savedModel = this.loadSetting(SETTINGS_MODEL) || 'llama-3.3-70b-versatile';
    this.groq = new GroqClient(savedKey, savedModel);
  }

  async init(): Promise<void> {
    if (!sideBarApps || !this.baseUrl) return;

    injectStyles();

    acode.addIcon(
      PlutoPlugin.SIDEBAR_ICON,
      await acode.toInternalUrl(Url.join(this.baseUrl, PlutoPlugin.SIDEBAR_ICON_PATH)),
    );

    sideBarApps.add(
      PlutoPlugin.SIDEBAR_ICON,
      plugin.id,
      plugin.name,
      (container: HTMLElement) => {
        this.sidebarContainer = container;
        container.innerHTML = '<div class="pluto-sidebar-proxy"></div>';
      },
      false,
      () => {
        this.openPanel();
      },
    );
  }

  private initChatView(container: HTMLElement): void {
    this.chatView = new ChatView(container, {
      onBack: () => this.closePanel(),
      onSend: (text) => this.handleUserMessage(text),
      onAcceptFile: (fp) => this.handleAcceptFile(fp),
      onRejectFile: (fp) => this.handleRejectFile(fp),
      onAcceptAll: () => this.handleAcceptAll(),
      onRejectAll: () => this.handleRejectAll(),
      onRevertAll: () => this.handleRevertAll(),
      onAddContext: () => this.handleAddContext(),
      onRemoveContext: (f) => this.chatView?.removeContextFile(f),
      onAgentChange: (agent) => this.handleAgentChange(agent),
      onSettingsOpen: () => this.showSettings(),
      onNewChat: () => this.handleNewChat(),
    });

    this.syncContextState();
  }

  private openPanel(): void {
    if (this.panelHost) {
      this.panelHost.style.display = 'block';
      this.syncContextState();
      return;
    }

    const host = document.createElement('div');
    host.className = 'pluto-overlay-host';
    document.body.appendChild(host);
    this.panelHost = host;
    this.initChatView(host);
  }

  private closePanel(): void {
    if (!this.panelHost) return;
    this.panelHost.style.display = 'none';
    this.settingsEl?.remove();
    this.settingsEl = null;
  }

  private syncContextState(): void {
    const chatView = this.chatView;
    if (!chatView) return;

    try {
      const activeFile = editorManager?.activeFile;
      if (activeFile?.filename) {
        chatView.addContextFile(activeFile.filename);
      }
    } catch (_) { }

    if (!this.hasApiKey()) {
      chatView.setBlockedState(true, {
        title: 'Add your Groq API key first',
        body: 'Pluto is disabled until a valid API key is set. You can hardcode it or save it from settings.',
        actionLabel: 'Open settings',
        action: () => this.showSettings(),
        reason: 'Add your Groq API key in Settings before sending a message.',
      });
      return;
    }

    if (!this.hasWorkspaceContext()) {
      chatView.setBlockedState(true, {
        title: 'Open a file or project first',
        body: 'Pluto only works against real editor context. Open a file, folder, or project, then come back here.',
        actionLabel: 'Back to editor',
        action: () => this.closePanel(),
        reason: 'Open a file, folder, or project first.',
      });
      return;
    }

    chatView.setBlockedState(false);
  }

  private async handleUserMessage(text: string): Promise<void> {
    this.syncContextState();
    if (!this.hasApiKey() || !this.hasWorkspaceContext()) {
      return;
    }

    const userMsg: Message = {
      id: uid(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    this.messages.push(userMsg);
    this.chatView?.addMessage(userMsg);
    this.chatView?.setGenerating(true);
    this.chatView?.showTyping(true);

    try {
      const reply = await this.groq.sendMessage(text, (toolName, filename) => {
        this.chatView?.showTyping(false);
        this.chatView?.showToolActivity(toolName, filename);
      });

      this.chatView?.showTyping(false);
      this.chatView?.clearToolActivity();

      const pending = getPendingChanges();

      const agentMsg: Message = {
        id: uid(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
        fileChanges: pending.length > 0 ? [...pending] : undefined,
      };
      this.messages.push(agentMsg);
      this.chatView?.addMessage(agentMsg);

      if (pending.length > 0) {
        this.chatView?.updateDiffBar(pending);
      }
    } catch (err) {
      this.chatView?.showTyping(false);
      this.chatView?.clearToolActivity();

      const errMsg: Message = {
        id: uid(),
        role: 'assistant',
        content: 'Something went wrong. Check your API key in settings.',
        timestamp: Date.now(),
      };
      this.messages.push(errMsg);
      this.chatView?.addMessage(errMsg);
    }

    this.chatView?.setGenerating(false);
  }

  private handleAcceptFile(filepath: string): void {
    const ok = acceptChange(filepath);
    if (ok) {
      acode.pushNotification?.('Pluto', `Applied changes to ${filepath}`, { type: 'success' });
    }
    this.refreshDiffBar();
  }

  private handleRejectFile(filepath: string): void {
    rejectChange(filepath);
    acode.pushNotification?.('Pluto', `Rejected changes to ${filepath}`, { type: 'info' });
    this.refreshDiffBar();
  }

  private handleAcceptAll(): void {
    const pending = getPendingChanges();
    pending.forEach(c => acceptChange(c.filepath));
    acode.pushNotification?.('Pluto', 'Applied all changes', { type: 'success' });
    this.refreshDiffBar();
  }

  private handleRejectAll(): void {
    const pending = getPendingChanges();
    pending.forEach(c => rejectChange(c.filepath));
    acode.pushNotification?.('Pluto', 'Rejected all changes', { type: 'info' });
    this.refreshDiffBar();
  }

  private handleRevertAll(): void {
    const pending = getPendingChanges();
    pending.forEach(c => revertChange(c.filepath));
    clearPendingChanges();
    acode.pushNotification?.('Pluto', 'Reverted all changes', { type: 'info' });
    this.refreshDiffBar();
  }

  private refreshDiffBar(): void {
    this.chatView?.updateDiffBar(getPendingChanges());
  }

  private handleAddContext(): void {
    try {
      const activeFile = editorManager?.activeFile;
      if (activeFile?.filename) {
        this.chatView?.addContextFile(activeFile.filename);
        this.syncContextState();
      }
    } catch (_) { }
  }

  private handleAgentChange(agent: Agent): void {
    this.groq.setModel(agent.model);
    this.saveSetting(SETTINGS_MODEL, agent.model);
  }

  private handleNewChat(): void {
    this.messages = [];
    clearPendingChanges();
    this.groq.clearHistory();
    this.chatView?.clearMessages();
  }

  private showSettings(): void {
    if (!this.panelHost) return;
    if (this.settingsEl) { this.settingsEl.remove(); this.settingsEl = null; return; }

    const overlay = document.createElement('div');
    overlay.className = 'pluto-settings';

    const header = document.createElement('div');
    header.className = 'pluto-settings-header';
    header.innerHTML = `
      <button class="pluto-settings-back">&#8592;</button>
      <span class="pluto-settings-title">Settings</span>
    `;
    header.querySelector('.pluto-settings-back')!.addEventListener('click', () => {
      overlay.remove();
      this.settingsEl = null;
    });

    const body = document.createElement('div');
    body.className = 'pluto-settings-body';

    const currentKey = this.loadSetting(SETTINGS_KEY) || '';
    const currentModel = this.loadSetting(SETTINGS_MODEL) || 'llama-3.3-70b-versatile';

    body.innerHTML = `
      <div class="pluto-settings-field">
        <label class="pluto-settings-label">Groq API Key</label>
        <textarea class="pluto-settings-input pluto-settings-textarea" id="pluto-api-key" placeholder="gsk_..." autocomplete="off">${currentKey}</textarea>
        <div class="pluto-settings-hint">This key is stored on your device and used for Groq requests from Pluto.</div>
      </div>
      <div class="pluto-settings-field">
        <label class="pluto-settings-label">Model</label>
        <input class="pluto-settings-input" id="pluto-model" type="text" value="${currentModel}" autocomplete="off" />
        <div class="pluto-settings-hint">Change the Groq model if you want a faster or stronger default.</div>
      </div>
      <button class="pluto-settings-save" id="pluto-save-settings">Save settings</button>
    `;

    body.querySelector('#pluto-save-settings')!.addEventListener('click', () => {
      const keyInput = body.querySelector('#pluto-api-key') as HTMLTextAreaElement;
      const modelInput = body.querySelector('#pluto-model') as HTMLInputElement;
      const key = keyInput.value.trim();
      const model = modelInput.value.trim() || 'llama-3.3-70b-versatile';
      this.saveSetting(SETTINGS_KEY, key);
      this.saveSetting(SETTINGS_MODEL, model);
      this.groq.setApiKey(key);
      this.groq.setModel(model);
      overlay.remove();
      this.settingsEl = null;
      this.syncContextState();
      acode.pushNotification?.('Pluto', 'Settings saved', { type: 'success' });
    });

    overlay.appendChild(header);
    overlay.appendChild(body);
    this.panelHost.appendChild(overlay);
    this.settingsEl = overlay;
  }

  private hasApiKey(): boolean {
    return !!(this.loadSetting(SETTINGS_KEY) || '').trim();
  }

  private hasWorkspaceContext(): boolean {
    try {
      if (editorManager?.activeFile?.session) return true;
      if ((editorManager?.files?.length ?? 0) > 0) return true;
      if (((window as any).addedFolder?.length ?? 0) > 0) return true;
    } catch (_) {}
    return false;
  }

  private saveSetting(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (_) { }
  }

  private loadSetting(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  async destroy(): Promise<void> {
    this.panelHost?.remove();
    sideBarApps.remove(plugin.id);
    removeStyles();
  }
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

if (window.acode) {
  const plutoPlugin = new PlutoPlugin();
  acode.setPluginInit(
    plugin.id,
    async (baseUrl: string) => {
      if (!baseUrl.endsWith('/')) baseUrl += '/';
      plutoPlugin.baseUrl = baseUrl;
      await plutoPlugin.init();
    },
  );
  acode.setPluginUnmount(plugin.id, () => {
    plutoPlugin.destroy();
  });
}
