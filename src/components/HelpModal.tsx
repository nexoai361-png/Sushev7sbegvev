import React from 'react';
import { HelpCircle, Sparkles, Edit, Palette } from 'lucide-react';
import { Codicon } from '../lib/icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <React.Fragment>
      {isOpen && (
        <div key="help-modal" className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
          <div 
            
            
            
            className="bg-background border border-white/10 w-full max-w-2xl max-h-[85vh] rounded-none shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-none flex items-center justify-center text-accent">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h2 className="text-[17px] font-semibold text-white tracking-tight">About This AI IDE</h2>
                  <p className="text-[11px] text-foreground/40 font-medium uppercase tracking-widest mt-0.5">Comprehensive User Guide</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-foreground/30 hover:text-white transition-all"
              >
                <Codicon name="close" size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-xl mx-auto space-y-10">
                
                <section>
                  <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Introduction</h3>
                  <p className="text-[14px] text-foreground/70 leading-relaxed">
                    Welcome to your modern AI-powered development environment. This IDE is designed to turn your ideas into functional web applications through natural conversation and powerful coding tools.
                  </p>
                </section>

                <section className="space-y-6">
                  <h3 className="text-sm font-bold text-accent uppercase tracking-widest">Main Interface Tabs</h3>
                  
                  <div className="grid gap-6">
                    <div className="flex gap-4">
                      <div className="mt-1"><Codicon name="apps" size={18} className="text-foreground/40" /></div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-white mb-1">Apps Tab</h4>
                        <p className="text-[13px] text-foreground/60 leading-normal">
                          This is your project dashboard. Here you can create new apps, rename existing ones, or switch between projects. 
                          <span className="block mt-2 text-red-400 font-medium">Security Tip: To delete a project, you must type its exact name to prevent accidental loss.</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1"><Codicon name="comment-discussion" size={18} className="text-foreground/40" /></div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-white mb-1">Chat Console</h4>
                        <p className="text-[13px] text-foreground/60 leading-normal">
                          Communicate directly with the AI. You can ask it to "Create a login page", "Add a dark mode toggle", or "Fix the submit button logic". The AI will write the code and update your files in real-time.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1"><Codicon name="code" size={18} className="text-foreground/40" /></div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-white mb-1">Code Editor</h4>
                        <p className="text-[13px] text-foreground/60 leading-normal">
                          A fully featured editor where you can manually tweak your files. It features syntax highlighting, auto-formatting, and intelligent AI tools.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-sm font-bold text-accent uppercase tracking-widest">Editor Tools & Buttons</h3>
                  <div className="bg-white/[0.02] border border-white/5 rounded-none p-6 space-y-5">
                    <div className="flex items-start gap-4">
                      <Sparkles size={16} className="text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[13px] font-bold text-white block">AI Assistants</span>
                        <span className="text-[12px] text-foreground/50">Found in the "More Actions" menu. Use Refactor to clean code or Document to add comments.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Edit size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[13px] font-bold text-white block">Format Code</span>
                        <span className="text-[12px] text-foreground/50">Instantly prettifies your code to keep it standardized and professional.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Palette size={16} className="text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[13px] font-bold text-white block">Themes</span>
                        <span className="text-[12px] text-foreground/50">Choose between 10+ professional syntax highlighting themes to match your visual preference.</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Final Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-[13px] text-foreground/60">
                      <span className="text-accent">•</span>
                      <span>The **Preview Window** updates automatically every time you or the AI saves a file.</span>
                    </li>
                    <li className="flex gap-3 text-[13px] text-foreground/60">
                      <span className="text-accent">•</span>
                      <span>Use the **Global Search** (Magnifying glass) to find variables or functions across your entire project.</span>
                    </li>
                  </ul>
                </section>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-white/5 flex justify-center bg-white/[0.01]">
              <button 
                onClick={onClose}
                className="px-10 py-2.5 bg-accent hover:bg-accent/90 text-white text-[13px] font-bold rounded-none transition-all shadow-lg shadow-accent/20 active:bg-blue-700"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
