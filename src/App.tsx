/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  MessageSquare, 
  Code, 
  Settings, 
  Files, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MoveDown,
  MoveUp,
  ArrowLeftToLine,
  ArrowRightToLine,
  Menu,
  Send, 
  User, 
  Terminal,
  Search,
  Smartphone,
  Laptop,
  Monitor,
  MonitorSmartphone,
  Plus,
  Minus,
  Blocks,
  Zap,
  Sun,
  UploadCloud,
  Upload,
  Languages,
  BookOpen,
  Copy,
  Check,
  Trash2,
  Github,
  Share2,
  Edit3,
  Undo2,
  Redo2,
  ClipboardPaste,
  Save,
  RefreshCw,
  Maximize2,
  Minimize2,
  FolderOpen,
  FilePlus,
  FolderPlus,
  ArrowUp,
  Film,
  Wand2,
  Sparkles,
  Hash,
  Bug,
  FileText,
  Loader2,
  Users,
  Paperclip,
  HelpCircle,
  Image as ImageIcon,
  FileCode,
  FileJson,
  File,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  MoreVertical,
  Cog,
  MessageCircle,
  Folder,
  PlayCircle,
  SearchCode,
  Users2,
  User2,
  SquareTerminal,
  PlusSquare,
  Trash,
  Edit,
  CheckCircle,
  SaveAll,
  RefreshCcw,
  Maximize,
  ArrowUpCircle,
  Wand,
  Sparkle,
  BugPlay,
  FileCode2,
  FileJson2,
  MoreHorizontal,
  Code2,
  CheckCircle2,
  X,
  Mic,
  Info,
  Drone,
  Bot,
  GitBranch,
  Bell,
  Download,
  SearchCode as SearchCodeIcon,
  Terminal as TerminalIcon,
  Plus as PlusIcon,
  Play as PlayIcon,
  Code as CodeIcon,
  Trash as TrashIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  RefreshCcw as RefreshCcwIcon,
  Maximize as MaximizeIcon,
  FolderClosed as FolderClosedIcon,
  ArrowUpCircle as ArrowUpCircleIcon,
  Wand as WandIcon,
  Sparkle as SparkleIcon,
  BugPlay as BugPlayIcon,
  FileCode2 as FileCode2Icon,
  FileJson2 as FileJson2Icon,
  MoreHorizontal as MoreHorizontalIcon,
  Key
} from 'lucide-react';
import { IconContext, useIcons, ICON_THEMES, Codicon } from './lib/icons';

import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

// Types & Contexts
import { 
  Attachment, Message, Project, Snippet, TreeNodeType, Bookmark,
  FileIconSizeContext, useFileIconSize 
} from './types';

// Editor Utilities
import { 
  SYNTAX_THEMES, getCodeMirrorExtensions, getLanguageFromPath 
} from './utils/editorUtils';

// Services
import { syncReactState, triggerEvent, EditorAPI } from './services/extensionApi';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Modular Components
import { QuickOpenModal } from './components/QuickOpenModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ShortcutsCheatSheet } from './components/ShortcutsCheatSheet';
import { AttachmentEditorModal } from './components/AttachmentEditorModal';
import { ChatMessage } from './components/ChatMessage';
import { MemoizedCodeEditor } from './components/MemoizedCodeEditor';
import { SnippetEditorModal } from './components/SnippetEditorModal';
import { FileTreeItem, InlineCreationInput } from './components/FileTreeItem';
import { SettingsModal } from './components/SettingsModal';
import { GithubExportModal } from './components/GithubExportModal';
import { GithubImportModal } from './components/GithubImportModal';
import { DeleteFileModal } from './components/DeleteFileModal';
import { RenameFileModal } from './components/RenameFileModal';
import { HelpModal } from './components/HelpModal';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const FONT_OPTIONS: Record<string, string> = {
  'Segoe UI': '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  'Google Sans': '"Google Sans", "Open Sans", sans-serif',
  'Inter': 'Inter, sans-serif',
  'Open Sans': '"Open Sans", sans-serif',
  'Poppins': 'Poppins, sans-serif',
  'Lato': 'Lato, sans-serif',
  'Nunito': 'Nunito, sans-serif',
  'Rubik': 'Rubik, sans-serif',
  'Ubuntu': 'Ubuntu, sans-serif',
  'Outfit': 'Outfit, sans-serif',
  'Cabin': 'Cabin, sans-serif',
  'Lexend': 'Lexend, sans-serif',
  'Fira Sans': '"Fira Sans", sans-serif',
  'Quicksand': 'Quicksand, sans-serif',
  'Plus Jakarta Sans': '"Plus Jakarta Sans", sans-serif',
  'Georgia': 'Georgia, serif',
  'Lora': 'Lora, serif',
  'Merriweather': 'Merriweather, serif',
  'Roboto': 'Roboto, sans-serif',
  'Montserrat': 'Montserrat, sans-serif'
};

import 'katex/dist/katex.min.css';
import { transform } from 'sucrase';

// Lazy loaded components for better performance
const MarkdownRenderer = React.lazy(() => import('./components/MarkdownRenderer'));
const MarkdownPreview = React.lazy(() => import('./components/MarkdownRenderer').then(m => ({ default: m.MarkdownPreview })));
const SyntaxHighlighter = React.lazy(() => import('./components/AsyncSyntaxHighlighter'));

// Components
import { Group, Panel, Separator } from 'react-resizable-panels';
import { Skeleton } from './components/Skeleton';
import { 
  vscDarkPlus,
  atomDark,
  cb,
  darcula,
  duotoneDark,
  duotoneEarth,
  duotoneForest,
  duotoneLight,
  duotoneSea,
  duotoneSpace,
  ghcolors,
  hopscotch,
  materialDark,
  materialLight,
  materialOceanic,
  nord,
  oneDark,
  oneLight,
  pojoaque,
  prism,
  shadesOfPurple,
  solarizedlight,
  tomorrow,
  twilight,
  xonokai,
  coldarkCold,
  coldarkDark,
  dracula,
  gruvboxDark,
  gruvboxLight,
  lucario,
  nightOwl,
  synthwave84
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { chatWithAI, chatWithAIStream, simpleChat } from './services/ai';
import { checkErrors, EditorMarker } from './services/errorChecker';
import * as db from './services/db';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getInitialCode = (name: string) => {
  const greeting = getGreeting();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${greeting}, ${name}</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
            color: #fff;
            font-family: -apple-system, system-ui, sans-serif;
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: 0.02em;
        }

        span {
            font-weight: 500;
        }
    </style>
</head>
<body>

    <h1>${greeting}, <span>${name}</span>.</h1>

</body>
</html>`;
};

export const APP_THEMES: Record<string, any> = {
  'VS Code Dark': {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    muted: '#858585',
    subtle: '#454545',
    accent: '#007acc',
    accentForeground: '#ffffff',
    sidebar: '#252526',
    border: '#333333'
  },
  'One Dark Pro': {
    background: '#282c34',
    foreground: '#abb2bf',
    muted: '#5c6370',
    subtle: '#3e4452',
    accent: '#61afef',
    accentForeground: '#ffffff',
    sidebar: '#21252b',
    border: '#181a1f'
  },
  'Dracula': {
    background: '#282a36',
    foreground: '#f8f8f2',
    muted: '#6272a4',
    subtle: '#44475a',
    accent: '#bd93f9',
    accentForeground: '#ffffff',
    sidebar: '#21222c',
    border: '#191a21'
  },
  'Nord': {
    background: '#2e3440',
    foreground: '#eceff4',
    muted: '#4c566a',
    subtle: '#3b4252',
    accent: '#88c0d0',
    accentForeground: '#2e3440',
    sidebar: '#2e3440',
    border: '#3b4252'
  },
  'Github Dark': {
    background: '#0d1117',
    foreground: '#c9d1d9',
    muted: '#8b949e',
    subtle: '#30363d',
    accent: '#58a6ff',
    accentForeground: '#ffffff',
    sidebar: '#161b22',
    border: '#30363d'
  }
};

// CollapsibleCodeBlock has been moved to src/components/CollapsibleCodeBlock.tsx


// QuickOpenModal has been moved to src/components/QuickOpenModal.tsx


// CommandPaletteModal and ShortcutsModal have been moved to src/components/


// AttachmentEditorModal and FileAttachment have been moved to src/components/


// ChatMessage, MobileKeyboardToolbar, and CoreEditor have been moved to src/components/




// FileTree icons and getOfficialIcon helper have been moved to src/components/VSCodeIcons.tsx


// InlineCreationInput has been moved to src/components/FileTreeItem.tsx


// FileTreeItem has been moved to src/components/FileTreeItem.tsx


// SnippetEditorModal has been moved to src/components/SnippetEditorModal.tsx


const buildFileTree = (filesList: string[]) => {
  const root: TreeNodeType = { name: 'root', type: 'folder', children: {}, path: '' };
  filesList.forEach(path => {
    const parts = path.split('/');
    let current = root;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current.children[part] = { name: part, type: 'file', path: path, children: {} };
      } else {
        if (!current.children[part]) {
          current.children[part] = { name: part, type: 'folder', children: {}, path: parts.slice(0, i + 1).join('/') };
        }
        current = current.children[part];
      }
    });
  });
  return root;
};

export default function App() {
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [previewPendingIdx, setPreviewPendingIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const stopRef = useRef(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showAndroidImportModal, setShowAndroidImportModal] = useState(false);
  const [androidImportTarget, setAndroidImportTarget] = useState<'welcome' | 'sidebar'>('welcome');
  const [settingsCategory, setSettingsCategory] = useState<'appearance' | 'editor' | 'application' | 'syntax'>('appearance');
  const [syntaxThemeName, setSyntaxThemeName] = useState(() => localStorage.getItem('reversx_syntax_theme') || 'VS Code Dark');

  useEffect(() => {
    localStorage.setItem('reversx_syntax_theme', syntaxThemeName);
  }, [syntaxThemeName]);

  // Custom Extension states
  const [customExtensions, setCustomExtensions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('reversx_custom_extensions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'case-transformer',
        name: 'Case Transformer',
        description: 'Selected code text converts to UPPERCASE, lowercase, camelCase, snake_case etc.',
        html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #181c1c;
      color: #94a3b8;
      padding: 12px;
      margin: 0;
      font-size: 12px;
    }
    h3 {
      color: #f1f5f9;
      margin: 0 0 10px 0;
      font-size: 13px;
      font-weight: 600;
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      width: 100%;
      text-align: left;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      margin-bottom: 6px;
      transition: background 0.2s;
    }
    button:hover {
      background: #60a5fa;
    }
    .status {
      margin-top: 10px;
      font-size: 10px;
      color: #64748b;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h3>🔥 Case Transformer</h3>
  <button onclick="transform('upper')">UPPERCASE</button>
  <button onclick="transform('lower')">lowercase</button>
  <button onclick="transform('camel')">camelCase</button>
  <button onclick="transform('snake')">snake_case</button>
  
  <div class="status" id="status">Ready</div>

  <script>
    function transform(mode) {
      try {
        const api = window.parent.EditorAPI || window.EditorAPI;
        if (!api) {
          document.getElementById('status').innerText = "EditorAPI not found";
          return;
        }
        const activeState = api.editor.active;
        const selection = activeState.getSelection();
        if (!selection || !selection.text) {
          document.getElementById('status').innerText = "Please select code first!";
          return;
        }
        let txt = selection.text;
        if (mode === 'upper') txt = txt.toUpperCase();
        else if (mode === 'lower') txt = txt.toLowerCase();
        else if (mode === 'camel') txt = txt.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase());
        else if (mode === 'snake') txt = txt.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
        
        activeState.insertText(txt);
        document.getElementById('status').innerText = "Transformed text successful.";
      } catch (e) {
        document.getElementById('status').innerText = "Error: " + e.message;
      }
    }
  </script>
</body>
</html>`,
        isActive: true
      },
      {
        id: 'code-decorator',
        name: 'Code Decorator',
        description: 'Quickly insert descriptive file headers, JS DocBlocks, and star-banners.',
        html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #181c18;
      color: #a3b894;
      padding: 12px;
      margin: 0;
      font-size: 12px;
    }
    h3 {
      color: #f5f9f1;
      margin: 0 0 10px 0;
      font-size: 13px;
      font-weight: 600;
    }
    button {
      background: #10b981;
      color: white;
      border: none;
      width: 100%;
      text-align: left;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      margin-bottom: 6px;
      transition: background 0.2s;
    }
    button:hover {
      background: #34d399;
    }
    .status {
      margin-top: 10px;
      font-size: 10px;
      color: #64748b;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h3>🛠️ Code JSDoc & Banner</h3>
  <button onclick="addComment('jsdoc')">Add JSDoc Block</button>
  <button onclick="addComment('banner')">Add Comment Banner</button>
  
  <div class="status" id="status">Ready</div>

  <script>
    function addComment(mode) {
      try {
        const api = window.parent.EditorAPI || window.EditorAPI;
        if (!api) {
          document.getElementById('status').innerText = "EditorAPI not found";
          return;
        }
        const activeState = api.editor.active;
        const file = activeState.getPath() || 'unknown';
        const date = new Date().toLocaleDateString();
        
        let comment = "";
        if (mode === 'jsdoc') {
          comment = "/**\\n * @file " + file + "\\n * @date " + date + "\\n * @author Extension\\n */\\n";
        } else {
          comment = "/* ==========================================================\\n   BUILD UNIT SHIELD: " + date + " \\n   ========================================================== */\\n";
        }
        activeState.insertText(comment);
        document.getElementById('status').innerText = "Comment inserted.";
      } catch (e) {
        document.getElementById('status').innerText = "Error: " + e.message;
      }
    }
  </script>
</body>
</html>`,
        isActive: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('reversx_custom_extensions', JSON.stringify(customExtensions));
  }, [customExtensions]);

  const [activeExtensionUI, setActiveExtensionUI] = useState<any | null>(null);
  const [showAddExtensionForm, setShowAddExtensionForm] = useState(false);
  const [newExtName, setNewExtName] = useState('');
  const [newExtDesc, setNewExtDesc] = useState('');
  const [newExtHtml, setNewExtHtml] = useState('');
  const [docLanguage, setDocLanguage] = useState<'en' | 'bn'>('en');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalReplaceQuery, setGlobalReplaceQuery] = useState('');
  const [globalSearchOptions, setGlobalSearchOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false
  });
  const [globalSearchResults, setGlobalSearchResults] = useState<{ filename: string, matches: { line: number, text: string, index: number }[] }[]>([]);

  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'cmd' | 'output' | 'error', text: string }[]>([
    { type: 'output', text: 'ReversX v1 Terminal - Type "help" for a list of commands.' }
  ]);
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isGithubImportOpen, setIsGithubImportOpen] = useState(false);
  const [isGithubExportOpen, setIsGithubExportOpen] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [githubExportRepo, setGithubExportRepo] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubCommitMessage, setGithubCommitMessage] = useState('Update from ReversX Editor');
  const [isGitHubImporting, setIsGitHubImporting] = useState(false);
  const [isGitHubExporting, setIsGitHubExporting] = useState(false);
  const [welcomeChatInput, setWelcomeChatInput] = useState('');
  const [welcomeChatFiles, setWelcomeChatFiles] = useState<{name: string, type: string, url?: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const welcomeChatRef = useRef<HTMLTextAreaElement>(null);
  const welcomeChatFileInputRef = useRef<HTMLInputElement>(null);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('Agent v1');
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setWelcomeChatInput(prev => prev + (prev ? ' ' : '') + transcript);
      if (welcomeChatRef.current) {
        setTimeout(() => {
          if (welcomeChatRef.current) {
            welcomeChatRef.current.style.height = 'auto';
            welcomeChatRef.current.style.height = `${Math.min(welcomeChatRef.current.scrollHeight, 150)}px`;
          }
        }, 0);
      }
    };
    
    recognition.start();
  }, [welcomeChatInput]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const exchangeToken = async () => {
        setIsGitHubExporting(true);
        try {
          const res = await fetch('/api/github/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          const data = await res.json();
          if (data.access_token) {
            setGithubToken(data.access_token);
            if (isDbLoaded) idbSet('reversx_github_token', data.access_token);
            setIsGithubExportOpen(true);
          } else {
            throw new Error(data.error_description || data.error || 'Failed to authenticate');
          }
        } catch (err: any) {
          console.error('GitHub Auth Error:', err);
        } finally {
          setIsGitHubExporting(false);
        }
      };
      exchangeToken();
    }
  }, [isDbLoaded]);

  const handleGithubLogin = useCallback(() => {
    const clientId = (import.meta as any).env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = (import.meta as any).env.VITE_GITHUB_REDIRECT_URI || window.location.origin;
    if (!clientId) {
      alert('GitHub Client ID is not configured. Please add VITE_GITHUB_CLIENT_ID in the dashboard settings.');
      return;
    }
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
    window.location.href = githubUrl;
  }, []);

  const getPlatformConfig = useCallback((): { platform: string, apiKey: string, model: string, extra?: { baseURL?: string } } => {
    return { platform: 'gemini', apiKey: geminiApiKey || 'env-key', model: geminiModel };
  }, [geminiApiKey, geminiModel]);

  const [mainView, setMainView] = useState<'editor' | 'preview' | 'projects' | 'settings'>('editor');
  const [mobileView, setMobileView] = useState<'editor' | 'chat' | 'preview' | 'tab'>('editor');
  const [showSnippetEditor, setShowSnippetEditor] = useState<Snippet | null>(null);
  const [showSnippetsModal, setShowSnippetsModal] = useState(false);
  const [showProjectNaming, setShowProjectNaming] = useState(false);
  const appliedBlocks = useRef<Set<number>>(new Set());
  const [pendingProjectName, setPendingProjectName] = useState('');
  const [pendingUserMessage, setPendingUserMessage] = useState('');
  const [pendingUserAttachments, setPendingUserAttachments] = useState<Attachment[]>([]);
  const [editingAttachment, setEditingAttachment] = useState<{ attachment: Attachment, index?: number, isPending: boolean } | null>(null);
  const [pendingUserAttachmentsForAI, setPendingUserAttachmentsForAI] = useState<Attachment[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeActionsId, setActiveActionsId] = useState<string | null>(null);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const previewTimeout = useRef<NodeJS.Timeout | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const explorerFileInputRef = useRef<HTMLInputElement>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [editorLineHeight, setEditorLineHeight] = useState(1.5);
  const [editorFontFamily, setEditorFontFamily] = useState('Consolas, Menlo, Monaco, "Courier New", monospace');
  const editorThemeName = 'VS Code Dark';
  const currentEditorTheme = vscDarkPlus;
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [appThemeName, setAppThemeName] = useState('VS Code Dark');
  const [iconThemeName, setIconThemeName] = useState('VS code');
  const [fileIconSize, setFileIconSize] = useState(16);
  const [appFontName, setAppFontName] = useState('Inter');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const [markers, setMarkers] = useState<EditorMarker[]>([]);
  const [auditResults, setAuditResults] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'laptop' | 'desktop'>('desktop');
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  const [files, setFiles] = useState<Record<string, { code: string, language: string }>>({});
  const [previewFiles, setPreviewFiles] = useState<Record<string, { code: string, language: string }>>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [activeFileSecondary, setActiveFileSecondary] = useState<string | null>(null);
  const [editorPanes, setEditorPanes] = useState<string[]>([]);
  const [paneWidths, setPaneWidths] = useState<number[]>([100]);
  const [isResizingPane, setIsResizingPane] = useState<number | null>(null);

  useEffect(() => {
    // Sync pane widths when panes are added/removed
    if (editorPanes.length !== paneWidths.length) {
      const equalWidth = 100 / editorPanes.length;
      setPaneWidths(new Array(editorPanes.length).fill(equalWidth));
    }
  }, [editorPanes.length]);

  const startResizingPane = (index: number) => {
    setIsResizingPane(index);
  };

  const stopResizingPane = () => {
    setIsResizingPane(null);
  };

  const handlePaneResize = useCallback((e: MouseEvent | TouchEvent) => {
    if (isResizingPane === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const container = document.getElementById('main-editor-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const totalWidth = rect.width;
    const percentage = (x / totalWidth) * 100;

    setPaneWidths(prev => {
      const next = [...prev];
      const i = isResizingPane;
      
      // Calculate current cumulative percentage up to the pane before the handle
      let leftCumulative = 0;
      for (let j = 0; j < i; j++) leftCumulative += next[j];
      
      const minWidth = 10; // 10% minimum width
      const delta = percentage - (leftCumulative + next[i]);
      
      if (next[i] + delta > minWidth && next[i+1] - delta > minWidth) {
        next[i] += delta;
        next[i+1] -= delta;
      }
      
      return next;
    });
  }, [isResizingPane]);

  useEffect(() => {
    if (isResizingPane !== null) {
      window.addEventListener('mousemove', handlePaneResize);
      window.addEventListener('mouseup', stopResizingPane);
      window.addEventListener('touchmove', handlePaneResize);
      window.addEventListener('touchend', stopResizingPane);
      return () => {
        window.removeEventListener('mousemove', handlePaneResize);
        window.removeEventListener('mouseup', stopResizingPane);
        window.removeEventListener('touchmove', handlePaneResize);
        window.removeEventListener('touchend', stopResizingPane);
      };
    }
  }, [isResizingPane, handlePaneResize]);

  const [focusedPaneIndex, setFocusedPaneIndex] = useState(0);
  const [focusedPane, setFocusedPane] = useState<'left' | 'right'>('left');
  const [editorSplit, setEditorSplit] = useState(false);
  const [editorSplitRatio, setEditorSplitRatio] = useState(50);
  const [isResizingEditorSplit, setIsResizingEditorSplit] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isBookmarksCollapsed, setIsBookmarksCollapsed] = useState(false);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [bookmarkSearchTerm, setBookmarkSearchTerm] = useState('');
  const enabledMobileTabs = ['editor', 'preview', 'settings'];
  const [activeTooltip, setActiveTooltip] = useState<{ text: string, x: number, y: number } | null>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLongPressStart = (text: string, e: React.MouseEvent | React.TouchEvent) => {
    // Basic coordinates
    let x = 0;
    let y = 0;
    if ('touches' in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = (e as React.MouseEvent).clientX;
      y = (e as React.MouseEvent).clientY;
    }

    tooltipTimerRef.current = setTimeout(() => {
      setActiveTooltip({ text, x, y: y - 40 });
      // Clear after 2 seconds automatically
      setTimeout(() => setActiveTooltip(null), 2000);
    }, 800);
  };

  const handleLongPressEnd = () => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [inlineCreatingType, setInlineCreatingType] = useState<'file' | 'folder' | null>(null);
  const [inlineCreatingParent, setInlineCreatingParent] = useState<string>('');
  const [inlineCreatingName, setInlineCreatingName] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isExplorerCreateMenuOpen, setIsExplorerCreateMenuOpen] = useState(false);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameOldName, setRenameOldName] = useState('');
  const [renameNewName, setRenameNewName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showQuickOpen, setShowQuickOpen] = useState(false);
  const [showInlineFileSearch, setShowInlineFileSearch] = useState(false);
  const [inlineFileSearchQuery, setInlineFileSearchQuery] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showShortcutsCheatSheet, setShowShortcutsCheatSheet] = useState(false);
  const [activeFileMenu, setActiveFileMenu] = useState<string | null>(null);
  const fileHandles = useRef<Record<string, any>>({});
  const [copied, setCopied] = useState(false);

  // Persistence Effects
  useEffect(() => {
    if (isDbLoaded && userName) idbSet('reversx_userName', userName);
  }, [userName, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_messages', messages);
  }, [messages, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_gemini_model', geminiModel);
  }, [geminiModel, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_gemini_key', geminiApiKey);
  }, [geminiApiKey, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_active_tab', activeTab);
  }, [activeTab, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_github_token', githubToken);
  }, [githubToken, isDbLoaded]);

  useEffect(() => {
    if (activeFile && files[activeFile]) {
      const newMarkers = checkErrors(files[activeFile].code, files[activeFile].language);
      setMarkers(newMarkers);
    }
  }, [files, activeFile]);

  const handleAudit = useCallback(async (type: 'bugs' | 'security' | 'performance') => {
    if (!activeFile || !files[activeFile] || isLoading) return;
    
    setIsLoading(true);
    setAuditResults(null);

    const code = files[activeFile].code;
    const lang = files[activeFile].language;
    
    let sysPrompt = "";
    if (type === 'bugs') {
      sysPrompt = "You are a World-Class Bug Hunter. Analyze the following code specifically for logical errors, edge cases, and runtime bugs. List the issues found and provide fixes. Speak in Bengali if possible for the descriptions.";
    } else if (type === 'security') {
      sysPrompt = "You are a Cyber-Security Expert. Perform a deep security audit on this code. Look for XSS, SQL injection, insecure storage, and sensitive data leaks. Provide clear warnings and solutions. Use Bengali for explanations.";
    } else {
      sysPrompt = "You are a Performance Engineer. Analyze this code for performance bottlenecks, memory leaks, and inefficient algorithms. Provide optimization tips. Use Bengali for explanations.";
    }

    const prompt = `${sysPrompt}\n\nCode Preview:\n\`\`\`${lang}\n${code}\n\`\`\``;
    
    try {
      const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra } = getPlatformConfig();
      const res = await chatWithAI(prompt, [], currentApiKey, currentModel, currentPlatform, [], extra);
      setAuditResults(res);
      
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFile, files, isLoading]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_editor_theme', editorThemeName);
  }, [editorThemeName, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_editor_font_size', editorFontSize.toString());
  }, [editorFontSize, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_editor_line_height', editorLineHeight.toString());
  }, [editorLineHeight, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_editor_font_family', editorFontFamily);
  }, [editorFontFamily, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_split_screen', isSplitScreen.toString());
  }, [isSplitScreen, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_open_files', openFiles);
  }, [openFiles, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_app_theme', appThemeName);
  }, [appThemeName, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_icon_theme', iconThemeName);
  }, [iconThemeName, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_file_icon_size', fileIconSize);
  }, [fileIconSize, isDbLoaded]);
  
  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_app_font', appFontName);
    document.documentElement.style.setProperty('--app-ui-font', FONT_OPTIONS[appFontName] || 'Inter, sans-serif');
  }, [appFontName, isDbLoaded]);
  
  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_projects', projects);
  }, [projects, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) {
      if (activeProjectId) {
        idbSet('reversx_active_project_id', activeProjectId);
      } else {
        idbDel('reversx_active_project_id');
      }
    }
  }, [activeProjectId, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_files', files);
  }, [files, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_active_file', activeFile);
  }, [activeFile, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_bookmarks', bookmarks);
  }, [bookmarks, isDbLoaded]);

  // Initial Data Load
  useEffect(() => {
    const loadState = async () => {
      try {
        const checkAndMigrate = async (key: string, parse = false, defaultVal: any = null) => {
          let val = await idbGet(key);
          if (val === undefined) {
            const lsVal = localStorage.getItem(key);
            if (lsVal !== null) {
              val = parse ? JSON.parse(lsVal) : lsVal;
              await idbSet(key, val); 
            } else {
              val = defaultVal;
            }
          } else if (parse && typeof val === 'string') {
            try {
              // Automatically recover stringified data mistakenly saved as strings back into objects
              val = JSON.parse(val);
              await idbSet(key, val); // update it back correctly
            } catch (e) {
              console.warn(`Could not parse ${key} from string fallback: `, val);
            }
          }
          return val;
        };

        const dbUserName = await checkAndMigrate('reversx_userName', false, null);
        setUserName(dbUserName);
        setShowNamePrompt(!dbUserName);

        const loadedMessages = await checkAndMigrate('reversx_messages', true, []);
        if (loadedMessages.length > 0) setMessages(loadedMessages);

        const loadedProjects = await checkAndMigrate('reversx_projects', true, []);
        if (loadedProjects.length > 0) setProjects(loadedProjects);

        setActiveProjectId(await checkAndMigrate('reversx_active_project_id', false, null));
        setActiveTab(await checkAndMigrate('reversx_active_tab', false, 'projects'));
        setGeminiApiKey(await checkAndMigrate('reversx_gemini_key', false, ''));
        
        let initialGeminiModel = await checkAndMigrate('reversx_gemini_model', false, 'gemini-2.0-flash');
        if (initialGeminiModel === 'gemini-2.0-flash-exp' || initialGeminiModel === 'gemini-1.5-flash-exp') {
          initialGeminiModel = 'gemini-2.0-flash';
          idbSet('reversx_gemini_model', initialGeminiModel);
        }
        setGeminiModel(initialGeminiModel);

        setGithubToken(await checkAndMigrate('reversx_github_token', false, ''));
        
        setEditorFontSize(Number(await checkAndMigrate('reversx_editor_font_size', false, 14)));
        setEditorLineHeight(Number(await checkAndMigrate('reversx_editor_line_height', false, 1.5)));
        setEditorFontFamily(await checkAndMigrate('reversx_editor_font_family', false, 'Consolas, Menlo, Monaco, "Courier New", monospace'));
        
        const splitVal = await checkAndMigrate('reversx_split_screen', false, 'false');
        setIsSplitScreen(splitVal === 'true' || splitVal === true);
        
        const defaultFiles = {};
        const loadedFiles = await checkAndMigrate('reversx_files', true, defaultFiles);
        setFiles(loadedFiles);
        setPreviewFiles(loadedFiles);
        setActiveFile(await checkAndMigrate('reversx_active_file', false, ''));
        setOpenFiles(await checkAndMigrate('reversx_open_files', true, []));
        setAppThemeName(await checkAndMigrate('reversx_app_theme', false, 'VS Code Dark'));
        setIconThemeName(await checkAndMigrate('reversx_icon_theme', false, 'VS code'));
        setFileIconSize(await checkAndMigrate('reversx_file_icon_size', false, 16));
        setAppFontName(await checkAndMigrate('reversx_app_font', false, 'Inter'));
        
        const loadedBookmarks = await checkAndMigrate('reversx_bookmarks', true, []);
        setBookmarks(loadedBookmarks);

        setIsDbLoaded(true);
      } catch (err) {
        console.error("Failed to load from IndexedDB", err);
        setIsDbLoaded(true);
      }
    };
    setTimeout(loadState, 4000);
  }, []);

  const activeEditorRef = useRef<any>(null);

  const insertText = (text: string) => {
    if (activeEditorRef.current) {
      const selection = activeEditorRef.current.getSelection();
      const range = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn
      };
      activeEditorRef.current.executeEdits('', [{ range: range, text: text }]);
      activeEditorRef.current.focus();
    }
  };

  const handleSaveSelectedAsSnippet = useCallback(() => {
    if (activeEditorRef.current) {
      const selection = activeEditorRef.current.getSelection();
      const model = activeEditorRef.current.getModel();
      const selectedText = model.getValueInRange(selection);
      
      if (selectedText) {
        setShowSnippetEditor({
          id: '',
          name: '',
          code: selectedText,
          language: files[activeFile]?.language || 'javascript',
          createdAt: Date.now()
        });
      }
    }
  }, [files, activeFile]);

  // ==========================================
  // EXTENSION API SYNCHRONIZATION HOOKS & LOOPS
  // ==========================================
  useEffect(() => {
    // 1. Export state and references to the browser-side Extension API Manager
    syncReactState(activeEditorRef.current, {
      files,
      setFiles,
      activeFile,
      setActiveFile,
      openFiles,
      setOpenFiles,
      showNotification: (msg, type) => {
        console.log(`[Extension Notification: ${type}] ${msg}`);
      }
    });

    // Notify listeners of selection updates if possible
    if (activeEditorRef.current) {
      try {
        const selection = activeEditorRef.current.state?.selection?.main;
        if (selection) {
          triggerEvent('selection:changed', {
            anchor: selection.anchor,
            head: selection.head,
            text: activeEditorRef.current.state.doc.sliceString(selection.from, selection.to)
          });
        }
      } catch (e) {}
    }
  }, [files, activeFile, openFiles, setFiles, setActiveFile, setOpenFiles]);

  // Synchronize with the Backend Express Server
  useEffect(() => {
    let activeSelection = null;
    if (activeEditorRef.current) {
      try {
        const sel = activeEditorRef.current.state?.selection?.main;
        if (sel) {
          activeSelection = {
            anchor: sel.anchor,
            head: sel.head,
            from: sel.from,
            to: sel.to
          };
        }
      } catch (e) {}
    }

    // Post to `/api/editor/sync`
    fetch('/api/editor/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files,
        activeFile,
        selection: activeSelection
      })
    }).catch(err => {
      // Backend api didn't respond or offline inside frame preview, ignore
    });
  }, [files, activeFile]);

  // Poll for external commands/actions issued by Node.js, TS, JS scripts
  useEffect(() => {
    let isMounted = true;
    let pollInterval: any;

    const pollPendingActions = async () => {
      try {
        const response = await fetch('/api/editor/actions/pending');
        if (!response.ok) return;
        const actions = await response.json();
        if (!isMounted || !actions || actions.length === 0) return;

        // Process sequentially
        for (const action of actions) {
          try {
            let result: any = null;
            let errorMsg: string | null = null;

            if (action.type === 'writeFile') {
              if (action.path && action.code !== undefined) {
                setFiles(prev => ({
                  ...prev,
                  [action.path!]: { code: action.code!, language: action.language || 'javascript' }
                }));
                result = { success: true };
              } else {
                errorMsg = "Missing path or code in writeFile";
              }
            } else if (action.type === 'bulkWrite' || action.type === 'writeFiles') {
              if (action.files) {
                setFiles(prev => {
                  const copy = { ...prev };
                  Object.entries(action.files).forEach(([p, val]: [string, any]) => {
                    const finalLanguage = val.language || prev[p]?.language || 'javascript';
                    copy[p] = { code: val.code, language: finalLanguage };
                    triggerEvent('file:changed', { path: p, code: val.code, language: finalLanguage });
                  });
                  return copy;
                });
                result = { success: true };
              } else {
                errorMsg = "Missing files in bulkWrite";
              }
            } else if (action.type === 'deleteFile') {
              if (action.path) {
                setFiles(prev => {
                  const copy = { ...prev };
                  delete copy[action.path!];
                  return copy;
                });
                result = { success: true };
              } else {
                errorMsg = "Missing path in deleteFile";
              }
            } else if (action.type === 'bulkDelete' || action.type === 'deleteFiles') {
              if (action.paths && Array.isArray(action.paths)) {
                setFiles(prev => {
                  const copy = { ...prev };
                  action.paths.forEach((p: string) => {
                    if (copy[p]) {
                      delete copy[p];
                      triggerEvent('file:deleted', { path: p });
                    }
                  });
                  return copy;
                });
                result = { success: true };
              } else {
                errorMsg = "Missing paths array in bulkDelete";
              }
            } else if (action.type === 'batch') {
              if (action.operations && Array.isArray(action.operations)) {
                setFiles(prev => {
                  const copy = { ...prev };
                  action.operations.forEach((op: any) => {
                    if (op.type === 'write' && op.path && op.code !== undefined) {
                      const finalLanguage = op.language || prev[op.path]?.language || 'javascript';
                      copy[op.path] = { code: op.code, language: finalLanguage };
                      triggerEvent('file:changed', { path: op.path, code: op.code, language: finalLanguage });
                    } else if (op.type === 'delete' && op.path) {
                      if (copy[op.path]) {
                        delete copy[op.path];
                        triggerEvent('file:deleted', { path: op.path });
                      }
                    }
                  });
                  return copy;
                });
                result = { success: true };
              } else {
                errorMsg = "Missing operations array in batch";
              }
            } else if (action.type === 'readRange') {
              if (action.path) {
                const f = files[action.path];
                if (f) {
                  const code = f.code;
                  const opts = action.options || {};
                  if (opts.offset !== undefined) {
                    const offset = opts.offset;
                    const length = opts.length !== undefined ? opts.length : code.length - offset;
                    result = { text: code.substring(offset, offset + length) };
                  } else if (opts.startLine !== undefined) {
                    const lines = code.split('\n');
                    const start = Math.max(0, opts.startLine - 1);
                    const end = opts.endLine !== undefined ? Math.min(lines.length, opts.endLine) : start + 1;
                    result = { text: lines.slice(start, end).join('\n') };
                  } else {
                    result = { text: code };
                  }
                } else {
                  errorMsg = `File "${action.path}" not found`;
                }
              } else {
                errorMsg = "Missing path in readRange";
              }
            } else if (action.type === 'openFile') {
              if (action.path) {
                if (files[action.path]) {
                  setActiveFile(action.path);
                  if (!openFiles.includes(action.path)) {
                    setOpenFiles(prev => prev.includes(action.path!) ? prev : [...prev, action.path!]);
                  }
                  result = { success: true };
                } else {
                  errorMsg = `File "${action.path}" does not exist`;
                }
              } else {
                errorMsg = "Missing path in openFile";
              }
            } else if (action.type === 'setSelection') {
              if (activeEditorRef.current && action.anchor !== undefined) {
                activeEditorRef.current.dispatch({
                  selection: { anchor: action.anchor, head: action.head !== undefined ? action.head : action.anchor },
                  scrollIntoView: true
                });
                result = { success: true };
              } else {
                errorMsg = "Missing anchor or editor not ready";
              }
            } else if (action.type === 'insertText') {
              if (activeEditorRef.current && action.text !== undefined) {
                const view = activeEditorRef.current;
                const selection = view.state.selection.main;
                view.dispatch({
                  changes: { from: selection.from, to: selection.to, insert: action.text },
                  selection: { anchor: selection.from + action.text.length }
                });
                result = { success: true };
              } else {
                errorMsg = "Missing text or editor not ready";
              }
            } else if (action.type === 'executeCommand') {
              if (action.id_cmd) {
                result = await EditorAPI.commands.execute(action.id_cmd, ...(action.args || []));
              } else {
                errorMsg = "Missing id_cmd in executeCommand";
              }
            } else {
              errorMsg = `Unknown action type "${action.type}"`;
            }

            // Report resolution back to Express to resume Node.js blocked HTTP client
            await fetch('/api/editor/actions/resolve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                actionId: action.id,
                result,
                error: errorMsg
              })
            });

          } catch (itemErr: any) {
            console.error(`Error executing action ${action.id}:`, itemErr);
            fetch('/api/editor/actions/resolve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                actionId: action.id,
                error: itemErr.message || "Failed to execute"
              })
            }).catch(() => {});
          }
        }
      } catch (err) {
        // Silence potential network connection errors during standalone preview loads
      }
    };

    pollInterval = setInterval(pollPendingActions, 450);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [files, activeFile, openFiles, setFiles, setActiveFile, setOpenFiles]);

  
  const currentAppTheme = React.useMemo(() => APP_THEMES[appThemeName] || APP_THEMES['VS Code Dark'], [appThemeName]);
  const currentIconTheme = React.useMemo(() => {
    const theme = ICON_THEMES[iconThemeName] || ICON_THEMES['VS code'];
    return { ...ICON_THEMES['VS code'], ...theme };
  }, [iconThemeName]);

  const { 
    MessageSquare, Code, Settings, Files, Play, ChevronRight, ChevronLeft, ChevronDown, 
    Send, User, Terminal, Plus, Copy, Check, Trash2, Edit3, Undo2, Redo2, 
    ClipboardPaste, Save, RefreshCw, Maximize2, FolderOpen, ArrowUp, Wand2, 
    Sparkles, Hash, Bug, FileText, Loader2, Users, Paperclip, HelpCircle, ImageIcon, FileCode, 
    FileJson, File, ChevronDownIcon, ChevronRightIcon, MoreVertical, SearchCode, CheckCircle2,
    Bell, GitBranch, Key, Edit, Palette, Search
  } = currentIconTheme;
  
  const combinedHtml = React.useMemo(() => {
    const htmlFile = previewFiles['index.html'] || Object.values(previewFiles).find(f => f.language === 'html');
    if (!htmlFile) {
      const activeF = previewFiles[activeFile];
      if (!activeF) return '';
      let code = activeF.code;
      if (activeFile.endsWith('.ts') || activeFile.endsWith('.tsx')) {
        try {
          // Automatic Bare Import Resolution to CDN (esm.sh)
          const rewrittenCode = activeF.code.replace(
            /(from\s+['"]|import\s+['"])(?!\.|\/|https?:\/\/)([^'"]+)(['"])/g,
            `$1https://esm.sh/$2$3`
          );
          const transpiled = transform(rewrittenCode, { transforms: ['typescript', 'jsx'] }).code;
          code = `<!DOCTYPE html><html><head>
          <style>body { background: #0d0d0d; color: #e0e0e0; font-family: sans-serif; }</style>
          </head><body><script type="module">
          try {
            ${transpiled}
          } catch(e) {
            console.error('Runtime Error:', e);
            const errDiv = document.createElement('div');
            errDiv.style.color = '#f48771';
            errDiv.style.padding = '20px';
            errDiv.style.background = '#1e1e1e';
            errDiv.style.border = '1px solid #f48771';
            errDiv.style.borderRadius = '8px';
            errDiv.style.margin = '20px';
            errDiv.innerHTML = '<strong>Runtime Error:</strong><br>' + e.message;
            document.body.appendChild(errDiv);
          }
          </script></body></html>`;
        } catch (e: any) {
          return `<!DOCTYPE html><html><body><pre style="color:red;padding:20px;">Compilation Error: ${e.message}</pre></body></html>`;
        }
      }
      return code;
    }

    let combined = htmlFile.code;
    
    // Error Overlay Script
    const errorOverlayScript = `
    <script id="reversx-error-overlay">
      window.onerror = function(message, source, lineno, colno, error) {
        showError(message, source, lineno, colno, error);
        return false;
      };
      window.addEventListener('unhandledrejection', function(event) {
        showError(event.reason, 'Promise', '', '', event.reason);
      });
      function showError(msg, source, line, col, error) {
        const existing = document.getElementById('reversx-error-container');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.id = 'reversx-error-container';
        div.style.position = 'fixed';
        div.style.bottom = '20px';
        div.style.left = '20px';
        div.style.right = '20px';
        div.style.background = '#1e1e1e';
        div.style.color = '#f48771';
        div.style.padding = '20px';
        div.style.borderRadius = '8px';
        div.style.fontSize = '13px';
        div.style.fontFamily = "'Fira Code', 'JetBrains Mono', monospace";
        div.style.zIndex = '999999';
        div.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        div.style.border = '1px solid #f48771';
        div.style.maxHeight = '80vh';
        div.style.overflowY = 'auto';
        
        let stack = error && error.stack ? error.stack : '';
        let cleanSource = source ? source.split('/').pop() : 'unknown';

        div.innerHTML = \`
          <div style="display:flex; justify-content:between; align-items:start; margin-bottom:10px;">
            <div style="flex:1">
              <strong style="font-size:15px; color:#f44336;">Runtime Error Found</strong>
              <div style="margin-top:8px; color:#fff; font-weight:bold;">\${msg}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#fff; font-size:24px; cursor:pointer; padding:0 5px;">&times;</button>
          </div>
          <div style="background:#252526; padding:12px; border-radius:4px; margin-top:10px; border-left:3px solid #f48771;">
            <div style="color:#858585; margin-bottom:5px;">Location:</div>
            <div style="color:#61afef;">\${cleanSource}\${line ? ':' + line : ''}\${col ? ':' + col : ''}</div>
            \${stack ? \`<div style="color:#858585; margin-top:10px; margin-bottom:5px;">Stack Trace:</div><pre style="margin:0; white-space:pre-wrap; font-size:11px; color:#abb2bf; opacity:0.8;">\${stack}</pre>\` : ''}
          </div>
          <div style="margin-top:15px; font-size:11px; color:#858585;">
            Tip: Check the line number in your code editor to fix this issue.
          </div>
        \`;
        document.body.appendChild(div);
      }
    </script>`;

    // Get image files
    const imageFiles = Object.entries(previewFiles).filter(([name, f]) => 
      f.language === 'image' || name.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)
    );

    // Replace images in HTML
    imageFiles.forEach(([imgName, imgF]) => {
      combined = combined.split(`"${imgName}"`).join(`"${imgF.code}"`)
                         .split(`'${imgName}'`).join(`'${imgF.code}'`)
                         .split(`"./${imgName}"`).join(`"${imgF.code}"`)
                         .split(`'./${imgName}'`).join(`'${imgF.code}'`);
    });

    // Inject all CSS files
    const cssFiles = Object.entries(previewFiles).filter(([name, f]) => name.endsWith('.css'));
    let cssContent = '';
    cssFiles.forEach(([name, f]) => {
      let code = f.code;
      // Replace images in CSS
      imageFiles.forEach(([imgName, imgF]) => {
        code = code.split(`"${imgName}"`).join(`"${imgF.code}"`)
                   .split(`'${imgName}'`).join(`'${imgF.code}'`)
                   .split(` url(${imgName})`).join(` url(${imgF.code})`)
                   .split(` url("${imgName}")`).join(` url("${imgF.code}")`)
                   .split(` url('${imgName}')`).join(` url('${imgF.code}')`);
      });
      cssContent += `\n/* --- ${name} --- */\n${code}\n`;
    });

    if (cssContent) {
      const styleTag = `<style id="reversx-injected-styles">${cssContent}</style>`;
      if (combined.includes('</head>')) {
        combined = combined.replace('</head>', `${styleTag}</head>`);
      } else if (combined.includes('<head>')) {
        combined = combined.replace('<head>', `<head>${styleTag}`);
      } else {
        combined = `<head>${styleTag}</head>` + combined;
      }
    }

    // Inject Error Overlay
    if (combined.includes('</head>')) {
      combined = combined.replace('</head>', `${errorOverlayScript}</head>`);
    } else {
      combined = errorOverlayScript + combined;
    }

    // Inject all JS files
    const jsFiles = Object.entries(previewFiles).filter(([name, f]) => name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.tsx'));
    
    // Generate Import Map for ES Modules
    const importMap: Record<string, string> = {};
    jsFiles.forEach(([name, f]) => {
      let code = f.code;
      if (name.endsWith('.ts') || name.endsWith('.tsx')) {
        try {
          // Bare import resolution for CDN
          const rewrittenCode = f.code.replace(
            /(from\s+['"]|import\s+['"])(?!\.|\/|https?:\/\/)([^'"]+)(['"])/g,
            `$1https://esm.sh/$2$3`
          );
          code = transform(rewrittenCode, { transforms: ['typescript', 'jsx'] }).code;
        } catch (e: any) {
          code = `console.error('Compilation Error in ${name}:', ${JSON.stringify(e.message)});`;
        }
      } else {
        // Even for JS, resolve bare imports
        code = f.code.replace(
          /(from\s+['"]|import\s+['"])(?!\.|\/|https?:\/\/)([^'"]+)(['"])/g,
          `$1https://esm.sh/$2$3`
        );
      }
      
      const blob = new Blob([code], { type: 'text/javascript' });
      importMap[`./${name}`] = URL.createObjectURL(blob);
      importMap[name] = importMap[`./${name}`];
    });

    const importMapScript = `<script type="importmap">${JSON.stringify({ imports: importMap })}</script>`;
    
    if (combined.includes('</head>')) {
      combined = combined.replace('</head>', `${importMapScript}</head>`);
    } else {
      combined = importMapScript + combined;
    }

    // Find entry point or inject scripts
    let jsContent = '';
    jsFiles.forEach(([name, f]) => {
      // We only auto-inject scripts if they are NOT modules intended to be imported
      // or if they are traditionally used entry points
      if (name === 'index.js' || name === 'main.js' || name === 'script.js' || name === 'App.tsx' || name === 'main.tsx') {
        jsContent += `\nimport './${name}';\n`;
      }
    });

    if (jsContent) {
      const scriptTag = `<script type="module" id="reversx-injected-scripts">${jsContent}</script>`;
      if (combined.includes('</body>')) {
        combined = combined.replace('</body>', `${scriptTag}</body>`);
      } else if (combined.includes('</html>')) {
        combined = combined.replace('</html>', `${scriptTag}</html>`);
      } else {
        combined = combined + scriptTag;
      }
    }

    return combined;
  }, [previewFiles, activeFile]);

  const isMarkdownFile = React.useMemo(() => {
    if (!activeFile) return false;
    const lower = activeFile.toLowerCase();
    return lower.endsWith('.md') || lower.endsWith('.markdown') || (files[activeFile]?.language === 'markdown');
  }, [activeFile, files]);

  const activeProject = React.useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);

  // Static placeholder
  const placeholderText = "Ask ReversX";

  // Optimized Sidebar Resizing with CSS Variables
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const [explorerWidth, setExplorerWidth] = useState(260);
  const [isResizingExplorer, setIsResizingExplorer] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // ReversX v1 Agent States
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [showAgentQuestions, setShowAgentQuestions] = useState(false);
  const [agentQuestions, setAgentQuestions] = useState<{question: string, options: string[]}[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentAgentPrompt, setCurrentAgentPrompt] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // If within 100px of the bottom, consider it scrolled to bottom
      shouldAutoScroll.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (chatEndRef.current && (force || shouldAutoScroll.current)) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const isSyncingRef = useRef(true);

  useEffect(() => {
    if (activeProjectId && !isSyncingRef.current && !isLoading) {
      const timeoutId = setTimeout(() => {
        setProjects(prev => {
          const projectIndex = prev.findIndex(p => p.id === activeProjectId);
          if (projectIndex === -1) return prev;
          
          const project = prev[projectIndex];
          // Only update if something actually changed to avoid infinite loops
          if (
            project.messages === messages && 
            project.files === files && 
            project.openFiles === openFiles && 
            project.activeFile === activeFile
          ) {
            return prev;
          }

          const updatedProjects = [...prev];
          updatedProjects[projectIndex] = {
            ...project,
            messages,
            files,
            openFiles,
            activeFile
          };
          return updatedProjects;
        });
      }, 5000); // 5s debounce for project sync from files
      return () => clearTimeout(timeoutId);
    }
  }, [messages, files, openFiles, activeFile, activeProjectId, isLoading]);

  useEffect(() => {
    // Reset syncing flag after states have likely updated
    if (isSyncingRef.current) {
      isSyncingRef.current = false;
    }
  }, [messages, files, activeFile, activeProjectId]);

  useEffect(() => {
    db.setItem('reversx_editor_font_size', editorFontSize);
  }, [editorFontSize]);

  useEffect(() => {
    db.setItem('reversx_editor_line_height', editorLineHeight);
  }, [editorLineHeight]);

  useEffect(() => {
    db.setItem('reversx_editor_font_family', editorFontFamily);
  }, [editorFontFamily]);

  useEffect(() => {
    db.setItem('reversx_open_files', openFiles);
  }, [openFiles]);

  useEffect(() => {
    db.setItem('reversx_split_screen', isSplitScreen);
  }, [isSplitScreen]);

  const handleSplit = useCallback(() => {
    if (editorPanes.length < 4) {
      const currentFile = editorPanes[focusedPaneIndex] || 'index.html';
      setEditorPanes(prev => [...prev, currentFile]);
      setFocusedPaneIndex(editorPanes.length);
    }
  }, [editorPanes, focusedPaneIndex]);

  const handleClosePane = useCallback((index: number) => {
    if (editorPanes.length > 1) {
      setEditorPanes(prev => {
        const next = [...prev];
        next.splice(index, 1);
        return next;
      });
      setFocusedPaneIndex(prev => Math.max(0, prev >= index ? prev - 1 : prev));
    }
  }, [editorPanes]);

  const setPaneFile = useCallback((index: number, fileName: string) => {
    setEditorPanes(prev => {
      const next = [...prev];
      next[index] = fileName;
      return next;
    });
    setFocusedPaneIndex(index);
    setActiveFile(fileName);
  }, []);

  const handleFileOpen = useCallback((name: string) => {
    setOpenFiles(prev => {
      if (prev.includes(name)) return prev;
      return [...prev, name];
    });
    setPaneFile(focusedPaneIndex, name);
  }, [focusedPaneIndex, setPaneFile]);

  const handleFileClose = useCallback((name: string) => {
    setOpenFiles(prev => {
      if (prev.length <= 1 && prev[0] === name) return prev;
      const next = prev.filter(f => f !== name);
      
      // Update panes if closing a file that is active in some pane
      setEditorPanes(pPanes => pPanes.map(p => p === name ? (next[next.length - 1] || 'index.html') : p));
      
      if (activeFile === name) {
        setActiveFile(next[next.length - 1] || 'index.html');
      }
      return next;
    });
  }, [activeFile]);

  const handleToggleBookmark = useCallback((filename: string, lineNumber: number, lineContent: string) => {
    if (!activeProjectId) return;
    setBookmarks(prev => {
      const existingIndex = prev.findIndex(
        b => b.projectId === activeProjectId && b.filename === filename && b.lineNumber === lineNumber
      );
      if (existingIndex >= 0) {
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        const newBookmark: Bookmark = {
          id: Math.random().toString(36).substring(2, 9),
          projectId: activeProjectId,
          filename,
          lineNumber,
          lineContent: lineContent.trim() || `Line ${lineNumber}`,
          createdAt: Date.now()
        };
        return [...prev, newBookmark];
      }
    });
  }, [activeProjectId]);

  const handleGoToBookmark = useCallback((filename: string, lineNumber: number) => {
    handleFileOpen(filename);
    setTimeout(() => {
      const event = new CustomEvent('jump-to-line', { detail: { filename, lineNumber } });
      window.dispatchEvent(event);
    }, 150);
  }, [handleFileOpen]);

  const handleClearAllBookmarks = useCallback(() => {
    if (!activeProjectId) return;
    setBookmarks(prev => prev.filter(b => b.projectId !== activeProjectId));
  }, [activeProjectId]);
  useEffect(() => {
    if (projects.length > 0) {
      const timeoutId = setTimeout(() => {
        db.setItem('reversx_projects', projects);
      }, 10000); // 10s debounce for IndexedDB save
      return () => clearTimeout(timeoutId);
    }
  }, [projects]);

  useEffect(() => {
    const loadData = async () => {
      // ... existing loads ...
      const savedFontSize = await db.getItem('reversx_editor_font_size');
      if (savedFontSize) setEditorFontSize(Number(savedFontSize));

      const savedFontFamily = await db.getItem('reversx_editor_font_family');
      if (savedFontFamily) setEditorFontFamily(savedFontFamily);

      const savedOpenFiles = await db.getItem('reversx_open_files');
      if (savedOpenFiles) setOpenFiles(savedOpenFiles);

      const savedSplit = await db.getItem('reversx_split_screen');
      if (savedSplit !== null) setIsSplitScreen(!!savedSplit);
      const savedName = await db.getItem('reversx_user');
      if (savedName) {
        setUserName(savedName);
        setShowNamePrompt(false);
        // Update initial files with the correct name if no projects exist yet
        // Left empty intentionally to show Welcome Screen
        // setFiles(...)
        // setPreviewFiles(...)
      }

      const savedEditorTheme = await db.getItem('reversx_editor_theme');
      // theme is fixed to VS Code Dark
      const savedAppTheme = await db.getItem('reversx_app_theme');
      if (savedAppTheme) setAppThemeName(savedAppTheme);

      const savedIconTheme = await db.getItem('reversx_icon_theme');
      if (savedIconTheme) setIconThemeName(savedIconTheme);

      const savedIconSize = await db.getItem('reversx_file_icon_size');
      if (savedIconSize) setFileIconSize(parseInt(savedIconSize as string, 10));

      const savedTab = await db.getItem('reversx_active_tab');
      if (savedTab) {
        setActiveTab(savedTab as any);
      }

      const savedMobileView = await db.getItem('reversx_mobile_view');
      if (savedMobileView) {
        setMobileView(savedMobileView as any);
      }

      const savedProjects = await db.getItem('reversx_projects');
      if (savedProjects && savedProjects.length > 0) {
        isSyncingRef.current = true;
        setProjects(savedProjects);
        const last = savedProjects[0];
        setActiveProjectId(last.id);
        
        // Force update greeting if it's an unmodified New Project
        let projectFiles = last.files;
        let lastActiveFile = last.activeFile;
        let lastOpenFiles = last.openFiles || [];
        
        if (last.name === 'New Project' || last.name === 'My First Project') {
          const indexHtml = projectFiles['index.html']?.code || '';
          if (indexHtml.includes('ReversX AI') || indexHtml.includes('glitch') || indexHtml.includes('New Project Started')) {
            projectFiles = {}; // Clear it so the import screen shows up!
            lastActiveFile = '';
            lastOpenFiles = [];
          }
        }

        // Filter out old welcome messages to show new branding
        const filteredMessages = last.messages.filter((m: any) => m.content !== "What do you want to build?");
        setMessages(filteredMessages);
        setFiles(projectFiles);
        setPreviewFiles(projectFiles);
        if (lastOpenFiles && lastOpenFiles.length > 0 && Object.keys(projectFiles).length > 0) {
          setOpenFiles(lastOpenFiles.filter((f: string) => projectFiles[f]));
        } else {
          setOpenFiles(Object.keys(projectFiles));
        }
        
        if (lastActiveFile && projectFiles[lastActiveFile]) {
          setActiveFile(lastActiveFile);
          setEditorPanes([lastActiveFile]);
        } else if (Object.keys(projectFiles).length > 0) {
          const newActive = Object.keys(projectFiles)[0];
          setActiveFile(newActive);
          setEditorPanes([newActive]);
        } else {
          setActiveFile('');
          setEditorPanes([]);
        }
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    db.setItem('reversx_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    db.setItem('reversx_mobile_view', mobileView);
  }, [mobileView]);

  useEffect(() => {
    if (userName) {
      db.setItem('reversx_user', userName);
    }
  }, [userName]);

  useEffect(() => {
    db.setItem('reversx_editor_theme', editorThemeName);
  }, [editorThemeName]);

  useEffect(() => {
    db.setItem('reversx_app_theme', appThemeName);
    
    // Apply app theme variables
    const theme = APP_THEMES[appThemeName] || APP_THEMES['VS Code Dark'];
    const root = document.documentElement;
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-foreground', theme.foreground);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-foreground', theme.accentForeground || '#ffffff');
    root.style.setProperty('--color-sidebar', theme.sidebar);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--color-muted', theme.muted);
    root.style.setProperty('--color-subtle', theme.subtle);
    root.style.setProperty('--color-foreground-muted', theme.muted);
    root.style.setProperty('--color-foreground-subtle', theme.subtle);
    
    // Also update accent dim
    const accentDim = theme.accent.startsWith('#') ? `${theme.accent}33` : 'rgba(255, 255, 255, 0.1)';
    root.style.setProperty('--color-accent-dim', accentDim);
  }, [appThemeName]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--editor-line-height', editorLineHeight.toString());
  }, [editorLineHeight]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--editor-font-size', `${editorFontSize}px`);
  }, [editorFontSize]);

  useEffect(() => {
    db.setItem('reversx_icon_theme', iconThemeName);
  }, [iconThemeName]);

  useEffect(() => {
    db.setItem('reversx_file_icon_size', fileIconSize.toString());
  }, [fileIconSize]);


  const resize = useCallback((e: MouseEvent | TouchEvent) => {
    if (isResizing) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const newWidth = clientX - 56;
      const minWidth = 200;
      const maxWidth = windowWidth * 0.8;
      
      if (newWidth > minWidth && newWidth < maxWidth) {
        setSidebarWidth(newWidth);
        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
      }
    }
  }, [isResizing]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  }, []);

  const startResizing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Check if it's a touch event and prevent default only if needed
    if (e.type === 'touchstart') {
      // Don't prevent default to allow scrolling if user is not on handle
    } else {
      e.preventDefault();
    }
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  const resizeExplorer = useCallback((e: MouseEvent | TouchEvent) => {
    if (isResizingExplorer) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      // clientX - total offset from left (activity bar + sidebar)
      const offset = 56 + (isSidebarMinimized ? 0 : sidebarWidth);
      const newWidth = clientX - offset;
      const minWidth = 150;
      const maxWidth = 500;
      
      if (newWidth > minWidth && newWidth < maxWidth) {
        setExplorerWidth(newWidth);
      }
    }
  }, [isResizingExplorer, isSidebarMinimized, sidebarWidth]);

  const resizeEditorSplit = useCallback((e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const container = document.getElementById('main-editor-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const ratio = (relativeX / rect.width) * 100;
      setEditorSplitRatio(Math.max(10, Math.min(90, ratio)));
    }
  }, []);

  const stopResizingEditorSplit = useCallback(() => {
    setIsResizingEditorSplit(false);
    document.body.style.cursor = 'default';
  }, []);

  const startResizingEditorSplit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type !== 'touchstart') {
      e.preventDefault();
    }
    setIsResizingEditorSplit(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  const stopResizingExplorer = useCallback(() => {
    setIsResizingExplorer(false);
    document.body.style.cursor = 'default';
  }, []);

  const startResizingExplorer = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type !== 'touchstart') {
      e.preventDefault();
    }
    setIsResizingExplorer(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (isResizing) resize(e);
      if (isResizingExplorer) resizeExplorer(e);
      if (isResizingEditorSplit) resizeEditorSplit(e);
    };

    const handleWindowEnd = () => {
      if (isResizing) stopResizing();
      if (isResizingExplorer) stopResizingExplorer();
      if (isResizingEditorSplit) stopResizingEditorSplit();
    };

    if (isResizing || isResizingExplorer || isResizingEditorSplit) {
      window.addEventListener('mousemove', handleWindowMove);
      window.addEventListener('mouseup', handleWindowEnd);
      window.addEventListener('touchmove', handleWindowMove, { passive: false });
      window.addEventListener('touchend', handleWindowEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowEnd);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('touchend', handleWindowEnd);
    };
  }, [isResizing, isResizingExplorer, isResizingEditorSplit, resize, resizeExplorer, resizeEditorSplit, stopResizing, stopResizingExplorer, stopResizingEditorSplit]);

  const handleNameSubmit = useCallback(() => {
    if (!tempName.trim()) return;
    const name = tempName.trim();
    setUserName(name);
    setShowNamePrompt(false);
    
    if (projects.length === 0) {
      isSyncingRef.current = true;
      const initialCode = getInitialCode(name);
      const newProject: Project = {
        id: generateId(),
        name: 'My First Project',
        messages: [],
        files: {},
        activeFile: '',
        openFiles: [],
        createdAt: Date.now()
      };
      
      setProjects([newProject]);
      setActiveProjectId(newProject.id);
      setMessages([]);
      setFiles({});
      setPreviewFiles({});
      setOpenFiles([]);
      setActiveFile('');
      setEditorPanes([]);
    }
  }, [tempName, projects.length]);

  const createNewProject = useCallback(() => {
    isSyncingRef.current = true;
    const initialCode = getInitialCode(userName || 'User');
    const newProject: Project = {
      id: generateId(),
      name: `Project ${projects.length + 1}`,
      messages: [],
      files: {},
      activeFile: '',
      openFiles: [],
      createdAt: Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setMessages([]);
    setFiles({});
    setPreviewFiles({});
    setOpenFiles([]);
    setActiveFile('');
    setEditorPanes([]);
    setActiveTab('projects');
  }, [userName, projects.length]);

  const switchProject = useCallback((id: string) => {
    if (id === activeProjectId) {
      // Don't reset tab if already active
      return;
    }

    const targetProject = projects.find(p => p.id === id);
    if (targetProject) {
      isSyncingRef.current = true;
      setActiveProjectId(id);
      // Filter out old welcome messages to show new branding
      const filteredMessages = targetProject.messages.filter(m => m.content !== "What do you want to build?");
      setMessages(filteredMessages);
      setFiles(targetProject.files);
      setPreviewFiles(targetProject.files);
      if (targetProject.openFiles && targetProject.openFiles.length > 0) {
        setOpenFiles(targetProject.openFiles);
      } else {
        setOpenFiles(Object.keys(targetProject.files));
      }
      setActiveFile(targetProject.activeFile);
      if (targetProject.activeFile) {
        setEditorPanes([targetProject.activeFile]);
      } else if (Object.keys(targetProject.files).length > 0) {
        setEditorPanes([Object.keys(targetProject.files)[0]]);
      }
      setActiveTab('projects');
      setMobileView('chat');
    }
  }, [activeProjectId, projects]);

  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const deleteProject = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (projects.length <= 1) return;
    
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    
    if (activeProjectId === id) {
      isSyncingRef.current = true;
      const next = newProjects[0];
      setActiveProjectId(next.id);
      setMessages(next.messages);
      setFiles(next.files);
      setPreviewFiles(next.files);
      setOpenFiles([next.activeFile]);
      setActiveFile(next.activeFile);
      setEditorPanes([next.activeFile]);
      setActiveTab('projects');
      setMobileView('chat');
    }
    setProjectToDeleteId(null);
    setDeleteConfirmName('');
  }, [projects, activeProjectId]);

  const startRenaming = useCallback((e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditNameValue(project.name);
  }, []);

  const saveRename = useCallback((e: React.FormEvent | React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!editNameValue.trim()) return;
    
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: editNameValue.trim() } : p));
    setEditingProjectId(null);
  }, [editNameValue]);

  const handleHoldStart = useCallback((id: string) => {
    holdTimer.current = setTimeout(() => {
      setActiveActionsId(id);
    }, 600); // 600ms hold time
  }, []);

  const handleHoldEnd = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const handleStop = useCallback(() => {
    stopRef.current = true;
    setIsLoading(false);
  }, []);

  const processMessage = async (userMessage: string, attachments: Attachment[] = []) => {
    setIsLoading(true);
    stopRef.current = false;
    shouldAutoScroll.current = true;
    appliedBlocks.current.clear();
    setTimeout(() => scrollToBottom(true), 100);

    try {
      const maxFileContextChars = 15000;
      let totalChars = 0;
      const currentFilesContext = Object.entries(files)
        .map(([name, file]) => {
          if (totalChars > maxFileContextChars) return null;
          const content = file.code.length > 3000 ? file.code.substring(0, 3000) + "\n... [file truncated]" : file.code;
          const chunk = `File: ${name}\n\`\`\`${file.language}\n${content}\n\`\`\``;
          totalChars += chunk.length;
          return chunk;
        })
        .filter(Boolean)
        .join('\n\n');

      const attachmentContext = attachments
        .map(att => {
          const isImage = att.type.startsWith('image/');
          if (isImage) {
            return `[Attached Image: ${att.name}]`;
          } else {
            const contentPreview = att.content.length < 5000 ? att.content : att.content.substring(0, 5000) + '... [truncated]';
            return `[Attached File: ${att.name}]\nContent:\n${contentPreview}`;
          }
        })
        .join('\n\n');

      const agentSystemPrompt = isAgentActive 
        ? `You are the ReversX v1 Agent, an advanced AI integrated into the ReversX v1 IDE. You are extremely serious, professional, and precise. 
           Your goal is to build high-quality, production-ready web applications and assist the user in navigating this IDE.

           ### COMPREHENSIVE IDE GUIDE:
           1. **Activity Bar (Leftmost)**:
              - *Projects*: Create, rename, delete, and switch between different coding projects.
              - *Chat*: Your primary communication channel with me.
              - *Friends*: Connect with other developers.
              - *Settings*: Customize the App Theme (Dark/Light/etc.), Icon Themes, and Syntax Highlighting.
           2. **Sidebar (Left)**: Shows the content of the tab selected in the Activity Bar. It can be minimized using the chevron button or resized by dragging the vertical handle.
           3. **Code Editor (Center)**:
              - *Tabbed Interface*: Open multiple files simultaneously.
              - *File Explorer Button*: Click the "FILE EXPLORER" text button at the top left of the editor to toggle the file tree.
              - *File Tree*: Right-click or use the '...' menu on files to Rename or Delete. Use the '+' icon at the top of the explorer to create new files.
           4. **Preview Area (Right/Toggle)**: Displays the live output of your code.
           5. **Top Navigation Bar**:
              - *Code/Preview*: Toggle between the editor and the live preview.
              - *Full*: Opens the current project in a new browser tab for a full-screen experience.
              - *Refresh*: Forces the preview to reload.
              - *Settings/Terminal*: Quick shortcuts to the settings panel or a terminal-style view.
           6. **File Attachments**:
              - Users can upload files or images using the '+' button in the chat input.
              - Clicking an attached file opens a modal where the user can edit the content, save changes, or specifically "Send to AI" for focused analysis.
           7. **Responsive Design**: On mobile, the IDE uses a single-view layout. Users can switch between Chat, Editor, and Preview using the navigation.

           Focus on clean code, modern design, and robust functionality. No duplicates. If user speaks in Bengali, respond in natural, elegant Bengali.`
        : '';

      const currentFilesSummary = Object.keys(files).join(', ');
      const prompt = `${agentSystemPrompt}
      
      ### PROJECT STATUS
      Existing Files: [ ${currentFilesSummary} ]
      
      ### MANDATORY PROTOCOL
      - For existing files: \`PATCH: filename.ext\` with SEARCH/REPLACE blocks.
      - For new files: \`### path/to/file.ext\`.
      - To delete: \`[DELETE: file.ext]\`.
      - To rename: \`[RENAME: old.ext -> new.ext]\`.
      
      Current project files context:
      ${currentFilesContext}
      
      ${attachmentContext ? `Attachments:\n${attachmentContext}\n\n` : ''}User request: ${userMessage}`;

      const history = messages
        .filter(m => !m.content.startsWith('Welcome_msg:'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));
      
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', content: '' }]);
      
      const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra } = getPlatformConfig();
      const stream = await chatWithAIStream(prompt, history, currentApiKey, currentModel, currentPlatform, attachments, extra);
      let fullResponse = '';
      
      const langMap: Record<string, string> = {
        'js': 'javascript', 'javascript': 'javascript', 'ts': 'typescript', 'typescript': 'typescript',
        'py': 'python', 'python': 'python', 'py3': 'python', 'html': 'html', 'css': 'css',
        'cpp': 'cpp', 'c++': 'cpp', 'c': 'c', 'java': 'java', 'php': 'php', 'sql': 'sql',
        'sh': 'bash', 'bash': 'bash', 'json': 'json', 'md': 'markdown', 'markdown': 'markdown',
        'rust': 'rust', 'rs': 'rust', 'go': 'go', 'golang': 'go'
      };

      const fileMap: Record<string, string> = {
        'html': 'index.html', 'javascript': 'script.js', 'typescript': 'index.ts',
        'python': 'main.py', 'css': 'style.css', 'cpp': 'main.cpp', 'c': 'main.c',
        'java': 'Main.java', 'php': 'index.php', 'sql': 'query.sql', 'bash': 'script.sh',
        'json': 'data.json', 'markdown': 'README.md', 'rust': 'main.rs', 'go': 'main.go'
      };

      let lastUpdateTime = Date.now();
      const updateInterval = 80; // Ultra-fast streaming for that "gRPC" feel

      const applyPatch = (originalCode: string, patchInstructions: string) => {
        const normalizeLineEndings = (s: string) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        let patchedCode = normalizeLineEndings(originalCode);
        const patchInstructionsNorm = normalizeLineEndings(patchInstructions);
        
        const patchRegex = /<<<<(?:[ \t]*SEARCH)?[ \t]*\n([\s\S]*?)\n[=]{4,}[ \t]*\n([\s\S]*?)>>>>/g;
        let match;
        let appliedAny = false;

        while ((match = patchRegex.exec(patchInstructionsNorm)) !== null) {
          const searchStr = match[1];
          const replaceStr = match[2];
          
          const findMatch = (content: string, search: string) => {
            const index = content.indexOf(search);
            if (index !== -1) return { index, length: search.length };
            
            const norm = (s: string) => s.trim().replace(/[ \t]+/g, ' ');
            const contentLines = content.split('\n');
            const searchLines = search.split('\n');
            
            if (searchLines.length === 0) return null;

            for (let i = 0; i <= contentLines.length - searchLines.length; i++) {
              let allLinesMatch = true;
              for (let j = 0; j < searchLines.length; j++) {
                if (norm(contentLines[i + j]) !== norm(searchLines[j])) {
                  allLinesMatch = false;
                  break;
                }
              }
              if (allLinesMatch) {
                const startIdx = contentLines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
                const endIdx = contentLines.slice(0, i + searchLines.length).join('\n').length;
                return { index: startIdx, length: endIdx - startIdx };
              }
            }
            return null;
          };

          const matchInfo = findMatch(patchedCode, searchStr);
          if (matchInfo) {
            patchedCode = patchedCode.substring(0, matchInfo.index) + replaceStr + patchedCode.substring(matchInfo.index + matchInfo.length);
            appliedAny = true;
          }
        }
        return appliedAny ? patchedCode : originalCode;
      };

      const extractAndApplyFiles = (text: string, isFinal: boolean = false) => {
        const updates: { name: string, code: string, language: string, isPatch: boolean, index: number }[] = [];
        const segments = text.split(/```/);
        
        for (let i = 1; i < segments.length; i += 2) {
          const block = segments[i];
          const prevText = segments[i-1] || '';
          const isClosed = segments[i+1] !== undefined;
          
          if (appliedBlocks.current.has(i)) continue;

          const firstLine = block.split('\n')[0] || '';
          const langMatch = firstLine.match(/^([\w+]+)(?::([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9]+))?/);
          const detectedLang = langMatch ? langMatch[1].toLowerCase() : 'text';
          const inlineName = langMatch ? langMatch[2] : null;
          const code = block.replace(/^.*?\n/, '');
          const finalLang = langMap[detectedLang] || detectedLang;
          
          const nameRegex = /(?:^|\n|\r|[:.!?])\s*(?:###|PATCH:|FILE:?|FILENAME:?|PATH:?|TARGET:?|UPDATE(?: FOR)?|MODIFIED?:?|CODE FOR|CURRENT FILE:?|CREATE:?|NEW FILE:?|WRITE:?|ADD:?|UPDATING:?)\s*(?:\[|'|")?([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9]+)(?:\]|'|")?/i;
          const nameMatch = prevText.match(nameRegex);
          const isPatch = prevText.toLowerCase().includes('patch:') || code.includes('<<<< SEARCH');
          
          let name = inlineName || (nameMatch ? nameMatch[1].trim() : null);
          if (!name) {
            const fallbackMatch = prevText.slice(-150).match(/(?:^|\s)([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9]+)(?:\s|$|[:.!?])/);
            if (fallbackMatch) name = fallbackMatch[1].trim();
          }

          if (name) {
            name = name.replace(/^\.?\/+/, ''); 
            if (isPatch) {
              if (isClosed || isFinal) {
                updates.push({ name, code, language: finalLang, isPatch: true, index: i });
                appliedBlocks.current.add(i);
              }
            } else {
              // Smooth streaming for new files or full rewrites
              if (isFinal || block.endsWith('\n') || code.length > 200) {
                 updates.push({ name, code, language: finalLang, isPatch: false, index: i });
                 if (isClosed) appliedBlocks.current.add(i);
              }
            }
          }
        }

        if (updates.length > 0) {
          setFiles(prev => {
            const next = { ...prev };
            let hasChanged = false;
            let targetFile = "";

            for (const update of updates) {
              const { name, code, language, isPatch } = update;
              targetFile = name;
              if (isPatch) {
                if (next[name]) {
                  const newCode = applyPatch(next[name].code, code);
                  if (newCode !== next[name].code) {
                    next[name] = { ...next[name], code: newCode };
                    hasChanged = true;
                  }
                }
              } else {
                if (!next[name] || next[name].code !== code) {
                  next[name] = { code, language };
                  hasChanged = true;
                }
              }
            }

            if (hasChanged) {
              setPreviewFiles({ ...next });
              if (targetFile) setActiveFile(targetFile);
            }
            return next;
          });

          // Ensure files are in the open tabs
          setOpenFiles(prev => {
             const names = updates.map(u => u.name);
             const newNames = names.filter(n => !prev.includes(n));
             return newNames.length > 0 ? [...prev, ...newNames] : prev;
          });
        }
      };

      for await (const chunk of stream) {
        if (stopRef.current) break;
        const content = typeof chunk === 'string' ? chunk : (chunk as any).content || '';
        fullResponse += content;

        // Enhanced Masking Logic: Cursor/Windsurf Style (Clean Chat, Direct Code Editor)
        let cleanContent = fullResponse;
        
        // 1. Force remove all code blocks (even incomplete ones) from chat text
        cleanContent = cleanContent.replace(/```[\s\S]*?(?:```|$)/g, (match) => {
           if (match.endsWith('```')) return '\n\n*(Code and logic applied to the editor)*\n\n';
           return '\n\n*(AI is actively coding in the editor...)*\n\n';
        });
        
        // 2. Aggressively strip file-path markers and structural instructions
        const masks = [
          /\[DELETE:.*?\]/gi,
          /\[RENAME:.*?\]/gi,
          /(?:^|\n)(?:###|PATCH:|FILE:|FILENAME:|PATH:|TARGET:|CREATE:|UPDATE:)\s*[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+[^\n]*/gi,
          /PATCH:\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi,
          /###\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi
        ];

        masks.forEach(m => {
          cleanContent = cleanContent.replace(m, '');
        });

        // 3. Final cleanup to prevent flickering or empty messages
        const finalOutput = cleanContent.trim();

        setMessages(prev => {
          const next = [...prev];
          const lastMsg = next[next.length - 1];
          if (lastMsg && lastMsg.role === 'model') {
            lastMsg.content = finalOutput || "I'm updating your project structure and code directly in the editor...";
          }
          return next;
        });

        const now = Date.now();
        if (now - lastUpdateTime > updateInterval) {
          extractAndApplyFiles(fullResponse, false);
          lastUpdateTime = now;
          scrollToBottom(true);
        }
      }

      // Final processing
      extractAndApplyFiles(fullResponse, true);
      
      const deletionMatches = Array.from(fullResponse.matchAll(/\[DELETE:\s*([a-zA-Z0-9_.\-/]+)\]/gi));
      if (deletionMatches.length > 0) {
        setFiles(prev => {
          const next = { ...prev };
          deletionMatches.forEach(m => delete next[m[1].trim().replace(/^\.?\/+/, '')]);
          setPreviewFiles(next);
          return next;
        });
      }

      const renameMatches = Array.from(fullResponse.matchAll(/\[RENAME:\s*([a-zA-Z0-9_.\-/]+)\s*->\s*([a-zA-Z0-9_.\-/]+)\]/gi));
      if (renameMatches.length > 0) {
        setFiles(prev => {
          const next = { ...prev };
          renameMatches.forEach(m => {
            const oldN = m[1].trim().replace(/^\.?\/+/, '');
            const newN = m[2].trim().replace(/^\.?\/+/, '');
            if (next[oldN]) {
              next[newN] = next[oldN];
              delete next[oldN];
            }
          });
          setPreviewFiles(next);
          return next;
        });
      }

      let chatFinal = fullResponse;
      // Aggressively remove all code blocks
      chatFinal = chatFinal.replace(/```[\s\S]*?(?:```|$)/g, '');
      
      const cleaningMasks = [
        /\[DELETE:.*?\]/gi,
        /\[RENAME:.*?\]/gi,
        /(?:^|\n)(?:###|PATCH:|FILE:|FILENAME:|PATH:|TARGET:|CREATE:|UPDATE:)\s*[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+[^\n]*/gi,
        /PATCH:\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi,
        /###\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi
      ];

      cleaningMasks.forEach(m => {
        chatFinal = chatFinal.replace(m, '');
      });

      const finalText = chatFinal.trim();
      
      setMessages(prev => {
        const next = [...prev];
        const lastMsg = next[next.length - 1];
        if (lastMsg && lastMsg.role === 'model') {
          lastMsg.content = finalText || "Architecture updated. The code changes have been applied to the editor.";
        }
        return next;
      });

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        const errorMessage = error.message || "Something went wrong.";
        if (last && last.role === 'model' && last.content === '') {
          return [...prev.slice(0, -1), { id: crypto.randomUUID(), role: 'model', content: `Error: ${errorMessage}` }];
        }
        return [...prev, { id: crypto.randomUUID(), role: 'model', content: `Error: ${errorMessage}` }];
      });
    } finally {
      setIsLoading(false);
      // Play a subtle sound when done
      if (!stopRef.current) {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3').play().catch(() => {});
      }
    }
  };

  const handleOpenInNewTab = useCallback(() => {
    const blob = new Blob([combinedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }, [combinedHtml]);

  const handleTerminalCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setTerminalHistory(prev => [...prev, { type: 'cmd', text: trimmed }]);
    setTerminalInput('');

    const args = trimmed.split(' ');
    const baseCmd = args[0].toLowerCase();

    if (baseCmd === 'help') {
      setTerminalHistory(prev => [...prev, { type: 'output', text: 'Available commands: help, clear, ls, npm install <pkg>, npm uninstall <pkg>' }]);
      setShowShortcutsCheatSheet(true);
    } else if (baseCmd === 'clear') {
      setTerminalHistory([]);
    } else if (baseCmd === 'ls') {
      const fileList = Object.keys(files).join('  ');
      setTerminalHistory(prev => [...prev, { type: 'output', text: fileList || 'No files found.' }]);
    } else if (baseCmd === 'npm' && args[1] === 'install') {
      const pkg = args[2];
      if (!pkg) {
        setTerminalHistory(prev => [...prev, { type: 'error', text: 'Error: Please specify a package name. Example: npm install lodash' }]);
        return;
      }

      setTerminalHistory(prev => [...prev, { type: 'output', text: `Installing ${pkg}...` }]);
      
      setTimeout(() => {
        let pkgJson = files['package.json'] ? JSON.parse(files['package.json'].code) : { dependencies: {} };
        if (!pkgJson.dependencies) pkgJson.dependencies = {};
        pkgJson.dependencies[pkg] = "latest";

        setFiles(prev => ({
          ...prev,
          'package.json': {
            code: JSON.stringify(pkgJson, null, 2),
            language: 'json'
          }
        }));

        setTerminalHistory(prev => [...prev, { type: 'output', text: `+ ${pkg}@latest installed successfully.` }]);
      }, 800);
    } else if (baseCmd === 'npm' && args[1] === 'uninstall') {
        const pkg = args[2];
        if (!pkg) {
          setTerminalHistory(prev => [...prev, { type: 'error', text: 'Error: Please specify a package name.' }]);
          return;
        }
        let pkgJson = files['package.json'] ? JSON.parse(files['package.json'].code) : null;
        if (pkgJson && pkgJson.dependencies && pkgJson.dependencies[pkg]) {
          delete pkgJson.dependencies[pkg];
          setFiles(prev => ({
            ...prev,
            'package.json': {
              code: JSON.stringify(pkgJson, null, 2),
              language: 'json'
            }
          }));
          setTerminalHistory(prev => [...prev, { type: 'output', text: `uninstalled ${pkg}.` }]);
        } else {
          setTerminalHistory(prev => [...prev, { type: 'error', text: `Package ${pkg} not found in dependencies.` }]);
        }
    } else {
      setTerminalHistory(prev => [...prev, { type: 'error', text: `Command not found: ${baseCmd}` }]);
    }
  }, [files]);

  const handleOpenBrandingPage = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReversX v1</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0d0d0d;
            --side: #181818;
            --text: #cccccc;
            --blue: #4fc1ff;
            --orange: #ce9178;
            --green: #6a9955;
            --border: #2b2b2b;
            --highlight: #1e1e1e;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Roboto', sans-serif;
            display: flex;
            height: 100vh;
            font-size: 14px;
        }

        /* --- SIDEBAR ICONS --- */
        .sidebar {
            width: 50px;
            background: var(--side);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 20px;
            gap: 25px;
        }

        .icon { width: 22px; height: 22px; position: relative; opacity: 0.6; }
        .icon-files { border: 2px solid #858585; border-radius: 2px; }
        .icon-files::after { content: ''; position: absolute; top: 4px; left: 4px; width: 10px; height: 2px; background: #858585; box-shadow: 0 4px 0 #858585, 0 8px 0 #858585; }

        /* --- MAIN AREA --- */
        .main {
            flex: 1;
            padding: 35px;
            overflow-y: auto;
        }

        .comment { color: var(--green); margin-bottom: 8px; }
        h1 { color: #fff; font-size: 26px; font-weight: 500; margin-bottom: 25px; }

        /* --- HIGH VISIBILITY TABLE --- */
        .data-table {
            width: 100%;
            max-width: 450px;
            margin: 25px 0;
            border-collapse: collapse;
            background: var(--highlight);
            border: 1px solid var(--border);
            border-left: 4px solid var(--blue); /* Highlight side */
            border-radius: 4px;
        }

        .data-table tr {
            border-bottom: 1px solid var(--border);
        }

        .data-table tr:last-child {
            border-bottom: none;
        }

        .data-table td {
            padding: 14px 20px;
            font-size: 13px;
        }

        .key { 
            color: var(--blue); 
            font-weight: 500;
            width: 40%;
            border-right: 1px solid var(--border);
        }

        .val { 
            color: var(--orange); 
        }

        .text { margin-bottom: 10px; }

        /* --- FOOTER --- */
        .status-bar {
            position: fixed;
            bottom: 0;
            width: 100%;
            background: #007acc;
            color: white;
            font-size: 11px;
            padding: 4px 15px;
            display: flex;
            justify-content: space-between;
        }

        @media (max-width: 500px) {
            .main { padding: 25px; }
            .sidebar { display: none; }
        }
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="icon icon-files"></div>
    </div>

    <div class="main">
        <div class="comment">// About ReversX v1</div>
        <h1>ReversX v1</h1>
        
        <p class="text">A free helper to build websites easily.</p>
        <p class="text">Made for people who code on their phone.</p>

        <table class="data-table">
            <tr>
                <td class="key">Works on</td>
                <td class="val">Android Phones</td>
            </tr>
            <tr>
                <td class="key">Price</td>
                <td class="val">Free</td>
            </tr>
            <tr>
                <td class="key">Users</td>
                <td class="val">20,000</td>
            </tr>
            <tr>
                <td class="key">Saved work</td>
                <td class="val">Lifetime</td>
            </tr>
        </table>

        <div class="comment">/* How to use */</div>
        <p class="text">1. Add your key.</p>
        <p class="text">2. Tell the AI your idea.</p>
        <p class="text">3. Get your code back.</p>
    </div>

    <div class="status-bar">
        <div>main*</div>
        <div>ReversX System Active</div>
    </div>

</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }, []);

  const generateAgentQuestions = async (userPrompt: string) => {
    setIsLoading(true);
    setCurrentAgentPrompt(userPrompt);
    
    const prompt = `The user wants to build: "${userPrompt}". 
    As a professional ReversX v1 Agent, generate exactly 3 specific multiple-choice questions to better understand the technical requirements, design preferences, and functionality of this project. 
    Keep the questions concise and professional.
    Format your response as a JSON array of objects, each with "question" and "options" (array of strings).
    Example: [{"question": "What is the primary color theme?", "options": ["Dark", "Light", "Vibrant"]}]`;

     try {
       const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra } = getPlatformConfig();
       const response = await chatWithAI(prompt, [], currentApiKey, currentModel, currentPlatform, [], extra);
       const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        setAgentQuestions(questions);
        setSelectedAnswers({});
        setShowAgentQuestions(true);
      } else {
        processMessage(userPrompt);
      }
    } catch (error) {
      console.error("Agent Question Generation Error:", error);
      processMessage(userPrompt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentSubmit = () => {
    if (Object.keys(selectedAnswers).length < agentQuestions.length) return;
    
    const answersText = agentQuestions.map((q, i) => `Q: ${q.question}\nA: ${selectedAnswers[i]}`).join('\n');
    const finalPrompt = `User Project Request: ${currentAgentPrompt}\n\nTechnical Requirements & Preferences:\n${answersText}`;
    
    setShowAgentQuestions(false);
    processMessage(finalPrompt);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const content = await new Promise<string>((resolve) => {
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });

      newAttachments.push({
        name: file.name,
        type: file.type,
        content: content
      });
    }

    setPendingAttachments(prev => [...prev, ...newAttachments]);
    if (e.target) e.target.value = '';
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
    if (previewPendingIdx === index) setPreviewPendingIdx(null);
    else if (previewPendingIdx !== null && previewPendingIdx > index) setPreviewPendingIdx(previewPendingIdx - 1);
  }, [previewPendingIdx]);

  const handleSaveAttachment = useCallback((updated: Attachment) => {
    if (editingAttachment?.isPending && editingAttachment.index !== undefined) {
      const newAttachments = [...pendingAttachments];
      newAttachments[editingAttachment.index] = updated;
      setPendingAttachments(newAttachments);
    }
    setEditingAttachment(null);
  }, [editingAttachment, pendingAttachments]);

  const handleSendEditedAttachment = useCallback(async (updated: Attachment) => {
    setEditingAttachment(null);
    const userMessage = `I've edited the file "${updated.name}". Here is the updated content:`;
    processMessage(userMessage, [updated]);
  }, [processMessage]);

  const handleSend = useCallback(async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || isLoading) return;

    const userMessage = input;
    const attachments = [...pendingAttachments];
    setInput('');
    setPendingAttachments([]);
    setPreviewPendingIdx(null);
    
    // Reset textarea height immediately
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
    }
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      attachments: attachments.length > 0 ? attachments : undefined
    }]);
    
    if (isAgentActive) {
      generateAgentQuestions(userMessage);
      return;
    }

    // Handle project naming if it's the first real message
    const isFirstMessage = messages.filter(m => !m.content.startsWith('Welcome_msg:')).length === 0;

    if (isFirstMessage && activeProjectId) {
      const project = projects.find(p => p.id === activeProjectId);
      if (project && (
        project.name === 'New Project' || 
        project.name === 'My First Project' || 
        project.name.startsWith('Project ')
      )) {
        setPendingUserMessage(userMessage);
        setPendingUserAttachments(attachments);
        setShowProjectNaming(true);
        return;
      }
    }

    await processMessage(userMessage, attachments);
  }, [input, pendingAttachments, isLoading, isAgentActive, messages, activeProjectId, projects, processMessage]);

  const handleProjectNamingSubmit = useCallback(() => {
    if (!pendingProjectName.trim()) return;
    
    const cleanName = pendingProjectName.trim();
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, name: cleanName } : p));
    setShowProjectNaming(false);
    setPendingProjectName('');
    
    if (pendingUserMessage || pendingUserAttachments.length > 0) {
      processMessage(pendingUserMessage, pendingUserAttachments);
      setPendingUserMessage('');
      setPendingUserAttachments([]);
    }
  }, [pendingUserAttachments, processMessage]);
  
  
  
  const handleImportFiles = useCallback(async (fileList: FileList | File[]) => {
    setIsLoading(true);
    
    try {
      const newFiles: Record<string, { code: string, language: string }> = {};
      let firstFile: string | null = null;
      let folderName: string | null = null;
      
      const fileArray = Array.from(fileList);
      
      // Process in small batches so UI doesn't completely freeze
      const BATCH_SIZE = 50;
      for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
        const batch = fileArray.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (file) => {
          let path = file.webkitRelativePath || file.name;
          if (!folderName && file.webkitRelativePath) {
            folderName = file.webkitRelativePath.split('/')[0];
          }
          if (path.startsWith('/')) path = path.slice(1);
          
          // Skip node_modules, .git to prevent freezing
          if (path.includes('node_modules/') || path.includes('.git/') || path.includes('dist/') || path.includes('.next/')) {
            return;
          }

          try {
            if (file.type.startsWith('image/') || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(file.name)) {
              if (file.size > 5 * 1024 * 1024) return; // Skip incredibly large images (>5MB)
              const reader = new FileReader();
              const p = new Promise<string>((resolve, reject) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
              const base64 = await p;
              newFiles[path] = { code: base64, language: 'image' };
            } else {
              if (file.size > 5 * 1024 * 1024) return; // Skip huge sources (>5MB)
              const text = await file.text();
              newFiles[path] = { code: text, language: getLanguageFromPath(path) };
            }
            if (!firstFile) firstFile = path; // It's fine if it's slightly random due to parallel
          } catch (e) {
            console.error("Failed to read file", file.name, e);
          }
        }));
      }

      // If parallel reads finished, let's grab the first file again deterministically if possible
      const keys = Object.keys(newFiles);
      if (keys.length === 0) {
        const defaultName = 'untitled.txt';
        newFiles[defaultName] = { code: '', language: 'txt' };
        keys.push(defaultName);
        if (!firstFile) firstFile = defaultName;
      }

      if (keys.length > 0) {
          if (!firstFile || !newFiles[firstFile]) {
             firstFile = keys.find(k => k.includes('index.html')) || keys.find(k => k.includes('main.')) || keys[0];
          }

          setFiles(prev => {
            const nextFiles = { ...prev, ...newFiles };
            if (!activeProjectId) {
               const newProject: Project = {
                 id: generateId(),
                 name: folderName || `Imported Project`,
                 messages: [],
                 files: nextFiles,
                 activeFile: firstFile || 'index.html',
                 openFiles: [firstFile || 'index.html'],
                 createdAt: Date.now()
               };
               requestAnimationFrame(() => {
                  setProjects(p => [newProject, ...p]);
                  setActiveProjectId(newProject.id);
               });
            }
            return nextFiles;
          });
          setPreviewFiles(prev => ({ ...prev, ...newFiles }));
          
          setOpenFiles(prev => {
              const toAdd = keys.filter(f => !prev.includes(f));
              return Array.from(new Set([...prev, ...toAdd])); // removed limit
          });
          
          if (firstFile) {
              setActiveFile(firstFile);
              setEditorPanes([firstFile]);
          }
      } else {
         console.warn("No valid files were imported.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [setFiles, setPreviewFiles, setOpenFiles, setEditorPanes, setActiveFile, activeProjectId]);

  const handleZipUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipFile = e.target.files?.[0];
    if (!zipFile) return;
    setIsLoading(true);
    setIsUploadMenuOpen(false);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const content = await zip.loadAsync(zipFile);
      const newFiles: Record<string, { code: string, language: string }> = {};
      
      const filePaths = Object.keys(content.files);
      for (const path of filePaths) {
        const fileNode = content.files[path];
        if (fileNode.dir) continue;
        
        // Skip common ignore patterns
        if (path.includes('node_modules/') || path.includes('.git/') || path.includes('__MACOSX/')) continue;
        
        const isImage = /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(path);
        if (isImage) {
          const base64 = await fileNode.async('base64');
          const ext = path.split('.').pop()?.toLowerCase();
          const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
          newFiles[path] = { code: `data:${mimeType};base64,${base64}`, language: 'image' };
        } else {
          const text = await fileNode.async('text');
          newFiles[path] = { code: text, language: getLanguageFromPath(path) };
        }
      }

      if (Object.keys(newFiles).length === 0) {
        newFiles['untitled.txt'] = { code: '', language: 'txt' };
      }

      setFiles(prev => {
        const nextFiles = { ...prev, ...newFiles };
        if (!activeProjectId) {
           const newProject: Project = {
             id: generateId(),
             name: zipFile.name.replace(/\.zip$/i, '') || `Imported Zip`,
             messages: [],
             files: nextFiles,
             activeFile: Object.keys(newFiles)[0] || 'index.html',
             openFiles: [Object.keys(newFiles)[0] || 'index.html'],
             createdAt: Date.now()
           };
           requestAnimationFrame(() => {
              setProjects(p => [newProject, ...p]);
              setActiveProjectId(newProject.id);
           });
        }
        return nextFiles;
      });
      setPreviewFiles(prev => ({ ...prev, ...newFiles }));
      const firstZipFile = Object.keys(newFiles)[0];
      if (firstZipFile) {
         handleFileOpen(firstZipFile);
      }
    } catch (err) {
      console.error('Error uploading zip:', err);
    } finally {
      setIsLoading(false);
      if (e.target) e.target.value = '';
    }
  }, [activeFile, handleFileOpen, setFiles, setPreviewFiles]);

  const handleSingleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    setIsUploadMenuOpen(false);
    
    const newFiles: Record<string, { code: string, language: string }> = {};
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        const isImage = file.type.startsWith('image/') || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(file.name);
        if (isImage) {
          const reader = new FileReader();
          const p = new Promise<string>((resolve, reject) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          const base64 = await p;
          newFiles[file.name] = { code: base64, language: 'image' };
        } else {
          const text = await file.text();
          newFiles[file.name] = { code: text, language: getLanguageFromPath(file.name) };
        }
      } catch (err) {
        console.error("Failed to read file", file.name, err);
      }
    }
    
    if (Object.keys(newFiles).length === 0) {
      newFiles['untitled.txt'] = { code: '', language: 'txt' };
    }
    
    setFiles(prev => {
      const nextFiles = { ...prev, ...newFiles };
      if (!activeProjectId) {
         const newProject: Project = {
           id: generateId(),
           name: `Imported Files`,
           messages: [],
           files: nextFiles,
           activeFile: Object.keys(newFiles)[0] || 'index.html',
           openFiles: [Object.keys(newFiles)[0] || 'index.html'],
           createdAt: Date.now()
         };
         requestAnimationFrame(() => {
            setProjects(p => [newProject, ...p]);
            setActiveProjectId(newProject.id);
         });
      }
      return nextFiles;
    });
    setPreviewFiles(prev => ({ ...prev, ...newFiles }));
    const firstUploadedFile = Object.keys(newFiles)[0];
    if (firstUploadedFile) {
      handleFileOpen(firstUploadedFile);
    }
    if (e.target) e.target.value = '';
  }, [activeFile, handleFileOpen, setFiles, setPreviewFiles]);

  const handleMediaFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    setIsUploadMenuOpen(false);
    
    const newFiles: Record<string, { code: string, language: string }> = {};
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        try {
            const reader = new FileReader();
            const p = new Promise<string>((resolve, reject) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            const base64 = await p;
            const isVideo = file.type.startsWith('video/');
            const isImage = file.type.startsWith('image/');
            newFiles[file.name] = { code: base64, language: isVideo ? 'video' : (isImage ? 'image' : 'unknown') };
        } catch (err) {
            console.error("Failed to read media file", file.name, err);
        }
    }
    
    if (Object.keys(newFiles).length > 0) {
        setFiles(prev => ({ ...prev, ...newFiles }));
        setPreviewFiles(prev => ({ ...prev, ...newFiles }));
        const firstFile = Object.keys(newFiles)[0];
        if (firstFile) handleFileOpen(firstFile);
    }
    if (e.target) e.target.value = '';
  }, [handleFileOpen, setFiles, setPreviewFiles]);

  const handleCreateFilesDirectly = useCallback((newFiles: string[]) => {
    setFiles(prev => {
      const updated = { ...prev };
      let lastCreated: string | null = null;
      newFiles.forEach(name => {
        if (!updated[name]) {
          updated[name] = { 
            code: name.endsWith('.html') ? '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>New File</title>\n</head>\n<body>\n    \n</body>\n</html>' : (name.endsWith('.css') ? '/* New Stylesheet */\n' : '// New file\n'), 
            language: getLanguageFromPath(name)
          };
          lastCreated = name;
        }
      });
      if (lastCreated) {
        setOpenFiles(prevOpen => {
          if (!prevOpen.includes(lastCreated!)) return [...prevOpen, lastCreated!];
          return prevOpen;
        });
        setActiveFile(lastCreated);
      }
      return updated;
    });
  }, [setOpenFiles, setActiveFile]);

  const handleCreateInFolder = useCallback((type: 'file' | 'folder', parentPath: string) => {
    setInlineCreatingType(type);
    setInlineCreatingParent(parentPath);
    setInlineCreatingName('');
    setIsExplorerCreateMenuOpen(false);
  }, []);

  const handleCreateFile = useCallback(() => {
    let parentFolder = '';
    if (activeFile) {
      const parts = activeFile.split('/');
      if (parts.length > 1) {
        parentFolder = parts.slice(0, parts.length - 1).join('/');
      }
    }
    handleCreateInFolder('file', parentFolder);
  }, [activeFile, handleCreateInFolder]);

  const handleCreateFolder = useCallback(() => {
    let parentFolder = '';
    if (activeFile) {
      const parts = activeFile.split('/');
      if (parts.length > 1) {
        parentFolder = parts.slice(0, parts.length - 1).join('/');
      }
    }
    handleCreateInFolder('folder', parentFolder);
  }, [activeFile, handleCreateInFolder]);

  const handleConfirmInlineCreate = useCallback(() => {
    const name = inlineCreatingName.trim();
    if (!name) {
      setInlineCreatingType(null);
      setInlineCreatingParent('');
      setInlineCreatingName('');
      return;
    }

    const fullPath = inlineCreatingParent ? `${inlineCreatingParent}/${name}` : name;

    if (inlineCreatingType === 'file') {
      if (files[fullPath]) {
        alert('File already exists!');
        return;
      }
      
      const language = getLanguageFromPath(fullPath);

      setFiles(prev => ({
        ...prev,
        [fullPath]: { code: '', language }
      }));
      setOpenFiles(prev => {
        return prev.includes(fullPath) ? prev : [...prev, fullPath];
      });
      setActiveFile(fullPath);
    } else {
      const folderPath = fullPath.endsWith('/') ? fullPath.substring(0, fullPath.length - 1) : fullPath;
      const dummyFile = `${folderPath}/.keep`;
      
      if (files[dummyFile]) {
        alert('Folder already exists!');
        return;
      }

      setFiles(prev => ({
        ...prev,
        [dummyFile]: { code: '', language: 'plaintext' }
      }));
    }

    setInlineCreatingType(null);
    setInlineCreatingParent('');
    setInlineCreatingName('');
  }, [inlineCreatingName, inlineCreatingType, inlineCreatingParent, files, setOpenFiles, setActiveFile]);

  const handleCancelInlineCreate = useCallback(() => {
    setInlineCreatingType(null);
    setInlineCreatingParent('');
    setInlineCreatingName('');
  }, []);

  const handleGithubImport = useCallback(() => {
    setIsGithubImportOpen(true);
    setIsExplorerCreateMenuOpen(false);
  }, []);

  const handleGithubExport = useCallback(() => {
    setIsGithubExportOpen(true);
    setIsExplorerCreateMenuOpen(false);
  }, []);

  const handleDownloadProject = useCallback(async () => {
    const JSZip = (await import('jszip')).default;
    const { saveAs } = await import('file-saver');
    const zip = new JSZip();

    Object.entries(files).forEach(([path, file]) => {
      zip.file(path, file.code);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'project.zip');
  }, [files]);

  const confirmGithubExport = async () => {
    if (!githubExportRepo || !githubToken) {
      alert('Repository path and Personal Access Token are required.');
      return;
    }
    
    setIsGitHubExporting(true);
    try {
      const repoPath = githubExportRepo.trim().replace('https://github.com/', '').replace('http://github.com/', '');
      const [owner, repo] = repoPath.split('/');
      if (!owner || !repo) throw new Error('Invalid Repository path. Use owner/repo');

      const headers = {
        'Authorization': `token ${githubToken.trim()}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      };

      // 1. Get the latest commit SHA of the branch
      const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${githubBranch}`, { headers });
      
      let baseTreeSha: string | undefined;
      let parentCommitSha: string | undefined;

      if (refRes.ok) {
        const refData = await refRes.json();
        parentCommitSha = refData.object.sha;
        const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${parentCommitSha}`, { headers });
        const commitData = await commitRes.json();
        baseTreeSha = commitData.tree.sha;
      } else if (refRes.status === 404) {
        // Branch might not exist, or repo is empty. For a real app, we'd handle initial commit differently.
        throw new Error('Branch not found. Please ensure the repository exists and has at least one commit.');
      } else {
        throw new Error('Failed to connect to GitHub. Check your token and repository permissions.');
      }

      // 2. Create Blobs and Tree
      const treeItems = Object.entries(files).map(([path, file]) => ({
        path,
        mode: '100644',
        type: 'blob',
        content: file.code
      }));

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeItems
        })
      });
      const treeData = await treeRes.json();
      if (!treeRes.ok) throw new Error(treeData.message || 'Failed to create tree');

      // 3. Create Commit
      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: githubCommitMessage || 'Update from Editor',
          tree: treeData.sha,
          parents: [parentCommitSha]
        })
      });
      const commitData = await commitRes.json();
      if (!commitRes.ok) throw new Error(commitData.message || 'Failed to create commit');

      // 4. Update Reference
      const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${githubBranch}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          sha: commitData.sha,
          force: false
        })
      });

      if (!updateRes.ok) {
        const data = await updateRes.json();
        throw new Error(data.message || 'Failed to update branch reference');
      }

      alert('Successfully pushed to GitHub!');
      setIsGithubExportOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(`Push error: ${err.message}`);
    } finally {
      setIsGitHubExporting(false);
    }
  };

  const confirmGithubImport = async () => {
    if (!githubRepoUrl) return;
    setIsGitHubImporting(true);
    try {
      let repoPath = githubRepoUrl.trim().replace('https://github.com/', '').replace('http://github.com/', '');
      if (repoPath.endsWith('.git')) repoPath = repoPath.slice(0, -4);
      
      const parts = repoPath.split('/');
      if (parts.length < 2) throw new Error('Invalid GitHub URL structure. Use owner/repo');
      const owner = parts[0];
      const repo = parts[1];

      const fetchRepo = async (path: string = ''): Promise<Record<string, { code: string, language: string }>> => {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${githubBranch}`);
        if (!response.ok) {
           if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
           if (response.status === 404) throw new Error(`Failed to fetch ${path || 'repository'}: Not Found. Please check if the repository or branch "${githubBranch}" exists.`);
           throw new Error(`Failed to fetch ${path || 'repository'} (Status: ${response.status} ${response.statusText}). If status is 0, check your internet connection or ad-blocker.`);
        }
        const data = await response.json();
        
        let newFiles: Record<string, { code: string, language: string }> = {};
        const items = Array.isArray(data) ? data : [data];
        
        for (const item of items) {
          if (item.type === 'file') {
            const fileRes = await fetch(item.download_url);
            const content = await fileRes.text();
            const ext = item.name.split('.').pop() || 'plaintext';
            const langMap: Record<string, string> = {
              'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
              'html': 'html', 'css': 'css', 'py': 'python', 'json': 'json', 'md': 'markdown'
            };
            newFiles[item.path] = { code: content, language: langMap[ext] || 'plaintext' };
          } else if (item.type === 'dir') {
            const dirFiles = await fetchRepo(item.path);
            newFiles = { ...newFiles, ...dirFiles };
          }
        }
        return newFiles;
      };

      const importedFiles = await fetchRepo();
      if (Object.keys(importedFiles).length === 0) {
        importedFiles['untitled.txt'] = { code: '', language: 'txt' };
      }

      setFiles(prev => ({ ...prev, ...importedFiles }));
      setPreviewFiles(importedFiles);
      const firstFile = Object.keys(importedFiles)[0];
      setActiveFile(firstFile);
      setOpenFiles(prev => Array.from(new Set([...prev, firstFile])));
      setEditorPanes([firstFile]);
      
      setIsGithubImportOpen(false);
      setGithubRepoUrl('');
    } catch (err: any) {
      console.error(err);
      alert(`Import error: ${err.message}`);
    } finally {
      setIsGitHubImporting(false);
    }
  };

  const confirmCreateFolder = useCallback(() => {
    const name = newFolderName.trim();
    if (!name) return;
    
    // We create a hidden file to represent the folder in the flat file system
    const folderPath = name.endsWith('/') ? name.substring(0, name.length - 1) : name;
    const dummyFile = `${folderPath}/.keep`;
    
    if (files[dummyFile]) {
      alert('Folder already exists!');
      return;
    }

    setFiles(prev => ({
      ...prev,
      [dummyFile]: { code: '', language: 'plaintext' }
    }));
    setShowNewFolderModal(false);
  }, [newFolderName, files]);

  const confirmCreateFile = useCallback(() => {
    const name = newFileName.trim();
    if (!name) return;
    if (files[name]) {
      alert('File already exists!');
      return;
    }
    
    const language = getLanguageFromPath(name);

    setFiles(prev => ({
      ...prev,
      [name]: { code: '', language }
    }));
    setOpenFiles(prev => {
      return prev.includes(name) ? prev : [...prev, name];
    });
    setActiveFile(name);
    setShowNewFileModal(false);
    setNewFileName('');
  }, [newFileName, files]);

  const handleRenameFile = useCallback((oldName: string) => {
    setRenameOldName(oldName);
    setRenameNewName(oldName);
    setShowRenameModal(true);
  }, []);

  const confirmRenameFile = useCallback(() => {
    const oldName = renameOldName;
    const newName = renameNewName.trim();
    if (!newName || newName === oldName) {
      setShowRenameModal(false);
      return;
    }
    if (files[newName]) {
      alert('File already exists!');
      return;
    }

    setFiles(prev => {
      const newFiles = { ...prev };
      const oldData = newFiles[oldName];
      const newLanguage = getLanguageFromPath(newName);
      newFiles[newName] = { ...oldData, language: newLanguage };
      delete newFiles[oldName];
      return newFiles;
    });
    if (activeFile === oldName) setActiveFile(newName);
    setShowRenameModal(false);
  }, [renameOldName, renameNewName, files, activeFile]);

  const handleDeleteFile = useCallback((name: string) => {
    if (Object.keys(files).length <= 1) {
      alert('Cannot delete the last file.');
      return;
    }
    setFileToDelete(name);
    setShowDeleteModal(true);
  }, [files]);

  const confirmDeleteFile = useCallback(() => {
    const name = fileToDelete;
    if (!name) {
      setShowDeleteModal(false);
      return;
    }

    setFiles(prev => {
      const updated = { ...prev };
      delete updated[name];
      setPreviewFiles(updated);
      return updated;
    });

    setOpenFiles(prev => prev.filter(f => f !== name));

    if (activeFile === name) {
      const remaining = Object.keys(files).filter(f => f !== name);
      setActiveFile(remaining[0] || '');
    }
    setShowDeleteModal(false);
    setFileToDelete('');
  }, [fileToDelete, files, activeFile]);

  const handleDownloadFile = useCallback((filename: string) => {
    const content = files[filename]?.code || '';
    handleDownloadFallback(filename, content);
  }, [files]);

  const handleCodeChange = useCallback((value: string | undefined, specificFile?: string) => {
    const targetFile = specificFile || activeFile;
    if (value !== undefined && targetFile) {
      setFiles(prev => {
        if (prev[targetFile]?.code === value) return prev;
        return {
          ...prev,
          [targetFile]: {
            ...prev[targetFile],
            code: value
          }
        };
      });

      if (showPreview) {
        if (previewTimeout.current) clearTimeout(previewTimeout.current);
        previewTimeout.current = setTimeout(() => {
          setPreviewFiles(prev => ({
            ...prev,
            [targetFile]: {
              ...prev[targetFile],
              code: value
            }
          }));
        }, 1000);
      }
    }
  }, [activeFile, showPreview]);

  const handleOpenLocalFile = async () => {
    // Check if we are in an iframe
    const isIframe = window.self !== window.top;

    if (!('showOpenFilePicker' in window) || isIframe) {
      handleOpenFileSystem();
      return;
    }

    try {
      const [handle] = await (window as any).showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: 'Code Files',
            accept: {
              'text/*': ['.js', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.txt', '.py', '.c', '.cpp', '.java', '.php', '.sql', '.sh', '.rs', '.go'],
            },
          },
        ],
      });

      const file = await handle.getFile();
      const contents = await file.text();
      const name = file.name;
      
      fileHandles.current[name] = handle;
      const language = getLanguageFromPath(name);

      setFiles(prev => ({
        ...prev,
        [name]: { code: contents, language }
      }));
      setActiveFile(name);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      
      console.warn('File System Access API blocked or failed, falling back to standard input:', err);
      handleOpenFileSystem();
    }
  };

  const handleDownloadFallback = async (filename: string, content: string) => {
    // 1. If running in Capacitor (native Android app)
    if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
      try {
        let fileData = content;
        let isBase64 = false;

        // If it's a data URL (e.g. image), extract the raw base64 data
        if (content.startsWith('data:') && content.includes(';base64,')) {
          const parts = content.split(';base64,');
          fileData = parts[1];
          isBase64 = true;
        }

        // Write the file to the Cache directory
        const result = await Filesystem.writeFile({
          path: filename,
          data: fileData,
          directory: Directory.Cache,
          encoding: isBase64 ? undefined : 'utf8' as any
        });
        
        // Share the saved file to let user save it or share it
        await Share.share({
          title: `Download ${filename}`,
          text: `Save or share your file: ${filename}`,
          url: result.uri,
          dialogTitle: 'Save File'
        });
      } catch (error) {
        console.error('Capacitor download error:', error);
        alert('Failed to save file: ' + (error as Error).message);
      }
      return;
    }

    // 2. Standard Web fallback
    const isBase64 = content.startsWith('data:') && content.includes(';base64,');
    let url = '';
    
    if (isBase64) {
      url = content; // It is already a data URL
    } else {
      const blob = new Blob([content], { type: 'text/plain' });
      url = URL.createObjectURL(blob);
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    if (!isBase64) {
      URL.revokeObjectURL(url);
    }
    alert(`Downloaded ${filename} to your device.`);
  };

  const handleSaveToLocal = useCallback(async () => {
    const handle = fileHandles.current[activeFile];
    const content = files[activeFile]?.code || '';
    const isIframe = window.self !== window.top;

    if (handle && !isIframe) {
      try {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        alert(`Saved ${activeFile} to device!`);
      } catch (err) {
        console.error('Error saving to local file:', err);
        handleDownloadFallback(activeFile, content);
      }
    } else {
      if (!('showSaveFilePicker' in window) || isIframe) {
        handleDownloadFallback(activeFile, content);
        return;
      }

      try {
        const newHandle = await (window as any).showSaveFilePicker({
          suggestedName: activeFile,
        });
        const writable = await newHandle.createWritable();
        await writable.write(content);
        await writable.close();
        fileHandles.current[activeFile] = newHandle;
        alert(`Saved ${activeFile} to device!`);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error saving new local file:', err);
          handleDownloadFallback(activeFile, content);
        }
      }
    }
  }, [activeFile, files]);

  const handleOpenFileSystem = useCallback(async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = async (e: any) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;
        
        const newFiles = { ...files };
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const contents = await file.text();
          const name = file.name;
          const language = getLanguageFromPath(name);

          newFiles[name] = { code: contents, language };
        }
        setFiles(newFiles);
        setPreviewFiles(newFiles);
      };
      input.click();
    } catch (err) {
      console.error('Error opening files:', err);
    }
  }, [files]);

  const handleGlobalSearch = useCallback((query: string) => {
    if (!query) {
      setGlobalSearchResults([]);
      return;
    }

    const results: { filename: string, matches: { line: number, text: string, index: number }[] }[] = [];
    
    Object.entries(files).forEach(([filename, fileData]) => {
      const code = fileData.code;
      if (typeof code !== 'string') return;
      
      const fileMatches: { line: number, text: string, index: number }[] = [];
      const lines = code.split('\n');
      
      let flags = 'g';
      if (!globalSearchOptions.caseSensitive) flags += 'i';
      
      let pattern = query;
      if (!globalSearchOptions.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      
      if (globalSearchOptions.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const regex = new RegExp(pattern, flags);
      
      lines.forEach((lineText, lineIdx) => {
        let match;
        const lineRegex = new RegExp(pattern, flags);
        while ((match = lineRegex.exec(lineText)) !== null) {
          fileMatches.push({
            line: lineIdx + 1,
            text: lineText.trim(),
            index: match.index
          });
          if (!flags.includes('g')) break;
        }
      });
      
      if (fileMatches.length > 0) {
        results.push({ filename, matches: fileMatches });
      }
    });
    
    setGlobalSearchResults(results);
  }, [files, globalSearchOptions]);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    const newFiles = { ...files };
    
    const readFileEntry = (entry: any): Promise<File> => {
      return new Promise((resolve) => entry.file(resolve));
    };

    const readDirectoryEntry = (entry: any): Promise<any[]> => {
      const dirReader = entry.createReader();
      return new Promise((resolve, reject) => {
        const results: any[] = [];
        const readEntries = () => {
          dirReader.readEntries((entries: any[]) => {
            if (entries.length === 0) {
              resolve(results);
            } else {
              results.push(...entries);
              readEntries();
            }
          }, (err: any) => reject(err));
        };
        readEntries();
      });
    };

    const processEntry = async (entry: any, path: string = '') => {
      if (entry.isFile) {
        const file = await readFileEntry(entry);
        const relativePath = path + entry.name;
        
        // Skip common large or unnecessary files/folders
        if (relativePath.includes('node_modules') || relativePath.includes('.git')) return;

        let content: string;
        let language: string;
        
        if (file.type.startsWith('image/')) {
          content = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result as string);
            reader.readAsDataURL(file);
          });
          language = 'image';
        } else {
          content = await file.text();
          language = getLanguageFromPath(entry.name);
        }
        
        newFiles[relativePath] = { code: content, language };
      } else if (entry.isDirectory) {
        const entries = await readDirectoryEntry(entry);
        for (const childEntry of entries) {
          await processEntry(childEntry, path + entry.name + '/');
        }
      }
    };

    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        promises.push(processEntry(entry));
      }
    }
    
    await Promise.all(promises);
    setFiles(newFiles);
    setPreviewFiles(newFiles);
  }, [files]);

  const handleGlobalReplace = useCallback((filename: string, oldText: string, newText: string) => {
    setFiles(prev => {
      const fileData = prev[filename];
      if (!fileData) return prev;
      
      let flags = 'g';
      if (!globalSearchOptions.caseSensitive) flags += 'i';
      
      let pattern = oldText;
      if (!globalSearchOptions.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (globalSearchOptions.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const regex = new RegExp(pattern, flags);
      const newCode = fileData.code.replace(regex, newText);
      
      return {
        ...prev,
        [filename]: { ...fileData, code: newCode }
      };
    });
    // Refresh search
    setTimeout(() => handleGlobalSearch(globalSearchQuery), 0);
  }, [globalSearchOptions, handleGlobalSearch, globalSearchQuery]);

  const handleGlobalReplaceAll = useCallback(() => {
    if (!globalSearchQuery) return;
    
    setFiles(prev => {
      const newFiles = { ...prev };
      let flags = 'g';
      if (!globalSearchOptions.caseSensitive) flags += 'i';
      
      let pattern = globalSearchQuery;
      if (!globalSearchOptions.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (globalSearchOptions.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const regex = new RegExp(pattern, flags);
      
      Object.keys(newFiles).forEach(filename => {
        const fileData = newFiles[filename];
        if (typeof fileData.code === 'string') {
          newFiles[filename] = {
            ...fileData,
            code: fileData.code.replace(regex, globalReplaceQuery)
          };
        }
      });
      
      return newFiles;
    });
    setGlobalSearchResults([]);
  }, [globalSearchQuery, globalReplaceQuery, globalSearchOptions]);

  const handleUploadImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e: any) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;
      
      const newFiles = { ...files };
      Array.from(selectedFiles).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setFiles(prev => ({ ...prev, [file.name]: { code: base64, language: 'image' } }));
          setPreviewFiles(prev => ({ ...prev, [file.name]: { code: base64, language: 'image' } }));
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  }, [files]);

  const byokConfig = React.useMemo(() => {
    return getPlatformConfig();
  }, [getPlatformConfig]);

  const onEditAttachment = useCallback((att: Attachment) => {
    setEditingAttachment({ attachment: att, isPending: false });
  }, []);

  const onCodeChange = useCallback((newCode: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], code: newCode }
    }));
  }, [activeFile]);

  if (!isDbLoaded) {
    return (
    <div className="flex w-screen h-screen bg-background p-4 gap-4">
      <Skeleton className="w-[50px] h-full" />
      <Skeleton className="w-[260px] h-full" />
      <div className="flex-1 flex flex-col gap-4">
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-[22px]" />
      </div>
    </div>
    );
  }

  return (
    <IconContext.Provider value={iconThemeName}>
      <FileIconSizeContext.Provider value={fileIconSize}>
      <div style={{ fontFamily: FONT_OPTIONS[appFontName] }} className={`flex flex-col h-full w-full bg-background text-foreground overflow-hidden relative`}>
      
      {/* Hidden file inputs available globally */}
      <input 
        type="file" 
        ref={folderInputRef} 
        style={{ display: 'none' }} 
        multiple 
        {...({ webkitdirectory: "true", directory: "true" } as any)} 
        onChange={(e) => {
          const uploadedFiles = Array.from(e.target.files || []);
          handleImportFiles(uploadedFiles);
          e.target.value = '';
        }} 
      />
      <input 
        type="file" 
        ref={zipInputRef} 
        accept=".zip" 
        style={{ display: 'none' }} 
        onChange={handleZipUpload}
      />
      <input 
        type="file" 
        ref={explorerFileInputRef} 
        multiple 
        style={{ display: 'none' }} 
        onChange={handleSingleFileUpload}
      />
      <input 
        type="file" 
        ref={mediaFileInputRef} 
        multiple 
        accept="image/*,video/*"
        style={{ display: 'none' }} 
        onChange={handleMediaFileUpload}
      />
      <input 
        type="file" 
        ref={welcomeChatFileInputRef} 
        multiple 
        style={{ display: 'none' }} 
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          const newFiles = files.map(file => ({
            name: file.name,
            type: file.type,
            url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
          }));
          setWelcomeChatFiles(prev => [...prev, ...newFiles]);
          e.target.value = '';
        }} 
      />

      <React.Fragment>
        {showAgentQuestions && (
          <div 
            key="agent-questions"
            
            
            
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <div 
              
              
              className="w-full max-w-lg bg-sidebar border border-accent/30 p-6 rounded-none shadow-[0_0_30px_rgba(0,255,65,0.1)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-none bg-accent/10 flex items-center justify-center text-accent">
                  <Terminal size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-normal text-foreground tracking-tight">ReversX v1 Agent</h2>
                  <p className="text-foreground/70 text-xs">Clarifying technical requirements</p>
                </div>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {agentQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <p className="text-sm font-normal text-foreground/80">{q.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                          className={`w-full text-left px-4 py-3 rounded-none border text-sm transition-all ${
                            selectedAnswers[qIdx] === opt
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'bg-black/20 border-white/5 text-white/70 hover:border-white/10 hover:text-white/85'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    setShowAgentQuestions(false);
                    processMessage(currentAgentPrompt);
                  }}
                  className="flex-1 py-3 bg-foreground/5 text-foreground-subtle font-normal rounded-none hover:bg-foreground/10 transition-all text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={handleAgentSubmit}
                  disabled={Object.keys(selectedAnswers).length < agentQuestions.length}
                  className="flex-[2] py-3 bg-accent text-accent-foreground font-normal rounded-none hover:bg-accent/90 active:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-[0_0_20px_rgba(0,255,65,0.2)]"
                >
                  Submit & Build
                </button>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>

      <React.Fragment>
        {showNamePrompt && (
          <div 
            key="name-prompt"
            
            
            
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div 
              
              
              className="w-full max-w-md bg-sidebar border border-border p-8 rounded-none shadow-2xl"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-none bg-accent/10 flex items-center justify-center text-accent">
                  <Terminal size={32} />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-normal tracking-tight text-foreground">Welcome to ReversX</h1>
                  <p className="text-foreground/50 text-sm">Please enter your name to continue</p>
                </div>
                <div className="w-full space-y-4">
                  <input 
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    placeholder="Your Name"
                    autoFocus
                    className="w-full bg-foreground/5 border border-border rounded-none p-4 text-center text-lg focus:outline-none focus:border-accent transition-all text-foreground placeholder:text-foreground/10"
                  />
                  <button 
                    onClick={handleNameSubmit}
                    disabled={!tempName.trim()}
                    className="w-full py-4 bg-[#007ACC] hover:bg-[#006BB3] active:bg-[#005a9e] text-white font-medium rounded-none transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Start Building
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>

      <React.Fragment>
        {showProjectNaming && (
          <div 
            key="project-naming"
            
            
            
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div 
              
              
              className="w-full max-w-md bg-sidebar border border-border p-8 rounded-none shadow-2xl"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-none bg-accent/10 flex items-center justify-center text-accent">
                  <Files size={32} />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-normal tracking-tight text-foreground">Name Your Project</h1>
                  <p className="text-foreground/50 text-sm">Give your project a name to save it</p>
                </div>
                <div className="w-full space-y-4">
                  <input 
                    type="text"
                    value={pendingProjectName}
                    onChange={(e) => setPendingProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleProjectNamingSubmit()}
                    placeholder="Project Name"
                    autoFocus
                    className="w-full bg-foreground/5 border border-border rounded-none p-4 text-center text-lg focus:outline-none focus:border-accent transition-all text-foreground placeholder:text-foreground/10"
                  />
                  <button 
                    onClick={handleProjectNamingSubmit}
                    disabled={!pendingProjectName.trim()}
                    className="w-full py-4 bg-[#007ACC] hover:bg-[#006BB3] active:bg-[#005a9e] text-white font-medium rounded-none transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>

      <React.Fragment>
        {editingAttachment && (
          <AttachmentEditorModal 
            key="attachment-editor"
            editingData={editingAttachment}
            onClose={() => setEditingAttachment(null)}
            onSave={handleSaveAttachment}
            onSend={handleSendEditedAttachment}
            appThemeName={appThemeName}
            syntaxThemeName={syntaxThemeName}
          />
        )}
      </React.Fragment>

      {/* Sidebar Content */}
      <div 
        style={{ width: isZenMode ? '0px' : (isSidebarMinimized ? '0px' : (mobileView === 'chat' ? '100%' : '0px')), height: isZenMode ? '0px' : (mobileView === 'chat' ? '100%' : '0px') }}
        className={`
          ${mobileView === 'chat' && !isZenMode ? 'flex flex-1' : 'hidden'} 
          border-r border-border bg-sidebar flex-col overflow-hidden transition-all duration-300 ease-in-out relative
        `}
      >
        <div className="h-10 px-2 flex items-center justify-between shrink-0 select-none bg-black/10 border-b border-white/5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'projects', label: 'Apps', icon: Folder },
              { id: 'settings_toggle', label: 'Settings', icon: Settings, action: () => setShowSettingsMenu(!showSettingsMenu) },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = tab.id === 'projects' ? activeTab === 'projects' : showSettingsMenu;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.action) tab.action();
                    else setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                    isActive 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'text-foreground/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  title={tab.label}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1 shrink-0">
          </div>
        </div>


        {activeTab === 'projects' ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-sidebar font-sans">
            {/* VS Code Style Header */}
            <div className="px-4 py-2 border-b border-white/[0.05] flex items-center justify-between bg-background shrink-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider">Project History</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-[#cccccc]">Workspace Apps</span>
                  <span className="text-[#858585] text-[10px] tabular-nums">({projects.length})</span>
                </div>
              </div>
              <button 
                onClick={createNewProject}
                className="w-6 h-6 flex items-center justify-center hover:bg-[#37373d] text-[#cccccc] rounded-[2px] transition-colors"
                title="New Application"
              >
                <Codicon name="add" size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20 gap-3 grayscale">
                  <Codicon name="folder" size={48} />
                  <span className="text-[13px] font-medium tracking-tight text-[#cccccc]">No applications found</span>
                </div>
              ) : projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => switchProject(project.id)}
                  className={`w-full flex gap-3 transition-colors group cursor-pointer relative px-4 py-3 border-b border-white/[0.03] ${
                    activeProjectId === project.id 
                      ? 'bg-[#37373d]' 
                      : 'hover:bg-[#2a2d2e]'
                  }`}
                >
                  {/* Selected Indicator */}
                  {activeProjectId === project.id && (
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-[#007acc]" />
                  )}

                  <div className={`w-10 h-10 rounded-[2px] flex items-center justify-center shrink-0 bg-background border border-white/[0.05] transition-all ${activeProjectId === project.id ? 'border-[#007acc]/40' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                      <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke={activeProjectId === project.id ? "#007acc" : "#555"} strokeWidth="6" />
                      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight="bold" fontSize="28" fill={activeProjectId === project.id ? "#007acc" : "#888"}>RX</text>
                    </svg>
                  </div>
                  
                  <div className="flex flex-col min-w-0 flex-1 justify-center">
                    {editingProjectId === project.id ? (
                      <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editNameValue}
                          onChange={e => setEditNameValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveRename(e as any, project.id)}
                          autoFocus
                          className="bg-[#3c3c3c] border border-[#007acc] rounded-none px-2 py-1 text-[12px] w-full focus:outline-none text-white font-sans"
                        />
                        <button onClick={e => saveRename(e, project.id)} className="bg-[#007acc] text-white p-1 rounded-sm hover:brightness-110 active:scale-95 shrink-0">
                          <Codicon name="check" size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`text-[13px] font-medium truncate ${activeProjectId === project.id ? 'text-white' : 'text-[#cccccc]'}`}>
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button 
                              onClick={(e) => { e.stopPropagation(); startRenaming(e, project); }}
                              className="p-1 hover:bg-[#444] text-[#858585] hover:text-[#cccccc] rounded-sm transition-colors"
                              title="Rename"
                            >
                              <Codicon name="edit" size={14} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setProjectToDeleteId(project.id); setDeleteConfirmName(''); }}
                              className="p-1 hover:bg-red-500/10 text-[#858585] hover:text-red-500 rounded-sm transition-colors"
                              title="Delete"
                            >
                              <Codicon name="trash" size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#858585] font-sans mt-0.5">
                          <span className="shrink-0">{new Date(project.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="truncate opacity-60">
                            {project.messages && project.messages.length > 0 
                              ? project.messages[0].content 
                              : "No history"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Delete Modal */}
            {projectToDeleteId && (
              <div 
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-[2px]"
                onClick={() => setProjectToDeleteId(null)}
              >
                <div 
                  className="bg-background border border-[#2d2d2d] w-[90%] max-w-[350px] p-6 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-200"
                  onClick={e => e.stopPropagation()}
                >
                  <h2 className="text-[16px] font-semibold text-white mb-3 tracking-wide">Delete Project</h2>
                  <p className="text-[13px] text-[#858585] mb-4 leading-relaxed">
                    To confirm, type <span className="font-bold text-white bg-[#333] px-2 py-0.5 rounded-none text-[12px]">{projects.find(p => p.id === projectToDeleteId)?.name}</span> in the box below.
                  </p>
                  
                  <input
                    type="text"
                    placeholder="Type name here..."
                    value={deleteConfirmName}
                    onChange={e => setDeleteConfirmName(e.target.value)}
                    className="w-full bg-sidebar border border-[#2d2d2d] text-white px-3 py-2.5 rounded-none outline-none focus:border-accent transition-colors text-[13px] mb-6"
                    autoFocus
                  />
                  
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setProjectToDeleteId(null)}
                      className="px-4 py-2 text-[#858585] hover:text-white text-[12px] font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={deleteConfirmName !== projects.find(p => p.id === projectToDeleteId)?.name}
                      onClick={(e) => deleteProject(e, projectToDeleteId)}
                      className={`px-5 py-2 rounded-none text-[12px] font-semibold transition-all ${
                        deleteConfirmName === projects.find(p => p.id === projectToDeleteId)?.name
                          ? 'bg-[#f85149] text-white hover:brightness-110 active:bg-[#f85149]/80'
                          : 'bg-transparent border border-[#f85149]/30 text-[#f85149]/40 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01] flex justify-center items-center">
              <span className="text-[11px] text-foreground/20 font-medium tracking-tight">Your created project will appear here.</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden items-center justify-center opacity-10 grayscale select-none pointer-events-none">
            <Codicon name="layers" size={64} className="mb-4" />
            <span className="text-sm font-medium tracking-tight">Select a workspace tab to begin</span>
          </div>
        )}
      </div>

      {/* Resizer Handle */}
      {!isSidebarMinimized && (
        <div 
          onMouseDown={startResizing}
          onTouchStart={startResizing}
          className={`hidden w-6 -mx-3 bg-transparent cursor-col-resize transition-all z-[100] relative group ${isResizing ? 'bg-accent/5' : ''} touch-none`}
          title="Drag to resize sidebar"
        >
          {/* Vertical divider line */}
          <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#2b2b2b] group-hover:bg-accent/50 transition-colors ${isResizing ? 'bg-accent' : ''}`} />
          
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[10px] bg-accent/0 group-hover:bg-accent/5 transition-all blur-md" />
        </div>
      )}

      {/* Resize Overlays */}
      {(isResizing || isResizingExplorer) && (
        <div 
          className="fixed inset-0 z-[9999] cursor-col-resize bg-transparent"
        />
      )}

      {/* Main Content Area */}
      <div className={`
        ${(mobileView !== 'chat' || isZenMode) ? 'flex flex-1' : 'hidden'} 
        flex-col bg-background overflow-hidden relative
      `}>
        {isSidebarMinimized && (
          <button
            onClick={() => setIsSidebarMinimized(false)}
            className="hidden absolute top-1/2 left-0 transform -translate-y-1/2 z-[60] w-6 h-12 bg-sidebar hover:bg-foreground/10 border border-border border-l-0 rounded-r-[2px] items-center justify-center text-foreground-muted transition-all shadow-xl"
            title="Expand Sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}
        {/* Main Editor/Preview Container */}
        <div className={`flex-1 relative overflow-hidden bg-background flex flex-col pt-2`}>
          {(!showPreview && mobileView !== 'preview') ? (
            <div className="flex-1 flex font-sans overflow-hidden">

              {/* VS Code Style File Explorer */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`flex flex-col bg-[#252526] border-r border-[#2b2b2b] transition-all duration-300 ease-in-out overflow-hidden
                  ${isExplorerOpen && !isEditorFullscreen && !isZenMode ? (isLandscape ? 'w-[200px]' : 'w-[260px]') + ' opacity-100 pointer-events-auto' : 'w-0 opacity-0 pointer-events-none'}
                  ${isDragging ? 'ring-2 ring-accent ring-inset bg-accent/5' : ''}
                  fixed inset-y-0 left-0 z-[60] md:relative md:z-10
                `}
                style={{ fontFamily: "'Cabin', sans-serif" }}
              >
                {isDragging && (
                  <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-accent/10 backdrop-blur-[2px] pointer-events-none border-2 border-dashed border-accent/40 m-2 rounded-lg">
                    <PlusIcon className="text-accent mb-2" size={24} />
                    <span className="text-[10px] font-extrabold text-accent tracking-[0.2em] uppercase">Drop to Import</span>
                  </div>
                )}
                <div className="h-9 flex items-center justify-between px-4 bg-[#252526] shrink-0 select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#bbbbbb] uppercase tracking-wider font-inherit select-none">EXPLORER</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="relative">
                      <button 
                        onClick={() => setIsUploadMenuOpen(!isUploadMenuOpen)}
                        className={`w-[22px] h-[22px] flex items-center justify-center rounded-none transition-colors ${isUploadMenuOpen ? 'bg-[#37373d] text-white' : 'text-zinc-400 hover:text-white hover:bg-[#2a2d2e]'}`}
                        title="Upload"
                      >
                        <Upload size={14} />
                      </button>
                      
                      <React.Fragment>
                        {isUploadMenuOpen && (
                          <div key="upload-menu">
                            <div className="fixed inset-0 z-[70]" onClick={() => setIsUploadMenuOpen(false)} />
                            <div
                              
                              
                              
                              className="absolute right-0 top-full mt-1 w-max min-w-[150px] bg-[#252526] border border-[#454545] rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] z-[80] overflow-hidden py-1"
                            >
                              <button 
                                onClick={() => { explorerFileInputRef.current?.click(); setIsUploadMenuOpen(false); }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11.5px] text-[#cccccc] hover:bg-[#007acc] hover:text-white transition-colors rounded-none font-inherit whitespace-nowrap"
                                title="Upload multiple files"
                              >
                                <FilePlus size={12} strokeWidth={2} />
                                <span className="leading-none pt-[1px] whitespace-nowrap">Upload file</span>
                              </button>
                              <button 
                                onClick={() => { zipInputRef.current?.click(); setIsUploadMenuOpen(false); }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11.5px] text-[#cccccc] hover:bg-[#007acc] hover:text-white transition-colors rounded-none font-inherit whitespace-nowrap"
                                title="Upload ZIP and extract"
                              >
                                <Blocks size={12} strokeWidth={2} />
                                <span className="leading-none pt-[1px] whitespace-nowrap">Upload Zip file</span>
                              </button>
                              <button 
                                onClick={() => { mediaFileInputRef.current?.click(); setIsUploadMenuOpen(false); }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11.5px] text-[#cccccc] hover:bg-[#007acc] hover:text-white transition-colors rounded-none font-inherit whitespace-nowrap"
                                title="Upload images and videos"
                              >
                                <Film size={12} strokeWidth={2} />
                                <span className="leading-none pt-[1px] whitespace-nowrap">Upload media file</span>
                              </button>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      </div>

                    <button 
                      onClick={handleGithubImport}
                      className="w-[22px] h-[22px] flex items-center justify-center rounded-none text-zinc-400 hover:text-white hover:bg-[#2a2d2e] transition-colors"
                      title="Import from GitHub"
                    >
                      <Github size={14} />
                    </button>
                    <button 
                      onClick={handleGithubExport}
                      className="w-[22px] h-[22px] flex items-center justify-center rounded-none text-zinc-400 hover:text-white hover:bg-[#2a2d2e] transition-colors"
                      title="Push to GitHub"
                    >
                      <Share2 size={14} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setIsExplorerCreateMenuOpen(!isExplorerCreateMenuOpen)}
                        className={`w-[22px] h-[22px] flex items-center justify-center rounded-none transition-colors ${isExplorerCreateMenuOpen ? 'bg-[#37373d] text-white' : 'text-zinc-400 hover:text-white hover:bg-[#2a2d2e]'}`}
                        title="New File/Folder"
                      >
                        <Plus size={14} />
                      </button>
                      
                      <React.Fragment>
                        {isExplorerCreateMenuOpen && (
                          <div key="explorer-menu">
                            <div className="fixed inset-0 z-[70]" onClick={() => setIsExplorerCreateMenuOpen(false)} />
                            <div
                              
                              
                              
                              className="absolute right-0 top-full mt-1 w-max min-w-[140px] bg-[#252526] border border-[#454545] rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.5)] z-[80] overflow-hidden py-1"
                            >
                              <button 
                                onClick={() => { handleCreateFile(); setIsExplorerCreateMenuOpen(false); }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11.5px] text-[#cccccc] hover:bg-[#007acc] hover:text-white transition-colors rounded-none font-inherit whitespace-nowrap"
                              >
                                <FilePlus size={12} strokeWidth={2.5} />
                                <span className="leading-none pt-[1px] whitespace-nowrap">New File</span>
                              </button>
                              <button 
                                onClick={() => { handleCreateFolder(); setIsExplorerCreateMenuOpen(false); }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11.5px] text-[#cccccc] hover:bg-[#007acc] hover:text-white transition-colors rounded-none font-inherit whitespace-nowrap"
                              >
                                <FolderPlus size={12} strokeWidth={2.5} />
                                <span className="leading-none pt-[1px] whitespace-nowrap">New Folder</span>
                              </button>
                              <button 
                                onClick={() => { 
                                  setIsExplorerCreateMenuOpen(false); 
                                  handleDownloadProject(); 
                                }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11.5px] text-[#cccccc] hover:bg-[#007acc] hover:text-white transition-colors rounded-none font-inherit whitespace-nowrap"
                                title="Download Project"
                              >
                                <Download size={12} strokeWidth={2.5} />
                                <span className="leading-none pt-[1px] whitespace-nowrap">Export ZIP</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    </div>
                  </div>
                </div>
                <div className={`custom-scrollbar bg-[#252526] pb-4 ${isBookmarksCollapsed ? 'flex-1 overflow-y-auto' : 'flex-[3] min-h-[150px] overflow-y-auto'}`}>
                  <div className="pl-2 h-[22px] pr-3 flex items-center justify-between text-[#cccccc] hover:bg-white/[0.04] cursor-pointer group transition-colors border-t border-b border-[#2b2b2b]">
                    <div className="flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider opacity-100 transition-opacity">
                      <ChevronDownIcon size={12} className="text-[#cccccc]" />
                      <span className="select-none leading-none pt-[1px] text-[#bbbbbb] font-inherit">WORKSPACE</span>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowInlineFileSearch(!showInlineFileSearch); if(!showInlineFileSearch) setInlineFileSearchQuery(''); }}
                        className="p-1 md:opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-none transition-all text-zinc-400 hover:text-white flex items-center justify-center shrink-0"
                        title="Search Files"
                      >
                        <Search size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {showInlineFileSearch && (
                    <div className="px-2 pb-1">
                      <div className="flex items-center bg-[#2d2d2d] rounded-sm border border-[#3e3e42] px-1.5 focus-within:border-[#007acc] transition-colors">
                        <Search size={12} className="text-zinc-400 shrink-0" />
                        <input
                          type="text"
                          value={inlineFileSearchQuery}
                          onChange={(e) => setInlineFileSearchQuery(e.target.value)}
                          placeholder="Search files..."
                          className="w-full bg-transparent border-none outline-none text-[11px] text-[#cccccc] py-1 pl-1.5 min-w-0"
                          autoFocus
                        />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowInlineFileSearch(false); setInlineFileSearchQuery(''); }}
                          className="p-0.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white shrink-0 ml-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col w-full">
                    {inlineCreatingType && inlineCreatingParent === '' && (
                      <InlineCreationInput 
                        type={inlineCreatingType}
                        depth={0}
                        value={inlineCreatingName}
                        onChange={setInlineCreatingName}
                        onConfirm={handleConfirmInlineCreate}
                        onCancel={handleCancelInlineCreate}
                      />
                    )}
                    {(() => {
                      const filteredFiles = Object.keys(files).filter(path => {
                        if (!showInlineFileSearch || !inlineFileSearchQuery) return true;
                        // Search by relative path or just name, both are fine. Including case insensitivity.
                        return path.toLowerCase().includes(inlineFileSearchQuery.toLowerCase());
                      });
                      const root = buildFileTree(filteredFiles);
                      return Object.values(root.children).sort((a: any, b: any) => {
                        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                        return a.name.localeCompare(b.name);
                      }).map((child: any) => (
                        <FileTreeItem 
                          key={child.path}
                          node={child}
                          activeFile={activeFile}
                          activeFileMenu={activeFileMenu}
                          handleFileOpen={(name) => {
                            handleFileOpen(name);
                            setIsExplorerOpen(false);
                          }}
                          setActiveFileMenu={setActiveFileMenu}
                          handleRenameFile={handleRenameFile}
                          handleDeleteFile={handleDeleteFile}
                          handleDownloadFile={handleDownloadFile}
                          depth={0}
                          inlineCreatingType={inlineCreatingType}
                          inlineCreatingParent={inlineCreatingParent}
                          inlineCreatingName={inlineCreatingName}
                          setInlineCreatingName={setInlineCreatingName}
                          onConfirmInlineCreate={handleConfirmInlineCreate}
                          onCancelInlineCreate={handleCancelInlineCreate}
                          onInitiateInlineCreateInFolder={handleCreateInFolder}
                        />
                      ));
                    })()}
                  </div>
                </div>

                {/* Bookmarks Section */}
                <div className={`flex flex-col bg-[#252526] overflow-hidden ${isBookmarksCollapsed ? 'shrink-0' : 'flex-1 min-h-[120px] border-t border-[#2b2b2b]'}`}>
                  <div 
                    onClick={() => setIsBookmarksCollapsed(!isBookmarksCollapsed)}
                    className="pl-2 h-[22px] pr-3 flex items-center justify-between text-[#cccccc] hover:bg-white/[0.04] cursor-pointer group transition-colors border-b border-[#2b2b2b]"
                  >
                    <div className="flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider">
                      {isBookmarksCollapsed ? <ChevronRightIcon size={12} /> : <ChevronDownIcon size={12} />}
                      <span className="select-none leading-none pt-[1px] text-[#bbbbbb] font-inherit">
                        BOOKMARKS 🔖 ({bookmarks.filter(b => b.projectId === activeProjectId).length})
                      </span>
                    </div>
                    {bookmarks.some(b => b.projectId === activeProjectId) && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleClearAllBookmarks(); }}
                        className="p-1 hover:bg-white/10 rounded-[2px] transition-all text-zinc-400 hover:text-[#f87171]"
                        title="Clear All Bookmarks"
                      >
                        <Trash2 size={11} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>

                  {!isBookmarksCollapsed && (
                    <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
                      <div className="px-2 mb-2">
                        <input
                          type="text"
                          placeholder="Search bookmarks..."
                          value={bookmarkSearchTerm}
                          onChange={(e) => setBookmarkSearchTerm(e.target.value)}
                          className="w-full bg-[#3c3c3c] text-[11px] text-white px-2 py-1 rounded-[2px] border border-transparent focus:border-blue-500 focus:outline-none font-inherit"
                        />
                      </div>
                      {(() => {
                        const projectBookmarks = bookmarks.filter(b => b.projectId === activeProjectId);
                        const filteredBookmarks = projectBookmarks.filter(b => 
                           b.filename.toLowerCase().includes(bookmarkSearchTerm.toLowerCase()) ||
                           b.lineContent.toLowerCase().includes(bookmarkSearchTerm.toLowerCase())
                        );

                        if (filteredBookmarks.length === 0) {
                          return (
                            <div className="px-4 py-3 text-[11px] text-[#858585] text-center font-inherit">
                              {projectBookmarks.length === 0 ? "No bookmarks in this project." : "No matching bookmarks found."}
                            </div>
                          );
                        }

                        // Group bookmarks by file path
                        const groups: Record<string, Bookmark[]> = {};
                        filteredBookmarks.forEach(b => {
                          if (!groups[b.filename]) groups[b.filename] = [];
                          groups[b.filename].push(b);
                        });

                        return Object.entries(groups).map(([filename, fileBookmarks]) => (
                          <div key={filename} className="mb-2">
                            <div 
                              onClick={() => handleFileOpen(filename)}
                              className="px-3 py-1 flex items-center gap-1.5 hover:bg-white/[0.02] cursor-pointer"
                            >
                              <span className="text-[11px] text-[#cccccc] font-inherit font-medium truncate flex-1 flex items-center gap-1.5">
                                <span className="text-zinc-500 font-mono">📂</span>
                                {filename.split('/').pop()}
                              </span>
                              <span className="text-[9px] px-1 bg-white/5 text-zinc-400 rounded-full font-inherit">
                                {fileBookmarks.length}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              {fileBookmarks.sort((a,b) => a.lineNumber - b.lineNumber).map(b => (
                                <div 
                                  key={b.id}
                                  onClick={() => handleGoToBookmark(filename, b.lineNumber)}
                                  className="pl-6 pr-3 py-1 flex items-center justify-between text-[11px] font-mono text-zinc-400 hover:text-white hover:bg-white/[0.04] cursor-pointer group/item select-none"
                                >
                                  <span className="truncate flex-1 flex items-center gap-2">
                                    <span className="text-[#FFD700] text-[9px]">Line {b.lineNumber}:</span>
                                    <span className="text-[#bbbbbb] truncate text-[10px]">{b.lineContent}</span>
                                  </span>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      handleToggleBookmark(b.filename, b.lineNumber, ''); 
                                    }}
                                    className="p-0.5 opacity-0 group-hover/item:opacity-100 hover:bg-white/10 rounded text-zinc-400 hover:text-red-400 transition-all ml-1 shrink-0"
                                    title="Delete bookmark"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* Explorer Overlay Backdrop for Mobile */}
              {isExplorerOpen && (
                <div 
                  onClick={() => setIsExplorerOpen(false)}
                  className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300"
                />
              )}

              {/* Explorer Resizer Handle */}
              {isExplorerOpen && !isEditorFullscreen && (
                <div 
                  onMouseDown={startResizingExplorer}
                  onTouchStart={startResizingExplorer}
                  className={`hidden w-4 -mx-2 bg-transparent cursor-col-resize transition-all z-20 relative group ${isResizingExplorer ? 'bg-accent/5' : ''} touch-none`}
                  title="Drag to resize explorer"
                >
                  <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/5 group-hover:bg-accent/40 transition-colors ${isResizingExplorer ? 'bg-accent/60' : ''}`} />
                  
                  {/* Fullscreen Toggle Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsEditorFullscreen(true); }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sidebar border border-[#454545] text-zinc-400 hover:text-white hover:border-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-30"
                    title="Fullscreen Editor"
                  >
                    <Maximize2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {isEditorFullscreen && (
                <button 
                  onClick={() => setIsEditorFullscreen(false)}
                  className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-accent text-white shadow-[0_8px_30px_rgb(0,120,212,0.4)] flex items-center justify-center z-[100] animate-in zoom-in-50 duration-300 hover:scale-110 active:bg-blue-700"
                  title="Exit Fullscreen"
                >
                  <ArrowLeftToLine size={20} strokeWidth={2.5} className="rotate-180" />
                </button>
              )}

              {/* Main Editor Area */}
              <div id="main-editor-container" className={`flex-1 flex overflow-hidden bg-background relative ${isLandscape ? 'flex-row' : 'flex-col'}`}>
                {isEditorFullscreen && (
                  <button 
                    onClick={() => setIsEditorFullscreen(false)}
                    className="absolute top-4 right-4 z-[100] p-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-zinc-400 hover:text-white rounded border border-white/10 transition-all active:bg-white/10 shadow-2xl group"
                    title="Exit Fullscreen"
                  >
                    <Minimize2 size={16} />
                  </button>
                )}
                
                {editorPanes.length === 0 ? (
                  <div className="flex-1 flex flex-col items-start justify-center bg-background p-16 absolute inset-0 z-20 overflow-y-auto custom-scrollbar font-opensans">
                    {/* PWA Install Button on Landing Page */}
                    <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
                      {isInstallable && (
                        <button 
                          onClick={handleInstallClick}
                          className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full border border-accent/30 transition-all active:bg-accent/20 group animate-in slide-in-from-right-4 duration-500"
                        >
                          <Download size={16} className="group-hover:bounce" />
                          <span className="text-xs font-bold uppercase tracking-wider">Install App</span>
                        </button>
                      )}
                    </div>

                    <div className="w-full max-w-4xl mx-auto">
                      <div className="flex flex-col items-start gap-4 mb-10 select-none">
                        <div className="flex flex-col items-start">
                          <h1 className="text-4xl font-light text-[#cccccc] tracking-tight mb-2">ReversX</h1>
                          <p className="text-[#858585] text-sm font-normal">Code at the speed of thought.</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start gap-6">
                        <div className="flex flex-col items-start gap-3">
                          <h2 className="text-[#cccccc] text-lg font-normal mb-1">Start</h2>
                          <button 
                            onClick={() => {
                              if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
                                setAndroidImportTarget('welcome');
                                setShowAndroidImportModal(true);
                              } else {
                                folderInputRef.current?.click();
                              }
                            }}
                            className="flex items-center gap-2 text-[#007acc] hover:underline text-[13px] transition-colors"
                          >
                            <FolderOpen size={16} />
                            <span>Open Folder...</span>
                          </button>
                          <button 
                            onClick={() => handleGithubImport()}
                            className="flex items-center gap-2 text-[#007acc] hover:underline text-[13px] transition-colors"
                          >
                            <Github size={16} />
                            <span>Clone Repository...</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cursor-like Chat Box (Dummy) */}
                    <div className="mt-20 w-full max-w-[500px] px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                      <div className="flex items-center justify-end mb-2 px-1">
                        <button className="text-white/20 hover:text-white/40 transition-colors">
                          <Info size={12} />
                        </button>
                      </div>
                      <div className="bg-background border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all hover:border-white/20 focus-within:border-[#007acc] focus-within:ring-1 focus-within:ring-[#007acc]/50 group relative">
                        <div className="p-4">
                          {welcomeChatFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {welcomeChatFiles.map((file, i) => (
                                <div key={i} className="relative group/file w-14 h-14 rounded-md border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center animate-in zoom-in-75 duration-200">
                                  {file.url ? (
                                    <img src={file.url} className="w-full h-full object-cover" alt="" />
                                  ) : (
                                    <File size={16} className="text-white/40" />
                                  )}
                                  <button 
                                    onClick={() => setWelcomeChatFiles(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity hover:bg-red-500"
                                  >
                                    <X size={10} />
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 py-0.5 px-1 bg-black/40 backdrop-blur-sm">
                                    <p className="text-[8px] text-white/60 truncate whitespace-nowrap">{file.name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0">
                              <textarea 
                                ref={welcomeChatRef}
                                placeholder="Ask ReversX"
                                className="w-full bg-transparent border-none resize-none text-[13px] text-white/90 placeholder-white/30 focus:outline-none min-h-[70px] max-h-[150px] py-1 cursor-text custom-scrollbar transition-all overflow-y-auto"
                                value={welcomeChatInput}
                                onChange={(e) => {
                                  setWelcomeChatInput(e.target.value);
                                  if (welcomeChatRef.current) {
                                    welcomeChatRef.current.style.height = 'auto';
                                    welcomeChatRef.current.style.height = `${Math.min(welcomeChatRef.current.scrollHeight, 150)}px`;
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => welcomeChatFileInputRef.current?.click()}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 text-[11px] text-white/40 transition-colors cursor-pointer"
                            >
                              <Plus size={14} />
                              <span className="font-medium">Context</span>
                            </button>
                            <div className="h-3 w-[1px] bg-white/10 mx-0.5" />
                            <div className="relative">
                              <button 
                                onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all cursor-pointer ${
                                  isAgentDropdownOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/40 hover:text-white/60'
                                }`}
                              >
                                <Drone size={12} className={isAgentDropdownOpen ? 'text-blue-400' : ''} />
                                <span className="text-[11px] font-medium">{selectedAgent}</span>
                                <ChevronDown size={10} className={`transition-transform duration-300 ${isAgentDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>
                              
                              <React.Fragment>
                                {isAgentDropdownOpen && (
                                  <div
                                    
                                    
                                    
                                    className="absolute bottom-full left-0 mb-2 w-32 bg-sidebar border border-[#454545] rounded shadow-xl overflow-hidden z-[100]"
                                  >
                                    <div className="p-1 space-y-0.5">
                                      {['Agent v1', 'Chat', 'Research'].map((agent) => (
                                        <button
                                          key={agent}
                                          onClick={() => {
                                            setSelectedAgent(agent);
                                            setIsAgentDropdownOpen(false);
                                          }}
                                          className={`w-full px-2.5 py-1.5 text-left text-[11px] rounded transition-colors flex items-center justify-between group active:bg-white/5 ${
                                            selectedAgent === agent 
                                              ? 'bg-[#37373d] text-white' 
                                              : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
                                          }`}
                                        >
                                          <span>{agent}</span>
                                          {selectedAgent === agent && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </React.Fragment>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => toggleVoiceInput()}
                               className={`h-7 w-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-white/40 hover:bg-white/10 active:bg-white/10'}`}
                             >
                               <Mic size={14} />
                             </button>
                             <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                                <span className="text-[9px] text-white/30 font-bold">⌘ K</span>
                             </div>
                             <button 
                               onClick={() => {
                                 if (!welcomeChatInput.trim() && welcomeChatFiles.length === 0) return;
                                 setInput(welcomeChatInput);
                                 setPendingAttachments(welcomeChatFiles.map(f => ({
                                   name: f.name,
                                   type: f.type,
                                   content: f.url || ''
                                 })));
                                 setWelcomeChatInput('');
                                 setWelcomeChatFiles([]);
                                 setMobileView('chat');
                                 handleSend();
                               }}
                               className="h-7 w-7 flex items-center justify-center rounded-md bg-white/10 text-white transition-all hover:scale-105 active:bg-white/20 cursor-pointer"
                             >
                               <ArrowUp size={16} strokeWidth={2.5} />
                             </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Keyboard shortcuts hints */}
                      <div className="mt-4 flex items-center justify-center gap-6 opacity-30 select-none">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center text-[9px] font-bold">L</div>
                          <span className="text-[10px] uppercase tracking-widest">Search</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center text-[9px] font-bold">K</div>
                          <span className="text-[10px] uppercase tracking-widest">Chat</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center text-[9px] font-bold">I</div>
                          <span className="text-[10px] uppercase tracking-widest">Edit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="flex-1 flex flex-row overflow-hidden border-r border-[#2b2b2b]">
                  {editorPanes.map((paneFile, idx) => (
                    <React.Fragment key={`${idx}-${paneFile}`}>
                      <div 
                        className={`flex flex-col overflow-hidden relative z-10 transition-shadow ${focusedPaneIndex === idx ? 'ring-1 ring-accent/30 shadow-[0_0_20px_rgba(0,255,65,0.05)]' : ''}`}
                        style={{ width: `${paneWidths[idx]}%` }}
                        onClickCapture={() => setFocusedPaneIndex(idx)}
                      >
                        <MemoizedCodeEditor 
                          code={files[paneFile]?.code || ''} 
                          language={files[paneFile]?.language || 'text'} 
                          filename={paneFile}
                          allFiles={files}
                          activeFiles={openFiles}
                          onFileSelect={(name) => setPaneFile(idx, name)}
                          onCreateFilesDirectly={handleCreateFilesDirectly}
                          onCloseFile={(name) => {
                            if (editorPanes.length > 1) {
                              handleClosePane(idx);
                            } else {
                              handleFileClose(name);
                            }
                          }}
                          fontSize={editorFontSize}
                          lineHeight={editorLineHeight}
                          fontFamily={editorFontFamily}
                          splitScreen={isSplitScreen && editorPanes.length === 1}
                          isSplitPane={editorPanes.length > 1}
                          onToggleSplit={handleSplit}
                          onClosePane={() => handleClosePane(idx)}
                          editorThemeName={editorThemeName}
                          onChange={(val) => handleCodeChange(val, paneFile)}
                          onSaveToLocal={handleSaveToLocal}
                          onPlay={() => { setPreviewFiles(files); setShowPreview(true); setMobileView('preview'); }}
                          onShowPreview={(show) => { setShowPreview(show); setMobileView(show ? 'preview' : 'editor'); }}
                          onShowSettings={() => { setMobileView('chat'); setActiveTab('settings'); }}
                          onBackToChat={() => setMobileView('chat')}
                          onMenuClick={() => setIsExplorerOpen(prev => !prev)}
                          onCreateFile={handleCreateFile}
                          onRenameFile={handleRenameFile}
                          onDeleteFile={handleDeleteFile}
                          getPlatformConfig={getPlatformConfig}
                          appThemeName={appThemeName}
                          onShowHelp={() => setShowHelpModal(true)}
                          onShowQuickOpen={() => setShowQuickOpen(true)}
                          onShowCommandPalette={() => setShowCommandPalette(true)}
                          onShowShortcuts={() => setShowShortcutsModal(true)}
                          onSetActiveTab={(tab: any) => setActiveTab(tab)}
                          onSetMobileView={(view: any) => setMobileView(view)}
                          activeFile={activeFile}
                          setShowSnippetEditor={setShowSnippetEditor}
                          onSetActiveEditor={(editor: any) => activeEditorRef.current = editor}
                          onSaveSelectedAsSnippet={handleSaveSelectedAsSnippet}
                          onCreateNewProject={createNewProject}
                          onOpenFull={() => setIsEditorFullscreen(true)}
                          isLandscape={isLandscape}
                          syntaxThemeName={syntaxThemeName}
                          isZenMode={isZenMode}
                          setIsZenMode={setIsZenMode}
                          bookmarks={bookmarks}
                          onToggleBookmark={handleToggleBookmark}
                        />
                      </div>
                      
                      {idx < editorPanes.length - 1 && (
                        <div 
                          onMouseDown={() => startResizingPane(idx)}
                          onTouchStart={() => startResizingPane(idx)}
                          className={`flex w-4 bg-transparent cursor-col-resize transition-all z-20 items-center justify-center group -mx-2 touch-none ${isResizingPane === idx ? 'bg-accent/5' : ''}`}
                          title="Drag to resize panes"
                        >
                          <div className={`h-full transition-all duration-150 ${isResizingPane === idx ? 'w-[2px] bg-[#007acc] shadow-[0_0_12px_rgba(0,122,204,0.6)]' : 'w-[1px] bg-background group-hover:bg-[#007acc]/40'}`} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                )}

                {isSplitScreen && editorPanes.length === 1 && (
                  <div className="hidden flex-[0.8] flex-col bg-background border-l border-border relative text-foreground">
                    <div className="h-11 bg-background border-b border-border flex items-center px-4 justify-between shrink-0">
                      <span className="text-[10px] tracking-widest text-foreground-subtle font-bold">Split Preview</span>
                      <button 
                        onClick={() => setIsSplitScreen(false)}
                        className="text-foreground-subtle hover:text-foreground transition-colors"
                      >
                        <Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                    {isMarkdownFile ? (
                      <div className="flex-1 w-full overflow-hidden flex flex-col">
                        <React.Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-500">Loading Markdown...</div>}>
                          <MarkdownPreview
                            code={files[activeFile]?.code || ''}
                            appThemeName={appThemeName}
                            setAppThemeName={setAppThemeName}
                          />
                        </React.Suspense>
                      </div>
                    ) : (
                      <iframe
                        title="Split Preview"
                        srcDoc={combinedHtml}
                        className="flex-1 w-full border-none bg-white"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`h-full w-full relative md:pt-0 pt-10 flex flex-col items-center transition-all duration-500 ${previewDevice !== 'desktop' ? 'bg-[#121212] p-8 overflow-auto' : 'bg-white'} custom-scrollbar`}>
              <div className={`relative transition-all duration-500 shadow-2xl overflow-hidden shrink-0 flex flex-col items-center ${previewDevice === 'desktop' ? '' : 'my-auto'}`} style={{
                width: previewDevice === 'mobile' ? '375px' : previewDevice === 'laptop' ? '1024px' : '100%',
                height: previewDevice === 'mobile' ? '667px' : previewDevice === 'laptop' ? '640px' : '100%',
                maxWidth: previewDevice === 'desktop' ? '100%' : '95%',
                maxHeight: previewDevice === 'desktop' ? '100%' : 'calc(100% - 20px)',
                borderRadius: previewDevice === 'mobile' ? '40px' : previewDevice === 'laptop' ? '12px' : '0px',
                border: previewDevice === 'mobile' ? '12px solid #222' : previewDevice === 'laptop' ? '8px solid #333' : 'none',
                backgroundColor: 'white'
              }}>
                {previewDevice === 'mobile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-2xl z-10 flex items-center justify-center">
                    <div className="w-12 h-1 bg-white/10 rounded-full" />
                  </div>
                )}
                {isMarkdownFile ? (
                  <div className="w-full h-full overflow-hidden flex flex-col">
                    <React.Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-500">Loading Markdown...</div>}>
                      <MarkdownPreview
                        code={files[activeFile]?.code || ''}
                        appThemeName={appThemeName}
                        setAppThemeName={setAppThemeName}
                      />
                    </React.Suspense>
                  </div>
                ) : (
                  <iframe
                    title="ReversX Preview"
                    srcDoc={combinedHtml}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                  />
                )}
              </div>

              {previewDevice === 'laptop' && (
                <div className="w-full max-w-[1040px] h-3 bg-[#444] rounded-b-2xl border-t border-white/10 shadow-xl shrink-0 -mt-2 z-10 hidden lg:block" />
              )}
                 {/* Floating Action Controls in Preview */}
              <div className="absolute top-2 left-4 right-4 flex items-center justify-center gap-6 px-4 py-0.5 bg-sidebar border border-[#3c3c3c] shadow-lg z-[60] rounded-none">
                <div className="relative">
                  <button 
                    onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                    className="h-5.5 w-5.5 flex items-center justify-center text-[#cccccc] hover:text-white hover:bg-[#37373d] rounded-none transition-all group"
                    title="Devices"
                  >
                    <MonitorSmartphone size={11} className="text-[#cccccc] group-hover:text-white group-hover:scale-110 transition-transform" />
                  </button>
                  
                  <React.Fragment>
                    {showDeviceMenu && (
                      <div key="device-menu">
                        <div 
                           className="fixed inset-0 z-[65]" 
                          onClick={() => setShowDeviceMenu(false)}
                        />
                        <div
                          
                          
                          
                          className="absolute top-full mt-1 right-0 bg-sidebar border border-[#3c3c3c] rounded-none shadow-2xl overflow-hidden py-1 z-[70] min-w-[110px]"
                        >
                          {[
                            { id: 'mobile', label: 'Mobile', icon: Smartphone },
                            { id: 'laptop', label: 'Laptop', icon: Laptop },
                            { id: 'desktop', label: 'Desktop', icon: Monitor }
                          ].map((device) => (
                            <button
                              key={device.id}
                              onClick={() => {
                                setPreviewDevice(device.id as any);
                                setShowDeviceMenu(false);
                              }}
                              className={`w-full px-3 py-1.5 text-left flex items-center gap-2 transition-all rounded-none ${
                                previewDevice === device.id 
                                  ? 'text-white bg-[#007acc] font-semibold' 
                                  : 'text-[#cccccc] hover:text-white hover:bg-[#37373d]'
                              }`}
                            >
                              <device.icon size={11} />
                              <span className="text-[10px] tracking-wide">{device.label}</span>
                              {previewDevice === device.id && <div className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                </div>

                <button 
                  onClick={() => { setShowPreview(false); setMobileView('editor'); }}
                  className="h-5.5 w-5.5 flex items-center justify-center text-[#cccccc] hover:text-white hover:bg-[#37373d] rounded-none transition-all"
                  title="Back to Code"
                >
                  <ArrowLeftToLine size={11} />
                </button>
                <button 
                  onClick={() => setPreviewFiles({...files})}
                  className="h-5.5 w-5.5 flex items-center justify-center text-[#cccccc] hover:text-white hover:bg-[#37373d] rounded-none transition-all"
                  title="Refresh"
                >
                  <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                  <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
                  <div className="text-accent font-normal tracking-[0.2em] text-xs animate-pulse">
                    Loading assets...
                  </div>
                  <div className="text-white/40 text-[12px] mt-2 font-roboto">
                    Waiting for HTML, CSS, and JS to complete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`h-11 border-t border-border bg-sidebar flex items-center justify-between px-8 z-50 ${mobileView === 'chat' ? 'border-t-0' : ''}`}>
        <button 
          onClick={() => {
            const currentIndex = enabledMobileTabs.indexOf(showSettingsMenu ? 'settings' : (mobileView === 'preview' ? 'preview' : 'editor'));
            if (currentIndex !== -1) {
              const prevIndex = (currentIndex - 1 + enabledMobileTabs.length) % enabledMobileTabs.length;
              const prevTab = enabledMobileTabs[prevIndex];
              if (prevTab === 'editor') {
                setMobileView('editor');
                setShowSettingsMenu(false);
              } else if (prevTab === 'preview') {
                setMobileView('preview');
                setPreviewFiles(files);
                setShowPreview(true);
                setShowSettingsMenu(false);
              } else if (prevTab === 'settings') {
                setShowSettingsMenu(true);
              }
            }
          }}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all shrink-0"
          title="Previous Tab"
        >
          <ChevronLeft size={16} />
        </button>

        {enabledMobileTabs.includes('editor') && (
          <button 
            onClick={() => setMobileView('editor')}
            onMouseDown={(e) => handleLongPressStart('Code Editor', e)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={(e) => handleLongPressStart('Code Editor', e)}
            onTouchEnd={handleLongPressEnd}
            className={`flex flex-col items-center justify-center min-w-[32px] h-full transition-all ${mobileView === 'editor' ? 'text-white border-b-2 border-white' : 'text-foreground/75 opacity-60'}`}
          >
            <Code size={14} strokeWidth={mobileView === 'editor' ? 2.5 : 1.5} />
          </button>
        )}
        
        {enabledMobileTabs.includes('preview') && (files[activeFile]?.language === 'html' || true) && (
          <button 
            onClick={() => { setMobileView('preview'); setPreviewFiles(files); setShowPreview(true); }}
            onMouseDown={(e) => handleLongPressStart('App Preview', e)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={(e) => handleLongPressStart('App Preview', e)}
            onTouchEnd={handleLongPressEnd}
            className={`flex flex-col items-center justify-center min-w-[32px] h-full transition-all ${mobileView === 'preview' ? 'text-white border-b-2 border-white' : 'text-foreground/75 opacity-60'}`}
          >
            <Play size={14} strokeWidth={mobileView === 'preview' ? 2.5 : 1.5} />
          </button>
        )}


        {enabledMobileTabs.includes('explorer') && (
          <button 
            onClick={() => { setIsExplorerOpen(true); }}
            onMouseDown={(e) => handleLongPressStart('File Explorer', e)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={(e) => handleLongPressStart('File Explorer', e)}
            onTouchEnd={handleLongPressEnd}
            className={`flex flex-col items-center justify-center min-w-[32px] h-full transition-all ${isExplorerOpen ? 'text-white border-b-2 border-white' : 'text-foreground/75 opacity-60'}`}
          >
            <Files size={14} strokeWidth={isExplorerOpen ? 2.5 : 1.5} />
          </button>
        )}

        {enabledMobileTabs.includes('settings') && (
          <button 
            onClick={() => { setShowSettingsMenu(!showSettingsMenu); }}
            onMouseDown={(e) => handleLongPressStart('Settings', e)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={(e) => handleLongPressStart('Settings', e)}
            onTouchEnd={handleLongPressEnd}
            className={`flex flex-col items-center justify-center min-w-[32px] h-full transition-all ${showSettingsMenu ? 'text-white border-b-2 border-white' : 'text-foreground/75 opacity-60'}`}
          >
            <Settings size={14} strokeWidth={showSettingsMenu ? 2.5 : 1.5} />
          </button>
        )}

        <button 
          onClick={() => {
            const currentIndex = enabledMobileTabs.indexOf(showSettingsMenu ? 'settings' : (mobileView === 'preview' ? 'preview' : 'editor'));
            if (currentIndex !== -1) {
              const nextIndex = (currentIndex + 1) % enabledMobileTabs.length;
              const nextTab = enabledMobileTabs[nextIndex];
              if (nextTab === 'editor') {
                setMobileView('editor');
                setShowSettingsMenu(false);
              } else if (nextTab === 'preview') {
                setMobileView('preview');
                setPreviewFiles(files);
                setShowPreview(true);
                setShowSettingsMenu(false);
              } else if (nextTab === 'settings') {
                setShowSettingsMenu(true);
              }
            }
          }}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all shrink-0"
          title="Next Tab"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <React.Fragment>
        {activeTooltip && (
          <div 
            
            
            
            className="fixed z-[100] bg-sidebar text-[#ffffff] px-4 py-2 rounded-lg text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap border border-white/10"
            style={{ 
              left: Math.max(10, Math.min(window.innerWidth - 120, activeTooltip.x - 50)),
              top: activeTooltip.y - 20 
            }}
          >
            {activeTooltip.text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1a1a1a]" />
          </div>
        )}
      </React.Fragment>


      {/* Modals are handled inline in VS Code style */}
      {/* GitHub Export Modal */}
      <SettingsModal 
        isOpen={showSettingsMenu}
        onClose={() => setShowSettingsMenu(false)}
        appThemeName={appThemeName}
        setAppThemeName={setAppThemeName}
        iconThemeName={iconThemeName}
        setIconThemeName={setIconThemeName}
        editorFontFamily={editorFontFamily}
        setEditorFontFamily={setEditorFontFamily}
        editorFontSize={editorFontSize}
        setEditorFontSize={setEditorFontSize}
        editorLineHeight={editorLineHeight}
        setEditorLineHeight={setEditorLineHeight}
        syntaxThemeName={syntaxThemeName}
        setSyntaxThemeName={setSyntaxThemeName}
        isInstallable={isInstallable}
        handleInstallClick={handleInstallClick}
        appFontName={appFontName}
        setAppFontName={setAppFontName}
      />

      <GithubExportModal 
        isOpen={isGithubExportOpen}
        onClose={() => setIsGithubExportOpen(false)}
        githubToken={githubToken}
        setGithubToken={setGithubToken}
        githubExportRepo={githubExportRepo}
        setGithubExportRepo={setGithubExportRepo}
        githubBranch={githubBranch}
        setGithubBranch={setGithubBranch}
        githubCommitMessage={githubCommitMessage}
        setGithubCommitMessage={setGithubCommitMessage}
        handleGithubLogin={handleGithubLogin}
        confirmGithubExport={confirmGithubExport}
        isGitHubExporting={isGitHubExporting}
      />

      <GithubImportModal 
        isOpen={isGithubImportOpen}
        onClose={() => setIsGithubImportOpen(false)}
        githubRepoUrl={githubRepoUrl}
        setGithubRepoUrl={setGithubRepoUrl}
        githubBranch={githubBranch}
        setGithubBranch={setGithubBranch}
        confirmGithubImport={confirmGithubImport}
        isGitHubImporting={isGitHubImporting}
      />

      {showAndroidImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#333333] shadow-2xl w-full max-w-md overflow-hidden text-[#cccccc] rounded-lg">
            {/* Header */}
            <div className="px-4 py-3 bg-[#252526] border-b border-[#333333] flex items-center justify-between">
              <span className="font-bold text-[13px] text-[#ffffff] tracking-wide uppercase">Import Project on Android</span>
              <button 
                onClick={() => setShowAndroidImportModal(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-5 flex flex-col gap-4 text-[12.5px] leading-relaxed">
              <p className="text-[#858585]">
                Android restricts opening raw directories directly in the WebView. Choose one of the secure ways below to load your project:
              </p>
              
              <div className="flex flex-col gap-3">
                {/* Option 1: ZIP File (Recommended) */}
                <button 
                  onClick={() => {
                    setShowAndroidImportModal(false);
                    zipInputRef.current?.click();
                  }}
                  className="w-full p-4 border border-[#007acc]/40 hover:border-[#007acc] bg-[#007acc]/5 hover:bg-[#007acc]/10 text-left transition-all flex items-start gap-3 group rounded"
                >
                  <div className="p-2 bg-[#007acc]/20 rounded group-hover:bg-[#007acc]/30 text-[#007acc] transition-colors mt-0.5">
                    <Blocks size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ffffff] mb-0.5">Import ZIP File (Highly Recommended)</h4>
                    <p className="text-[11.5px] text-[#858585] group-hover:text-[#cccccc] transition-colors">
                      Select a `.zip` file of your project. It extracts automatically and preserves your full folder structure perfectly.
                    </p>
                  </div>
                </button>

                {/* Option 2: Multiple Files */}
                <button 
                  onClick={() => {
                    setShowAndroidImportModal(false);
                    explorerFileInputRef.current?.click();
                  }}
                  className="w-full p-4 border border-[#333333] hover:border-zinc-500 bg-white/5 hover:bg-white/10 text-left transition-all flex items-start gap-3 group rounded"
                >
                  <div className="p-2 bg-white/5 rounded group-hover:bg-white/10 text-zinc-300 transition-colors mt-0.5">
                    <FilePlus size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ffffff] mb-0.5">Select Multiple Files</h4>
                    <p className="text-[11.5px] text-[#858585] group-hover:text-[#cccccc] transition-colors">
                      Select one or multiple source code files to import directly into your workspace.
                    </p>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-[#252526] border-t border-[#333333] flex justify-end">
              <button 
                onClick={() => setShowAndroidImportModal(false)}
                className="px-4 py-1.5 bg-[#333333] hover:bg-[#454545] text-white text-[12px] font-medium transition-colors rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folders creation handled inline */}

      <DeleteFileModal 
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setFileToDelete(''); }}
        fileToDelete={fileToDelete}
        confirmDeleteFile={confirmDeleteFile}
      />

      <HelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <RenameFileModal 
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        renameNewName={renameNewName}
        setRenameNewName={setRenameNewName}
        confirmRenameFile={confirmRenameFile}
      />
      <React.Fragment>
        {showQuickOpen && (
          <QuickOpenModal 
            key="quick-open"
            files={Object.keys(files)} 
            onClose={() => setShowQuickOpen(false)} 
            onSelect={(name) => { setActiveFile(name); setShowQuickOpen(false); }} 
          />
        )}
        {showCommandPalette && (
          <CommandPaletteModal 
            key="command-palette"
            onClose={() => setShowCommandPalette(false)} 
            actions={[
              { label: 'Save File', shortcut: 'Ctrl+S', action: handleSaveToLocal },
              { label: 'New File', shortcut: 'Ctrl+N', action: handleCreateFile },
              { label: 'New Folder', shortcut: '', action: handleCreateFolder },
              { label: 'Settings', shortcut: 'Ctrl+,', action: () => { setMobileView('chat'); setActiveTab('settings'); } },
              { label: 'Search in all files', shortcut: 'Ctrl+Shift+F', action: () => { setIsExplorerOpen(true); } },
              { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+Shift+K', action: () => setShowShortcutsModal(true) },
              { label: 'Toggle Sidebar', action: () => setIsSidebarMinimized(prev => !prev) },
              { label: 'Toggle Explorer', action: () => setIsExplorerOpen(prev => !prev) },
              { label: 'Open Preview', action: () => { setPreviewFiles(files); setShowPreview(true); setMobileView('preview'); } },
              { label: 'Save Selection as Snippet', shortcut: 'Ctrl+Shift+S', action: handleSaveSelectedAsSnippet },
              { label: 'Close All Tabs', action: () => { setOpenFiles([]); setActiveFile(''); } },
            ]}
          />
        )}
        {showShortcutsModal && (
          <ShortcutsModal key="shortcuts" onClose={() => setShowShortcutsModal(false)} />
        )}
        <ShortcutsCheatSheet 
          isOpen={showShortcutsCheatSheet} 
          onClose={() => setShowShortcutsCheatSheet(false)} 
        />
      </React.Fragment>
      </div>
      </FileIconSizeContext.Provider>
    </IconContext.Provider>
  );
}
