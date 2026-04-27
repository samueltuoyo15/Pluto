const KEYWORDS = new Set([
  'const','let','var','function','return','if','else','for','while',
  'class','import','export','from','async','await','new','this',
  'try','catch','throw','typeof','instanceof','in','of','switch',
  'case','break','continue','default','do','void','null','undefined',
  'true','false','yield','static','extends','super','interface','type',
  'enum','implements','private','public','protected','readonly','declare',
  'def','print','lambda','elif','pass','raise','with','as','is','not',
  'and','or','None','True','False','self',
]);

const BASH_KEYWORDS = new Set([
  'npm','npx','pnpm','yarn','bun','node','git','cd','ls','mkdir','rm',
  'cp','mv','cat','echo','export','source','chmod','curl','wget','grep',
  'find','touch','sudo','apt','brew','pip','python','python3','tsc',
  'eslint','prettier',
]);

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightCode(code: string, lang: string): string {
  if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    return highlightBash(code);
  }
  const escaped = escapeHtml(code);
  return escaped
    .replace(/(\/\/.*$|#(?![\w{]).*$)/gm, '<span class="pluto-tok-cm">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="pluto-tok-cm">$1</span>')
    .replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|`[^`]*?`)/g, '<span class="pluto-tok-str">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="pluto-tok-num">$1</span>')
    .replace(/(\w+)(?=\s*\()/g, (match) => {
      if (KEYWORDS.has(match)) return match;
      return `<span class="pluto-tok-fn">${match}</span>`;
    })
    .replace(/\b(\w+)\b/g, (match) => {
      if (KEYWORDS.has(match)) return `<span class="pluto-tok-kw">${match}</span>`;
      return match;
    })
    .replace(/(=&gt;)/g, '<span class="pluto-tok-op">$1</span>');
}

function highlightBash(code: string): string {
  return escapeHtml(code)
    .replace(/#.*$/gm, '<span class="pluto-tok-cm">$&</span>')
    .replace(/"[^"]*"/g, '<span class="pluto-tok-str">$&</span>')
    .replace(/'[^']*'/g, '<span class="pluto-tok-str">$&</span>')
    .replace(/\b(\w+)\b/g, (match) => {
      if (BASH_KEYWORDS.has(match)) return `<span class="pluto-tok-kw">${match}</span>`;
      return match;
    })
    .replace(/(-{1,2}[\w-]+)/g, '<span class="pluto-tok-op">$1</span>');
}

export function renderMarkdown(text: string): string {
  const lines = text.split('\n');
  let html = '';
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        if (inList) { html += '</ul>'; inList = false; }
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim() || 'text';
        codeContent = '';
      } else {
        html += renderCodeBlock(codeLang, codeContent.slice(0, -1));
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false; }
      continue;
    }

    if (/^[\s]*[-*]\s/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inlineFormat(line.replace(/^[\s]*[-*]\s/, ''))}</li>`;
      continue;
    }

    if (inList) { html += '</ul>'; inList = false; }

    html += `<p>${inlineFormat(line)}</p>`;
  }

  if (inList) html += '</ul>';
  if (inCodeBlock) html += renderCodeBlock(codeLang, codeContent.slice(0, -1));

  return html;
}

function renderCodeBlock(lang: string, code: string): string {
  const isBash = lang === 'bash' || lang === 'sh' || lang === 'shell';
  const highlighted = highlightCode(code, lang);
  const extraClass = isBash ? ' pluto-code--bash' : '';
  return `<div class="pluto-code${extraClass}">
    <div class="pluto-code-header">
      <span class="pluto-code-lang">${isBash ? 'terminal' : escapeHtml(lang)}</span>
      <button class="pluto-code-copy" data-code="${escapeHtml(code)}">copy</button>
    </div>
    <div class="pluto-code-body">${highlighted}</div>
  </div>`;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
}
