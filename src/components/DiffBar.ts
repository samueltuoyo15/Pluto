import { FileChange } from '../types';

interface DiffBarCallbacks {
  onAcceptFile: (filepath: string) => void;
  onRejectFile: (filepath: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onRevertAll: () => void;
}

export interface DiffBarHandle {
  el: HTMLElement;
  update: (changes: FileChange[]) => void;
}

export function createDiffBar(cb: DiffBarCallbacks): DiffBarHandle {
  const el = document.createElement('div');
  el.className = 'pluto-diff-bar';
  el.style.display = 'none';

  const expandedFiles = new Set<string>();
  let currentChanges: FileChange[] = [];

  function render() {
    const pending = currentChanges.filter(c => c.status === 'pending');
    if (pending.length === 0) {
      el.style.display = 'none';
      return;
    }

    el.style.display = 'flex';
    el.innerHTML = '';

    // Header row with actions
    const header = document.createElement('div');
    header.className = 'pluto-diff-bar-header';

    const title = document.createElement('span');
    title.className = 'pluto-diff-bar-title';
    title.textContent = `${pending.length} file${pending.length > 1 ? 's' : ''} changed`;
    header.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'pluto-diff-bar-actions';

    actions.appendChild(makeBtn('Accept all', 'pluto-diff-btn pluto-diff-btn--accept', () => {
      cb.onAcceptAll();
      currentChanges.forEach(c => c.status = 'accepted');
      render();
    }));
    actions.appendChild(makeBtn('Reject all', 'pluto-diff-btn pluto-diff-btn--reject', () => {
      cb.onRejectAll();
      currentChanges.forEach(c => c.status = 'rejected');
      render();
    }));
    actions.appendChild(makeBtn('Revert', 'pluto-diff-btn pluto-diff-btn--revert', () => {
      cb.onRevertAll();
      currentChanges.forEach(c => c.status = 'pending');
      render();
    }));

    header.appendChild(actions);
    el.appendChild(header);

    // File cards
    const filesEl = document.createElement('div');
    filesEl.className = 'pluto-diff-files';

    pending.forEach(change => {
      const card = document.createElement('div');

      const row = document.createElement('div');
      row.className = 'pluto-file-card';

      // File info (name + stats)
      const info = document.createElement('div');
      info.className = 'pluto-file-info';
      info.innerHTML = `
        <span class="pluto-file-name">${esc(change.filepath)}</span>
        <span class="pluto-file-stats">
          <span class="pluto-file-add">+${change.additions}</span>
          <span class="pluto-file-del">-${change.deletions}</span>
        </span>
      `;
      row.appendChild(info);

      // Per-file accept/reject buttons
      const fileActions = document.createElement('div');
      fileActions.className = 'pluto-file-actions';

      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'pluto-file-action pluto-file-action--accept';
      acceptBtn.innerHTML = '\u2713';
      acceptBtn.title = 'Accept';
      acceptBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cb.onAcceptFile(change.filepath);
        change.status = 'accepted';
        render();
      });

      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'pluto-file-action pluto-file-action--reject';
      rejectBtn.innerHTML = '\u2715';
      rejectBtn.title = 'Reject';
      rejectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cb.onRejectFile(change.filepath);
        change.status = 'rejected';
        render();
      });

      fileActions.appendChild(acceptBtn);
      fileActions.appendChild(rejectBtn);
      row.appendChild(fileActions);

      // Toggle expanded diff on row click
      row.addEventListener('click', () => {
        if (expandedFiles.has(change.filepath)) {
          expandedFiles.delete(change.filepath);
        } else {
          expandedFiles.add(change.filepath);
        }
        render();
      });

      card.appendChild(row);

      // Expanded diff lines
      if (expandedFiles.has(change.filepath) && change.hunks.length > 0) {
        const diffEl = document.createElement('div');
        diffEl.className = 'pluto-diff-expand';
        change.hunks.forEach(hunk => {
          hunk.lines.forEach(line => {
            const lineEl = document.createElement('div');
            lineEl.className = `pluto-diff-line pluto-diff-line--${line.type}`;
            const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ';
            lineEl.innerHTML = `
              <span class="pluto-diff-ln">${line.lineNumber}</span>
              <span class="pluto-diff-prefix">${prefix}</span>
              <span class="pluto-diff-content">${esc(line.content)}</span>
            `;
            diffEl.appendChild(lineEl);
          });
        });
        card.appendChild(diffEl);
      }

      filesEl.appendChild(card);
    });

    el.appendChild(filesEl);
  }

  return {
    el,
    update(changes: FileChange[]) {
      currentChanges = changes;
      render();
    },
  };
}

function makeBtn(text: string, cls: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = cls;
  btn.textContent = text;
  btn.addEventListener('click', onClick);
  return btn;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
