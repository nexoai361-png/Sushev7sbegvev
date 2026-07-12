import React from 'react';
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js';

const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons@master/icons/';

export const VSCodeDefaultFileIcon = ({ className = "shrink-0", size = 16 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} style={{ width: size, height: size }}>
    <path d="M20.414,2H5V30H27V8.586ZM7,28V4H19v6h6V28Z" fill="#c5c5c5"/>
  </svg>
);

export const VSCodeFolderClosedIcon = ({ className = "shrink-0", size = 16 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} style={{ width: size, height: size }}>
    <path d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1-2.1h7.1Z" fill="#c09553"/>
  </svg>
);

export const VSCodeFolderOpenIcon = ({ className = "shrink-0", size = 16 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} style={{ width: size, height: size }}>
    <path d="M27.4,5.5H18.2L16.1,9.7H4.3V26.5H29.5V5.5Zm0,18.7H6.6V11.8H27.4Zm0-14.5H19.2l1-2.1h7.1V9.7Z" fill="#dcb67a"/>
    <polygon points="25.7 13.7 0.5 13.7 4.3 26.5 29.5 26.5 25.7 13.7" fill="#dcb67a"/>
  </svg>
);

export const getOfficialIcon = (filenameOrExt: string): string => {
  if (!filenameOrExt) return '';
  let name = filenameOrExt;
  // If it's just an extension without a dot, make it look like a filename
  if (!name.includes('.') && name.length <= 4) {
    name = `dummy.${name}`;
  }
  const iconName = getIconForFile(name);
  return `${CDN_BASE_URL}${iconName}`;
};

export const getFolderIcon = (foldername: string, isOpen: boolean): string => {
  const iconName = isOpen ? getIconForOpenFolder(foldername) : getIconForFolder(foldername);
  return `${CDN_BASE_URL}${iconName}`;
};

