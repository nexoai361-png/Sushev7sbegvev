import React, { useState } from 'react';
import { FilePlus, FolderPlus, Copy, Move } from 'lucide-react';
import { useIcons } from '../lib/icons';
import { TreeNodeType, useFileIconSize } from '../types';
import { 
  VSCodeDefaultFileIcon, 
  VSCodeFolderClosedIcon, 
  VSCodeFolderOpenIcon, 
  getOfficialIcon,
  getFolderIcon
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
      className="w-full flex items-center gap-1.5 h-[22px] bg-[var(--sidebar-subtle)]/40 relative"
      style={{ paddingLeft: `${Math.max(8, depth * 12 + (type === 'file' ? 24 : 8))}px`, paddingRight: '12px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {depth > 0 && Array.from({ length: depth }).map((_, i) => (
        <div 
          key={i}
          className="absolute border-l border-[var(--sidebar-border)]/40 h-full pointer-events-none"
          style={{ left: `${i * 12 + 14}px` }}
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
        className="flex-1 bg-[var(--sidebar-bg)] border border-[var(--sidebar-accent)] text-[var(--sidebar-fg)] text-[12px] px-1 py-[1px] outline-none rounded-sm placeholder-[var(--sidebar-fg)]/25 w-full min-w-0 z-10"
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
  handleCopyFile: (path: string) => void;
  handleMoveFile: (path: string) => void;
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
  handleCopyFile,
  handleMoveFile,
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
  const fileIconSize = useFileIconSize();

  const {
     FolderOpen, ChevronDownIcon, ChevronRightIcon, File, FileJson, ImageIcon, Edit3, Trash2, MoreVertical, Download
  } = useIcons();

  if (node.type === 'folder') {
    return (
      <div className="w-full flex flex-col">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-1.5 h-[22px] text-[12px] group cursor-pointer text-[var(--sidebar-fg)]/80 hover:bg-[var(--sidebar-subtle)]/40 active:bg-[var(--sidebar-subtle)]/70 hover:text-[var(--sidebar-fg)] relative transition-all duration-100`}
          style={{ paddingLeft: `${Math.max(8, depth * 12 + 8)}px`, paddingRight: '12px' }}
        >
          {depth > 0 && Array.from({ length: depth }).map((_, i) => (
            <div 
              key={i}
              className="absolute border-l border-[var(--sidebar-border)]/40 h-full pointer-events-none"
              style={{ left: `${i * 12 + 14}px` }}
            />
          ))}

          <div className="w-4 h-4 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
            {isOpen ? <ChevronDownIcon size={12} className="text-[var(--sidebar-fg)]/85" /> : <ChevronRightIcon size={12} className="text-[var(--sidebar-fg)]/85" />}
          </div>
          <div className="shrink-0 select-none flex items-center justify-center" style={{ width: fileIconSize, height: fileIconSize }}>
            <img 
              src={getFolderIcon(node.name, isOpen)} 
              alt={node.name} 
              className="object-contain shrink-0" 
              style={{ width: fileIconSize, height: fileIconSize }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="truncate flex-1 tracking-tight leading-none pt-[1px]">{node.name}</span>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 z-20 shrink-0 ml-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                onInitiateInlineCreateInFolder('file', node.path);
              }}
              className="p-0.5 hover:bg-[var(--sidebar-subtle)]/80 active:bg-[var(--sidebar-subtle)] rounded-sm text-[var(--sidebar-fg)]/60 hover:text-[var(--sidebar-fg)] transition-all duration-100"
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
              className="p-0.5 hover:bg-[var(--sidebar-subtle)]/80 active:bg-[var(--sidebar-subtle)] rounded-sm text-[var(--sidebar-fg)]/60 hover:text-[var(--sidebar-fg)] transition-all duration-100"
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
                handleCopyFile={handleCopyFile}
                handleMoveFile={handleMoveFile}
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
  
  const officialIconUrl = getOfficialIcon(node.name);
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
      className={`w-full flex items-center gap-1.5 h-[22px] text-[12px] group cursor-pointer relative transition-all duration-100 ${
        isSelected 
          ? 'bg-[var(--sidebar-subtle)] text-[var(--sidebar-fg)] font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[var(--sidebar-accent)] active:bg-[var(--sidebar-subtle)]/80' 
          : 'text-[var(--sidebar-fg)]/85 hover:bg-[var(--sidebar-subtle)]/40 active:bg-[var(--sidebar-subtle)]/70 hover:text-[var(--sidebar-fg)]'
      }`}
      style={{ paddingLeft: `${Math.max(8, depth * 12 + 28)}px`, paddingRight: '16px' }}
    >
      {depth > 0 && Array.from({ length: depth }).map((_, i) => (
        <div 
          key={i}
          className="absolute border-l border-[var(--sidebar-border)]/40 h-full pointer-events-none"
          style={{ left: `${i * 12 + 14}px` }}
        />
      ))}

      {officialIconUrl ? (
        <img 
          src={officialIconUrl} 
          alt={extension} 
          className="object-contain shrink-0" 
          style={{ width: fileIconSize, height: fileIconSize }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <VSCodeDefaultFileIcon size={fileIconSize} />
      )}
      
      <span className="truncate flex-1 tracking-tight leading-none pt-[1px]">
        {node.name}
        {isSelected && <span className="ml-1.5 text-[var(--sidebar-fg)] font-extrabold text-[14px] leading-none select-none inline-block">•</span>}
      </span>
      
      <div className="relative flex items-center shrink-0">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleCopyFile(name); 
          }}
          className="p-0.5 hover:bg-[var(--sidebar-subtle)]/80 active:bg-[var(--sidebar-subtle)] rounded-sm text-[var(--sidebar-fg)]/65 hover:text-sky-400 transition-all duration-100 opacity-0 group-hover:opacity-100 mr-1"
          title="Copy file"
        >
          <Copy size={11} />
        </button>

        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleMoveFile(name); 
          }}
          className="p-0.5 hover:bg-[var(--sidebar-subtle)]/80 active:bg-[var(--sidebar-subtle)] rounded-sm text-[var(--sidebar-fg)]/65 hover:text-amber-400 transition-all duration-100 opacity-0 group-hover:opacity-100 mr-1"
          title="Move file"
        >
          <Move size={11} />
        </button>

        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setActiveFileMenu(name === activeFileMenu ? null : name); 
          }}
          className="p-0.5 hover:bg-[var(--sidebar-subtle)]/80 active:bg-[var(--sidebar-subtle)] rounded-sm text-[var(--sidebar-fg)]/60 hover:text-[var(--sidebar-fg)] transition-all duration-100 opacity-0 group-hover:opacity-100"
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
                className="absolute right-0 top-full mt-1 w-max min-w-[110px] bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.4)] z-[70] py-1 overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[var(--sidebar-fg)]/85 hover:text-[var(--sidebar-accent-fg)] hover:bg-[var(--sidebar-accent)] flex items-center gap-2 transition-colors rounded-none font-inherit whitespace-nowrap"
                >
                  <Edit3 size={11} />
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[var(--sidebar-fg)]/85 hover:text-[var(--sidebar-accent-fg)] hover:bg-[var(--sidebar-accent)] flex items-center gap-2 transition-colors rounded-none font-inherit whitespace-nowrap"
                >
                  <Copy size={11} />
                  Copy File
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[var(--sidebar-fg)]/85 hover:text-[var(--sidebar-accent-fg)] hover:bg-[var(--sidebar-accent)] flex items-center gap-2 transition-colors rounded-none font-inherit whitespace-nowrap"
                >
                  <Move size={11} />
                  Move File
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[#f85149] hover:text-white hover:bg-[var(--sidebar-accent)] flex items-center gap-2 transition-colors rounded-none font-inherit whitespace-nowrap"
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
                  className="w-full px-3 py-1.5 text-left text-[11px] text-[var(--sidebar-fg)]/85 hover:text-[var(--sidebar-accent-fg)] hover:bg-[var(--sidebar-accent)] flex items-center gap-2 transition-colors rounded-none font-inherit whitespace-nowrap"
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
