import { Agent, DEFAULT_AGENTS } from '../types';

interface InputAreaCallbacks {
  onSend: (text: string) => void;
  onAgentChange: (agent: Agent) => void;
}

export interface InputAreaHandle {
  el: HTMLElement;
  input: HTMLTextAreaElement;
  sendBtn: HTMLButtonElement;
  setAgent: (agent: Agent) => void;
  setDisabled: (disabled: boolean, reason?: string) => void;
}

export function createInputArea(cb: InputAreaCallbacks): InputAreaHandle {
  let activeAgent = DEFAULT_AGENTS[0];
  let pickerOpen = false;
  let pickerEl: HTMLElement | null = null;

  const wrap = document.createElement('div');
  wrap.className = 'pluto-input-wrap';
  wrap.style.position = 'relative';

  const row = document.createElement('div');
  row.className = 'pluto-input-row';

  const input = document.createElement('textarea');
  input.className = 'pluto-input';
  input.placeholder = 'Ask Pluto anything...';
  input.rows = 1;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
  input.addEventListener('input', autoResize);
  row.appendChild(input);

  const sendBtn = document.createElement('button');
  sendBtn.className = 'pluto-send-btn';
  sendBtn.textContent = 'Send';
  sendBtn.addEventListener('click', handleSend);
  row.appendChild(sendBtn);

  wrap.appendChild(row);

  const status = document.createElement('div');
  status.className = 'pluto-input-status';
  status.style.display = 'none';
  wrap.appendChild(status);

  const agentBar = document.createElement('div');
  agentBar.className = 'pluto-agent-bar';

  const agentPill = document.createElement('button');
  agentPill.className = 'pluto-agent-pill';
  updatePill();
  agentPill.addEventListener('click', () => togglePicker());
  agentBar.appendChild(agentPill);

  wrap.appendChild(agentBar);

  function handleSend() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;
    input.value = '';
    autoResize();
    cb.onSend(text);
  }

  function autoResize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  function updatePill() {
    agentPill.innerHTML = `
      <span class="pluto-agent-name">${esc(activeAgent.name)}</span>
      <span class="pluto-agent-model">${esc(activeAgent.model)}</span>
      <span class="pluto-agent-chevron">\u25be</span>
    `;
  }

  function togglePicker() {
    if (pickerOpen) { closePicker(); return; }
    pickerOpen = true;
    pickerEl = document.createElement('div');
    pickerEl.className = 'pluto-agent-picker';

    DEFAULT_AGENTS.forEach(agent => {
      const opt = document.createElement('button');
      opt.className = `pluto-agent-option${agent.id === activeAgent.id ? ' pluto-agent-option--active' : ''}`;
      opt.innerHTML = `
        <span class="pluto-agent-option-info">
          <span class="pluto-agent-option-name">${esc(agent.name)}</span>
          <span class="pluto-agent-option-model">${esc(agent.model)}</span>
        </span>
      `;
      opt.addEventListener('click', () => {
        activeAgent = agent;
        updatePill();
        cb.onAgentChange(agent);
        closePicker();
      });
      pickerEl!.appendChild(opt);
    });

    wrap.appendChild(pickerEl);
    setTimeout(() => {
      document.addEventListener('click', outsideClose);
    }, 10);
  }

  function outsideClose(e: Event) {
    if (!pickerEl?.contains(e.target as Node) && !agentPill.contains(e.target as Node)) {
      closePicker();
      document.removeEventListener('click', outsideClose);
    }
  }

  function closePicker() {
    pickerOpen = false;
    pickerEl?.remove();
    pickerEl = null;
  }

  return {
    el: wrap,
    input,
    sendBtn,
    setAgent(agent: Agent) {
      activeAgent = agent;
      updatePill();
    },
    setDisabled(disabled: boolean, reason = '') {
      input.disabled = disabled;
      sendBtn.disabled = disabled;
      input.placeholder = disabled ? reason || 'Pluto is unavailable right now.' : 'Ask Pluto anything...';
      status.textContent = reason;
      status.style.display = disabled && reason ? 'block' : 'none';
    },
  };
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
