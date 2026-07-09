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

interface KeyboardToolbarProps {
  onAction: (action: string) => void;
  onInsert: (text: string) => void;
  onHide: () => void;
  onShowQuickOpen?: () => void;
  onShowCommandPalette?: () => void;
}

export const MobileKeyboardToolbar = React.memo(({ 
  onAction, 
  onInsert, 
  onHide, 
  onShowQuickOpen, 
  onShowCommandPalette 
}: KeyboardToolbarProps) => {
  const symbols = ['<', '>', '/', '{', '}', '[', ']', ';', '(', ')', '"', "'", ':', '=', '!', '&', '|', '+', '-', '*', '%', '?', '#', '$', '@', '^', '~', '`'];
  
  return (
    <div className="bg-[#1e1e1e] border-t border-white/5 flex flex-col shrink-0 pb-[env(safe-area-inset-bottom)] px-1 py-1 gap-0.5 shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
      <div className="flex items-center overflow-x-auto no-scrollbar gap-0.5 h-9">
         <button onClick={() => onAction('left')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><ChevronLeft size={18} /></button>
         <button onClick={() => onAction('up')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><ChevronUp size={18} /></button>
         <button onClick={() => onAction('down')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><ChevronDown size={18} /></button>
         <button onClick={() => onAction('right')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><ChevronRight size={18} /></button>
         <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />
         <button onClick={() => onAction('undo')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><Undo2 size={16} /></button>
         <button onClick={() => onAction('redo')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><Redo2 size={16} /></button>
         <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />
         <button onClick={() => onAction('search')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><Search size={14} /></button>
         <button onClick={() => onShowQuickOpen?.()} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><SearchCode size={14} /></button>
         <button onClick={() => onShowCommandPalette?.()} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><Codicon name="terminal" size={14} /></button>
         <button onClick={() => onAction('tab')} className="w-10 h-full flex items-center justify-center text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"><ArrowRightToLine size={14} /></button>
         <button onClick={() => onAction('bookmark')} className="w-10 h-full flex items-center justify-center text-[#FFD700] active:text-white active:bg-white/10 rounded-sm transition-all shrink-0" title="Toggle Bookmark"><Bookmark size={14} /></button>
         <button onClick={() => onAction('save')} className="w-10 h-full flex items-center justify-center text-accent active:text-white active:bg-accent rounded-sm transition-all shrink-0"><Save size={14} /></button>
         <button onClick={onHide} className="w-10 h-full flex items-center justify-center text-zinc-600 hover:text-white transition-all shrink-0 ml-auto" title="Hide Toolbar"><Minimize2 size={14} /></button>
      </div>
      <div className="flex items-center overflow-x-auto no-scrollbar gap-0.5 h-9">
        {symbols.map(char => (
          <button
            key={char}
            onClick={() => onInsert(char)}
            className="w-9 h-full flex items-center justify-center text-[14px] text-zinc-400 active:text-white active:bg-white/10 transition-all shrink-0"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
});

MobileKeyboardToolbar.displayName = 'MobileKeyboardToolbar';
