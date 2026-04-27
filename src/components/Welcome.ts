export function createWelcome(onHintClick: (text: string) => void): HTMLElement {
  const el = document.createElement('div');
  el.className = 'pluto-welcome';

  const icon = document.createElement('div');
  icon.className = 'pluto-welcome-icon';
  icon.textContent = 'P';

  const title = document.createElement('div');
  title.className = 'pluto-welcome-title';
  title.textContent = 'What can I help you build?';

  const sub = document.createElement('div');
  sub.className = 'pluto-welcome-sub';
  sub.textContent = 'I can write code, fix bugs, refactor, and explain things. Just ask.';

  const hints = document.createElement('div');
  hints.className = 'pluto-welcome-hints';

  const hintTexts = [
    'Find bugs in my code and fix them',
    'Refactor this file for readability',
    'Explain how this function works',
    'Add error handling here',
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
  el.appendChild(hints);
  return el;
}
