import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileToDelete: string;
  confirmDeleteFile: () => void;
}

export const DeleteFileModal: React.FC<DeleteFileModalProps> = ({
  isOpen,
  onClose,
  fileToDelete,
  confirmDeleteFile,
}) => {
  return (
    <React.Fragment>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            
            
            
            className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-none p-6 shadow-2xl"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-none flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2 text-center">Delete File?</h3>
            <p className="text-sm text-foreground/50 mb-6 text-center">
              Are you sure you want to permanently delete <span className="text-white font-bold">"{fileToDelete}"</span>? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={confirmDeleteFile}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-none transition-colors"
              >
                Delete Permanently
              </button>
              <button 
                onClick={onClose}
                className="w-full py-2.5 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
