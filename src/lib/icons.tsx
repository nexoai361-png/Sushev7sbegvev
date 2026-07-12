import React from 'react';
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
  Plus,
  Copy,
  Check,
  Trash2,
  Edit3,
  Undo2,
  Redo2,
  ClipboardPaste,
  History,
  Save,
  RefreshCw,
  Maximize2,
  FolderOpen,
  ArrowUp,
  Wand2,
  Sparkles,
  Hash,
  Bug,
  FileText,
  Loader2,
  Users,
  Activity,
  Cpu,
  Zap,
  Box,
  Paperclip,
  HelpCircle,
  Image as ImageIcon,
  FileCode,
  FileJson,
  File,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  MoreVertical,
  Palette,
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
  FolderClosed,
  ArrowUpCircle,
  Wand,
  Sparkle,
  BugPlay,
  FileCode2,
  FileJson2,
  MoreHorizontal,
  Code2,
  CheckCircle2,
  Grid3X3,
  ShieldCheck,
  X,
  Bell,
  GitBranch,
  Key,
  Lock,
  CheckCheck,
  Mic,
  Square,
  Pause,
  Video,
  Download
} from 'lucide-react';

export const Codicon = ({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) => (
  <i 
    className={`codicon codicon-${name} ${className}`} 
    style={{ 
      fontSize: size, 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: size,
      height: size,
      verticalAlign: 'middle'
    }} 
  />
);

export const MaterialIcon = ({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={{ 
      fontSize: size, 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: size,
      height: size,
      verticalAlign: 'middle'
    }}
  >
    {name}
  </span>
);

const GOOGLE_ICON_MAP: Record<string, string> = {
  MessageSquare: 'chat',
  Code: 'code',
  Settings: 'settings',
  Files: 'folder',
  Play: 'play_arrow',
  ChevronRight: 'chevron_right',
  ChevronLeft: 'chevron_left',
  ChevronDown: 'expand_more',
  ChevronUp: 'expand_less',
  Send: 'send',
  User: 'person',
  Terminal: 'terminal',
  Search: 'search',
  Plus: 'add',
  Copy: 'content_copy',
  Check: 'check',
  Trash2: 'delete',
  Edit3: 'edit',
  Undo2: 'undo',
  Redo2: 'redo',
  ClipboardPaste: 'content_paste',
  History: 'history',
  Save: 'save',
  RefreshCw: 'refresh',
  Maximize2: 'fullscreen',
  FolderOpen: 'folder_open',
  ArrowUp: 'arrow_upward',
  Wand2: 'auto_fix_high',
  Sparkles: 'auto_awesome',
  Hash: 'tag',
  Bug: 'bug_report',
  FileText: 'description',
  Loader2: 'progress_activity',
  Users: 'group',
  Paperclip: 'attachment',
  HelpCircle: 'help',
  ImageIcon: 'image',
  FileCode: 'source',
  FileJson: 'data_object',
  File: 'draft',
  MoreVertical: 'more_vert',
  Palette: 'palette',
  Cog: 'settings',
  SearchCode: 'search_check',
  Users2: 'group_add',
  SquareTerminal: 'terminal',
  PlusSquare: 'add_box',
  Trash: 'delete',
  Edit: 'edit',
  CheckCircle: 'check_circle',
  SaveAll: 'save_as',
  RefreshCcw: 'refresh',
  Maximize: 'fullscreen',
  FolderClosed: 'folder',
  ArrowUpCircle: 'arrow_circle_up',
  Wand: 'magic_button',
  Sparkle: 'spark',
  BugPlay: 'bug_report',
  FileCode2: 'file_code',
  FileJson2: 'description',
  MoreHorizontal: 'more_horiz',
  Grid3X3: 'grid_view',
  ShieldCheck: 'verified_user',
  X: 'close',
  Bell: 'notifications',
  GitBranch: 'account_tree',
  Key: 'key',
  Lock: 'lock',
  CheckCheck: 'done_all',
  Mic: 'mic',
  Square: 'square',
  Pause: 'pause',
  Video: 'videocam',
  Download: 'download'
};

const GoogleTheme: Record<string, any> = {};
Object.entries(GOOGLE_ICON_MAP).forEach(([key, name]) => {
  GoogleTheme[key] = (props: any) => <MaterialIcon name={name} {...props} />;
});

export const ICON_THEMES: Record<string, any> = {
  'VS code': {
    MessageSquare, Code, Settings, Files, Play, ChevronRight, ChevronLeft, ChevronDown,
    Send, User, Terminal, Search, Plus, Copy, Check, Trash2, Edit3, Undo2, Redo2,
    ClipboardPaste, History, Save, RefreshCw, Maximize2, FolderOpen, ArrowUp, Wand2,
    Sparkles, Hash, Bug, FileText, Loader2, Users, Activity, Cpu, Zap, Box, 
    Paperclip, HelpCircle, ImageIcon, FileCode,
    FileJson, File, MoreVertical, ChevronDownIcon, ChevronRightIcon,
    ChevronUp, MoveDown, MoveUp, ArrowLeftToLine, ArrowRightToLine, Menu, Edit, Palette,
    SearchCode, CheckCircle2, CheckCircle, RefreshCcw, Grid3X3, ShieldCheck,
    X, Bell, GitBranch, Key, Lock, CheckCheck, Mic, Square, Pause, Video, Download
  },
  'ReversX v1': {
    MessageSquare: MessageCircle,
    Code: Code2,
    Settings: Cog,
    Files: Folder,
    Play: PlayCircle,
    ChevronRight, ChevronLeft, ChevronDown,
    Send, User: User2, Terminal: SquareTerminal, Search: SearchCode, Plus: PlusSquare,
    Copy, Check: CheckCircle2, Trash2: Trash, Edit3: Edit, Undo2, Redo2,
    ClipboardPaste, History, Save: SaveAll, RefreshCw: RefreshCcw, Maximize2: Maximize,
    FolderOpen: FolderClosed, ArrowUp: ArrowUpCircle, Wand2: Wand,
    Sparkles: Sparkle, Hash, Bug: BugPlay, FileText, Loader2, Users: Users2, 
    Activity, Cpu, Zap, Box, Paperclip, HelpCircle, ImageIcon, FileCode: FileCode2, FileJson: FileJson2, File, MoreVertical: MoreHorizontal,
    ChevronDownIcon: ChevronDown, ChevronRightIcon: ChevronRight,
    ChevronUp, MoveDown, MoveUp, ArrowLeftToLine, ArrowRightToLine, Menu, Edit, Palette,
    X, Bell, GitBranch, Key, Lock, CheckCheck, Mic, Square, Pause, Video, Download
  }
};

export const IconContext = React.createContext('VS code');

export const useIcons = () => {
  const themeName = React.useContext(IconContext);
  const theme = ICON_THEMES[themeName] || ICON_THEMES['VS code'];
  // Merge with Default to ensure no missing icons
  return { ...ICON_THEMES['VS code'], ...theme };
};

