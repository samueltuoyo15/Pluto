export function createHeader(cb: { onSettingsOpen: () => void; onNewChat: () => void }): HTMLElement {
  const header = document.createElement('div');
  header.className = 'pluto-header';
  header.innerHTML = `
    <div class="pluto-header-left">
      <span class="pluto-status"></span>
      <span class="pluto-title">Pluto</span>
    </div>
    <div class="pluto-header-actions">
      <button class="pluto-icon-btn" data-action="new" title="New chat">&#43;</button>
      <button class="pluto-icon-btn" data-action="settings" title="Settings">&#9881;</button>
    </div>
  `;
  header.querySelector('[data-action="settings"]')!.addEventListener('click', cb.onSettingsOpen);
  header.querySelector('[data-action="new"]')!.addEventListener('click', cb.onNewChat);
  return header;
}
