interface HeaderCallbacks {
  onSettingsOpen: () => void;
  onNewChat: () => void;
}

export function createHeader(cb: HeaderCallbacks): HTMLElement {
  const header = document.createElement('div');
  header.className = 'pluto-header';
  header.innerHTML = `
    <div class="pluto-header-left">
      <span class="pluto-status"></span>
      <span class="pluto-title">Pluto</span>
    </div>
    <div class="pluto-header-actions">
      <button class="pluto-icon-btn" data-action="new" title="New chat">+</button>
      <button class="pluto-icon-btn" data-action="settings" title="Settings">⚙</button>
    </div>
  `;
  header.querySelector('[data-action="settings"]')!.addEventListener('click', cb.onSettingsOpen);
  header.querySelector('[data-action="new"]')!.addEventListener('click', cb.onNewChat);
  return header;
}
