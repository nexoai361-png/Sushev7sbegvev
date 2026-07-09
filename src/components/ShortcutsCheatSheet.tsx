import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShortcutsCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsCheatSheet = ({ isOpen, onClose }: ShortcutsCheatSheetProps) => {
  const sections = [
    {
      title: "General",
      shortcuts: [
        { key: "Ctrl + P", desc: "Quick Open" },
        { key: "Ctrl + Shift + P", desc: "Command Palette" },
        { key: "Ctrl + ,", desc: "Settings" },
        { key: "Ctrl + Shift + K", desc: "Keyboard Shortcuts" }
      ]
    },
    {
      title: "Navigation",
      shortcuts: [
        { key: "Ctrl + F", desc: "Find" },
        { key: "Ctrl + H", desc: "Replace" },
        { key: "Ctrl + G", desc: "Go to Line" },
        { key: "Ctrl + Shift + F", desc: "Global Search" }
      ]
    },
    {
      title: "Editor",
      shortcuts: [
        { key: "Ctrl + S", desc: "Save File" },
        { key: "Ctrl + Enter", desc: "New line below" },
        { key: "Alt + ↑/↓", desc: "Move line up/down" },
        { key: "Ctrl + D", desc: "Select next match" }
      ]
    },
    {
      title: "Terminal Commands",
      shortcuts: [
        { key: "help", desc: "Show this help" },
        { key: "clear", desc: "Clear terminal" },
        { key: "ls", desc: "List project files" },
        { key: "npm install <pkg>", desc: "Install package" }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[2px]"
          />
          
          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[320px] z-[160] bg-background border-l border-border shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-sidebar">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-accent/20 rounded-lg text-accent">
                  <Keyboard size={18} />
                </div>
                <h2 className="text-[14px] font-bold text-white uppercase tracking-wider">Cheat Sheet</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-[10px] font-extrabold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                    {section.title}
                    <div className="flex-1 h-[1px] bg-white/5" />
                  </h3>
                  <div className="space-y-2">
                    {section.shortcuts.map((s) => (
                      <div key={s.key} className="flex flex-col gap-1 group">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-zinc-300 font-medium">{s.desc}</span>
                          <kbd className="px-1.5 py-0.5 bg-sidebar-muted border border-white/5 rounded text-[10px] font-mono text-zinc-400 shadow-sm">
                            {s.key}
                          </kbd>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-white/5">
                <div className="p-3 bg-accent/5 rounded-lg border border-accent/10 text-[11px] text-zinc-400 leading-relaxed italic">
                  Tip: Type "clear" in the terminal to clear the history.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
