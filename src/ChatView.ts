import { Message, FileChange, Agent } from './types';
import { createHeader } from './components/Header';
import { createContextBar, ContextBarHandle } from './components/ContextBar';
import { createWelcome } from './components/Welcome';
import { createInputArea, InputAreaHandle } from './components/InputArea';
import { createDiffBar, DiffBarHandle } from './components/DiffBar';
import { renderMessage, createTypingIndicator, createToolActivity } from './components/MessageRenderer';

export interface ChatViewCallbacks {
  onBack: () => void;
  onSend: (text: string) => void;
  onAcceptFile: (filepath: string) => void;
  onRejectFile: (filepath: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onRevertAll: () => void;
  onAddContext: () => void;
  onRemoveContext: (file: string) => void;
  onAgentChange: (agent: Agent) => void;
  onSettingsOpen: () => void;
  onNewChat: () => void;
}

export class ChatView {
  private root: HTMLElement;
  private messagesEl: HTMLElement;
  private welcomeEl: HTMLElement;
  private typingEl: HTMLElement;
  private stateEl: HTMLElement;
  private stateTitleEl: HTMLElement;
  private stateBodyEl: HTMLElement;
  private stateActionEl: HTMLButtonElement;
  private toolActivityEls: HTMLElement[] = [];
  private contextBar: ContextBarHandle;
  private inputArea: InputAreaHandle;
  private diffBar: DiffBarHandle;
  private hasMessages = false;
  private opts: ChatViewCallbacks;

  constructor(container: HTMLElement, opts: ChatViewCallbacks) {
    this.opts = opts;
    this.root = document.createElement('div');
    this.root.className = 'pluto';

    this.root.appendChild(createHeader({
      onBack: opts.onBack,
      onSettingsOpen: opts.onSettingsOpen,
      onNewChat: opts.onNewChat,
    }));

    this.diffBar = createDiffBar({
      onAcceptFile: opts.onAcceptFile,
      onRejectFile: opts.onRejectFile,
      onAcceptAll: opts.onAcceptAll,
      onRejectAll: opts.onRejectAll,
      onRevertAll: opts.onRevertAll,
    });
    this.root.appendChild(this.diffBar.el);

    this.contextBar = createContextBar({
      onAddContext: opts.onAddContext,
      onRemoveContext: opts.onRemoveContext,
    });
    this.root.appendChild(this.contextBar.el);

    this.stateEl = document.createElement('div');
    this.stateEl.className = 'pluto-state';
    this.stateEl.style.display = 'none';
    this.stateEl.innerHTML = `
      <div class="pluto-state-copy">
        <div class="pluto-state-title"></div>
        <div class="pluto-state-body"></div>
      </div>
      <button class="pluto-secondary-btn">Open settings</button>
    `;
    this.stateTitleEl = this.stateEl.querySelector('.pluto-state-title') as HTMLElement;
    this.stateBodyEl = this.stateEl.querySelector('.pluto-state-body') as HTMLElement;
    this.stateActionEl = this.stateEl.querySelector('.pluto-secondary-btn') as HTMLButtonElement;
    this.root.appendChild(this.stateEl);

    this.welcomeEl = createWelcome((text) => {
      opts.onSend(text);
    }, opts.onSettingsOpen);
    this.root.appendChild(this.welcomeEl);

    this.messagesEl = document.createElement('div');
    this.messagesEl.className = 'pluto-messages';
    this.messagesEl.style.display = 'none';
    this.root.appendChild(this.messagesEl);

    this.typingEl = createTypingIndicator();
    this.typingEl.style.display = 'none';
    this.messagesEl.appendChild(this.typingEl);

    this.inputArea = createInputArea({
      onSend: opts.onSend,
      onAgentChange: opts.onAgentChange,
    });
    this.root.appendChild(this.inputArea.el);

    this.messagesEl.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('pluto-code-copy')) {
        const code = target.getAttribute('data-code') || '';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).catch(() => {});
        }
        target.textContent = 'copied';
        setTimeout(() => { target.textContent = 'copy'; }, 1500);
      }
    });

    container.innerHTML = '';
    container.appendChild(this.root);
  }

  addMessage(msg: Message): void {
    if (!this.hasMessages) {
      this.hasMessages = true;
      this.welcomeEl.style.display = 'none';
      this.messagesEl.style.display = 'block';
    }

    this.clearToolActivity();
    const el = renderMessage(msg);
    this.messagesEl.insertBefore(el, this.typingEl);
    this.scrollToBottom();

    if (msg.fileChanges && msg.fileChanges.length > 0) {
      this.diffBar.update(msg.fileChanges);
    }
  }

  showTyping(show: boolean): void {
    this.typingEl.style.display = show ? 'flex' : 'none';
    if (show) this.scrollToBottom();
  }

  showToolActivity(toolName: string, filename?: string): void {
    if (!this.hasMessages) {
      this.hasMessages = true;
      this.welcomeEl.style.display = 'none';
      this.messagesEl.style.display = 'block';
    }
    this.clearToolActivity();
    const el = createToolActivity(toolName, filename);
    this.toolActivityEls.push(el);
    this.messagesEl.insertBefore(el, this.typingEl);
    this.scrollToBottom();
  }

  clearToolActivity(): void {
    this.toolActivityEls.forEach(el => el.remove());
    this.toolActivityEls = [];
  }

  setGenerating(generating: boolean): void {
    this.inputArea.sendBtn.disabled = generating;
    if (!generating) this.inputArea.input.focus();
  }

  setBlockedState(blocked: boolean, config?: { title: string; body: string; actionLabel?: string; action?: () => void; reason?: string }): void {
    if (!blocked || !config) {
      this.stateEl.style.display = 'none';
      this.inputArea.setDisabled(false);
      return;
    }

    this.stateTitleEl.textContent = config.title;
    this.stateBodyEl.textContent = config.body;
    this.stateActionEl.textContent = config.actionLabel || 'Open settings';
    this.stateActionEl.onclick = () => {
      config.action?.();
    };
    this.stateEl.style.display = 'flex';
    this.inputArea.setDisabled(true, config.reason || config.body);
  }

  addContextFile(filepath: string): void {
    this.contextBar.addFile(filepath);
  }

  removeContextFile(filepath: string): void {
    this.contextBar.removeFile(filepath);
  }

  setAgent(agent: Agent): void {
    this.inputArea.setAgent(agent);
  }

  updateDiffBar(changes: FileChange[]): void {
    this.diffBar.update(changes);
  }

  clearMessages(): void {
    this.hasMessages = false;
    this.messagesEl.innerHTML = '';
    this.messagesEl.appendChild(this.typingEl);
    this.messagesEl.style.display = 'none';
    this.welcomeEl.style.display = 'flex';
    this.diffBar.update([]);
    this.toolActivityEls = [];
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    });
  }
}
