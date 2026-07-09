import React, { useState, useEffect } from 'react';
import { useIcons } from '../lib/icons';

interface CommandPaletteAction {
  label: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteModalProps {
  onClose: () => void;
  actions: CommandPaletteAction[];
}

export const CommandPaletteModal = ({ onClose, actions }: CommandPaletteModalProps) => {
  const [search, setSearch] = useState('>');
  const query = search.startsWith('>') ? search.slice(1).trim() : search.trim();
  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));
  const { Settings } = useIcons();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <div 
        
      className="fixed inset-0 z-[200] flex items-start justify-center pt-0 sm:pt-4 bg-transparent"
      onClick={onClose}
    >
      <div 
          
        className="w-full max-w-[600px] bg-sidebar border border-border rounded-none shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}
      >
        <div className="p-1.5">
          <div className="flex flex-col bg-sidebar">
            <div className="flex items-center px-1.5 py-1 box-border border rounded-none border-[#007fd4] bg-[#3c3c3c]">
              <input 
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#cccccc] font-sans"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && filtered.length > 0) {
                    filtered[selectedIndex]?.action();
                    onClose();
                  } else if (e.key === 'Escape') {
                    onClose();
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[300px] pb-1 custom-scrollbar">
          {filtered.length > 0 ? filtered.map((a, i) => (
            <div 
              key={a.label}
              onClick={() => { a.action(); onClose(); }}
              className={`px-3 py-1 flex items-center justify-between cursor-pointer ${i === selectedIndex ? 'bg-[#04395e] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'}`}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <div className="flex items-center gap-2">
                <Settings size={14} className={i === selectedIndex ? 'text-white' : 'text-[#cccccc]'} />
                <span className="text-[13px] leading-[22px]">{a.label}</span>
              </div>
              {a.shortcut && <span className={`text-[12px] opacity-80 ${i === selectedIndex ? 'text-white' : 'text-[#cccccc]'}`}>{a.shortcut}</span>}
            </div>
          )) : (
            <div className="px-4 py-3 text-[#cccccc] text-[13px]">No commands matching</div>
          )}
        </div>
      </div>
    </div>
  );
};
