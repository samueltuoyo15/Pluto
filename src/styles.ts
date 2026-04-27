export const PLUTO_CSS = `
.pluto {
  --p-bg: #0f0f0f;
  --p-surface: #161616;
  --p-surface-2: #1c1c1c;
  --p-surface-hover: #212121;
  --p-border: #262626;
  --p-border-subtle: #1e1e1e;
  --p-text: #e0e0e0;
  --p-text-2: #888;
  --p-text-3: #555;
  --p-accent: #7c8aff;
  --p-accent-dim: rgba(124,138,255,0.08);
  --p-accent-border: rgba(124,138,255,0.2);
  --p-success: #4ade80;
  --p-success-dim: rgba(74,222,128,0.08);
  --p-error: #f87171;
  --p-error-dim: rgba(248,113,113,0.08);
  --p-radius: 8px;
  --p-radius-sm: 6px;
  --p-radius-lg: 12px;
  --p-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --p-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Courier New', monospace;

  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--p-bg);
  font-family: var(--p-font);
  font-size: 13px;
  color: var(--p-text);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ── Header ── */
.pluto-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--p-border);
  flex-shrink: 0;
}
.pluto-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pluto-status {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--p-success);
  flex-shrink: 0;
}
.pluto-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.pluto-header-actions {
  display: flex;
  gap: 4px;
}
.pluto-icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--p-text-2);
  border-radius: var(--p-radius-sm);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-size: 16px;
  padding: 0;
}
.pluto-icon-btn:active {
  background: var(--p-surface-hover);
  color: var(--p-text);
}

/* ── Context Bar ── */
.pluto-ctx {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--p-border-subtle);
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.pluto-ctx::-webkit-scrollbar { display: none; }
.pluto-ctx-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--p-text-3);
  text-transform: uppercase;
  flex-shrink: 0;
}
.pluto-ctx-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: 100px;
  font-size: 11px;
  color: var(--p-text-2);
  white-space: nowrap;
  flex-shrink: 0;
}
.pluto-ctx-chip-close {
  font-size: 10px;
  cursor: pointer;
  color: var(--p-text-3);
  line-height: 1;
}
.pluto-ctx-add {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  background: transparent;
  border: 1px dashed var(--p-border);
  border-radius: 100px;
  font-size: 11px;
  color: var(--p-text-3);
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--p-font);
  transition: border-color 0.15s, color 0.15s;
  flex-shrink: 0;
}
.pluto-ctx-add:active {
  border-color: var(--p-text-2);
  color: var(--p-text-2);
}

/* ── Diff Bar ── */
.pluto-diff-bar {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--p-border);
  flex-shrink: 0;
  animation: pluto-slide-down 0.2s ease;
}
.pluto-diff-bar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
}
.pluto-diff-bar-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--p-text-2);
}
.pluto-diff-bar-actions {
  display: flex;
  gap: 6px;
}
.pluto-diff-btn {
  padding: 4px 10px;
  border: none;
  border-radius: var(--p-radius-sm);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--p-font);
  transition: opacity 0.15s;
}
.pluto-diff-btn:active { opacity: 0.7; }
.pluto-diff-btn--accept {
  background: var(--p-success-dim);
  color: var(--p-success);
}
.pluto-diff-btn--reject {
  background: var(--p-error-dim);
  color: var(--p-error);
}
.pluto-diff-btn--revert {
  background: var(--p-surface);
  color: var(--p-text-2);
  border: 1px solid var(--p-border);
}

/* ── File Change Cards ── */
.pluto-diff-files {
  padding: 0 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pluto-file-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-sm);
  cursor: pointer;
  transition: background 0.15s;
}
.pluto-file-card:active {
  background: var(--p-surface-hover);
}
.pluto-file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.pluto-file-name {
  font-size: 12px;
  font-family: var(--p-mono);
  color: var(--p-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pluto-file-stats {
  display: flex;
  gap: 6px;
  font-size: 11px;
  font-family: var(--p-mono);
  flex-shrink: 0;
}
.pluto-file-add { color: var(--p-success); }
.pluto-file-del { color: var(--p-error); }
.pluto-file-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  margin-left: 8px;
}
.pluto-file-action {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--p-radius-sm);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  transition: background 0.15s;
}
.pluto-file-action--accept { color: var(--p-success); }
.pluto-file-action--reject { color: var(--p-error); }
.pluto-file-action:active { background: var(--p-surface-hover); }

/* ── Diff Expanded ── */
.pluto-diff-expand {
  margin: 4px 0;
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-sm);
  overflow: hidden;
  font-size: 12px;
  font-family: var(--p-mono);
  line-height: 1.6;
}
.pluto-diff-line {
  display: flex;
  padding: 0 8px;
  white-space: pre;
  overflow-x: auto;
}
.pluto-diff-line--add {
  background: var(--p-success-dim);
  color: var(--p-success);
}
.pluto-diff-line--remove {
  background: var(--p-error-dim);
  color: var(--p-error);
  text-decoration: line-through;
  text-decoration-color: rgba(248,113,113,0.3);
}
.pluto-diff-line--context {
  color: var(--p-text-3);
}
.pluto-diff-ln {
  width: 28px;
  flex-shrink: 0;
  text-align: right;
  color: var(--p-text-3);
  margin-right: 8px;
  user-select: none;
}
.pluto-diff-prefix {
  width: 12px;
  flex-shrink: 0;
  user-select: none;
}
.pluto-diff-content {
  flex: 1;
  min-width: 0;
}

/* ── Messages ── */
.pluto-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0;
  scroll-behavior: smooth;
}
.pluto-messages::-webkit-scrollbar { width: 3px; }
.pluto-messages::-webkit-scrollbar-thumb {
  background: var(--p-border);
  border-radius: 3px;
}
.pluto-msg {
  padding: 8px 12px;
  animation: pluto-fade-in 0.2s ease;
}
.pluto-msg + .pluto-msg {
  margin-top: 2px;
}
.pluto-msg--user {
  background: var(--p-accent-dim);
  border-left: 2px solid var(--p-accent);
  margin: 4px 12px;
  border-radius: 0 var(--p-radius-sm) var(--p-radius-sm) 0;
  padding: 10px 12px;
}
.pluto-msg-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.pluto-msg-avatar {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}
.pluto-msg-avatar--agent {
  background: var(--p-accent-dim);
  border: 1px solid var(--p-accent-border);
  color: var(--p-accent);
}
.pluto-msg-avatar--user {
  background: var(--p-surface-2);
  color: var(--p-text-2);
}
.pluto-msg-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--p-text-2);
  letter-spacing: 0.01em;
}
.pluto-msg-time {
  font-size: 10px;
  color: var(--p-text-3);
  margin-left: auto;
}
.pluto-msg-body {
  font-size: 13px;
  line-height: 1.55;
  color: var(--p-text);
}
.pluto-msg-body p {
  margin: 0 0 8px;
}
.pluto-msg-body p:last-child {
  margin-bottom: 0;
}
.pluto-msg-body strong {
  font-weight: 600;
  color: #fff;
}
.pluto-msg-body code {
  font-family: var(--p-mono);
  font-size: 12px;
  background: var(--p-surface-2);
  padding: 1px 5px;
  border-radius: 3px;
  color: var(--p-accent);
}
.pluto-msg-body ul, .pluto-msg-body ol {
  margin: 4px 0 8px;
  padding-left: 18px;
}
.pluto-msg-body li {
  margin: 2px 0;
  line-height: 1.5;
}

/* ── Code Blocks ── */
.pluto-code {
  margin: 8px 0;
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-sm);
  overflow: hidden;
}
.pluto-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background: var(--p-surface);
  border-bottom: 1px solid var(--p-border);
}
.pluto-code-lang {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--p-text-3);
}
.pluto-code-copy {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: transparent;
  border: 1px solid var(--p-border);
  border-radius: 4px;
  font-size: 10px;
  color: var(--p-text-3);
  cursor: pointer;
  font-family: var(--p-font);
  transition: color 0.15s, border-color 0.15s;
}
.pluto-code-copy:active {
  color: var(--p-text);
  border-color: var(--p-text-2);
}
.pluto-code-body {
  padding: 10px 12px;
  overflow-x: auto;
  font-family: var(--p-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--p-text);
  background: var(--p-bg);
  white-space: pre;
  scrollbar-width: none;
}
.pluto-code-body::-webkit-scrollbar { display: none; }

/* Syntax tokens */
.pluto-tok-kw { color: #c792ea; }
.pluto-tok-str { color: #c3e88d; }
.pluto-tok-num { color: #f78c6c; }
.pluto-tok-cm { color: #555; font-style: italic; }
.pluto-tok-fn { color: #82aaff; }
.pluto-tok-op { color: #89ddff; }
.pluto-tok-type { color: #ffcb6b; }

/* ── Typing Indicator ── */
.pluto-typing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 12px;
}
.pluto-typing-dots {
  display: flex;
  gap: 4px;
}
.pluto-typing-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--p-text-3);
  animation: pluto-bounce 1.2s ease-in-out infinite;
}
.pluto-typing-dot:nth-child(2) { animation-delay: 0.15s; }
.pluto-typing-dot:nth-child(3) { animation-delay: 0.3s; }
.pluto-typing-label {
  font-size: 11px;
  color: var(--p-text-3);
}

/* ── Input Area ── */
.pluto-input-wrap {
  flex-shrink: 0;
  border-top: 1px solid var(--p-border);
  background: var(--p-bg);
}
.pluto-input-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 10px 12px 6px;
}
.pluto-input {
  flex: 1;
  min-height: 36px;
  max-height: 120px;
  padding: 8px 12px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-lg);
  color: var(--p-text);
  font-size: 13px;
  font-family: var(--p-font);
  resize: none;
  outline: none;
  line-height: 1.4;
  transition: border-color 0.15s;
}
.pluto-input::placeholder {
  color: var(--p-text-3);
}
.pluto-input:focus {
  border-color: var(--p-accent-border);
}
.pluto-send-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--p-accent);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s, transform 0.1s;
}
.pluto-send-btn:active {
  transform: scale(0.92);
}
.pluto-send-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* ── Agent Selector (Bottom) ── */
.pluto-agent-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px 10px;
  gap: 6px;
}
.pluto-agent-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: 100px;
  font-size: 11px;
  color: var(--p-text-2);
  cursor: pointer;
  font-family: var(--p-font);
  transition: border-color 0.15s;
}
.pluto-agent-pill:active {
  border-color: var(--p-accent-border);
}
.pluto-agent-icon {
  font-size: 12px;
}
.pluto-agent-name {
  font-weight: 500;
}
.pluto-agent-chevron {
  font-size: 8px;
  color: var(--p-text-3);
  margin-left: 2px;
}

/* ── Agent Picker Dropdown ── */
.pluto-agent-picker {
  position: absolute;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 260px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius);
  overflow: hidden;
  z-index: 100;
  animation: pluto-slide-up 0.15s ease;
}
.pluto-agent-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.1s;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-family: var(--p-font);
  color: var(--p-text);
}
.pluto-agent-option:active {
  background: var(--p-surface-hover);
}
.pluto-agent-option + .pluto-agent-option {
  border-top: 1px solid var(--p-border-subtle);
}
.pluto-agent-option-icon {
  font-size: 14px;
}
.pluto-agent-option-info {
  display: flex;
  flex-direction: column;
}
.pluto-agent-option-name {
  font-size: 13px;
  font-weight: 500;
}
.pluto-agent-option-model {
  font-size: 10px;
  color: var(--p-text-3);
}
.pluto-agent-option--active {
  background: var(--p-accent-dim);
}
.pluto-agent-option--active .pluto-agent-option-name {
  color: var(--p-accent);
}

/* ── Welcome State ── */
.pluto-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  gap: 12px;
}
.pluto-welcome-icon {
  font-size: 32px;
  opacity: 0.6;
}
.pluto-welcome-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--p-text);
}
.pluto-welcome-sub {
  font-size: 12px;
  color: var(--p-text-3);
  line-height: 1.5;
  max-width: 220px;
}
.pluto-welcome-hints {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 260px;
  margin-top: 8px;
}
.pluto-hint {
  padding: 10px 12px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius);
  font-size: 12px;
  color: var(--p-text-2);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s;
  font-family: var(--p-font);
}
.pluto-hint:active {
  border-color: var(--p-accent-border);
}

/* ── Edit Label (inline in messages) ── */
.pluto-edit-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 6px 0 2px;
  padding: 3px 8px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: 4px;
  font-size: 11px;
  font-family: var(--p-mono);
  color: var(--p-text-2);
}
.pluto-edit-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--p-accent);
}

/* ── Animations ── */
@keyframes pluto-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pluto-slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pluto-slide-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pluto-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* ── Scrollbar (messages) ── */
.pluto-messages::-webkit-scrollbar-track { background: transparent; }
`;

export function injectStyles(): void {
  if (document.getElementById('pluto-styles')) return;
  const style = document.createElement('style');
  style.id = 'pluto-styles';
  style.textContent = PLUTO_CSS;
  document.head.appendChild(style);
}

export function removeStyles(): void {
  document.getElementById('pluto-styles')?.remove();
}
