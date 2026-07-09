/**
 * Custom lightweight formatters for Kotlin, TOML, and Properties files.
 * These formatters run fully in the browser without requiring heavy native/WASM compilers,
 * providing instant and reliable formatting with proper indentation, brace alignment, and operator spacing.
 */

export function formatKotlin(code: string): string {
  const lines = code.split(/\r?\n/);
  let indentLevel = 0;
  const formattedLines: string[] = [];
  
  let inMultiLineComment = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === '') {
      // Keep at most 1 consecutive empty line
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('');
      }
      continue;
    }

    // Handle multiline comments
    if (inMultiLineComment) {
      if (line.includes('*/')) {
        inMultiLineComment = false;
      }
      formattedLines.push(' '.repeat(indentLevel * 4) + line);
      continue;
    }
    if (line.startsWith('/*')) {
      if (!line.includes('*/')) {
        inMultiLineComment = true;
      }
      formattedLines.push(' '.repeat(indentLevel * 4) + line);
      continue;
    }

    // Keep single-line comments styled cleanly
    if (line.startsWith('//')) {
      formattedLines.push(' '.repeat(indentLevel * 4) + line);
      continue;
    }

    // Strip strings and comments to accurately count brackets and braces
    const stripped = line
      .replace(/"([^"\\]|\\.)*"/g, '""')
      .replace(/'([^'\\]|\\.)*'/g, "''")
      .replace(/\/\/.*$/, '');

    let closeBraces = 0;
    let openBraces = 0;

    for (const char of stripped) {
      if (char === '}') closeBraces++;
      if (char === '{') openBraces++;
    }

    // If the line starts with a closing brace/bracket/parenthesis, decrement indent level first
    const startsWithClose = line.startsWith('}') || line.startsWith(')') || line.startsWith(']');
    
    if (startsWithClose) {
      indentLevel = Math.max(0, indentLevel - 1);
    } else if (closeBraces > openBraces) {
      indentLevel = Math.max(0, indentLevel - (closeBraces - openBraces));
    }

    // Apply clean spacing to keywords and structures
    line = line
      .replace(/\b(if|for|while|when|catch|init|constructor)\s*\(/g, '$1 (')
      .replace(/\)\s*\{/g, ') {')
      .replace(/\belse\s*\{/g, 'else {')
      .replace(/\belse\s+if\b/g, 'else if')
      .replace(/\btry\s*\{/g, 'try {')
      .replace(/\bget\s*\(\s*\)\s*=/g, 'get() =')
      .replace(/\bset\s*\(\s*(\w+)\s*\)\s*=/g, 'set($1) =')
      .replace(/\bfun\s+(\w+)\s*\(/g, 'fun $1(');

    // Standard operator spacing (ensure one space around '=', '+=', '-=', '*=', '/=', '==', '!=', '&&', '||', '->')
    // Avoid breaking comments or quotes (this works on the trimmed line with string preservation)
    line = line.replace(/\s*([=+\-*/<>!&|]+)\s*/g, (match, op) => {
      // Don't format operators inside standard structures like annotations @Nullable or type parameters <T> if they are part of words
      const allowedOps = ['=', '+=', '-=', '*=', '/=', '==', '!=', '&&', '||', '->', '+', '-', '*', '/'];
      if (allowedOps.includes(op)) {
        return ` ${op} `;
      }
      return match;
    });

    // Fix potential multiple spaces introduced by regex or original text
    line = line.replace(/[ \t]+/g, ' ').trim();

    // Re-verify after spacing
    const finalStartsWithClose = line.startsWith('}') || line.startsWith(')') || line.startsWith(']');
    if (finalStartsWithClose && !startsWithClose) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Push the properly indented line
    formattedLines.push(' '.repeat(indentLevel * 4) + line);

    // Calculate indent level for subsequent lines
    if (!finalStartsWithClose && closeBraces < openBraces) {
      indentLevel += (openBraces - closeBraces);
    } else if (finalStartsWithClose) {
      if (openBraces > closeBraces) {
        indentLevel += (openBraces - closeBraces);
      }
    }
  }

  return formattedLines.join('\n');
}

export function formatToml(code: string): string {
  const lines = code.split(/\r?\n/);
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === '') {
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('');
      }
      continue;
    }

    // Comments
    if (line.startsWith('#')) {
      formattedLines.push(line);
      continue;
    }

    // Table headers e.g. [dependencies] or [[bin]]
    if (line.startsWith('[') && line.endsWith(']')) {
      // Insert empty line before section headers for better visual breathing room
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('');
      }
      formattedLines.push(line);
      continue;
    }

    // Key-value pairs
    if (line.includes('=')) {
      const parts = line.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      formattedLines.push(`${key} = ${val}`);
    } else {
      formattedLines.push(line);
    }
  }

  return formattedLines.join('\n');
}

export function formatProperties(code: string): string {
  const lines = code.split(/\r?\n/);
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === '') {
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('');
      }
      continue;
    }

    // Comments
    if (line.startsWith('#') || line.startsWith('!')) {
      formattedLines.push(line);
      continue;
    }

    // Key-value pairs (properties can use = or :)
    if (line.includes('=')) {
      const parts = line.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      formattedLines.push(`${key}=${val}`);
    } else if (line.includes(':')) {
      const parts = line.split(':');
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      formattedLines.push(`${key}:${val}`);
    } else {
      formattedLines.push(line);
    }
  }

  return formattedLines.join('\n');
}
