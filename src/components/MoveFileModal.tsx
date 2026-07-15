import React from 'react';
import { Move } from 'lucide-react';

interface MoveFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePath: string;
  moveNewName: string;
  setMoveNewName: (name: string) => void;
  confirmMoveFile: () => void;
}

export const MoveFileModal: React.FC<MoveFileModalProps> = ({
  isOpen,
  onClose,
  sourcePath,
  moveNewName,
  setMoveNewName,
  confirmMoveFile,
}) => {
  return (
    <React.Fragment>
      {isOpen && (
        <div key="move-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-white mb-4">
              <Move size={20} className="text-amber-400" />
              <h3 className="text-lg font-normal">Move / Cut File</h3>
            </div>
            <div className="text-xs text-zinc-400 mb-2">
              Source file: <span className="font-mono text-zinc-300 break-all">{sourcePath}</span>
            </div>
            <label className="block text-xs text-zinc-400 mb-2">Destination Path:</label>
            <input
              autoFocus
              type="text"
              value={moveNewName}
              onChange={(e) => setMoveNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmMoveFile();
                if (e.key === 'Escape') onClose();
              }}
              className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white font-mono focus:outline-none focus:border-accent mb-6"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] active:bg-[#2d2d30] text-white text-sm transition-colors rounded-[2px]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmMoveFile}
                className="px-6 py-2 bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white text-sm font-medium rounded-[2px] transition-colors"
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
