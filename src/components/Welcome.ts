export function createWelcome(
  onHintClick: (text: string) => void,
  onOpenSettings: () => void,
): HTMLElement {
  const el = document.createElement('div');
  el.className = 'pluto-welcome';

  const icon = document.createElement('div');
  icon.className = 'pluto-welcome-icon';
  icon.textContent = 'P';

  const title = document.createElement('div');
  title.className = 'pluto-welcome-title';
  title.textContent = 'Ready when your project is ready';

  const sub = document.createElement('div');
  sub.className = 'pluto-welcome-sub';
  sub.textContent = 'Open a file or project, add your Groq API key, then Pluto can help you edit real code instead of guessing.';

  const actions = document.createElement('div');
  actions.className = 'pluto-welcome-actions';

  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'pluto-primary-btn';
  settingsBtn.textContent = 'Add API key';
  settingsBtn.addEventListener('click', onOpenSettings);
  actions.appendChild(settingsBtn);

  const hints = document.createElement('div');
  hints.className = 'pluto-welcome-hints';

  const hintTexts = [
    'Fix the bug in the active file',
    'Refactor this file for readability',
    'Explain the current function',
    'Add proper error handling here',
  ];

  hintTexts.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'pluto-hint';
    btn.textContent = text;
    btn.addEventListener('click', () => onHintClick(text));
    hints.appendChild(btn);
  });

  el.appendChild(icon);
  el.appendChild(title);
  el.appendChild(sub);
  el.appendChild(actions);
  el.appendChild(hints);
  return el;
}
