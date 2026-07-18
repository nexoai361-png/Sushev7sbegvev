import React from 'react';
import { Github, Loader2 } from 'lucide-react';
import { Codicon } from '../lib/icons';

interface GithubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubRepoUrl: string;
  setGithubRepoUrl: (url: string) => void;
  githubBranch: string;
  setGithubBranch: (branch: string) => void;
  confirmGithubImport: () => void;
  isGitHubImporting: boolean;
}

export const GithubImportModal: React.FC<GithubImportModalProps> = ({
  isOpen,
  onClose,
  githubRepoUrl,
  setGithubRepoUrl,
  githubBranch,
  setGithubBranch,
  confirmGithubImport,
  isGitHubImporting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center bg-black/40">
      <div 
        className="w-full max-w-[500px] mt-[10vh] bg-[#252526] border border-[#454545] rounded-none shadow-[0_8px_24px_rgba(0,0,0,0.5)] h-fit overflow-hidden"
      >
        {/* Minimalist VS Code Style Header */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#252526]">
          <div className="flex items-center gap-2">
            <Github size={12} className="text-[#858585]" />
            <span className="text-[11px] text-[#858585]">Import from GitHub</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#3e3e42] text-[#858585] hover:text-white transition-colors"
          >
            <Codicon name="close" size={14} />
          </button>
        </div>

        <div className="px-4 pb-4 pt-2">
          <div className="space-y-4">
            <div>
              <div className="text-[12px] text-[#cccccc] mb-2 opacity-90">
                Enter the repository name (<code className="text-[#4fc1ff] bg-[#1e1e1e] px-1 rounded-sm font-mono">owner/repo</code>) or full URL.
              </div>
              <input
                autoFocus
                type="text"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && githubRepoUrl) confirmGithubImport();
                  if (e.key === 'Escape') onClose();
                }}
                placeholder="e.g. facebook/react"
                className="w-full bg-[#3c3c3c] border border-transparent p-1.5 text-[13px] text-white focus:outline-none focus:border-[#007acc] placeholder:text-[#858585]"
              />
            </div>
            
            <div>
              <label className="block text-[11px] text-[#858585] mb-1">Branch / Reference (Optional)</label>
              <input
                type="text"
                value={githubBranch}
                onChange={(e) => setGithubBranch(e.target.value)}
                placeholder="main"
                className="w-full bg-[#3c3c3c] border border-transparent p-1.5 text-[13px] text-white focus:outline-none focus:border-[#007acc] placeholder:text-[#858585]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button 
              onClick={onClose}
              className="px-4 py-1 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-[12px] transition-colors rounded-none"
            >
              Cancel
            </button>
            <button 
              disabled={isGitHubImporting || !githubRepoUrl}
              onClick={confirmGithubImport}
              className={`px-4 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white text-[12px] rounded-none transition-colors flex items-center gap-2 min-w-[80px] justify-center ${isGitHubImporting || !githubRepoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGitHubImporting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Importing</span>
                </>
              ) : (
                <span>Import</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
