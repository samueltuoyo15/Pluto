export function createHeader(cb: { onBack: () => void; onSettingsOpen: () => void; onNewChat: () => void }): HTMLElement {
  const header = document.createElement('div');
  header.className = 'pluto-header';
  header.innerHTML = `
    <div class="pluto-header-left">
      <button class="pluto-back-btn" data-action="back" title="Back to editor">&#8592;</button>
      <div class="pluto-header-copy">
        <span class="pluto-title">Pluto</span>
        <span class="pluto-subtitle">Code with context</span>
      </div>
    </div>
    <div class="pluto-header-actions">
      <button class="pluto-icon-btn" data-action="new" title="New chat">New</button>
      <button class="pluto-icon-btn" data-action="settings" title="Settings">Settings</button>
    </div>
  `;
  header.querySelector('[data-action="back"]')!.addEventListener('click', cb.onBack);
  header.querySelector('[data-action="settings"]')!.addEventListener('click', cb.onSettingsOpen);
  header.querySelector('[data-action="new"]')!.addEventListener('click', cb.onNewChat);
  return header;
}
