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
  private container: HTMLElement | null = null;

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
        this.container = container;
        this.initChatView(container);
      },
      false,
      (_container: HTMLElement) => { },
    );
  }

  private initChatView(container: HTMLElement): void {
    this.chatView = new ChatView(container, {
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

    try {
      const activeFile = editorManager?.activeFile;
      if (activeFile?.filename) {
        this.chatView.addContextFile(activeFile.filename);
      }
    } catch (_) { }
  }

  private async handleUserMessage(text: string): Promise<void> {
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
    if (!this.container) return;
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

    body.innerHTML = `
      <div class="pluto-settings-field">
        <label class="pluto-settings-label">Groq API Key</label>
        <input class="pluto-settings-input" id="pluto-api-key" type="password" placeholder="gsk_..." value="${currentKey}" autocomplete="off" />
        <div class="pluto-settings-hint">Get a free key at console.groq.com. It stays on your device.</div>
      </div>
      <button class="pluto-settings-save" id="pluto-save-settings">Save</button>
    `;

    body.querySelector('#pluto-save-settings')!.addEventListener('click', () => {
      const keyInput = body.querySelector('#pluto-api-key') as HTMLInputElement;
      const key = keyInput.value.trim();
      this.saveSetting(SETTINGS_KEY, key);
      this.groq.setApiKey(key);
      overlay.remove();
      this.settingsEl = null;
      acode.pushNotification?.('Pluto', 'Settings saved', { type: 'success' });
    });

    overlay.appendChild(header);
    overlay.appendChild(body);
    this.container.style.position = 'relative';
    this.container.appendChild(overlay);
    this.settingsEl = overlay;
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
