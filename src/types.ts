export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  fileChanges?: FileChange[];
  isStreaming?: boolean;
}

export interface FileChange {
  filepath: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface DiffHunk {
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  lineNumber: number;
  content: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  icon: string;
}

export interface PlutoState {
  messages: Message[];
  contextFiles: string[];
  activeAgent: Agent;
  isGenerating: boolean;
  pendingChanges: FileChange[];
}

export const DEFAULT_AGENTS: Agent[] = [
  { id: 'pluto-auto', name: 'Pluto Auto', model: 'Auto', icon: '⚡' },
  { id: 'pluto-reason', name: 'Pluto Reason', model: 'Reasoning', icon: '🧠' },
  { id: 'pluto-fast', name: 'Pluto Fast', model: 'Fast', icon: '🚀' },
];
