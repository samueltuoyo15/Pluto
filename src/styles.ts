export const PLUTO_CSS = `
.pluto {
  --p-bg: #1e1e2e;
  --p-surface: #262637;
  --p-surface-2: #2e2e40;
  --p-surface-hover: #36364a;
  --p-border: #3a3a52;
  --p-border-subtle: #313148;
  --p-text: #cdd6f4;
  --p-text-2: #9399b2;
  --p-text-3: #6c7086;
  --p-accent: #89b4fa;
  --p-accent-dim: rgba(137,180,250,0.1);
  --p-accent-border: rgba(137,180,250,0.2);
  --p-success: #a6e3a1;
  --p-success-dim: rgba(166,227,161,0.08);
  --p-error: #f38ba8;
  --p-error-dim: rgba(243,139,168,0.08);
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

/* Header */
.pluto-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--p-border-subtle);
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
  gap: 2px;
}
.pluto-icon-btn {
  width: 34px;
  height: 34px;
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

/* Context Bar */
.pluto-ctx {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
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
  border: 1px solid var(--p-border-subtle);
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

/* Diff Bar */
.pluto-diff-bar {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--p-border-subtle);
  flex-shrink: 0;
  animation: pluto-slide-down 0.2s ease;
}
.pluto-diff-bar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
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
  border: 1px solid var(--p-border-subtle);
}

/* File Change Cards */
.pluto-diff-files {
  padding: 0 14px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pluto-file-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: var(--p-surface);
  border: 1px solid var(--p-border-subtle);
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
  width: 28px;
  height: 28px;
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

/* Diff Expanded */
.pluto-diff-expand {
  margin: 4px 0;
  border: 1px solid var(--p-border-subtle);
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
  text-decoration-color: rgba(243,139,168,0.3);
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

/* Messages */
.pluto-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0;
  -webkit-overflow-scrolling: touch;
}
.pluto-messages::-webkit-scrollbar { width: 3px; }
.pluto-messages::-webkit-scrollbar-track { background: transparent; }
.pluto-messages::-webkit-scrollbar-thumb {
  background: var(--p-border);
  border-radius: 3px;
}
.pluto-msg {
  padding: 10px 14px;
  animation: pluto-fade-in 0.2s ease;
}
.pluto-msg + .pluto-msg {
  margin-top: 2px;
}
.pluto-msg--user {
  background: var(--p-accent-dim);
  border-left: 2px solid var(--p-accent);
  margin: 6px 14px;
  border-radius: 0 var(--p-radius-sm) var(--p-radius-sm) 0;
  padding: 10px 14px;
}
.pluto-msg-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.pluto-msg-avatar {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.pluto-msg-avatar--agent {
  background: var(--p-accent-dim);
  border: 1px solid var(--p-accent-border);
  color: var(--p-accent);
}
.pluto-msg-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--p-text-2);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.pluto-msg-time {
  font-size: 10px;
  color: var(--p-text-3);
  margin-left: auto;
}
.pluto-msg-body {
  font-size: 13px;
  line-height: 1.6;
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

/* Code Blocks */
.pluto-code {
  margin: 8px 0;
  border: 1px solid var(--p-border-subtle);
  border-radius: var(--p-radius-sm);
  overflow: hidden;
}
.pluto-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--p-surface);
  border-bottom: 1px solid var(--p-border-subtle);
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
  border: 1px solid var(--p-border-subtle);
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
.pluto-tok-kw { color: #cba6f7; }
.pluto-tok-str { color: #a6e3a1; }
.pluto-tok-num { color: #fab387; }
.pluto-tok-cm { color: #6c7086; font-style: italic; }
.pluto-tok-fn { color: #89b4fa; }
.pluto-tok-op { color: #89dceb; }
.pluto-tok-type { color: #f9e2af; }

.pluto-code--bash .pluto-code-header {
  background: #1a2234;
  border-bottom-color: #253048;
}
.pluto-code--bash .pluto-code-lang {
  color: #a6e3a1;
}
.pluto-code--bash .pluto-code-body {
  background: #111927;
  color: #a6e3a1;
}
.pluto-code--bash .pluto-tok-kw { color: #89dceb; }
.pluto-code--bash .pluto-tok-op { color: #f9e2af; }

/* Typing Indicator */
.pluto-typing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
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

/* Tool Activity */
.pluto-tool-activity {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 12px;
  color: var(--p-text-3);
  animation: pluto-fade-in 0.2s ease;
}
.pluto-tool-icon {
  color: var(--p-accent);
  font-size: 13px;
}
.pluto-tool-name {
  font-family: var(--p-mono);
  font-size: 11px;
  color: var(--p-text-2);
  background: var(--p-surface);
  padding: 1px 6px;
  border-radius: 3px;
}

/* Input Area */
.pluto-input-wrap {
  flex-shrink: 0;
  border-top: 1px solid var(--p-border-subtle);
  background: var(--p-bg);
}
.pluto-input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 14px 8px;
}
.pluto-input {
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 14px;
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
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--p-accent);
  border: none;
  border-radius: 50%;
  color: #1e1e2e;
  font-size: 18px;
  font-weight: 700;
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

/* Agent Selector (Bottom) */
.pluto-agent-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 14px 12px;
  gap: 6px;
}
.pluto-agent-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: var(--p-surface);
  border: 1px solid var(--p-border-subtle);
  border-radius: 100px;
  font-size: 12px;
  color: var(--p-text-2);
  cursor: pointer;
  font-family: var(--p-font);
  transition: border-color 0.15s;
}
.pluto-agent-pill:active {
  border-color: var(--p-accent-border);
}
.pluto-agent-name {
  font-weight: 500;
}
.pluto-agent-model {
  font-size: 10px;
  color: var(--p-text-3);
  font-family: var(--p-mono);
}
.pluto-agent-chevron {
  font-size: 8px;
  color: var(--p-text-3);
  margin-left: 2px;
}

/* Agent Picker Dropdown */
.pluto-agent-picker {
  position: absolute;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 28px);
  max-width: 280px;
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
  gap: 10px;
  padding: 12px 14px;
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
.pluto-agent-option-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pluto-agent-option-name {
  font-size: 13px;
  font-weight: 500;
}
.pluto-agent-option-model {
  font-size: 10px;
  color: var(--p-text-3);
  font-family: var(--p-mono);
}
.pluto-agent-option--active {
  background: var(--p-accent-dim);
}
.pluto-agent-option--active .pluto-agent-option-name {
  color: var(--p-accent);
}

/* Welcome State */
.pluto-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  gap: 12px;
  min-height: 0;
}
.pluto-welcome-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--p-accent-dim);
  border: 1px solid var(--p-accent-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--p-accent);
  font-size: 16px;
  font-weight: 700;
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
  max-width: 240px;
}
.pluto-welcome-hints {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 280px;
  margin-top: 8px;
}
.pluto-hint {
  padding: 12px 14px;
  background: var(--p-surface);
  border: 1px solid var(--p-border-subtle);
  border-radius: var(--p-radius);
  font-size: 12px;
  color: var(--p-text-2);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s;
  font-family: var(--p-font);
  line-height: 1.4;
}
.pluto-hint:active {
  border-color: var(--p-accent-border);
}

/* Edit Label */
.pluto-edit-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 8px 0 2px;
  padding: 4px 10px;
  background: var(--p-surface);
  border: 1px solid var(--p-border-subtle);
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

/* Settings Overlay */
.pluto-settings {
  position: absolute;
  inset: 0;
  background: var(--p-bg);
  z-index: 200;
  display: flex;
  flex-direction: column;
  animation: pluto-fade-in 0.15s ease;
}
.pluto-settings-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--p-border-subtle);
}
.pluto-settings-back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--p-text-2);
  font-size: 18px;
  cursor: pointer;
  border-radius: var(--p-radius-sm);
}
.pluto-settings-title {
  font-size: 14px;
  font-weight: 600;
}
.pluto-settings-body {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
}
.pluto-settings-field {
  margin-bottom: 16px;
}
.pluto-settings-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--p-text-2);
  margin-bottom: 6px;
  display: block;
}
.pluto-settings-input {
  width: 100%;
  padding: 10px 12px;
  background: var(--p-surface);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-sm);
  color: var(--p-text);
  font-size: 13px;
  font-family: var(--p-mono);
  outline: none;
}
.pluto-settings-input:focus {
  border-color: var(--p-accent-border);
}
.pluto-settings-hint {
  font-size: 11px;
  color: var(--p-text-3);
  margin-top: 4px;
  line-height: 1.4;
}
.pluto-settings-save {
  width: 100%;
  padding: 10px;
  background: var(--p-accent);
  border: none;
  border-radius: var(--p-radius);
  color: #1e1e2e;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--p-font);
  margin-top: 8px;
}

/* Animations */
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
