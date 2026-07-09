import React, { useState } from 'react';
import { useIcons } from '../lib/icons';
import { Attachment } from '../types';

interface FileAttachmentProps {
  attachment: Attachment;
  isUser: boolean;
  onEdit?: () => void;
}

export const FileAttachment = ({ attachment, isUser, onEdit }: FileAttachmentProps) => {
  const [show, setShow] = useState(false);
  const isImage = attachment.type.startsWith('image/');
  const { Files, Edit3, Plus } = useIcons();

  return (
    <div className={`mt-2 flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
      <div 
        onClick={() => onEdit ? onEdit() : setShow(!show)}
        className="flex items-center gap-2 text-[11px] text-blue-400 hover:text-blue-300 transition-colors bg-white/5 px-3 py-2 rounded-none border border-white/10 cursor-pointer select-none group"
      >
        <Files size={14} />
        <span className="truncate max-w-[200px] font-medium">{attachment.name}</span>
        <Edit3 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
      </div>
      {show && !onEdit && (
        <div className="mt-2 w-full">
          {isImage ? (
            <div className="relative rounded-none overflow-hidden border border-white/10 bg-black/20">
              <img 
                src={attachment.content} 
                alt={attachment.name} 
                className="w-full h-auto block"
                referrerPolicy="no-referrer"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
              <button 
                onClick={(e) => { e.stopPropagation(); setShow(false); }}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-none text-white/70 hover:text-white"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
          ) : (
            <div className="relative rounded-none overflow-hidden border border-white/10 bg-black/40 p-3">
              <pre className="text-[10px] font-mono text-white/70 whitespace-pre-wrap break-all max-h-[400px] overflow-y-auto custom-scrollbar" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {attachment.content}
              </pre>
              <button 
                onClick={(e) => { e.stopPropagation(); setShow(false); }}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-none text-white/70 hover:text-white"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
