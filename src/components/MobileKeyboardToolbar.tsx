import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Undo2, 
  Redo2, 
  Search, 
  SearchCode, 
  ArrowRightToLine, 
  Save, 
  Minimize2,
  SquareTerminal,
  Bookmark
} from 'lucide-react';
import { Codicon } from '../lib/icons';

export interface ShortcutPreset {
  name: string;
  description: string;
  symbols: string[];
}

export const SHORTCUT_PRESETS: ShortcutPreset[] = [
  {
    name: 'VS Code Default',
    description: 'Standard development symbols in VS Code style',
    symbols: ['<', '>', '/', '{', '}', '[', ']', ';', '(', ')', '"', "'", ':', '=', '!', '&', '|', '+', '-', '*', '%', '?', '#', '$', '@', '^', '~', '`']
  },
  {
    name: 'Web Developer (HTML/JS/TS)',
    description: 'Optimized for frontend, brackets, and DOM operations',
    symbols: ['{', '}', '[', ']', '(', ')', '<', '>', '/', '=', ';', ':', '"', "'", '`', '$', '.', ',', '+', '-', '*', '%', '!', '?', '&', '|', '#', '@']
  },
  {
    name: 'Pythonist & Backend',
    description: 'Optimized for Python indentation, comments, and SQL',
    symbols: ['(', ')', '[', ']', '{', '}', ':', ',', '_', '=', '+', '-', '*', '/', '%', '"', "'", '#', '@', '!', '&', '|', '<', '>', '^', '~', '?', '.']
  },
  {
    name: 'Logic & Math Pro',
    description: 'Optimized for conditions, boolean algebra, and equations',
    symbols: ['=', '!', '<', '>', '&', '|', '+', '-', '*', '/', '%', '^', '(', ')', '[', ']', '{', '}', ';', ':', '.', ',', '?', '_', '$', '#', '@', '~']
  },
  {
    name: 'C/C++ & Java Core',
    description: 'Optimized for syntax, pointers, structures, and libraries',
    symbols: ['{', '}', '(', ')', '[', ']', ';', '&', '*', '+', '-', '=', '<', '>', '/', '%', '!', ':', '?', ',', '"', "'", '\\', '#', '.', '_', '|', '~']
  },
  {
    name: 'SQL & DB Admin',
    description: 'Optimized for database queries, filters, and schema names',
    symbols: ['*', ',', '(', ')', '=', '<', '>', '!', '`', '"', "'", '_', ';', '%', '+', '-', '/', '.', '[', ']', '?', '@', '#', '|', '&']
  },
  {
    name: 'Bash & Scripting',
    description: 'Optimized for shell commands, redirection, pipes, and variables',
    symbols: ['$', '[', ']', '(', ')', '{', '}', '/', '\\', '|', '&', ';', '`', '"', "'", '>', '<', '#', '!', '*', '?', '=', '-', '_', '~', '+']
  },
  {
    name: 'Markdown & Writing',
    description: 'Optimized for rich document creation, lists, and formatting',
    symbols: ['#', '*', '_', '[', ']', '(', ')', '`', '!', '-', '+', '>', '<', '~', '|', '\\', '{', '}', ':', '=', '/', '?', '@', '$', '%', '&']
  },
  {
    name: 'HTML & JSX QuickTags',
    description: 'Optimized for tagging, component creation, and attributes',
    symbols: ['<', '>', '/', '=', '{', '}', '"', "'", '(', ')', '[', ']', ':', ';', '!', '-', '_', '+', '*', '.', ',', '?', '#', '$', '@', '&', '|']
  },
  {
    name: 'CSS & Tailwind Essentials',
    description: 'Optimized for styles, property classes, select names, and rules',
    symbols: [':', ';', '{', '}', '.', '#', '-', '(', ')', '"', "'", ',', '%', '!', '*', '/', '[', ']', '+', '=', '<', '>', '_', '$', '@', '&', '|']
  },
  {
    name: 'Rust & Go Developer',
    description: 'Optimized for modern backend structures, macros, and returns',
    symbols: ['{', '}', '(', ')', '[', ']', ';', ':', '!', '&', '|', '=', '<', '>', '-', '>', '.', ',', '"', "'", '`', '+', '*', '/', '%', '#', '$', '@', '_']
  }
];

export const AVAILABLE_ACTIONS: Record<string, { icon: any; size: number; title: string; color?: string }> = {
  'left': { icon: ChevronLeft, size: 18, title: 'Move Left' },
  'up': { icon: ChevronUp, size: 18, title: 'Move Up' },
  'down': { icon: ChevronDown, size: 18, title: 'Move Down' },
  'right': { icon: ChevronRight, size: 18, title: 'Move Right' },
  'undo': { icon: Undo2, size: 16, title: 'Undo' },
  'redo': { icon: Redo2, size: 16, title: 'Redo' },
  'search': { icon: Search, size: 14, title: 'Search' },
  'quickOpen': { icon: SearchCode, size: 14, title: 'Quick Open' },
  'commandPalette': { icon: SquareTerminal, size: 14, title: 'Command Palette' },
  'tab': { icon: ArrowRightToLine, size: 14, title: 'Tab' },
  'bookmark': { icon: Bookmark, size: 14, title: 'Toggle Bookmark', color: '#FFD700' },
  'save': { icon: Save, size: 14, title: 'Save', color: 'var(--color-accent)' }
};

interface KeyboardToolbarProps {
  onAction: (action: string) => void;
  onInsert: (text: string) => void;
  onHide: () => void;
  onShowQuickOpen?: () => void;
  onShowCommandPalette?: () => void;
  symbols?: string[];
  actions?: string[];
  isCtrlActive?: boolean;
  isShiftActive?: boolean;
  isAltActive?: boolean;
  onToggleCtrl?: () => void;
  onToggleShift?: () => void;
  onToggleAlt?: () => void;
}

export const MobileKeyboardToolbar = React.memo(({ 
  onAction, 
  onInsert, 
  onHide, 
  onShowQuickOpen, 
  onShowCommandPalette,
  symbols,
  actions,
  isCtrlActive,
  isShiftActive,
  isAltActive,
  onToggleCtrl,
  onToggleShift,
  onToggleAlt
}: KeyboardToolbarProps) => {
  const activeSymbols = symbols || SHORTCUT_PRESETS[0].symbols;
  const activeActions = actions || ['left', 'up', 'down', 'right', 'undo', 'redo', 'search', 'quickOpen', 'commandPalette', 'tab', 'bookmark', 'save'];
  
  return (
    <div className="bg-[var(--color-sidebar)] border-t border-[var(--color-border)] flex flex-col shrink-0 pb-[env(safe-area-inset-bottom)] px-1 py-1 gap-0.5 shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
      <div className="flex items-center overflow-x-auto no-scrollbar gap-0.5 h-9">
         {activeActions.map((actionId, idx) => {
           if (actionId === '|') return <div key={`sep-${idx}`} className="w-[1px] h-4 bg-[var(--color-border)] mx-1 shrink-0" />;
           
           const action = AVAILABLE_ACTIONS[actionId as keyof typeof AVAILABLE_ACTIONS];
           if (!action) return null;

           const Icon = action.icon;
           
           const handleClick = () => {
             if (actionId === 'quickOpen') onShowQuickOpen?.();
             else if (actionId === 'commandPalette') onShowCommandPalette?.();
             else onAction(actionId);
           };

           return (
             <button 
               key={`${actionId}-${idx}`} 
               onClick={handleClick}
              onMouseDown={(e) => e.preventDefault()}
                className={`w-11 h-full flex items-center justify-center transition-all shrink-0 ${action.color ? '' : 'text-[var(--color-foreground)] hover:text-white'} active:bg-[var(--color-subtle)]`}
               style={action.color ? { color: action.color } : {}}
               title={action.title}
             >
               {actionId === 'commandPalette' ? <Codicon name="terminal" size={14} /> : <Icon size={action.size} />}
             </button>
           );
         })}
         <button onClick={onHide} onMouseDown={(e) => e.preventDefault()} className="w-11 h-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all shrink-0 ml-auto" title="Hide Toolbar"><Minimize2 size={14} /></button>
      </div>
      <div className="flex items-center overflow-x-auto no-scrollbar gap-1 h-9 px-1">
         {/* Sticky Modifier Keys */}
         {onToggleCtrl && (
           <button
             onClick={onToggleCtrl}
              onMouseDown={(e) => e.preventDefault()}
             className={`px-3 h-full font-sans text-[11px] font-bold transition-all shrink-0 flex items-center justify-center ${
               isCtrlActive
                 ? 'text-[var(--color-accent)]'
                 : 'text-[var(--color-foreground)] active:text-white'
             }`}
             title="Ctrl modifier"
           >
             CTRL
           </button>
         )}
         {onToggleShift && (
           <button
             onClick={onToggleShift}
              onMouseDown={(e) => e.preventDefault()}
             className={`px-3 h-full font-sans text-[11px] font-bold transition-all shrink-0 flex items-center justify-center ${
               isShiftActive
                 ? 'text-[var(--color-accent)]'
                 : 'text-[var(--color-foreground)] active:text-white'
             }`}
             title="Shift modifier"
           >
             SHIFT
           </button>
         )}
         {onToggleAlt && (
           <button
             onClick={onToggleAlt}
              onMouseDown={(e) => e.preventDefault()}
             className={`px-3 h-full font-sans text-[11px] font-bold transition-all shrink-0 flex items-center justify-center ${
               isAltActive
                 ? 'text-[var(--color-accent)]'
                 : 'text-[var(--color-foreground)] active:text-white'
             }`}
             title="Alt modifier"
           >
             ALT
           </button>
         )}
         
         {(onToggleCtrl || onToggleShift || onToggleAlt) && (
           <div className="w-[1px] h-4 bg-[var(--color-border)] mx-1 shrink-0" />
         )}
 
         {activeSymbols.map(char => (
           <button
             key={char}
             onClick={() => onInsert(char)}
              onMouseDown={(e) => e.preventDefault()}
             className="w-12 h-full flex items-center justify-center text-[14px] text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0 font-sans"
           >
             {char}
           </button>
         ))}
      </div>
    </div>
  );
});

MobileKeyboardToolbar.displayName = 'MobileKeyboardToolbar';
