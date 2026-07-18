import React from 'react';

interface RenameFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  renameNewName: string;
  setRenameNewName: (name: string) => void;
  confirmRenameFile: () => void;
}

export const RenameFileModal: React.FC<RenameFileModalProps> = ({
  isOpen,
  onClose,
  renameNewName,
  setRenameNewName,
  confirmRenameFile,
}) => {
  return (
    <React.Fragment>
      {isOpen && (
        <div key="rename-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            
            
            
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
          >
            <h3 className="text-lg font-normal text-white mb-4">Rename File</h3>
            <input
              autoFocus
              type="text"
              value={renameNewName}
              onChange={(e) => setRenameNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmRenameFile();
                if (e.key === 'Escape') onClose();
              }}
              className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent mb-6"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] active:bg-[#2d2d30] text-white text-sm transition-colors rounded-[2px]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRenameFile}
                className="px-6 py-2 bg-[#007acc] hover:bg-[#0062a3] active:bg-[#004e82] text-white text-sm font-medium rounded-[2px] transition-colors"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
