import React, { useState } from 'react';
import { FilePlus, FolderPlus } from 'lucide-react';
import { useIcons } from '../lib/icons';
import { TreeNodeType } from '../types';
import { 
  VSCodeDefaultFileIcon, 
  VSCodeFolderClosedIcon, 
  VSCodeFolderOpenIcon, 
  getOfficialIcon 
} from './VSCodeIcons';

interface InlineCreationInputProps {
  type: 'file' | 'folder';
  depth: number;
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const InlineCreationInput = ({ 
  type, 
  depth, 
  value, 
  onChange, 
  onConfirm, 
  onCancel 
}: InlineCreationInputProps) => {
  return (
    <div 
      className="w-full flex items-center gap-1.5 h-[22px] bg-[#37373d]/50 relative"
      style={{ paddingLeft: `${Math.max(8, depth * 8 + (type === 'file' ? 24 : 8))}px`, paddingRight: '12px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {depth > 0 && Array.from({ length: depth }).map((_, i) => (
        <div 
          key={i}
          className="absolute border-l border-white/5 h-full pointer-events-none"
          style={{ left: `${i * 8 + 12}px` }}
        />
      ))}
      
      <div className="w-4 h-4 flex items-center justify-center shrink-0 select-none z-10">
        {type === 'folder' ? (
          <VSCodeFolderOpenIcon />
        ) : (
          <VSCodeDefaultFileIcon />
        )}
      </div>

      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onConfirm}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onConfirm();
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        placeholder={type === 'folder' ? 'Folder Name...' : 'File Name...'}
        className="flex-1 bg-[#3c3c3c] border border-[#007acc] text-white text-[12px] px-1 py-[1px] outline-none rounded-none placeholder-white/25 w-full min-w-0 z-10"
        style={{ fontFamily: "'Cabin', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

interface FileTreeItemProps {
  node: TreeNodeType;
  activeFile: string;
  activeFileMenu: string | null;
  handleFileOpen: (path: string) => void;
  setActiveFileMenu: (path: string | null) => void;
  handleRenameFile: (path: string) => void;
  handleDeleteFile: (path: string) => void;
  handleDownloadFile: (path: string) => void;
  depth?: number;
  inlineCreatingType: 'file' | 'folder' | null;
  inlineCreatingParent: string | null;
  inlineCreatingName: string;
  setInlineCreatingName: (val: string) => void;
  onConfirmInlineCreate: () => void;
  onCancelInlineCreate: () => void;
  onInitiateInlineCreateInFolder: (type: 'file' | 'folder', path: string) => void;
}

export const FileTreeItem = React.memo(({ 
  node, 
  activeFile, 
  activeFileMenu, 
  handleFileOpen, 
  setActiveFileMenu, 
  handleRenameFile, 
  handleDeleteFile, 
  handleDownloadFile, 
  depth = 0,
  inlineCreatingType,
  inlineCreatingParent,
  inlineCreatingName,
  setInlineCreatingName,
  onConfirmInlineCreate,
  onCancelInlineCreate,
  onInitiateInlineCreateInFolder
}: FileTreeItemProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
     FolderOpen, ChevronDownIcon, ChevronRightIcon, File, FileJson, ImageIcon, Edit3, Trash2, MoreVertical, Download
  } = useIcons();

  if (node.type === 'folder') {
    return (
      <div className="w-full flex flex-col">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-1.5 h-[22px] text-[12px] group cursor-pointer text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white relative`}
          style={{ paddingLeft: `${Math.max(8, depth * 12 + 8)}px`, paddingRight: '12px' }}
        >
          {depth > 0 && Array.from({ length: depth }).map((_, i) => (
            <div 
              key={i}
              className="absolute border-l border-white/[0.05] h-full pointer-events-none"
              style={{ left: `${i * 12 + 14}px` }}
            />
          ))}

          <div className="w-4 h-4 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
            {isOpen ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
          </div>
          <div className="shrink-0 select-none">
            {isOpen ? <VSCodeFolderOpenIcon size={14} /> : <VSCodeFolderClosedIcon size={14} />}
          </div>
          <span className="truncate flex-1 tracking-tight leading-none pt-[1px]" style={{ fontFamily: "'Cabin', sans-serif" }}>{node.name}</span>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 z-20 shrink-0 ml-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                onInitiateInlineCreateInFolder('file', node.path);
              }}
              className="p-0.5 hover:bg-white/10 rounded-[2px] text-zinc-400 hover:text-white transition-colors"
              title="New File under folder..."
            >
              <FilePlus size={11} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                onInitiateInlineCreateInFolder('folder', node.path);
              }}
              className="p-0.5 hover:bg-white/10 rounded-[2px] text-zinc-400 hover:text-white transition-colors"
              title="New Folder under folder..."
            >
              <FolderPlus size={11} />
            </button>
          </div>
        </div>

        {isOpen && (
          <>
            {inlineCreatingType && inlineCreatingParent === node.path && (
              <InlineCreationInput 
                type={inlineCreatingType}
                depth={depth + 1}
                value={inlineCreatingName}
                onChange={setInlineCreatingName}
                onConfirm={onConfirmInlineCreate}
                onCancel={onCancelInlineCreate}
              />
            )}

            {Object.values(node.children).sort((a: any, b: any) => {
               if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
               return a.name.localeCompare(b.name);
            }).map((child: any) => (
              <FileTreeItem 
                key={child.path}
                node={child}
                activeFile={activeFile}
                activeFileMenu={activeFileMenu}
                handleFileOpen={handleFileOpen}
                setActiveFileMenu={setActiveFileMenu}
                handleRenameFile={handleRenameFile}
                handleDeleteFile={handleDeleteFile}
                handleDownloadFile={handleDownloadFile}
                depth={depth + 1}
                inlineCreatingType={inlineCreatingType}
                inlineCreatingParent={inlineCreatingParent}
                inlineCreatingName={inlineCreatingName}
                setInlineCreatingName={setInlineCreatingName}
                onConfirmInlineCreate={onConfirmInlineCreate}
                onCancelInlineCreate={onCancelInlineCreate}
                onInitiateInlineCreateInFolder={onInitiateInlineCreateInFolder}
              />
            ))}
          </>
        )}
      </div>
    );
  }

  const name = node.path;
  const isSelected = activeFile === name;
  const extension = name.split('.').pop()?.toLowerCase() || '';
  
  const officialIconUrl = getOfficialIcon(extension);
  let Icon = File;
  let iconColor = isSelected ? 'text-white' : 'text-[#cccccc]';

  if (!officialIconUrl) {
    if (extension === 'json') {
      Icon = FileJson;
      iconColor = isSelected ? 'text-white' : 'text-orange-400';
    } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) {
      Icon = ImageIcon;
      iconColor = isSelected ? 'text-white' : 'text-emerald-400';
    }
  }

  return (
    <div
      onClick={() => handleFileOpen(name)}
      className={`w-full flex items-center gap-1.5 h-[22px] text-[12px] group cursor-pointer relative ${
        isSelected 
          ? 'bg-[#37373d] text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#007acc]' 
          : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
      }`}
      style={{ paddingLeft: `${Math.max(8, depth * 12 + 28)}px`, paddingRight: '16px' }}
    >
      {depth > 0 && Array.from({ length: depth }).map((_, i) => (
        <div 
          key={i}
          className="absolute border-l border-white/[0.05] h-full pointer-events-none"
          style={{ left: `${i * 12 + 14}px` }}
        />
      ))}

      {officialIconUrl ? (
        <img 
          src={officialIconUrl} 
          alt={extension} 
          className="object-contain shrink-0" 
          style={{ width: 14, height: 14 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <VSCodeDefaultFileIcon size={14} />
      )}
      
      <span className="truncate flex-1 tracking-tight leading-none pt-[1px]" style={{ fontFamily: "'Cabin', sans-serif" }}>
        {node.name}
        {isSelected && <span className="ml-1.5 text-blue-500 font-extrabold text-[14px] leading-none select-none inline-block">•</span>}
      </span>
      
      <div className="relative flex items-center shrink-0">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setActiveFileMenu(name === activeFileMenu ? null : name); 
          }}
          className="p-0.5 hover:bg-white/10 rounded text-foreground-subtle hover:text-foreground-muted transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={12} />
        </button>

        <React.Fragment>
          {activeFileMenu === name && (
            <>
              <div 
                className="fixed inset-0 z-[60]" 
                onClick={(e) => { e.stopPropagation(); setActiveFileMenu(null); }}
              />
              <div
                
                
                
                className="absolute right-0 top-full mt-1 w-max min-w-[110px] bg-[#252526] border border-[#454545] rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] z-[70] py-1 overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[#cccccc] hover:text-white hover:bg-[#007acc] flex items-center gap-2 transition-colors rounded-none font-googlesans whitespace-nowrap"
                >
                  <Edit3 size={11} />
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[#f85149] hover:text-white hover:bg-[#007acc] flex items-center gap-2 transition-colors rounded-none font-googlesans whitespace-nowrap"
                >
                  <Trash2 size={11} />
                  Delete
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[#cccccc] hover:text-white hover:bg-[#007acc] flex items-center gap-2 transition-colors rounded-none font-googlesans whitespace-nowrap"
                >
                  <Download size={11} />
                  Download
                </button>
              </div>
            </>
          )}
        </React.Fragment>
      </div>
    </div>
  );
});

FileTreeItem.displayName = 'FileTreeItem';
