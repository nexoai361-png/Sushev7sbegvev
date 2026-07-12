import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { sass } from '@codemirror/lang-sass';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { markdown } from '@codemirror/lang-markdown';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php, phpLanguage } from '@codemirror/lang-php';
import { completeFromList, autocompletion } from '@codemirror/autocomplete';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { oneDark as cmOneDark } from '@codemirror/theme-one-dark';
import { 
  dracula as cmDracula, 
  monokai as cmMonokai, 
  githubDark as cmGithubDark, 
  nord as cmNord, 
  tokyoNight as cmTokyoNight, 
  materialDark as cmMaterialDark,
  sublime as cmSublime,
  atomone as cmAtomone,
  aura as cmAura,
  bbedit as cmBbedit,
  bespin as cmBespin,
  duotoneDark as cmDuotoneDark,
  duotoneLight as cmDuotoneLight,
  eclipse as cmEclipse,
  githubLight as cmGithubLight,
  gruvboxDark as cmGruvboxDark,
  gruvboxLight as cmGruvboxLight,
  materialLight as cmMaterialLight,
  noctisLilac as cmNoctisLilac,
  solarizedDark as cmSolarizedDark,
  solarizedLight as cmSolarizedLight,
  xcodeDark as cmXcodeDark,
  xcodeLight as cmXcodeLight
} from '@uiw/codemirror-themes-all';
import { EditorView, keymap, Decoration, DecorationSet, ViewPlugin, MatchDecorator, WidgetType, ViewUpdate, gutter, GutterMarker } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { foldGutter, foldKeymap, StreamLanguage } from '@codemirror/language';
import { diff } from '@codemirror/legacy-modes/mode/diff';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { kotlin } from '@codemirror/legacy-modes/mode/clike';
import { toml } from '@codemirror/legacy-modes/mode/toml';
import { properties } from '@codemirror/legacy-modes/mode/properties';
import { xml } from '@codemirror/legacy-modes/mode/xml';
import { abbreviationTracker, expandAbbreviation, emmetConfig, EmmetKnownSyntax, emmetCompletionSource } from '@emmetio/codemirror6-plugin';
import expandEmmetAbbreviation, { extract as extractEmmetAbbreviation } from 'emmet';

export const SYNTAX_THEMES: Record<string, any> = {
  'VS Code Dark': vscodeDark,
  'One Dark Pro': cmOneDark,
  'Dracula': cmDracula,
  'Monokai': cmMonokai,
  'Github Dark': cmGithubDark,
  'Github Light': cmGithubLight,
  'Nord': cmNord,
  'Tokyo Night': cmTokyoNight,
  'Material Dark': cmMaterialDark,
  'Material Light': cmMaterialLight,
  'Sublime': cmSublime,
  'Atom One': cmAtomone,
  'Aura': cmAura,
  'BBEdit': cmBbedit,
  'Bespin': cmBespin,
  'Duotone Dark': cmDuotoneDark,
  'Duotone Light': cmDuotoneLight,
  'Eclipse': cmEclipse,
  'Gruvbox Dark': cmGruvboxDark,
  'Gruvbox Light': cmGruvboxLight,
  'Noctis Lilac': cmNoctisLilac,
  'Solarized Dark': cmSolarizedDark,
  'Solarized Light': cmSolarizedLight,
  'Xcode Dark': cmXcodeDark,
  'Xcode Light': cmXcodeLight,
};

const urlHighlighter = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  constructor(view: EditorView) {
    this.decorations = this.getDeco(view);
  }
  update(update: any) {
    if (update.docChanged || update.viewportChanged) this.decorations = this.getDeco(update.view);
  }
  getDeco(view: EditorView) {
    const builder = new MatchDecorator({
      regexp: /https?:\/\/[^\s"'`<>{}|\\^]+[^\s"'`<>{}|\\^.,;?!]/g,
      decoration: match => Decoration.mark({
        class: "cm-url",
        attributes: { title: "Ctrl+Click to open link" }
      })
    });
    return builder.createDeco(view);
  }
}, {
  decorations: v => v.decorations,
  eventHandlers: {
    mousedown: (e, view) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("cm-url") && (e.ctrlKey || e.metaKey)) {
        const url = target.innerText;
        window.open(url, '_blank');
      }
    }
  }
});

const urlTheme = EditorView.baseTheme({
  ".cm-url": {
    color: "inherit",
    cursor: "pointer",
    textDecoration: "none"
  },
  ".cm-url:hover": {
    textDecoration: "underline",
    opacity: "0.8"
  }
});

class ColorPreviewWidget extends WidgetType {
  constructor(
    public readonly color: string,
    private readonly view: EditorView,
    private readonly pos: number
  ) {
    super();
  }

  eq(other: ColorPreviewWidget) {
    return this.color === other.color && this.pos === other.pos;
  }

  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-color-preview";
    span.style.backgroundColor = this.color;
    span.style.display = "inline-block";
    span.style.width = "10px";
    span.style.height = "10px";
    span.style.borderRadius = "2px";
    span.style.border = "1px solid rgba(128, 128, 128, 0.5)";
    span.style.marginRight = "4px";
    span.style.marginLeft = "2px";
    span.style.verticalAlign = "middle";
    span.style.cursor = "pointer";
    span.style.lineHeight = "1";
    span.title = `Click to change color: ${this.color}`;

    span.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      const input = document.createElement("input");
      input.type = "color";

      let initialValue = "#000000";
      if (this.color.startsWith("#")) {
        if (this.color.length === 4) {
          initialValue = "#" + this.color[1] + this.color[1] + this.color[2] + this.color[2] + this.color[3] + this.color[3];
        } else if (this.color.length === 7 || this.color.length === 9) {
          initialValue = this.color.slice(0, 7);
        }
      } else if (this.color.startsWith("rgb")) {
        const matches = this.color.match(/\d+/g);
        if (matches && matches.length >= 3) {
          const r = parseInt(matches[0]).toString(16).padStart(2, "0");
          const g = parseInt(matches[1]).toString(16).padStart(2, "0");
          const b = parseInt(matches[2]).toString(16).padStart(2, "0");
          initialValue = `#${r}${g}${b}`;
        }
      }
      
      input.value = initialValue;

      input.oninput = () => {
        const newColor = input.value;
        const currentText = this.view.state.doc.sliceString(this.pos, this.pos + this.color.length);
        if (currentText.toLowerCase() === this.color.toLowerCase()) {
          this.view.dispatch({
            changes: { from: this.pos, to: this.pos + this.color.length, insert: newColor }
          });
        }
      };

      input.click();
    };

    return span;
  }
}

const colorHighlighter = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  constructor(view: EditorView) {
    this.decorations = this.getDeco(view);
  }
  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.getDeco(update.view);
    }
  }
  getDeco(view: EditorView) {
    const decorator = new MatchDecorator({
      regexp: /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3}|[a-fA-F0-9]{8}|[a-fA-F0-9]{4})\b|(?:rgb|rgba)\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*(?:,\s*[\d.]+%?\s*)?\)|(?:hsl|hsla)\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)/gi,
      decoration: (match, view, pos) => {
        return Decoration.widget({
          widget: new ColorPreviewWidget(match[0], view, pos),
          side: -1
        });
      }
    });
    return decorator.createDeco(view);
  }
}, {
  decorations: v => v.decorations
});

const gutterTheme = EditorView.baseTheme({
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 4px", 
    minWidth: "20px", 
    fontSize: "0.85em" 
  },
  ".cm-foldGutter .cm-gutterElement": {
    width: "12px",
    padding: "0"
  },
  "@media (max-width: 640px)": {
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 2px",
      minWidth: "16px",
      fontSize: "0.8em"
    },
    ".cm-foldGutter .cm-gutterElement": {
      width: "8px"
    },
    ".cm-bookmark-gutter": {
      width: "10px !important"
    }
  }
});

class EmmetGhostTextWidget extends WidgetType {
  constructor(public readonly text: string) {
    super();
  }

  eq(other: EmmetGhostTextWidget) {
    return this.text === other.text;
  }

  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-emmet-ghost-text";
    span.style.color = "#888888";
    span.style.pointerEvents = "none";
    span.style.opacity = "0.7";
    span.style.whiteSpace = "pre";
    const cleanText = this.text.replace(/\$\{\d+(:[^}]+)?\}|\$\d+/g, "");
    span.textContent = cleanText;
    return span;
  }
}

export const createEmmetGhostTextPlugin = (syntaxType: 'markup' | 'stylesheet') => {
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    
    constructor(view: EditorView) {
      this.decorations = this.getDeco(view);
    }
    
    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet) {
        this.decorations = this.getDeco(update.view);
      }
    }
    
    getDeco(view: EditorView) {
      if (view.state.selection.ranges.length !== 1) return Decoration.none;
      const sel = view.state.selection.main;
      if (!sel.empty) return Decoration.none;
      
      const pos = sel.head;
      const line = view.state.doc.lineAt(pos);
      const linePos = pos - line.from;
      const lineText = line.text;
      
      if (linePos < lineText.length && /\w/.test(lineText[linePos])) {
        return Decoration.none;
      }
      
      try {
        const extracted = extractEmmetAbbreviation(lineText, linePos, { type: syntaxType });
        if (extracted && extracted.abbreviation) {
          const expanded = expandEmmetAbbreviation(extracted.abbreviation, { type: syntaxType });
          if (expanded && expanded !== extracted.abbreviation) {
            return Decoration.set([
              Decoration.widget({
                widget: new EmmetGhostTextWidget(expanded),
                side: 1
              }).range(pos)
            ]);
          }
        }
      } catch (e) {}
      
      return Decoration.none;
    }
  }, {
    decorations: v => v.decorations
  });
};

const betterCommentsPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  constructor(view: EditorView) {
    this.decorations = this.getDeco(view);
  }
  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet) {
      this.decorations = this.getDeco(update.view);
    }
  }
  getDeco(view: EditorView) {
    const builder = new MatchDecorator({
      // Match comments with specific prefixes
      // Support for both // and /* */ styles
      regexp: /(\/\/|\/\*)\s*(!|\?|TODO|\*)(.*?)(\*\/|$)/gi,
      decoration: (match) => {
        const prefix = match[2].toUpperCase();
        let className = "cm-better-comment-default";
        
        if (prefix === '!') className = "cm-better-comment-alert";
        else if (prefix === '?') className = "cm-better-comment-query";
        else if (prefix === 'TODO') className = "cm-better-comment-todo";
        else if (prefix === '*') className = "cm-better-comment-highlight";
        
        return Decoration.mark({ class: className });
      }
    });
    return builder.createDeco(view);
  }
}, {
  decorations: v => v.decorations
});

const betterCommentsTheme = EditorView.baseTheme({
  ".cm-better-comment-alert": { 
    color: "#FF5D5D !important", 
    fontWeight: "bold",
    fontStyle: "italic" 
  },
  ".cm-better-comment-alert::before": {
    content: "''",
    display: "inline-block",
    width: "13px",
    height: "13px",
    marginRight: "6px",
    verticalAlign: "-1.5px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23FF5D5D' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'/%3E%3Cline x1='12' y1='9' x2='12' y2='13'/%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'/%3E%3C/svg%3E")`
  },
  ".cm-better-comment-query": { 
    color: "#3498DB !important", 
    fontStyle: "italic" 
  },
  ".cm-better-comment-query::before": {
    content: "''",
    display: "inline-block",
    width: "13px",
    height: "13px",
    marginRight: "6px",
    verticalAlign: "-1.5px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%233498DB' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'/%3E%3C/svg%3E")`
  },
  ".cm-better-comment-todo": { 
    color: "#FF8C00 !important", 
    fontWeight: "bold",
    textDecoration: "underline" 
  },
  ".cm-better-comment-todo::before": {
    content: "''",
    display: "inline-block",
    width: "13px",
    height: "13px",
    marginRight: "6px",
    verticalAlign: "-1.5px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    textDecoration: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23FF8C00' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cpath d='M9 11l3 3L22 4'/%3E%3C/svg%3E")`
  },
  ".cm-better-comment-highlight": { 
    color: "#98C379 !important", 
    fontWeight: "500" 
  },
  ".cm-better-comment-highlight::before": {
    content: "''",
    display: "inline-block",
    width: "13px",
    height: "13px",
    marginRight: "6px",
    verticalAlign: "-1.5px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2398C379' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5'/%3E%3Cpath d='M9 18h6'/%3E%3Cpath d='M10 22h4'/%3E%3C/svg%3E")`
  }
});

class BookmarkMarker extends GutterMarker {
  toDOM() {
    const span = document.createElement("span");
    span.style.color = "#FFD700"; // Gold color
    span.style.cursor = "pointer";
    span.title = "Bookmark (Click to toggle)";
    span.style.fontSize = "11px";
    span.style.display = "inline-flex";
    span.style.alignItems = "center";
    span.style.justifyContent = "center";
    span.style.width = "100%";
    span.innerHTML = "🔖";
    return span;
  }
}

const bookmarkTheme = EditorView.baseTheme({
  ".cm-bookmark-gutter": {
    width: "12px",
    userSelect: "none",
    borderRight: "none"
  },
  ".cm-bookmark-gutter .cm-gutterElement": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: "0"
  }
});

const bookmarkGutter = (bookmarkedLines: number[]) => {
  return gutter({
    class: "cm-bookmark-gutter",
    lineMarker(view, line) {
      const lineNo = view.state.doc.lineAt(line.from).number;
      if (bookmarkedLines && bookmarkedLines.includes(lineNo)) {
        return new BookmarkMarker();
      }
      return null;
    },
    domEventHandlers: {
      mousedown(view, line) {
        const lineNo = view.state.doc.lineAt(line.from).number;
        const customEvent = new CustomEvent('toggle-bookmark', { detail: { lineNumber: lineNo } });
        window.dispatchEvent(customEvent);
        return true;
      }
    }
  });
};

export const getCodeMirrorExtensions = (language: string, bookmarkedLines: number[] = []) => {
  const extensions = [
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({ 
      spellcheck: "false",
      autocapitalize: "off",
      autocorrect: "off",
      autocomplete: "off",
      translate: "no"
    }),
    foldGutter(),
    keymap.of(foldKeymap),
    urlHighlighter,
    urlTheme,
    colorHighlighter,
    gutterTheme,
    betterCommentsPlugin,
    betterCommentsTheme,
    bookmarkGutter(bookmarkedLines),
    bookmarkTheme
  ];

  switch (language) {
    case 'javascript':
    case 'typescript':
    case 'jsx':
    case 'tsx':
      extensions.push(javascript({ jsx: true, typescript: language.includes('typescript') || language.includes('tsx') }));
      break;
    case 'html':
      extensions.push(html());
      break;
    case 'css':
      extensions.push(css());
      break;
    case 'scss':
    case 'sass':
      extensions.push(sass());
      break;
    case 'json':
      extensions.push(json());
      break;
    case 'python':
      extensions.push(python());
      break;
    case 'java':
      extensions.push(java());
      break;
    case 'c_cpp':
    case 'cpp':
    case 'c':
      extensions.push(cpp());
      break;
    case 'markdown':
    case 'md':
      extensions.push(markdown());
      break;
    case 'rust':
      extensions.push(rust());
      break;
    case 'go':
      extensions.push(go());
      break;
    case 'php':
      extensions.push(php());
      extensions.push(phpLanguage.data.of({
        autocomplete: completeFromList([
          ...['abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'class', 'clone', 'const', 'continue', 'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty', 'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile', 'eval', 'exit', 'extends', 'final', 'finally', 'fn', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements', 'include', 'include_once', 'instanceof', 'insteadof', 'interface', 'isset', 'list', 'match', 'namespace', 'new', 'or', 'print', 'private', 'protected', 'public', 'readonly', 'require', 'require_once', 'return', 'static', 'switch', 'throw', 'trait', 'try', 'unset', 'use', 'var', 'while', 'xor', 'yield'].map(k => ({label: k, type: 'keyword'})),
          ...['$_GET', '$_POST', '$_REQUEST', '$_SERVER', '$_SESSION', '$_COOKIE', '$_FILES', '$_ENV', '$GLOBALS'].map(k => ({label: k, type: 'variable'}))
        ])
      }));
      break;
    case 'sql':
      extensions.push(sql());
      break;
    case 'bash':
    case 'sh':
    case 'shell':
      extensions.push(StreamLanguage.define(shell));
      break;
    case 'diff':
    case 'patch':
      extensions.push(StreamLanguage.define(diff));
      break;
    case 'ruby':
      extensions.push(StreamLanguage.define(ruby));
      break;
    case 'kotlin':
      extensions.push(StreamLanguage.define(kotlin));
      break;
    case 'gradle':
      extensions.push(StreamLanguage.define(kotlin));
      break;
    case 'toml':
      extensions.push(StreamLanguage.define(toml));
      break;
    case 'properties':
      extensions.push(StreamLanguage.define(properties));
      break;
    case 'xml':
      extensions.push(StreamLanguage.define(xml));
      break;
    default:
      break;
  }

  if (['html', 'css', 'javascript', 'typescript', 'jsx', 'tsx', 'php', 'markdown', 'md', 'scss', 'less', 'xml'].includes(language)) {
    let syntax: any = EmmetKnownSyntax.html;
    let type = 'markup';

    if (language === 'css') {
      syntax = EmmetKnownSyntax.css;
      type = 'stylesheet';
    } else if (language === 'scss') {
      syntax = EmmetKnownSyntax.scss;
      type = 'stylesheet';
    } else if (language === 'less') {
      syntax = EmmetKnownSyntax.less;
      type = 'stylesheet';
    } else if (['javascript', 'typescript', 'jsx', 'tsx'].includes(language)) {
      syntax = EmmetKnownSyntax.jsx;
    } else if (language === 'markdown' || language === 'md') {
      syntax = EmmetKnownSyntax.html;
    } else if (language === 'xml') {
      syntax = EmmetKnownSyntax.html; // xml uses basic markup expansions if needed
    }

    extensions.push(emmetConfig.of({ 
      syntax: syntax,
      mark: true,
      previewEnabled: true,
      config: { type }
    }));
    extensions.push(abbreviationTracker());
    extensions.push(createEmmetGhostTextPlugin(type as 'markup' | 'stylesheet'));
    extensions.push(Prec.highest(keymap.of([
      { key: 'Tab', run: expandAbbreviation }
    ])));
    extensions.push(keymap.of([indentWithTab]));
  }

  extensions.push(autocompletion());
  return extensions;
};

export const getLanguageFromPath = (name: string) => {
  const extension = name.split('.').pop()?.toLowerCase() || 'text';
  const extMap: Record<string, string> = {
    'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
    'html': 'html', 'css': 'css', 'scss': 'scss', 'less': 'less', 'json': 'json', 
    'md': 'markdown', 'py': 'python',
    'cpp': 'c_cpp', 'c': 'c', 'java': 'java', 'php': 'php', 'sql': 'sql', 'sh': 'bash',
    'bash': 'bash', 'zsh': 'bash', 'shell': 'bash',
    'rs': 'rust', 'go': 'go', 'diff': 'diff', 'patch': 'patch',
    'rb': 'ruby', 'ruby': 'ruby',
    'kt': 'kotlin', 'kts': 'kotlin',
    'toml': 'toml',
    'gradle': 'gradle',
    'properties': 'properties',
    'xml': 'xml'
  };
  return extMap[extension] || 'text';
};
