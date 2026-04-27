/** Simple markdown-to-HTML renderer for chat messages */

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

export function highlightCode(code: string, lang: string): string {
  const escaped = escapeHtml(code);
  
  return escaped
    // Comments (// and #)
    .replace(/(\/\/.*$|#(?![\w{]).*$)/gm, '<span class="pluto-tok-cm">$1</span>')
    // Multi-line comments
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="pluto-tok-cm">$1</span>')
    // Strings (double and single quoted)
    .replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|`[^`]*?`)/g, '<span class="pluto-tok-str">$1</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="pluto-tok-num">$1</span>')
    // Function calls
    .replace(/(\w+)(?=\s*\()/g, (match) => {
      if (KEYWORDS.has(match)) return match;
      return `<span class="pluto-tok-fn">${match}</span>`;
    })
    // Keywords
    .replace(/\b(\w+)\b/g, (match) => {
      if (KEYWORDS.has(match)) {
        return `<span class="pluto-tok-kw">${match}</span>`;
      }
      return match;
    })
    // Arrow operators
    .replace(/(=&gt;)/g, '<span class="pluto-tok-op">$1</span>');
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

    // Code block fence
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        if (inList) { html += '</ul>'; inList = false; }
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim() || 'text';
        codeContent = '';
      } else {
        html += renderCodeBlock(codeLang, codeContent.slice(0, -1)); // remove trailing \n
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false; }
      continue;
    }

    // List items
    if (/^[\s]*[-*]\s/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inlineFormat(line.replace(/^[\s]*[-*]\s/, ''))}</li>`;
      continue;
    }

    if (inList) { html += '</ul>'; inList = false; }

    // Regular paragraph
    html += `<p>${inlineFormat(line)}</p>`;
  }

  if (inList) html += '</ul>';
  if (inCodeBlock) {
    html += renderCodeBlock(codeLang, codeContent.slice(0, -1));
  }

  return html;
}

function renderCodeBlock(lang: string, code: string): string {
  const highlighted = highlightCode(code, lang);
  return `<div class="pluto-code">
    <div class="pluto-code-header">
      <span class="pluto-code-lang">${escapeHtml(lang)}</span>
      <button class="pluto-code-copy" data-code="${escapeHtml(code)}">⎘ copy</button>
    </div>
    <div class="pluto-code-body">${highlighted}</div>
  </div>`;
}

function inlineFormat(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Italic
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
}
