import { GroqMessage, GroqResponse } from '../types';
import { TOOL_DEFINITIONS, executeTool } from './tools';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const CODING_SKILLS = `
# Code Quality
- Always read files before editing. Never guess at code structure.
- Make the smallest possible change that fixes the problem.
- Handle null/undefined with optional chaining (?.) and nullish coalescing (??)
- Prefer const, avoid var. Add proper return types. Handle promise rejections.
- Validate inputs, fail fast with early returns.

# Debugging
1. Read the file with the error first. Read all relevant imports.
2. Understand what the code should do before deciding what's wrong.
3. Fix the root cause, not the symptom.
4. After editing, trace through the code path to verify.

# Safe Editing
- Each edit_file call must use exact old_text that exists in the file.
- Include surrounding lines in old_text if the snippet might appear multiple times.
- Never rewrite a whole file when a targeted edit will do.
- Make multiple small edits rather than one large replacement.

# Common Bugs
- Missing await on async functions
- Accessing .length or .map on null/undefined
- Event listeners added but never removed
- Missing try/catch in async functions
- CSS overflow forgotten on scrollable containers
`;

const SYSTEM_PROMPT = `You are Pluto, an AI coding assistant built into the Acode editor on Android phones. You help people write, fix, and improve code.

Your personality:
- Talk like a friend, not a robot. Keep it casual and direct.
- Short answers. People are on phones. No walls of text.
- When you fix something, just fix it and say what you changed in a sentence.
- If someone asks why, then explain. Otherwise just do it.

Hard rules you must follow:
- Never use em-dashes (the long dash like this: --) anywhere. Not in code, not in comments, not in your replies. Ever.
- Do not add unnecessary comments to code. Only add a comment if it explains something that isn't obvious from the code itself. When you do comment, sound casual, like a friend left a note.
- Never guess or make up code that doesn't exist. If you don't know what's in a file, read it first. If you don't know what a library's API looks like, say so instead of inventing something. It's fine to say "I'm not sure how this library works, you might want to check the docs."
- Never fabricate function signatures, method names, or package APIs. Read the actual file or admit uncertainty.

When the user needs to install a package, tell them clearly and show the exact command in a bash code block like this:

\`\`\`bash
npm install some-package
\`\`\`

When the user should rebuild after changes, remind them:

\`\`\`bash
npm run build
\`\`\`

When you spot a lint issue or something that would cause a type error, flag it and suggest a fix. If the project has a lint script, remind the user to run it.

Your workflow:
1. Use list_files to see what's open if you don't know.
2. Use read_file to read the actual file before editing. Always.
3. Use edit_file with precise search/replace to make changes.
4. Tell the user what you changed in a sentence or two.

${CODING_SKILLS}

You have tools to read and edit files open in the editor. Use them.`;

export type OnToolCallFn = (toolName: string, filename?: string) => void;

export class GroqClient {
  private apiKey: string;
  private model: string;
  private conversationHistory: GroqMessage[] = [];

  constructor(apiKey: string, model = 'llama-3.3-70b-versatile') {
    this.apiKey = apiKey;
    this.model = model;
  }

  setModel(model: string): void {
    this.model = model;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  async sendMessage(userMessage: string, onToolCall?: OnToolCallFn): Promise<string> {
    if (!this.apiKey) {
      return 'You need to add your Groq API key first. Tap the gear icon in the header.';
    }

    this.conversationHistory.push({ role: 'user', content: userMessage });

    if (this.conversationHistory.length > 30) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    for (let round = 0; round < 10; round++) {
      const response = await this.callGroq();

      if (!response) {
        return 'Groq request failed. Check your API key and try again.';
      }

      const message = response.choices[0].message;
      this.conversationHistory.push(message);

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return message.content || '';
      }

      for (const toolCall of message.tool_calls) {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (_) {}

        const filename = (args.filename as string) || undefined;
        if (onToolCall) onToolCall(toolCall.function.name, filename);

        const result = executeTool(toolCall.function.name, args);

        this.conversationHistory.push({
          role: 'tool',
          content: result,
          tool_call_id: toolCall.id,
        });
      }
    }

    return 'Done. Check the diff bar for any pending changes.';
  }

  private async callGroq(): Promise<GroqResponse | null> {
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...this.conversationHistory,
          ],
          tools: TOOL_DEFINITIONS,
          tool_choice: 'auto',
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!res.ok) {
        const err = await res.text().catch(() => res.statusText);
        console.error('Groq error:', res.status, err);
        return null;
      }

      return res.json();
    } catch (err) {
      console.error('Groq request failed:', err);
      return null;
    }
  }
}
