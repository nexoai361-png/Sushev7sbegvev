/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface Attachment {
  name: string;
  type: string;
  content: string;
}

export interface Message {
  id?: string;
  role: 'user' | 'model';
  content: string;
  reasoning?: string;
  attachments?: Attachment[];
}

export interface Project {
  id: string;
  name: string;
  messages: Message[];
  files: Record<string, { code: string, language: string }>;
  openFiles?: string[];
  activeFile: string;
  createdAt: number;
}

export interface Snippet {
  id: string;
  name: string;
  code: string;
  language: string;
  description?: string;
  createdAt: number;
}

export type TreeNodeType = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: Record<string, TreeNodeType>;
};

export const FileIconSizeContext = React.createContext<number>(14);
export const useFileIconSize = () => React.useContext(FileIconSizeContext);

export interface Bookmark {
  id: string;
  projectId: string;
  filename: string;
  lineNumber: number;
  lineContent: string;
  createdAt: number;
}

