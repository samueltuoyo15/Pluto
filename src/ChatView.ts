import { Message, FileChange, Agent } from './types';
import { createHeader } from './components/Header';
import { createContextBar, ContextBarHandle } from './components/ContextBar';
import { createWelcome } from './components/Welcome';
import { createInputArea, InputAreaHandle } from './components/InputArea';
import { createDiffBar, DiffBarHandle } from './components/DiffBar';
import { renderMessage, createTypingIndicator } from './components/MessageRenderer';

export interface ChatViewCallbacks {
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
  private contextBar: ContextBarHandle;
  private inputArea: InputAreaHandle;
  private diffBar: DiffBarHandle;
  private hasMessages = false;
  private opts: ChatViewCallbacks;

  constructor(container: HTMLElement, opts: ChatViewCallbacks) {
    this.opts = opts;
    this.root = document.createElement('div');
    this.root.className = 'pluto';

    // Header
    this.root.appendChild(createHeader({
      onSettingsOpen: opts.onSettingsOpen,
      onNewChat: opts.onNewChat,
    }));

    // Diff bar
    this.diffBar = createDiffBar({
      onAcceptFile: opts.onAcceptFile,
      onRejectFile: opts.onRejectFile,
      onAcceptAll: opts.onAcceptAll,
      onRejectAll: opts.onRejectAll,
      onRevertAll: opts.onRevertAll,
    });
    this.root.appendChild(this.diffBar.el);

    // Context bar
    this.contextBar = createContextBar({
      onAddContext: opts.onAddContext,
      onRemoveContext: opts.onRemoveContext,
    });
    this.root.appendChild(this.contextBar.el);

    // Welcome screen
    this.welcomeEl = createWelcome((text) => {
      this.inputArea.input.value = text;
      this.opts.onSend(text);
      this.inputArea.input.value = '';
    });
    this.root.appendChild(this.welcomeEl);

    // Messages area
    this.messagesEl = document.createElement('div');
    this.messagesEl.className = 'pluto-messages';
    this.messagesEl.style.display = 'none';
    this.root.appendChild(this.messagesEl);

    // Typing indicator (lives inside messages area)
    this.typingEl = createTypingIndicator();
    this.typingEl.style.display = 'none';
    this.messagesEl.appendChild(this.typingEl);

    // Input area with agent selector
    this.inputArea = createInputArea({
      onSend: opts.onSend,
      onAgentChange: opts.onAgentChange,
    });
    this.root.appendChild(this.inputArea.el);

    // Delegate copy button clicks inside messages
    this.messagesEl.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('pluto-code-copy')) {
        const code = target.getAttribute('data-code') || '';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).catch(() => {});
        }
        target.textContent = '\u2713 copied';
        setTimeout(() => { target.textContent = '\u238b copy'; }, 1500);
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

  setGenerating(generating: boolean): void {
    this.inputArea.sendBtn.disabled = generating;
    if (!generating) this.inputArea.input.focus();
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

  clearMessages(): void {
    this.hasMessages = false;
    this.messagesEl.innerHTML = '';
    this.messagesEl.appendChild(this.typingEl);
    this.messagesEl.style.display = 'none';
    this.welcomeEl.style.display = 'flex';
    this.diffBar.update([]);
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    });
  }
}
