import { FileChange } from '../types';
import { computeDiff, countChanges } from './diff';

export const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'read_file',
      description: 'Read the full content of a file currently open in the editor. Always do this before editing.',
      parameters: {
        type: 'object',
        properties: {
          filename: { type: 'string', description: 'File name, e.g. main.ts or src/utils.ts' },
        },
        required: ['filename'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'edit_file',
      description: 'Apply search/replace edits to a file. Each edit finds old_text exactly and replaces it with new_text. Read the file first to get exact text.',
      parameters: {
        type: 'object',
        properties: {
          filename: { type: 'string', description: 'File to edit' },
          edits: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                old_text: { type: 'string', description: 'Exact text to find, including indentation' },
                new_text: { type: 'string', description: 'Replacement text' },
              },
              required: ['old_text', 'new_text'],
            },
          },
        },
        required: ['filename', 'edits'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'list_files',
      description: 'List all files currently open in the editor.',
      parameters: { type: 'object', properties: {} },
    },
  },
];

const pendingChanges = new Map<string, FileChange>();

export function getPendingChanges(): FileChange[] {
  return Array.from(pendingChanges.values());
}

export function clearPendingChanges(): void {
  pendingChanges.clear();
}

export function acceptChange(filepath: string): boolean {
  const change = pendingChanges.get(filepath);
  if (!change?.newContent) return false;
  const file = findEditorFile(filepath);
  if (!file?.session) return false;
  file.session.setValue(change.newContent);
  change.status = 'accepted';
  pendingChanges.delete(filepath);
  return true;
}

export function rejectChange(filepath: string): void {
  const change = pendingChanges.get(filepath);
  if (change) {
    change.status = 'rejected';
    pendingChanges.delete(filepath);
  }
}

export function revertChange(filepath: string): boolean {
  const change = pendingChanges.get(filepath);
  if (!change?.oldContent) return false;
  const file = findEditorFile(filepath);
  if (!file?.session) return false;
  file.session.setValue(change.oldContent);
  pendingChanges.delete(filepath);
  return true;
}

export function executeTool(name: string, args: Record<string, unknown>): string {
  switch (name) {
    case 'read_file':    return toolReadFile(args.filename as string);
    case 'edit_file':    return toolEditFile(args.filename as string, args.edits as Edit[]);
    case 'list_files':   return toolListFiles();
    default:             return `Unknown tool: ${name}`;
  }
}

interface Edit {
  old_text: string;
  new_text: string;
}

function toolReadFile(filename: string): string {
  if (!filename) return 'Error: filename is required.';

  const file = findEditorFile(filename);
  if (!file) {
    return `File "${filename}" is not open. Available files:\n${toolListFiles()}`;
  }

  const content = file.session?.getValue?.() ?? '';
  if (!content) return `File "${filename}" is empty.`;

  return content;
}

function toolEditFile(filename: string, edits: Edit[]): string {
  if (!filename) return 'Error: filename is required.';
  if (!edits || edits.length === 0) return 'Error: at least one edit is required.';

  const file = findEditorFile(filename);
  if (!file?.session) {
    return `File "${filename}" is not open. Use list_files to see available files.`;
  }

  const oldContent = file.session.getValue?.() ?? '';
  let newContent = oldContent;
  const errors: string[] = [];

  for (let i = 0; i < edits.length; i++) {
    const { old_text, new_text } = edits[i];

    if (!old_text) {
      errors.push(`Edit ${i + 1}: old_text is empty.`);
      continue;
    }

    // Count occurrences for safety
    const occurrences = newContent.split(old_text).length - 1;

    if (occurrences === 0) {
      errors.push(`Edit ${i + 1}: Could not find this text in ${filename}:\n${old_text.slice(0, 100)}...`);
      continue;
    }

    if (occurrences > 1) {
      errors.push(`Edit ${i + 1}: Found ${occurrences} matches for old_text. Be more specific and include surrounding lines.`);
      continue;
    }

    newContent = newContent.replace(old_text, new_text);
  }

  if (errors.length > 0 && newContent === oldContent) {
    return `Edit failed:\n${errors.join('\n')}`;
  }

  const hunks = computeDiff(oldContent, newContent);
  const { additions, deletions } = countChanges(hunks);

  const change: FileChange = {
    filepath: filename,
    additions,
    deletions,
    hunks,
    status: 'pending',
    oldContent,
    newContent,
  };

  pendingChanges.set(filename, change);

  const warning = errors.length > 0 ? `\nWarnings:\n${errors.join('\n')}` : '';
  const applied = edits.length - errors.length;
  return `Staged ${applied} edit(s) for ${filename}: +${additions} -${deletions} lines. Waiting for user approval.${warning}`;
}

function toolListFiles(): string {
  const files: string[] = [];

  try {
    for (const f of (editorManager?.files ?? [])) {
      const name = f.filename || f.name || 'untitled';
      files.push(name);
    }
  } catch (_) {}

  try {
    for (const folder of ((window as any).addedFolder ?? [])) {
      files.push(`[folder] ${folder.title || folder.url}`);
    }
  } catch (_) {}

  return files.length > 0 ? files.join('\n') : 'No files open.';
}

function findEditorFile(filename: string): any {
  try {
    const files: any[] = editorManager?.files ?? [];
    return files.find(f => {
      const name: string = f.filename || f.name || '';
      return name === filename || name.endsWith('/' + filename) || name.endsWith('\\' + filename);
    }) ?? null;
  } catch (_) {
    return null;
  }
}
