import plugin from '../plugin.json';
import { injectStyles, removeStyles } from './styles';
import { ChatView } from './ChatView';
import { Message, FileChange, Agent, DEFAULT_AGENTS } from './types';

const sideBarApps = acode.require('sidebarApps');
const Url = acode.require('url');

// ── Mock responses for demo ──
const MOCK_RESPONSES: { match: RegExp; response: string; files?: FileChange[] }[] = [
  {
    match: /bug|fix|error|issue/i,
    response: `I found a couple of issues in your code. Here's what I'd suggest:

1. **Null reference** on line 24 — you're accessing \`data.items\` without checking if \`data\` exists first.

2. **Missing error handling** in the async function.

Here's the fix:

\`\`\`javascript
// Before (buggy)
const items = data.items.map(i => i.name);

// After (safe)
const items = data?.items?.map(i => i.name) ?? [];
\`\`\`

I've applied the fixes to your files.`,
    files: [
      {
        filepath: 'src/utils.ts',
        additions: 8,
        deletions: 3,
        status: 'pending' as const,
        hunks: [{
          lines: [
            { type: 'remove' as const, lineNumber: 23, content: 'const items = data.items.map(i => i.name);' },
            { type: 'add' as const, lineNumber: 23, content: 'const items = data?.items?.map(i => i.name) ?? [];' },
            { type: 'context' as const, lineNumber: 24, content: '' },
            { type: 'remove' as const, lineNumber: 25, content: 'async function fetchData() {' },
            { type: 'add' as const, lineNumber: 25, content: 'async function fetchData(): Promise<Data> {' },
            { type: 'add' as const, lineNumber: 26, content: '  try {' },
            { type: 'context' as const, lineNumber: 27, content: '    const res = await fetch(url);' },
            { type: 'add' as const, lineNumber: 28, content: '    if (!res.ok) throw new Error(res.statusText);' },
            { type: 'context' as const, lineNumber: 29, content: '    return res.json();' },
            { type: 'add' as const, lineNumber: 30, content: '  } catch (err) {' },
            { type: 'add' as const, lineNumber: 31, content: '    console.error("Fetch failed:", err);' },
            { type: 'add' as const, lineNumber: 32, content: '    return null;' },
            { type: 'add' as const, lineNumber: 33, content: '  }' },
          ]
        }]
      },
      {
        filepath: 'src/index.ts',
        additions: 4,
        deletions: 1,
        status: 'pending' as const,
        hunks: [{
          lines: [
            { type: 'remove' as const, lineNumber: 1, content: 'import { fetchData } from "./utils";' },
            { type: 'add' as const, lineNumber: 1, content: 'import { fetchData, type Data } from "./utils";' },
            { type: 'add' as const, lineNumber: 2, content: 'import { handleError } from "./errors";' },
          ]
        }]
      }
    ]
  },
  {
    match: /refactor|clean|readab/i,
    response: `I've refactored the code for better readability:

- Extracted magic numbers into named constants
- Simplified nested conditionals using early returns
- Added proper TypeScript types

\`\`\`typescript
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

async function processQueue(items: QueueItem[]): Promise<void> {
  if (!items.length) return;

  for (const item of items) {
    if (item.processed) continue;
    await item.execute();
  }
}
\`\`\``,
    files: [
      {
        filepath: 'src/queue.ts',
        additions: 16,
        deletions: 22,
        status: 'pending' as const,
        hunks: [{
          lines: [
            { type: 'add' as const, lineNumber: 1, content: 'const MAX_RETRIES = 3;' },
            { type: 'add' as const, lineNumber: 2, content: 'const TIMEOUT_MS = 5000;' },
            { type: 'context' as const, lineNumber: 3, content: '' },
            { type: 'remove' as const, lineNumber: 4, content: 'function process(items) {' },
            { type: 'add' as const, lineNumber: 4, content: 'async function processQueue(items: QueueItem[]): Promise<void> {' },
            { type: 'add' as const, lineNumber: 5, content: '  if (!items.length) return;' },
          ]
        }]
      }
    ]
  },
  {
    match: /explain|how|what|why/i,
    response: `Great question! Let me break this down:

The function uses a **closure** to maintain state between calls. Each time you call \`createCounter()\`, it creates a new scope with its own \`count\` variable.

\`\`\`javascript
function createCounter(initial = 0) {
  let count = initial;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}
\`\`\`

The key insight is that the returned object's methods **close over** the \`count\` variable. Even after \`createCounter\` returns, those methods still have access to \`count\` through the closure.

This is a common pattern for encapsulating private state without classes.`,
  },
];

const DEFAULT_RESPONSE = `I understand you're working on that. Here's what I think would help:

\`\`\`javascript
// Example solution
function solveProblem(input) {
  return input.map(item => item * 2);
}
\`\`\`

This should handle your use case efficiently. Want me to elaborate or make any adjustments?`;

// ── Plugin Class ──

class PlutoPlugin {
  private static readonly SIDEBAR_ICON = 'pluto';
  private static readonly SIDEBAR_ICON_PATH = 'assets/pluto.svg';

  public baseUrl: string | undefined;
  private chatView: ChatView | null = null;
  private messages: Message[] = [];

  async init(): Promise<void> {
    if (!sideBarApps || !this.baseUrl) return;

    injectStyles();

    acode.addIcon(
      PlutoPlugin.SIDEBAR_ICON,
      await acode.toInternalUrl(
        Url.join(this.baseUrl, PlutoPlugin.SIDEBAR_ICON_PATH),
      ),
    );

    sideBarApps.add(
      PlutoPlugin.SIDEBAR_ICON,
      plugin.id,
      plugin.name,
      (container: HTMLElement) => {
        this.initChatView(container);
      },
      false,
      (_container: HTMLElement) => {},
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
      onSettingsOpen: () => this.handleSettingsOpen(),
      onNewChat: () => this.handleNewChat(),
    });

    // Add current file to context if there is one
    try {
      const activeFile = editorManager?.activeFile;
      if (activeFile?.filename) {
        this.chatView.addContextFile(activeFile.filename);
      }
    } catch (_) {}
  }

  private handleUserMessage(text: string): void {
    const userMsg: Message = {
      id: this.uid(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    this.messages.push(userMsg);
    this.chatView?.addMessage(userMsg);
    this.chatView?.setGenerating(true);
    this.chatView?.showTyping(true);

    // Simulate agent response
    setTimeout(() => {
      this.chatView?.showTyping(false);
      const mock = MOCK_RESPONSES.find(m => m.match.test(text));
      const agentMsg: Message = {
        id: this.uid(),
        role: 'assistant',
        content: mock?.response || DEFAULT_RESPONSE,
        timestamp: Date.now(),
        fileChanges: mock?.files,
      };
      this.messages.push(agentMsg);
      this.chatView?.addMessage(agentMsg);
      this.chatView?.setGenerating(false);
    }, 1500 + Math.random() * 1000);
  }

  private handleAcceptFile(filepath: string): void {
    // In real implementation: apply the diff to the actual file via editorManager
    acode.pushNotification?.('Pluto', `Accepted changes to ${filepath}`, { type: 'success' });
  }

  private handleRejectFile(filepath: string): void {
    acode.pushNotification?.('Pluto', `Rejected changes to ${filepath}`, { type: 'info' });
  }

  private handleAcceptAll(): void {
    acode.pushNotification?.('Pluto', 'All changes accepted', { type: 'success' });
  }

  private handleRejectAll(): void {
    acode.pushNotification?.('Pluto', 'All changes rejected', { type: 'info' });
  }

  private handleRevertAll(): void {
    acode.pushNotification?.('Pluto', 'All changes reverted', { type: 'info' });
  }

  private handleAddContext(): void {
    try {
      const activeFile = editorManager?.activeFile;
      if (activeFile?.filename) {
        this.chatView?.addContextFile(activeFile.filename);
      }
    } catch (_) {
      this.chatView?.addContextFile('untitled');
    }
  }

  private handleAgentChange(agent: Agent): void {
    // Store preference
    void agent;
  }

  private handleSettingsOpen(): void {
    // In real implementation: open a settings page
    acode.pushNotification?.('Pluto', 'Settings coming soon', { type: 'info' });
  }

  private handleNewChat(): void {
    this.messages = [];
    this.chatView?.clearMessages();
  }

  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  async destroy(): Promise<void> {
    sideBarApps.remove(plugin.id);
    removeStyles();
  }
}

// ── Registration ──

if (window.acode) {
  const plutoPlugin = new PlutoPlugin();
  acode.setPluginInit(
    plugin.id,
    async (baseUrl: string) => {
      if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
      }
      plutoPlugin.baseUrl = baseUrl;
      await plutoPlugin.init();
    },
  );
  acode.setPluginUnmount(plugin.id, () => {
    plutoPlugin.destroy();
  });
}
