import React from 'react';
import { Plus } from 'lucide-react';

interface ShortcutsModalProps {
  onClose: () => void;
}

export const ShortcutsModal = ({ onClose }: ShortcutsModalProps) => {
  const sections = [
    {
      title: "General",
      shortcuts: [
        { key: "Ctrl + P", desc: "Quick Open (File search)" },
        { key: "Ctrl + Shift + P", desc: "Command Palette" },
        { key: "Ctrl + ,", desc: "Settings" },
        { key: "Ctrl + Shift + K", desc: "Keyboard Shortcuts List" }
      ]
    },
    {
      title: "File & Tab Control",
      shortcuts: [
        { key: "Ctrl + N", desc: "New File" },
        { key: "Ctrl + S", desc: "Save" },
        { key: "Ctrl + W", desc: "Close Tab" }
      ]
    },
    {
      title: "Editing",
      shortcuts: [
        { key: "Ctrl + Enter", desc: "New line below" },
        { key: "Ctrl + Shift + Enter", desc: "New line above" },
        { key: "Alt + ↑ / ↓", desc: "Move line up/down" },
        { key: "Shift + Alt + ↓", desc: "Duplicate line" },
        { key: "Ctrl + D", desc: "Add selection to next find match" },
        { key: "Ctrl + Shift + L", desc: "Select all occurrences" }
      ]
    },
    {
      title: "Navigation & Search",
      shortcuts: [
        { key: "Ctrl + F", desc: "Find" },
        { key: "Ctrl + H", desc: "Replace" },
        { key: "Ctrl + G", desc: "Go to Line" },
        { key: "Ctrl + Shift + F", desc: "Global Search" }
      ]
    }
  ];

  return (
    <div 
        
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
          
        className="w-full max-w-2xl bg-background border border-border shadow-2xl rounded-none overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-sidebar">
          <h2 className="text-[15px] font-bold text-white/90 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-6 bg-accent rounded-none" />
            Keyboard Shortcuts
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <Plus size={24} className="rotate-45" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {sections.map(sec => (
            <div key={sec.title}>
              <h3 className="text-[11px] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">{sec.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {sec.shortcuts.map(s => (
                  <div key={s.key} className="flex items-center justify-between gap-4 py-1.5 border-b border-white/[0.03]">
                    <span className="text-[12px] text-zinc-400">{s.desc}</span>
                    <span className="text-[10px] font-mono text-white bg-sidebar px-1.5 py-0.5 rounded shadow-[0_2px_0_#111]">{s.key}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-8 p-4 bg-accent/5 rounded-none border border-accent/20">
             <h3 className="text-[12px] font-bold text-white mb-2">Mobile Usage Tip</h3>
             <p className="text-[11px] text-zinc-400 leading-relaxed">
               To use these shortcuts on mobile, connect a physical keyboard via Bluetooth or OTG. Alternatively, some keyboards like "Hacker's Keyboard" or specific IDE-oriented keyboard apps allow using Ctrl/Alt/Shift keys on Android.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
