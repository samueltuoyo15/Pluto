interface ContextBarCallbacks {
  onAddContext: () => void;
  onRemoveContext: (file: string) => void;
}

export interface ContextBarHandle {
  el: HTMLElement;
  addFile: (filepath: string) => void;
  removeFile: (filepath: string) => void;
}

export function createContextBar(cb: ContextBarCallbacks): ContextBarHandle {
  const bar = document.createElement('div');
  bar.className = 'pluto-ctx';

  const label = document.createElement('span');
  label.className = 'pluto-ctx-label';
  label.textContent = 'CTX';
  bar.appendChild(label);

  const chipsEl = document.createElement('div');
  chipsEl.style.display = 'contents';
  bar.appendChild(chipsEl);

  const addBtn = document.createElement('button');
  addBtn.className = 'pluto-ctx-add';
  addBtn.textContent = '+ add file';
  addBtn.addEventListener('click', cb.onAddContext);
  bar.appendChild(addBtn);

  let files: string[] = [];

  function renderChips() {
    chipsEl.innerHTML = '';
    files.forEach(file => {
      const chip = document.createElement('div');
      chip.className = 'pluto-ctx-chip';
      const name = file.split('/').pop() || file;
      chip.innerHTML = `<span>${esc(name)}</span><span class="pluto-ctx-chip-close">\u2715</span>`;
      chip.querySelector('.pluto-ctx-chip-close')!.addEventListener('click', () => cb.onRemoveContext(file));
      chipsEl.appendChild(chip);
    });
  }

  return {
    el: bar,
    addFile(filepath: string) {
      if (files.includes(filepath)) return;
      files.push(filepath);
      renderChips();
    },
    removeFile(filepath: string) {
      files = files.filter(f => f !== filepath);
      renderChips();
    },
  };
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
