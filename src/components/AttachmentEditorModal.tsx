import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useIcons } from '../lib/icons';
import { Attachment } from '../types';
import { Skeleton } from './Skeleton';
import { SYNTAX_THEMES, getCodeMirrorExtensions, getLanguageFromPath } from '../utils/editorUtils';

interface AttachmentEditorModalProps {
  editingData: { attachment: Attachment, index?: number, isPending: boolean };
  onClose: () => void;
  onSave: (updated: Attachment) => void;
  onSend: (updated: Attachment) => void;
  appThemeName: string;
  syntaxThemeName: string;
}

export const AttachmentEditorModal = React.forwardRef<HTMLDivElement, AttachmentEditorModalProps>(({ 
  editingData, 
  onClose, 
  onSave, 
  onSend, 
  appThemeName, 
  syntaxThemeName 
}, ref) => {
  const [content, setContent] = useState(editingData.attachment.content);
  const isImage = editingData.attachment.type.startsWith('image/');
  const { Files, Plus } = useIcons();

  return (
    <div 
      ref={ref}
      
      
      
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10"
    >
      <div 
        
        
        
        className="bg-[#0d0d0d] border border-white/10 w-full max-w-5xl h-full max-h-[90vh] flex flex-col rounded-none overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Files size={18} className="text-accent" />
            <span className="text-sm font-medium text-white/90">{editingData.attachment.name}</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative bg-black/20">
          {isImage ? (
            <div className="w-full h-full flex items-center justify-center p-6">
              <img 
                src={content} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain rounded shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <React.Suspense fallback={<div className="h-full w-full p-4"><Skeleton className="h-full w-full" /></div>}>
              <CodeMirror
                value={content}
                height="100%"
                className="w-full h-full"
                theme={SYNTAX_THEMES[syntaxThemeName] || vscodeDark}
                extensions={getCodeMirrorExtensions(getLanguageFromPath(editingData.attachment.name))}
                onChange={(val) => setContent(val || '')}
                style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace' }}
              />
            </React.Suspense>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
          >
            Cancel
          </button>
          {!isImage && (
            <button 
              onClick={() => onSave({ ...editingData.attachment, content })}
              className="px-4 py-2 bg-[#007ACC] hover:bg-[#006BB3] text-white text-sm transition-all rounded-[2px]"
            >
              Save Changes
            </button>
          )}
          <button 
            onClick={() => onSend({ ...editingData.attachment, content })}
            className="px-6 py-2 bg-white hover:bg-zinc-200 text-black text-sm font-medium transition-all rounded-[2px] shadow-lg shadow-white/5"
          >
            Send to AI
          </button>
        </div>
      </div>
    </div>
  );
});

AttachmentEditorModal.displayName = 'AttachmentEditorModal';
