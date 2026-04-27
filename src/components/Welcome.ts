export function createWelcome(onHintClick: (text: string) => void): HTMLElement {
  const el = document.createElement('div');
  el.className = 'pluto-welcome';
  el.innerHTML = `
    <div class="pluto-welcome-icon">\u2726</div>
    <div class="pluto-welcome-title">What can I help you build?</div>
    <div class="pluto-welcome-sub">I can write code, fix bugs, refactor, and explain your codebase.</div>
    <div class="pluto-welcome-hints">
      <button class="pluto-hint">Find bugs in my code and fix them</button>
      <button class="pluto-hint">Refactor this file for readability</button>
      <button class="pluto-hint">Explain how this function works</button>
    </div>
  `;

  el.querySelectorAll('.pluto-hint').forEach(btn => {
    btn.addEventListener('click', () => {
      onHintClick((btn as HTMLElement).textContent || '');
    });
  });

  return el;
}
