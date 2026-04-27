import { Message } from '../types';
import { renderMarkdown } from '../markdown';

export function renderMessage(msg: Message): HTMLElement {
  const el = document.createElement('div');
  el.className = `pluto-msg${msg.role === 'user' ? ' pluto-msg--user' : ''}`;

  if (msg.role === 'assistant') {
    const header = document.createElement('div');
    header.className = 'pluto-msg-header';
    header.innerHTML = `
      <span class="pluto-msg-avatar pluto-msg-avatar--agent">P</span>
      <span class="pluto-msg-name">Pluto</span>
      <span class="pluto-msg-time">${formatTime(msg.timestamp)}</span>
    `;
    el.appendChild(header);
  }

  const body = document.createElement('div');
  body.className = 'pluto-msg-body';
  body.innerHTML = renderMarkdown(msg.content);
  el.appendChild(body);

  if (msg.fileChanges && msg.fileChanges.length > 0) {
    msg.fileChanges.forEach(fc => {
      const label = document.createElement('div');
      label.className = 'pluto-edit-label';
      label.innerHTML = `<span class="pluto-edit-dot"></span>EDITED: ${esc(fc.filepath)}`;
      el.appendChild(label);
    });
  }

  return el;
}

export function createTypingIndicator(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'pluto-typing';
  el.innerHTML = `
    <div class="pluto-typing-dots">
      <span class="pluto-typing-dot"></span>
      <span class="pluto-typing-dot"></span>
      <span class="pluto-typing-dot"></span>
    </div>
    <span class="pluto-typing-label">thinking...</span>
  `;
  return el;
}

export function createToolActivity(toolName: string, filename?: string): HTMLElement {
  const el = document.createElement('div');
  el.className = 'pluto-tool-activity';

  const verbMap: Record<string, string> = {
    read_file: 'Reading',
    edit_file: 'Editing',
    list_files: 'Listing files',
  };

  const verb = verbMap[toolName] || toolName;
  const label = filename ? `${verb} ${esc(filename)}` : verb;

  el.innerHTML = `
    <span class="pluto-tool-icon">&#8635;</span>
    <span>${label}</span>
    ${filename ? `<span class="pluto-tool-name">${esc(filename)}</span>` : ''}
  `;
  return el;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
