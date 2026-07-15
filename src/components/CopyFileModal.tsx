import React, { useMemo } from 'react';
import { Copy, Folder, Zap } from 'lucide-react';

interface CopyFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePath: string;
  copyNewName: string;
  setCopyNewName: (name: string) => void;
  confirmCopyFile: () => void;
  existingPaths: string[];
}

export const CopyFileModal: React.FC<CopyFileModalProps> = ({
  isOpen,
  onClose,
  sourcePath,
  copyNewName,
  setCopyNewName,
  confirmCopyFile,
  existingPaths,
}) => {
  // Extract unique parent directories
  const directories = useMemo(() => {
    const dirs = new Set<string>();
    dirs.add('/'); // Root
    if (Array.isArray(existingPaths)) {
      existingPaths.forEach(p => {
        const parts = p.split('/');
        parts.pop(); // Remove filename
        let current = '';
        parts.forEach(part => {
          current = current ? `${current}/${part}` : part;
          if (current) dirs.add(current);
        });
      });
    }
    return Array.from(dirs).sort((a, b) => {
      if (a === '/') return -1;
      if (b === '/') return 1;
      return a.localeCompare(b);
    });
  }, [existingPaths]);

  // Current selected folder based on copyNewName
  const currentFolder = useMemo(() => {
    const index = copyNewName.lastIndexOf('/');
    if (index === -1) return '/';
    return copyNewName.substring(0, index);
  }, [copyNewName]);

  // Handle clicking a folder
  const handleSelectFolder = (dir: string) => {
    const filename = sourcePath.split('/').pop() || '';
    const newPath = dir === '/' ? filename : `${dir}/${filename}`;
    setCopyNewName(newPath);
  };

  // Instant duplication filename (e.g., file_copy.js)
  const duplicatePath = useMemo(() => {
    const lastDot = sourcePath.lastIndexOf('.');
    if (lastDot === -1) return `${sourcePath}_copy`;
    const base = sourcePath.substring(0, lastDot);
    const ext = sourcePath.substring(lastDot);
    return `${base}_copy${ext}`;
  }, [sourcePath]);

  const handleInstantDuplicate = () => {
    setCopyNewName(duplicatePath);
    // Use setTimeout so state updates before confirming
    setTimeout(() => {
      confirmCopyFile();
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div key="copy-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#3c3c3c] rounded-[2px] shadow-2xl flex flex-col font-sans select-none">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between bg-[#252526] px-4 py-2.5 border-b border-[#2d2d2d] text-zinc-300">
          <div className="flex items-center gap-2">
            <Copy size={14} className="text-[#007acc]" />
            <span className="text-xs font-semibold tracking-wide">COPY FILE</span>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xs font-mono p-1 transition-colors hover:bg-white/5 rounded"
          >
            ✕
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-4 flex flex-col gap-4">
          
          {/* Source Details */}
          <div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Source Path</div>
            <div className="font-mono text-[11px] text-zinc-300 bg-[#2d2d2d] border border-[#3c3c3c] px-2 py-1.5 rounded-[2px] break-all select-all">
              {sourcePath}
            </div>
          </div>

          {/* Quick Duplicate Action */}
          <div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">Quick Actions</div>
            <button
              onClick={handleInstantDuplicate}
              className="flex items-center justify-between w-full px-2.5 py-2 bg-[#2d2d2d] border border-[#3c3c3c] hover:border-[#007acc] text-zinc-300 hover:text-white rounded-[2px] text-xs transition-colors text-left group"
            >
              <span className="flex items-center gap-2 text-zinc-300 group-hover:text-white">
                <Zap size={13} className="text-[#007acc] fill-[#007acc]/20" />
                <span>Duplicate in-place</span>
              </span>
              <span className="font-mono text-[10px] text-zinc-400 bg-[#1e1e1e] border border-[#3c3c3c] px-1.5 py-0.5 rounded-[2px]">
                {duplicatePath.split('/').pop()}
              </span>
            </button>
          </div>

          {/* Destination Path */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-zinc-400 uppercase tracking-wider">Destination Path</label>
            <input
              autoFocus
              type="text"
              value={copyNewName}
              onChange={(e) => setCopyNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmCopyFile();
                if (e.key === 'Escape') onClose();
              }}
              className="w-full bg-[#3c3c3c]/30 border border-[#3c3c3c] focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] rounded-[2px] px-2.5 py-2 text-xs text-white font-mono focus:outline-none"
              placeholder="Enter destination path..."
            />
          </div>

          {/* Directory Navigator */}
          {directories.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Folder size={11} className="text-amber-500" />
                <span>Quick Destination Folder</span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto bg-[#1a1a1a] border border-[#2d2d2d] p-1.5 rounded-[2px] custom-scrollbar">
                {directories.map(dir => {
                  const isActive = currentFolder === dir;
                  return (
                    <button
                      key={dir}
                      onClick={() => handleSelectFolder(dir)}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] transition-all flex items-center gap-1 border ${
                        isActive 
                          ? 'bg-[#007acc]/20 text-white border-[#007acc] font-medium' 
                          : 'bg-[#252526] hover:bg-[#2d2d2d] text-zinc-400 border-transparent hover:text-zinc-200'
                      }`}
                    >
                      <Folder size={9} className={isActive ? 'text-[#007acc]' : 'text-zinc-500'} />
                      {dir === '/' ? '/' : dir}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 bg-[#252526] px-4 py-3 border-t border-[#2d2d2d]">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-[#3e3e42] hover:bg-[#4d4d52] active:bg-[#2d2d30] text-zinc-200 hover:text-white text-xs font-medium rounded-[2px] transition-colors border border-[#4d4d52]"
          >
            Cancel
          </button>
          <button 
            onClick={confirmCopyFile}
            className="px-5 py-1.5 bg-[#007acc] hover:bg-[#0062a3] active:bg-[#005a9e] text-white text-xs font-semibold rounded-[2px] transition-colors"
          >
            Copy File
          </button>
        </div>

      </div>
    </div>
  );
};
