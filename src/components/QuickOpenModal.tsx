import React, { useState } from 'react';
import { useIcons } from '../lib/icons';

interface QuickOpenModalProps {
  files: string[];
  onClose: () => void;
  onSelect: (name: string) => void;
}

export const QuickOpenModal = ({ files, onClose, onSelect }: QuickOpenModalProps) => {
  const [search, setSearch] = useState('');
  const filtered = files.filter(f => f.toLowerCase().includes(search.toLowerCase()));
  const { Files, Search } = useIcons();

  return (
    <div 
        
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div 
          
        className="w-full max-w-xl bg-sidebar border border-border shadow-2xl rounded-none overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-3 py-2 border-b border-[#454545] bg-[#3c3c3c]">
          <Search size={16} className="text-zinc-400 mr-2" />
          <input 
            autoFocus
            placeholder="Search files by name..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filtered.length > 0) {
                onSelect(filtered[0]);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto py-1">
          {filtered.length > 0 ? filtered.map(f => (
            <div 
              key={f}
              onClick={() => onSelect(f)}
              className="px-4 py-1.5 flex items-center gap-3 hover:bg-[#094771] cursor-pointer group"
            >
              <Files size={14} className="text-zinc-400 group-hover:text-white" />
              <div className="flex flex-col">
                <span className="text-[12px] text-white/90">{f.split('/').pop()}</span>
                <span className="text-[10px] text-zinc-500 group-hover:text-white/60">{f}</span>
              </div>
            </div>
          )) : (
            <div className="px-4 py-4 text-center text-zinc-500 text-[12px]">No files matching "{search}"</div>
          )}
        </div>
      </div>
    </div>
  );
};
