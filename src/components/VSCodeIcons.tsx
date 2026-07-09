import React from 'react';

export const VSCodeDefaultFileIcon = ({ className = "shrink-0", size = 16 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} style={{ width: size, height: size }}>
    <path d="M20.414,2H5V30H27V8.586ZM7,28V4H19v6h6V28Z" fill="#c5c5c5"/>
  </svg>
);

export const VSCodeFolderClosedIcon = ({ className = "shrink-0", size = 16 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} style={{ width: size, height: size }}>
    <path d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1-2.1h7.1Z" fill="#c09553"/>
  </svg>
);

export const VSCodeFolderOpenIcon = ({ className = "shrink-0", size = 16 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} style={{ width: size, height: size }}>
    <path d="M27.4,5.5H18.2L16.1,9.7H4.3V26.5H29.5V5.5Zm0,18.7H6.6V11.8H27.4Zm0-14.5H19.2l1-2.1h7.1V9.7Z" fill="#dcb67a"/>
    <polygon points="25.7 13.7 0.5 13.7 4.3 26.5 29.5 26.5 25.7 13.7" fill="#dcb67a"/>
  </svg>
);

export const getOfficialIcon = (ext: string) => {
  const icons: Record<string, string> = {
    html: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/html.svg',
    css: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/css.svg',
    sass: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/sass.svg',
    scss: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/sass.svg',
    js: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/javascript.svg',
    jsx: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/react.svg',
    ts: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/typescript.svg',
    tsx: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/react.svg',
    py: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/python.svg',
    java: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/java.svg',
    cpp: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/cpp.svg',
    c: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/c.svg',
    h: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/h.svg',
    md: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/markdown.svg',
    json: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/json.svg',
    svg: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/svg.svg',
    png: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/image.svg',
    jpg: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/image.svg',
    jpeg: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/image.svg',
    gif: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/image.svg',
    webp: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/image.svg',
    ico: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/image.svg',
    xml: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/xml.svg',
    yaml: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/yaml.svg',
    yml: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/yaml.svg',
    kt: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/kotlin.svg',
    kts: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/kotlin.svg',
    toml: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/toml.svg',
    gradle: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/gradle.svg',
    properties: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/properties.svg',
    pro: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/settings.svg',
    git: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/git.svg',
    gitignore: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/git.svg',
    config: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/settings.svg',
    sh: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/console.svg',
    bash: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/console.svg',
    zsh: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/console.svg',
    txt: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/document.svg',
    php: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/php.svg',
    rb: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/ruby.svg',
    ruby: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/ruby.svg'
  };
  return icons[ext] || null;
};
