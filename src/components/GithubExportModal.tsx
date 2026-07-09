import React from 'react';
import { Github, Loader2 } from 'lucide-react';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

interface GithubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  githubExportRepo: string;
  setGithubExportRepo: (repo: string) => void;
  githubBranch: string;
  setGithubBranch: (branch: string) => void;
  githubCommitMessage: string;
  setGithubCommitMessage: (msg: string) => void;
  handleGithubLogin: () => void;
  confirmGithubExport: () => void;
  isGitHubExporting: boolean;
}

export const GithubExportModal: React.FC<GithubExportModalProps> = ({
  isOpen,
  onClose,
  githubToken,
  setGithubToken,
  githubExportRepo,
  setGithubExportRepo,
  githubBranch,
  setGithubBranch,
  githubCommitMessage,
  setGithubCommitMessage,
  handleGithubLogin,
  confirmGithubExport,
  isGitHubExporting,
}) => {
  return (
    <React.Fragment>
      {isOpen && (
        <div key="github-export-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            
            
            
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-none p-6 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Github size={20} className="text-white" />
              <h3 className="text-lg font-normal text-white">Push to GitHub</h3>
            </div>
            
            {!githubToken ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center mb-4">
                  <Github size={32} className="text-zinc-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Connect Your Account</h4>
                <p className="text-[11px] text-zinc-400 mb-6 max-w-xs">Securely sign in to GitHub to push your projects directly to your repositories.</p>
                <button 
                  onClick={handleGithubLogin}
                  className="w-full py-3 bg-white text-black hover:bg-zinc-200 text-sm font-bold rounded-none transition-all flex items-center justify-center gap-2"
                >
                  <Github size={18} />
                  Continue with GitHub
                </button>
                <button 
                  onClick={onClose}
                  className="mt-4 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-zinc-400 mb-4">You are connected. Configure your push settings below.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Repository (owner/repo)</label>
                    <input
                      type="text"
                      value={githubExportRepo}
                      onChange={(e) => setGithubExportRepo(e.target.value)}
                      placeholder="e.g. username/project-repo"
                      className="w-full bg-black/40 border border-white/10 rounded-none p-3 text-sm text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Branch</label>
                      <input
                        type="text"
                        value={githubBranch}
                        onChange={(e) => setGithubBranch(e.target.value)}
                        placeholder="main"
                        className="w-full bg-black/40 border border-white/10 rounded-none p-3 text-sm text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Commit Message</label>
                      <input
                        type="text"
                        value={githubCommitMessage}
                        onChange={(e) => setGithubCommitMessage(e.target.value)}
                        placeholder="Commit message"
                        className="w-full bg-black/40 border border-white/10 rounded-none p-3 text-sm text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => {
                      setGithubToken('');
                      idbSet('reversx_github_token', '');
                    }}
                    className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors uppercase font-bold tracking-widest"
                  >
                    Sign Out
                  </button>
                  <div className="flex gap-3">
                    <button 
                      onClick={onClose}
                      className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={isGitHubExporting}
                      onClick={confirmGithubExport}
                      className={`px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-[2px] transition-colors flex items-center gap-2 ${isGitHubExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isGitHubExporting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Pushing...</span>
                        </>
                      ) : (
                        <span>Push Now</span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
