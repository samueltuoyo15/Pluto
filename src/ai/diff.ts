import { DiffLine, DiffHunk } from '../types';

export function computeDiff(oldText: string, newText: string): DiffHunk[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  const lcs = buildLCS(oldLines, newLines);
  const result: DiffLine[] = [];

  let oi = 0;
  let ni = 0;
  let li = 0;

  while (oi < oldLines.length || ni < newLines.length) {
    if (li < lcs.length && oi < oldLines.length && ni < newLines.length && oldLines[oi] === lcs[li] && newLines[ni] === lcs[li]) {
      result.push({ type: 'context', lineNumber: ni + 1, content: newLines[ni] });
      oi++; ni++; li++;
    } else if (oi < oldLines.length && (li >= lcs.length || oldLines[oi] !== lcs[li])) {
      result.push({ type: 'remove', lineNumber: oi + 1, content: oldLines[oi] });
      oi++;
    } else if (ni < newLines.length && (li >= lcs.length || newLines[ni] !== lcs[li])) {
      result.push({ type: 'add', lineNumber: ni + 1, content: newLines[ni] });
      ni++;
    }
  }

  // Group into hunks, only keeping lines near changes
  return groupIntoHunks(result, 2);
}

function buildLCS(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0;
      } else if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

function groupIntoHunks(lines: DiffLine[], contextSize: number): DiffHunk[] {
  const changed = lines.map((l, i) => l.type !== 'context' ? i : -1).filter(i => i >= 0);
  if (changed.length === 0) return [];

  const hunks: DiffHunk[] = [];
  let hunkLines: DiffLine[] = [];
  let lastChanged = -100;

  for (let i = 0; i < lines.length; i++) {
    const nearChange = changed.some(c => Math.abs(c - i) <= contextSize);
    if (nearChange) {
      hunkLines.push(lines[i]);
      if (lines[i].type !== 'context') lastChanged = i;
    } else if (hunkLines.length > 0 && i - lastChanged > contextSize) {
      hunks.push({ lines: hunkLines });
      hunkLines = [];
    }
  }

  if (hunkLines.length > 0) {
    hunks.push({ lines: hunkLines });
  }

  return hunks;
}

export function countChanges(hunks: DiffHunk[]): { additions: number; deletions: number } {
  let additions = 0;
  let deletions = 0;
  for (const hunk of hunks) {
    for (const line of hunk.lines) {
      if (line.type === 'add') additions++;
      if (line.type === 'remove') deletions++;
    }
  }
  return { additions, deletions };
}
