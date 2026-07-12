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

interface KeyboardToolbarProps {
  onAction: (action: string) => void;
  onInsert: (text: string) => void;
  onHide: () => void;
  onShowQuickOpen?: () => void;
  onShowCommandPalette?: () => void;
  symbols?: string[];
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
  isCtrlActive,
  isShiftActive,
  isAltActive,
  onToggleCtrl,
  onToggleShift,
  onToggleAlt
}: KeyboardToolbarProps) => {
  const activeSymbols = symbols || SHORTCUT_PRESETS[0].symbols;
  
  return (
    <div className="bg-[var(--color-sidebar)] border-t border-[var(--color-border)] flex flex-col shrink-0 pb-[env(safe-area-inset-bottom)] px-1 py-1 gap-0.5 shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
      <div className="flex items-center overflow-x-auto no-scrollbar gap-0.5 h-9">
         <button onClick={() => onAction('left')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><ChevronLeft size={18} /></button>
         <button onClick={() => onAction('up')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><ChevronUp size={18} /></button>
         <button onClick={() => onAction('down')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><ChevronDown size={18} /></button>
         <button onClick={() => onAction('right')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><ChevronRight size={18} /></button>
         <div className="w-[1px] h-4 bg-[var(--color-border)] mx-1 shrink-0" />
         <button onClick={() => onAction('undo')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><Undo2 size={16} /></button>
         <button onClick={() => onAction('redo')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><Redo2 size={16} /></button>
         <div className="w-[1px] h-4 bg-[var(--color-border)] mx-1 shrink-0" />
         <button onClick={() => onAction('search')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><Search size={14} /></button>
         <button onClick={() => onShowQuickOpen?.()} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><SearchCode size={14} /></button>
         <button onClick={() => onShowCommandPalette?.()} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><Codicon name="terminal" size={14} /></button>
         <button onClick={() => onAction('tab')} className="w-10 h-full flex items-center justify-center text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0"><ArrowRightToLine size={14} /></button>
         <button onClick={() => onAction('bookmark')} className="w-10 h-full flex items-center justify-center text-[#FFD700] hover:text-white active:bg-[var(--color-subtle)] rounded-sm transition-all shrink-0" title="Toggle Bookmark"><Bookmark size={14} /></button>
         <button onClick={() => onAction('save')} className="w-10 h-full flex items-center justify-center text-[var(--color-accent)] hover:text-white active:bg-[var(--color-accent)] rounded-sm transition-all shrink-0"><Save size={14} /></button>
         <button onClick={onHide} className="w-10 h-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all shrink-0 ml-auto" title="Hide Toolbar"><Minimize2 size={14} /></button>
      </div>
      <div className="flex items-center overflow-x-auto no-scrollbar gap-0.5 h-9 px-1">
         {/* Sticky Modifier Keys */}
         {onToggleCtrl && (
           <button
             onClick={onToggleCtrl}
             className={`px-3 h-7 rounded-none font-sans text-[11px] font-medium border transition-all shrink-0 flex items-center justify-center ${
               isCtrlActive
                 ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] border-[var(--color-accent)] shadow-sm font-semibold'
                 : 'bg-[var(--color-subtle)] text-[var(--color-foreground)] border-[var(--color-border)] active:text-[var(--color-foreground)] active:bg-[var(--color-subtle)]'
             }`}
             title="Ctrl modifier"
           >
             Ctrl
           </button>
         )}
         {onToggleShift && (
           <button
             onClick={onToggleShift}
             className={`px-3 h-7 rounded-none font-sans text-[11px] font-medium border transition-all shrink-0 flex items-center justify-center ${
               isShiftActive
                 ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] border-[var(--color-accent)] shadow-sm font-semibold'
                 : 'bg-[var(--color-subtle)] text-[var(--color-foreground)] border-[var(--color-border)] active:text-[var(--color-foreground)] active:bg-[var(--color-subtle)]'
             }`}
             title="Shift modifier"
           >
             Shift
           </button>
         )}
         {onToggleAlt && (
           <button
             onClick={onToggleAlt}
             className={`px-3 h-7 rounded-none font-sans text-[11px] font-medium border transition-all shrink-0 flex items-center justify-center ${
               isAltActive
                 ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] border-[var(--color-accent)] shadow-sm font-semibold'
                 : 'bg-[var(--color-subtle)] text-[var(--color-foreground)] border-[var(--color-border)] active:text-[var(--color-foreground)] active:bg-[var(--color-subtle)]'
             }`}
             title="Alt modifier"
           >
             Alt
           </button>
         )}
         
         {(onToggleCtrl || onToggleShift || onToggleAlt) && (
           <div className="w-[1px] h-4 bg-[var(--color-border)] mx-1 shrink-0" />
         )}
 
         {activeSymbols.map(char => (
           <button
             key={char}
             onClick={() => onInsert(char)}
             className="w-9 h-full flex items-center justify-center text-[13px] text-[var(--color-foreground)] hover:text-white active:bg-[var(--color-subtle)] transition-all shrink-0 font-sans"
           >
             {char}
           </button>
         ))}
      </div>
    </div>
  );
});

MobileKeyboardToolbar.displayName = 'MobileKeyboardToolbar';
