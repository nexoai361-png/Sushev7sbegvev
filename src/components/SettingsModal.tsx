import React, { useState } from 'react';
import { X, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { APP_THEMES } from '../App';
import { ICON_THEMES } from '../lib/icons';
import { SYNTAX_THEMES } from '../utils/editorUtils';
import { SHORTCUT_PRESETS } from './MobileKeyboardToolbar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appThemeName: string;
  setAppThemeName: (theme: string) => void;
  uiStyle: 'default' | 'material';
  setUiStyle: (style: 'default' | 'material') => void;
  iconThemeName: string;
  setIconThemeName: (theme: string) => void;
  editorFontFamily: string;
  setEditorFontFamily: (font: string) => void;
  editorFontSize: number;
  setEditorFontSize: (size: number) => void;
  editorLineHeight: number;
  setEditorLineHeight: (height: number) => void;
  syntaxThemeName: string;
  setSyntaxThemeName: (theme: string) => void;
  isInstallable: boolean;
  handleInstallClick: () => void;
  appFontName: string;
  setAppFontName: (font: string) => void;
  shortcutPresetName: string;
  setShortcutPresetName: (preset: string) => void;
  customSymbolsStr: string;
  setCustomSymbolsStr: (symbols: string) => void;
  fileIconSize: number;
  setFileIconSize: (size: number) => void;
}

const FONT_OPTIONS_MAP: Record<string, string> = {
  'System Font': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  appThemeName,
  setAppThemeName,
  uiStyle,
  setUiStyle,
  iconThemeName,
  setIconThemeName,
  editorFontFamily,
  setEditorFontFamily,
  editorFontSize,
  setEditorFontSize,
  editorLineHeight,
  setEditorLineHeight,
  syntaxThemeName,
  setSyntaxThemeName,
  isInstallable,
  handleInstallClick,
  appFontName,
  setAppFontName,
  shortcutPresetName,
  setShortcutPresetName,
  customSymbolsStr,
  setCustomSymbolsStr,
  fileIconSize,
  setFileIconSize,
}) => {
  const [settingsCategory, setSettingsCategory] = useState<'commonly' | 'appearance' | 'editor' | 'syntax' | 'shortcuts' | 'application'>('commonly');
  const [searchQuery, setSearchQuery] = useState('');

  const commonlyUsedKeys = [
    'workbench.colorTheme',
    'editor.fontFamily',
    'editor.fontSize',
    'window.uiStyle'
  ];

  interface SettingItem {
    id: string;
    title: string;
    keyName: string;
    description: string;
    category: 'appearance' | 'editor' | 'syntax' | 'shortcuts' | 'application';
    render: () => React.ReactNode;
  }

  const allSettings: SettingItem[] = [
    {
      id: 'uiStyle',
      title: 'UI Design Style',
      keyName: 'window.uiStyle',
      description: 'Controls the overall UI aesthetics. Default mode keeps the sharp retro ReversX edges, while Material UI provides smoother, rounded surfaces.',
      category: 'appearance',
      render: () => (
        <select
          value={uiStyle}
          onChange={(e) => setUiStyle(e.target.value as 'default' | 'material')}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          <option value="default">Default (ReversX)</option>
          <option value="material">Material UI</option>
        </select>
      )
    },
    {
      id: 'appTheme',
      title: 'Color Theme',
      keyName: 'workbench.colorTheme',
      description: 'Specifies the active color scheme applied across the sidebar, terminals, and workspace background panels.',
      category: 'appearance',
      render: () => (
        <select
          value={appThemeName}
          onChange={(e) => setAppThemeName(e.target.value)}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          {Object.keys(APP_THEMES).map((themeName) => (
            <option key={themeName} value={themeName}>{themeName}</option>
          ))}
        </select>
      )
    },
    {
      id: 'iconTheme',
      title: 'File Icon Theme',
      keyName: 'workbench.iconTheme',
      description: 'Specifies the layout structure and file-association icons shown in the project Explorer tree.',
      category: 'appearance',
      render: () => (
        <select
          value={iconThemeName}
          onChange={(e) => setIconThemeName(e.target.value)}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          {Object.keys(ICON_THEMES).map((themeName) => (
            <option key={themeName} value={themeName}>{themeName}</option>
          ))}
        </select>
      )
    },
    {
      id: 'systemFont',
      title: 'System Font Family',
      keyName: 'window.systemUiFont',
      description: 'Sets the font family for application workspace panels, menus, and file systems.',
      category: 'appearance',
      render: () => (
        <select
          value={appFontName}
          onChange={(e) => setAppFontName(e.target.value)}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          {Object.keys(FONT_OPTIONS_MAP).map((fontName) => (
            <option key={fontName} value={fontName} style={{ fontFamily: FONT_OPTIONS_MAP[fontName] }}>{fontName}</option>
          ))}
        </select>
      )
    },
    {
      id: 'fileIconSize',
      title: 'File Icon Size',
      keyName: 'workbench.fileIconSize',
      description: 'Controls the width and height dimensions of rendered file and folder indicators.',
      category: 'appearance',
      render: () => (
        <div className="flex items-center gap-3 max-w-md">
          <input 
            type="range" min="10" max="32" value={fileIconSize} 
            onChange={(e) => setFileIconSize(parseInt(e.target.value))}
            className="flex-1 accent-[#007acc] bg-[#2d2d2d] h-1 appearance-none cursor-pointer"
          />
          <input
            type="number" min="10" max="32" value={fileIconSize}
            onChange={(e) => setFileIconSize(Math.max(10, Math.min(32, parseInt(e.target.value) || 16)))}
            className="w-14 h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-white text-[12px] px-2 text-center rounded-[2px] outline-none"
          />
          <span className="text-[11px] text-[#858585]">px</span>
        </div>
      )
    },
    {
      id: 'editorFontFamily',
      title: 'Editor: Font Family',
      keyName: 'editor.fontFamily',
      description: 'Controls the typeface used in code editors, log outputs, and shell buffers.',
      category: 'editor',
      render: () => (
        <select
          value={editorFontFamily}
          onChange={(e) => setEditorFontFamily(e.target.value)}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          {[
            { name: 'VS Code Font', value: 'Consolas, Menlo, Monaco, "Courier New", monospace' },
            { name: 'Consolas', value: 'Consolas, "Liberation Mono", Courier, monospace' },
            { name: 'Courier New', value: '"Courier New", Courier, monospace' },
            { name: 'Cascadia Code', value: '"Cascadia Code", "Segoe UI Mono", monospace' },
            { name: 'Cascadia Mono', value: '"Cascadia Mono", monospace' },
            { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
            { name: 'Fira Code', value: '"Fira Code", monospace' },
            { name: 'Fira Mono', value: '"Fira Mono", monospace' },
            { name: 'Source Code Pro', value: '"Source Code Pro", monospace' },
            { name: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
            { name: 'Hack', value: 'Hack, monospace' },
            { name: 'Inconsolata', value: 'Inconsolata, monospace' },
            { name: 'Ubuntu Mono', value: '"Ubuntu Mono", monospace' },
            { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
            { name: 'SF Mono', value: '"SF Mono", Monaco, "Helvetica Neue", monospace' },
            { name: 'Menlo', value: 'Menlo, Monaco, monospace' },
            { name: 'Monaco', value: 'Monaco, "Courier New", monospace' },
            { name: 'DejaVu Sans Mono', value: '"DejaVu Sans Mono", monospace' },
            { name: 'Liberation Mono', value: '"Liberation Mono", monospace' },
            { name: 'Anonymous Pro', value: '"Anonymous Pro", monospace' },
            { name: 'Dank Mono', value: '"Dank Mono", monospace' },
            { name: 'Input Mono', value: '"Input Mono", monospace' },
            { name: 'Input Sans', value: '"Input Sans", sans-serif' },
            { name: 'Iosevka', value: 'Iosevka, monospace' },
            { name: 'Victor Mono', value: '"Victor Mono", monospace' },
            { name: 'Operator Mono', value: '"Operator Mono", monospace' },
            { name: 'PragmataPro', value: 'PragmataPro, monospace' },
            { name: 'Cousine', value: 'Cousine, monospace' },
            { name: 'PT Mono', value: '"PT Mono", monospace' },
            { name: 'Space Mono', value: '"Space Mono", monospace' },
            { name: 'Noto Sans Mono', value: '"Noto Sans Mono", monospace' },
            { name: 'Spline Sans Mono', value: '"Spline Sans Mono", monospace' },
            { name: 'Commit Mono', value: '"Commit Mono", monospace' },
            { name: 'Geist Mono', value: '"Geist Mono", monospace' },
            { name: 'Intel One Mono', value: '"Intel One Mono", monospace' },
            { name: 'Recursive', value: 'Recursive, monospace' },
            { name: 'Monoid', value: 'Monoid, monospace' },
            { name: 'Go Mono', value: '"Go Mono", monospace' },
            { name: 'Droid Sans Mono', value: '"Droid Sans Mono", monospace' },
            { name: 'Proggy Clean', value: '"Proggy Clean", monospace' },
            { name: 'Terminus', value: 'Terminus, monospace' },
            { name: 'Tiny5', value: '"Tiny5", monospace' },
            { name: 'Envy Code R', value: '"Envy Code R", monospace' },
            { name: 'Hasklig', value: 'Hasklig, monospace' },
            { name: 'Meslo LG', value: '"Meslo LG", monospace' },
            { name: 'JuliaMono', value: 'JuliaMono, monospace' },
            { name: 'Maple Mono', value: '"Maple Mono", monospace' },
            { name: 'Agave', value: 'Agave, monospace' },
            { name: 'Code New Roman', value: '"Code New Roman", monospace' },
            { name: 'Overpass Mono', value: '"Overpass Mono", monospace' },
            { name: 'Red Hat Mono', value: '"Red Hat Mono", monospace' },
            { name: 'Fragment Mono', value: '"Fragment Mono", monospace' },
            { name: 'CamingoCode', value: 'CamingoCode, monospace' },
            { name: 'Sudo', value: 'Sudo, monospace' },
            { name: 'Berkeley Mono', value: '"Berkeley Mono", monospace' },
            { name: 'Cartograph CF', value: '"Cartograph CF", monospace' },
            { name: 'Input Serif Mono', value: '"Input Serif Mono", serif, monospace' },
            { name: 'Inter', value: '"Inter", sans-serif' }
          ].map((f) => (
            <option key={f.name} value={f.value} style={{ fontFamily: f.value }}>{f.name}</option>
          ))}
        </select>
      )
    },
    {
      id: 'editorFontSize',
      title: 'Editor: Font Size',
      keyName: 'editor.fontSize',
      description: 'Controls the font size in pixels for optimal reading comfort.',
      category: 'editor',
      render: () => (
        <div className="flex items-center gap-3 max-w-md">
          <input 
            type="range" min="10" max="30" value={editorFontSize} 
            onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
            className="flex-1 accent-[#007acc] bg-[#2d2d2d] h-1 appearance-none cursor-pointer"
          />
          <input
            type="number" min="10" max="30" value={editorFontSize}
            onChange={(e) => setEditorFontSize(Math.max(10, Math.min(30, parseInt(e.target.value) || 14)))}
            className="w-14 h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-white text-[12px] px-2 text-center rounded-[2px] outline-none"
          />
          <span className="text-[11px] text-[#858585]">px</span>
        </div>
      )
    },
    {
      id: 'editorLineHeight',
      title: 'Editor: Line Height',
      keyName: 'editor.lineHeight',
      description: 'Specifies the multiplier line spacing height of editor code lines.',
      category: 'editor',
      render: () => (
        <div className="flex items-center gap-3 max-w-md">
          <input 
            type="range" min="1.0" max="2.2" step="0.1" value={editorLineHeight} 
            onChange={(e) => setEditorLineHeight(parseFloat(e.target.value))}
            className="flex-1 accent-[#007acc] bg-[#2d2d2d] h-1 appearance-none cursor-pointer"
          />
          <input
            type="number" min="1.0" max="2.2" step="0.1" value={editorLineHeight}
            onChange={(e) => setEditorLineHeight(Math.max(1.0, Math.min(2.2, parseFloat(e.target.value) || 1.4)))}
            className="w-14 h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-white text-[12px] px-2 text-center rounded-[2px] outline-none"
          />
        </div>
      )
    },
    {
      id: 'syntaxThemeName',
      title: 'Syntax Highlight Theme',
      keyName: 'syntax.theme',
      description: 'Controls the active coloring palette used by the editor tokenizer to highlight code syntax.',
      category: 'syntax',
      render: () => (
        <select
          value={syntaxThemeName}
          onChange={(e) => setSyntaxThemeName(e.target.value)}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          {Object.keys(SYNTAX_THEMES).map((themeName) => (
            <option key={themeName} value={themeName}>{themeName}</option>
          ))}
        </select>
      )
    },
    {
      id: 'shortcutPresetName',
      title: 'Shortcuts Row Preset',
      keyName: 'shortcuts.preset',
      description: 'Chooses the helper characters layout row for rapid button insertion in mobile environments.',
      category: 'shortcuts',
      render: () => (
        <select
          value={shortcutPresetName}
          onChange={(e) => setShortcutPresetName(e.target.value)}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          {[
            ...SHORTCUT_PRESETS,
            { name: 'Custom Layout', description: 'Create your own layout design below' }
          ].map((preset) => (
            <option key={preset.name} value={preset.name}>{preset.name} — {preset.description}</option>
          ))}
        </select>
      )
    },
    {
      id: 'customSymbolsStr',
      title: 'Custom Helper Symbols',
      keyName: 'shortcuts.customSymbols',
      description: 'Enter your custom symbols (separated by spaces or commas) for the mobile helper toolbar.',
      category: 'shortcuts',
      render: () => (
        <input
          type="text"
          value={customSymbolsStr}
          onChange={(e) => setCustomSymbolsStr(e.target.value)}
          className="w-full max-w-md h-7 px-2.5 bg-[#2d2d2d] border border-[#3c3c3c] text-white text-[12px] hover:bg-[#3c3c3c] transition-all focus:outline-none focus:border-[#007acc] font-mono rounded-[2px]"
          placeholder="e.g. <, >, /, {, }, ;, (, )"
          disabled={shortcutPresetName !== 'Custom Layout'}
        />
      )
    },
    {
      id: 'application',
      title: 'Application installation',
      keyName: 'application.install',
      description: 'Allows installing ReversX onto your local home screen or desktop to work offline.',
      category: 'application',
      render: () => isInstallable ? (
        <button
          onClick={handleInstallClick}
          className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0062a3] active:bg-[#004e82] text-white text-[11px] rounded-[2px] transition-all font-medium cursor-pointer"
        >
          Install PWA
        </button>
      ) : (
        <div className="text-[11px] text-[#858585] space-y-1 bg-[#1e1e1e] p-2.5 rounded-[2px] border border-[#333333] max-w-md">
          <p>✓ Running in browser Sandbox</p>
          <p>✓ Offline support available via service worker</p>
        </div>
      )
    }
  ];

  const filteredSettings = allSettings.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.keyName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    
    if (settingsCategory === 'commonly') {
      return commonlyUsedKeys.includes(item.keyName);
    }
    
    return item.category === settingsCategory;
  });

  return (
    <React.Fragment>
      {isOpen && (
        <>
          {/* VS Code Settings Panel - Full Screen */}
          <div
            className="fixed inset-0 z-[150] bg-[#1e1e1e] flex flex-col overflow-hidden font-sans text-[#cccccc]"
          >
            {/* Preferences Title Bar */}
            <div className="h-9 bg-[#2d2d2d] border-b border-[#252526] px-3.5 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#858585] font-semibold">Preferences</span>
                <span className="text-[10px] text-[#858585]">•</span>
                <span className="text-[11px] text-[#e1e1e1]">Settings</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-[#858585] hover:text-white hover:bg-white/10 rounded-[2px] transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Search Header */}
            <div className="bg-[#1e1e1e] border-b border-[#252526] shrink-0">
              <div className="p-4 pb-0">
                <div className="relative w-full max-w-2xl mb-3.5">
                  <input
                    type="text"
                    placeholder="Search settings"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-white text-[12px] pl-8 pr-8 rounded-[2px] outline-none transition-all placeholder-[#858585]"
                  />
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858585]">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M15.7 14.3l-4.2-4.2c.8-1 1.3-2.2 1.3-3.6 0-3.1-2.5-5.6-5.6-5.6S1.6 3.4 1.6 6.5s2.5 5.6 5.6 5.6c1.4 0 2.6-.5 3.6-1.3l4.2 4.2c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.3zM7.2 10.6c-2.3 0-4.1-1.8-4.1-4.1S4.9 2.4 7.2 2.4s4.1 1.8 4.1 4.1-1.8 4.1-4.1 4.1z"/>
                    </svg>
                  </div>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#858585] hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* User vs Workspace Subtabs */}
                <div className="flex gap-4 text-[12px] select-none mb-2">
                  <button className="pb-1.5 border-b-2 border-[#007acc] text-[#e1e1e1] font-medium">User</button>
                  <button className="pb-1.5 border-b-2 border-transparent text-[#858585] hover:text-[#cccccc] cursor-not-allowed" title="Workspace settings not available in single-user mode">Workspace</button>
                </div>
              </div>

              {/* Settings Category Tabs (Horizontal) */}
              <div className="flex bg-[#252526] overflow-x-auto no-scrollbar">
                {[
                  { id: 'commonly', label: 'Commonly Used' },
                  { id: 'editor', label: 'Text Editor' },
                  { id: 'appearance', label: 'Appearance' },
                  { id: 'syntax', label: 'Syntax Theme' },
                  { id: 'shortcuts', label: 'Shortcuts Row' },
                  { id: 'application', label: 'Application' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => {
                      setSettingsCategory(cat.id as any);
                      setSearchQuery('');
                    }}
                    className={`flex-shrink-0 px-4 h-9 flex items-center gap-2 text-[12px] border-r border-[#1e1e1e] transition-all relative ${
                      (settingsCategory === cat.id && !searchQuery)
                        ? 'bg-[#2d2d2d] text-white' 
                        : 'bg-[#252526] text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc]'
                    }`}
                  >
                    {settingsCategory === cat.id && !searchQuery && (
                      <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#007acc] rounded-t-full shadow-[0_-2px_8px_rgba(0,122,204,0.4)]" />
                    )}
                    <span className={settingsCategory === cat.id && !searchQuery ? 'font-medium' : ''}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Split Panel Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Settings Scrollable Content Panel */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1e1e1e] p-5">
                <div className="mb-4">
                  <h3 className="text-[14px] font-normal text-[#e1e1e1] capitalize">
                    {searchQuery ? `Search Results for "${searchQuery}"` : settingsCategory.replace('commonly', 'Commonly Used').replace('editor', 'Text Editor').replace('syntax', 'Syntax Theme').replace('shortcuts', 'Shortcuts Row')}
                  </h3>
                </div>

                <div className="space-y-5 divide-y divide-[#252526]">
                  {filteredSettings.length > 0 ? (
                    filteredSettings.map((setting) => (
                      <div 
                        key={setting.id} 
                        className="group relative pl-4.5 py-4 border-l-2 border-transparent hover:border-[#3c3c3c] transition-colors first:pt-1"
                      >
                        {/* VS Code Focus active left marker bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#007acc] opacity-0 group-hover:opacity-40" />

                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[12.5px] font-medium text-[#e1e1e1]">{setting.title}</span>
                              <span className="text-[10px] font-mono text-[#007acc]">{setting.keyName}</span>
                            </div>
                            <span className="text-[11px] text-[#858585] mt-1 max-w-[520px] leading-relaxed">
                              {setting.description}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-[12px]">
                          {setting.render()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[12px] text-[#858585]">
                      No settings found matching your query.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="h-6.5 border-t border-[#252526] bg-[#007acc] flex items-center px-4 shrink-0 select-none">
              <span className="text-[10px] text-white font-medium">ReversX System Preferences</span>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};
