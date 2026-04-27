export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: number;
  fileChanges?: FileChange[];
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

export interface FileChange {
  filepath: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
  status: 'pending' | 'accepted' | 'rejected';
  oldContent?: string;
  newContent?: string;
}

export interface DiffHunk {
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  lineNumber: number;
  content: string;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
}

export const DEFAULT_AGENTS: Agent[] = [
  { id: 'pluto-auto', name: 'Pluto', model: 'llama-3.3-70b-versatile' },
  { id: 'pluto-fast', name: 'Pluto Fast', model: 'llama-3.1-8b-instant' },
];

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: GroqToolCall[];
  tool_call_id?: string;
}

export interface GroqToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface GroqResponse {
  choices: {
    message: GroqMessage;
    finish_reason: string;
  }[];
}
