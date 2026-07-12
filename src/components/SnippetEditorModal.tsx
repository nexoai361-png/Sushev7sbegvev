import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Snippet } from '../types';

interface SnippetEditorModalProps {
  snippet?: Snippet | null;
  onSave: (updated: any) => void;
  onClose: () => void;
}

export const SnippetEditorModal = ({ snippet, onSave, onClose }: SnippetEditorModalProps) => {
  const [name, setName] = useState(snippet?.name || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [code, setCode] = useState(snippet?.code || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        
        
        
        className="w-full max-w-xl bg-background border border-white/10 rounded-none shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-sidebar">
          <h3 className="text-sm font-medium text-white">{snippet?.id ? 'Edit Snippet' : 'New Snippet'}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Snippet Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React Fetch Helper"
                className="w-full bg-black/40 border border-white/10 rounded-none p-2.5 text-[13px] text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-none p-2.5 text-[13px] text-white focus:outline-none focus:border-accent appearance-none capitalize"
              >
                {['javascript', 'typescript', 'html', 'css', 'python', 'json', 'markdown', 'java', 'cpp'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Description (Optional)</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of what this snippet does"
              className="w-full bg-black/40 border border-white/10 rounded-none p-2.5 text-[13px] text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col min-h-[300px]">
            <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Code Content</label>
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full flex-1 bg-black/60 border border-white/10 rounded-none p-4 text-[12px] text-zinc-300 font-mono focus:outline-none focus:border-accent resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="p-4 bg-sidebar border-t border-white/5 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[12px] text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave({ id: snippet?.id, name, description, code, language })}
            disabled={!name.trim() || !code.trim()}
            className="px-6 py-2 bg-accent hover:bg-blue-600 text-white text-[12px] font-medium rounded-none transition-all shadow-lg active:bg-blue-700 disabled:opacity-30 disabled:pointer-events-none"
          >
            {snippet?.id ? 'Update Snippet' : 'Save Snippet'}
          </button>
        </div>
      </div>
    </div>
  );
};
