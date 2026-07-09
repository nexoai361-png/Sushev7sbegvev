const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Clean up any broken imports
  content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"](framer-motion|motion\/react)['"];?\n?/g, '');
  content = content.replace(/import\s+[^;'"]*\s+from\s*['"](framer-motion|motion\/react)['"];?\n?/g, '');

  const attrRegex = /\b(initial|animate|exit|transition|layoutId)\s*=\s*\{/g;
  let match;
  while ((match = attrRegex.exec(content)) !== null) {
    let start = match.index;
    let index = start + match[0].length - 1; // points to {
    let openBraces = 0;
    let foundEnd = false;
    for (let i = index; i < content.length; i++) {
      if (content[i] === '{') openBraces++;
      if (content[i] === '}') openBraces--;
      if (openBraces === 0) {
        const end = i + 1;
        content = content.substring(0, start) + content.substring(end);
        attrRegex.lastIndex = 0;
        break;
      }
    }
  }
  
  content = content.replace(/\s+layout(?=[\s>])/g, '');
  content = content.replace(/<motion\.([a-zA-Z]+)/g, '<$1');
  content = content.replace(/<\/motion\.([a-zA-Z]+)>/g, '</$1>');

  fs.writeFileSync(file, content);
});
console.log('Done');
