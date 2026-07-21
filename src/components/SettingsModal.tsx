import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { Select, Input, Slider, InputNumber, Button, Switch } from 'antd';
import { APP_THEMES } from '../App';
import { ICON_THEMES } from '../lib/icons';
import { SYNTAX_THEMES } from '../utils/editorUtils';
import { SHORTCUT_PRESETS } from './MobileKeyboardToolbar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appThemeName: string;
  setAppThemeName: (theme: string) => void;
  uiStyle: 'default' | 'antd';
  setUiStyle: (style: 'default' | 'antd') => void;
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
  customActionsStr: string;
  setCustomActionsStr: (actions: string) => void;
  fileIconSize: number;
  setFileIconSize: (size: number) => void;
  smallestWidthPortrait: number;
  setSmallestWidthPortrait: (width: number) => void;
  smallestWidthLandscape: number;
  setSmallestWidthLandscape: (width: number) => void;
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
  customActionsStr,
  setCustomActionsStr,
  fileIconSize,
  setFileIconSize,
  smallestWidthPortrait,
  setSmallestWidthPortrait,
  smallestWidthLandscape,
  setSmallestWidthLandscape,
}) => {
  const [settingsCategory, setSettingsCategory] = useState<'commonly' | 'appearance' | 'editor' | 'syntax' | 'shortcuts' | 'application'>('commonly');
  const [searchQuery, setSearchQuery] = useState('');

  const [simulatedLoad, setSimulatedLoad] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
    supported: boolean;
  }>(() => {
    const pm = (performance as any).memory;
    if (pm) {
      return {
        used: pm.usedJSHeapSize,
        total: pm.totalJSHeapSize,
        limit: pm.jsHeapSizeLimit,
        supported: true
      };
    }
    return { used: 0, total: 0, limit: 0, supported: false };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const pm = (performance as any).memory;
      if (pm && !simulatedLoad) {
        setMemoryUsage({
          used: pm.usedJSHeapSize,
          total: pm.totalJSHeapSize,
          limit: pm.jsHeapSizeLimit,
          supported: true
        });
      } else if (simulatedLoad) {
        const mockUsed = 550 * 1024 * 1024 + Math.floor(Math.random() * 20 * 1024 * 1024);
        setMemoryUsage({
          used: mockUsed,
          total: 800 * 1024 * 1024,
          limit: 2048 * 1024 * 1024,
          supported: !!pm
        });
      } else {
        const mockUsed = 125 * 1024 * 1024 + Math.floor(Math.random() * 15 * 1024 * 1024);
        setMemoryUsage({
          used: mockUsed,
          total: 250 * 1024 * 1024,
          limit: 1024 * 1024 * 1024,
          supported: false
        });
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [simulatedLoad]);

  const commonlyUsedKeys = [
    'workbench.colorTheme',
    'editor.fontFamily',
    'editor.fontSize',
    'window.uiStyle',
    'window.smallestWidth',
    'application.memoryUsage'
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
      description: 'Controls the overall UI aesthetics. Default mode keeps the sharp retro ReversX edges, while Ant Design provides modern, polished components and layouts.',
      category: 'appearance',
      render: () => uiStyle === 'antd' ? (
        <Select
          value={uiStyle}
          onChange={(val) => setUiStyle(val as 'default' | 'antd')}
          className="w-full max-w-md"
          options={[
            { label: 'Default (ReversX)', value: 'default' },
            { label: 'Ant Design', value: 'antd' }
          ]}
        />
      ) : (
        <select
          value={uiStyle}
          onChange={(e) => setUiStyle(e.target.value as 'default' | 'antd')}
          className="w-full max-w-md h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-[#cccccc] text-[12px] px-2 rounded-[2px] outline-none cursor-pointer hover:bg-[#3c3c3c] transition-all"
        >
          <option value="default">Default (ReversX)</option>
          <option value="antd">Ant Design</option>
        </select>
      )
    },
    {
      id: 'appTheme',
      title: 'Color Theme',
      keyName: 'workbench.colorTheme',
      description: 'Specifies the active color scheme applied across the sidebar, terminals, and workspace background panels.',
      category: 'appearance',
      render: () => uiStyle === 'antd' ? (
        <Select
          value={appThemeName}
          onChange={(val) => setAppThemeName(val)}
          className="w-full max-w-md"
          options={Object.keys(APP_THEMES).map(t => ({ label: t, value: t }))}
        />
      ) : (
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
      render: () => uiStyle === 'antd' ? (
        <Select
          value={iconThemeName}
          onChange={(val) => setIconThemeName(val)}
          className="w-full max-w-md"
          options={Object.keys(ICON_THEMES).map(t => ({ label: t, value: t }))}
        />
      ) : (
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
      render: () => uiStyle === 'antd' ? (
        <Select
          value={appFontName}
          onChange={(val) => setAppFontName(val)}
          className="w-full max-w-md"
          options={Object.keys(FONT_OPTIONS_MAP).map(f => ({ label: f, value: f }))}
        />
      ) : (
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
      render: () => uiStyle === 'antd' ? (
        <div className="flex items-center gap-3 max-w-md">
          <Slider 
            min={10} max={32} value={fileIconSize} 
            onChange={(val) => setFileIconSize(val)}
            className="flex-1"
          />
          <InputNumber
            min={10} max={32} value={fileIconSize}
            onChange={(val) => setFileIconSize(val || 16)}
            className="w-14"
          />
        </div>
      ) : (
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
      id: 'smallestWidthPortrait',
      title: 'Smallest Width (Portrait)',
      keyName: 'window.smallestWidthPortrait',
      description: 'Adjusts the UI scaling to control element density in Portrait mode. Higher values make UI elements smaller.',
      category: 'appearance',
      render: () => uiStyle === 'antd' ? (
        <div className="flex items-center gap-3 max-w-md">
          <Slider 
            min={320} max={1200} value={smallestWidthPortrait} 
            onChange={(val) => setSmallestWidthPortrait(val)}
            className="flex-1"
          />
          <InputNumber
            min={320} max={1200} value={smallestWidthPortrait}
            onChange={(val) => setSmallestWidthPortrait(val || 360)}
            className="w-20"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 max-w-md">
          <input 
            type="range" min="320" max="1200" value={smallestWidthPortrait} 
            onChange={(e) => setSmallestWidthPortrait(parseInt(e.target.value))}
            className="flex-1 accent-[#007acc] bg-[#2d2d2d] h-1 appearance-none cursor-pointer"
          />
          <input
            type="number" min="320" max="1200" value={smallestWidthPortrait}
            onChange={(e) => setSmallestWidthPortrait(Math.max(320, Math.min(1200, parseInt(e.target.value) || 360)))}
            className="w-20 h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-white text-[12px] px-2 text-center rounded-[2px] outline-none"
          />
          <span className="text-[11px] text-[#858585]">dp</span>
        </div>
      )
    },
    {
      id: 'smallestWidthLandscape',
      title: 'Smallest Width (Landscape)',
      keyName: 'window.smallestWidthLandscape',
      description: 'Adjusts the UI scaling to control element density in Landscape mode. Useful for Bluetooth keyboard coding.',
      category: 'appearance',
      render: () => uiStyle === 'antd' ? (
        <div className="flex items-center gap-3 max-w-md">
          <Slider 
            min={320} max={1500} value={smallestWidthLandscape} 
            onChange={(val) => setSmallestWidthLandscape(val)}
            className="flex-1"
          />
          <InputNumber
            min={320} max={1500} value={smallestWidthLandscape}
            onChange={(val) => setSmallestWidthLandscape(val || 600)}
            className="w-20"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 max-w-md">
          <input 
            type="range" min="320" max="1500" value={smallestWidthLandscape} 
            onChange={(e) => setSmallestWidthLandscape(parseInt(e.target.value))}
            className="flex-1 accent-[#007acc] bg-[#2d2d2d] h-1 appearance-none cursor-pointer"
          />
          <input
            type="number" min="320" max="1500" value={smallestWidthLandscape}
            onChange={(e) => setSmallestWidthLandscape(Math.max(320, Math.min(1500, parseInt(e.target.value) || 600)))}
            className="w-20 h-7 bg-[#2d2d2d] border border-[#3c3c3c] focus:border-[#007acc] text-white text-[12px] px-2 text-center rounded-[2px] outline-none"
          />
          <span className="text-[11px] text-[#858585]">dp</span>
        </div>
      )
    },
    {
      id: 'editorFontFamily',
      title: 'Editor: Font Family',
      keyName: 'editor.fontFamily',
      description: 'Controls the typeface used in code editors, log outputs, and shell buffers.',
      category: 'editor',
      render: () => uiStyle === 'antd' ? (
        <Select
          value={editorFontFamily}
          onChange={(val) => setEditorFontFamily(val)}
          className="w-full max-w-md"
          options={[
            { label: 'VS Code Font', value: 'Consolas, Menlo, Monaco, "Courier New", monospace' },
            { label: 'Consolas', value: 'Consolas, "Liberation Mono", Courier, monospace' },
            { label: 'Courier New', value: '"Courier New", Courier, monospace' },
            { label: 'Cascadia Code', value: '"Cascadia Code", "Segoe UI Mono", monospace' },
            { label: 'Cascadia Mono', value: '"Cascadia Mono", monospace' },
            { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
            { label: 'Fira Code', value: '"Fira Code", monospace' },
            { label: 'Fira Mono', value: '"Fira Mono", monospace' },
            { label: 'Source Code Pro', value: '"Source Code Pro", monospace' },
            { label: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
            { label: 'Hack', value: 'Hack, monospace' },
            { label: 'Inconsolata', value: 'Inconsolata, monospace' },
            { label: 'Ubuntu Mono', value: '"Ubuntu Mono", monospace' },
            { label: 'Roboto Mono', value: '"Roboto Mono", monospace' },
            { label: 'SF Mono', value: '"SF Mono", Monaco, "Helvetica Neue", monospace' },
            { label: 'Menlo', value: 'Menlo, Monaco, monospace' },
            { label: 'Monaco', value: 'Monaco, "Courier New", monospace' },
            { label: 'DejaVu Sans Mono', value: '"DejaVu Sans Mono", monospace' },
            { label: 'Liberation Mono', value: '"Liberation Mono", monospace' },
            { label: 'Anonymous Pro', value: '"Anonymous Pro", monospace' },
            { label: 'Dank Mono', value: '"Dank Mono", monospace' },
            { label: 'Input Mono', value: '"Input Mono", monospace' },
            { label: 'Input Sans', value: '"Input Sans", sans-serif' },
            { label: 'Iosevka', value: 'Iosevka, monospace' },
            { label: 'Victor Mono', value: '"Victor Mono", monospace' },
            { label: 'Operator Mono', value: '"Operator Mono", monospace' },
            { label: 'PragmataPro', value: 'PragmataPro, monospace' },
            { label: 'Cousine', value: 'Cousine, monospace' },
            { label: 'PT Mono', value: '"PT Mono", monospace' },
            { label: 'Space Mono', value: '"Space Mono", monospace' },
            { label: 'Noto Sans Mono', value: '"Noto Sans Mono", monospace' },
            { label: 'Spline Sans Mono', value: '"Spline Sans Mono", monospace' },
            { label: 'Commit Mono', value: '"Commit Mono", monospace' },
            { label: 'Geist Mono', value: '"Geist Mono", monospace' },
            { label: 'Intel One Mono', value: '"Intel One Mono", monospace' },
            { label: 'Recursive', value: 'Recursive, monospace' },
            { label: 'Monoid', value: 'Monoid, monospace' },
            { label: 'Go Mono', value: '"Go Mono", monospace' },
            { label: 'Droid Sans Mono', value: '"Droid Sans Mono", monospace' },
            { label: 'Proggy Clean', value: '"Proggy Clean", monospace' },
            { label: 'Terminus', value: 'Terminus, monospace' },
            { label: 'Tiny5', value: '"Tiny5", monospace' },
            { label: 'Envy Code R', value: '"Envy Code R", monospace' },
            { label: 'Hasklig', value: 'Hasklig, monospace' },
            { label: 'Meslo LG', value: '"Meslo LG", monospace' },
            { label: 'JuliaMono', value: 'JuliaMono, monospace' },
            { label: 'Maple Mono', value: '"Maple Mono", monospace' },
            { label: 'Agave', value: 'Agave, monospace' },
            { label: 'Code New Roman', value: '"Code New Roman", monospace' },
            { label: 'Overpass Mono', value: '"Overpass Mono", monospace' },
            { label: 'Red Hat Mono', value: '"Red Hat Mono", monospace' },
            { label: 'Fragment Mono', value: '"Fragment Mono", monospace' },
            { label: 'CamingoCode', value: 'CamingoCode, monospace' },
            { label: 'Sudo', value: 'Sudo, monospace' },
            { label: 'Berkeley Mono', value: '"Berkeley Mono", monospace' },
            { label: 'Cartograph CF', value: '"Cartograph CF", monospace' },
            { label: 'Input Serif Mono', value: '"Input Serif Mono", serif, monospace' },
            { label: 'Inter', value: '"Inter", sans-serif' }
          ]}
        />
      ) : (
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
      render: () => uiStyle === 'antd' ? (
        <div className="flex items-center gap-3 max-w-md">
          <Slider 
            min={10} max={30} value={editorFontSize} 
            onChange={(val) => setEditorFontSize(val)}
            className="flex-1"
          />
          <InputNumber
            min={10} max={30} value={editorFontSize}
            onChange={(val) => setEditorFontSize(val || 14)}
            className="w-14"
          />
        </div>
      ) : (
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
      render: () => uiStyle === 'antd' ? (
        <div className="flex items-center gap-3 max-w-md">
          <Slider 
            min={1.0} max={2.2} step={0.1} value={editorLineHeight} 
            onChange={(val) => setEditorLineHeight(val)}
            className="flex-1"
          />
          <InputNumber
            min={1.0} max={2.2} step={0.1} value={editorLineHeight}
            onChange={(val) => setEditorLineHeight(val || 1.4)}
            className="w-14"
          />
        </div>
      ) : (
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
      render: () => uiStyle === 'antd' ? (
        <Select
          value={syntaxThemeName}
          onChange={(val) => setSyntaxThemeName(val)}
          className="w-full max-w-md"
          options={Object.keys(SYNTAX_THEMES).map(t => ({ label: t, value: t }))}
        />
      ) : (
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
      render: () => uiStyle === 'antd' ? (
        <Select
          value={shortcutPresetName}
          onChange={(val) => setShortcutPresetName(val)}
          className="w-full max-w-md"
          options={[
            ...SHORTCUT_PRESETS.map(p => ({ label: `${p.name} — ${p.description}`, value: p.name })),
            { label: 'Custom Layout — Create your own layout design below', value: 'Custom Layout' }
          ]}
        />
      ) : (
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
      title: 'Custom Helper Symbols (Row 2)',
      keyName: 'shortcuts.customSymbols',
      description: 'Enter your custom symbols (separated by spaces or commas) for the mobile helper toolbar (Row 2).',
      category: 'shortcuts',
      render: () => uiStyle === 'antd' ? (
        <Input
          value={customSymbolsStr}
          onChange={(e) => setCustomSymbolsStr(e.target.value)}
          className="w-full max-w-md"
          placeholder="e.g. <, >, /, {, }, ;, (, )"
          disabled={shortcutPresetName !== 'Custom Layout'}
        />
      ) : (
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
      id: 'customActionsStr',
      title: 'Custom Helper Actions (Row 1)',
      keyName: 'shortcuts.customActions',
      description: 'Enter your custom action IDs (separated by spaces or commas) for the mobile helper toolbar (Row 1). Available: left, up, down, right, undo, redo, search, quickOpen, commandPalette, tab, bookmark, save. Use "|" for a separator.',
      category: 'shortcuts',
      render: () => uiStyle === 'antd' ? (
        <Input
          value={customActionsStr}
          onChange={(e) => setCustomActionsStr(e.target.value)}
          className="w-full max-w-md"
          placeholder="e.g. left, right, |, undo, redo, |, save"
        />
      ) : (
        <input
          type="text"
          value={customActionsStr}
          onChange={(e) => setCustomActionsStr(e.target.value)}
          className="w-full max-w-md h-7 px-2.5 bg-[#2d2d2d] border border-[#3c3c3c] text-white text-[12px] hover:bg-[#3c3c3c] transition-all focus:outline-none focus:border-[#007acc] font-mono rounded-[2px]"
          placeholder="e.g. left, right, |, undo, redo, |, save"
        />
      )
    },
    {
      id: 'application',
      title: 'Application installation',
      keyName: 'application.install',
      description: 'Allows installing ReversX onto your local home screen or desktop to work offline.',
      category: 'application',
      render: () => uiStyle === 'antd' ? (
        <Button
          type="primary"
          onClick={handleInstallClick}
          disabled={!isInstallable}
        >
          Install PWA
        </Button>
      ) : isInstallable ? (
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
    },
    {
      id: 'memoryUsage',
      title: 'JavaScript Heap Memory Monitor',
      keyName: 'application.memoryUsage',
      description: 'Real-time monitoring of JavaScript heap memory allocation. Shows active memory usage and issues warnings if heap usage exceeds 500MB (critical threshold for low-memory devices).',
      category: 'application',
      render: () => {
        const usedMB = (memoryUsage.used / 1024 / 1024).toFixed(1);
        const totalMB = (memoryUsage.total / 1024 / 1024).toFixed(1);
        const limitMB = (memoryUsage.limit / 1024 / 1024).toFixed(1);
        const limitExceeded = memoryUsage.used > 500 * 1024 * 1024;
        
        return (
          <div className="space-y-3.5 bg-[#1a1a1a] p-4 rounded-[4px] border border-[#2d2d2d] max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${limitExceeded ? 'bg-[#f44336] animate-pulse' : 'bg-[#4caf50]'}`} />
                <span className="text-[12px] font-medium text-[#cccccc]">
                  {limitExceeded ? 'High Memory Usage Warning' : 'Healthy Memory Level'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#858585]">
                {memoryUsage.supported ? 'Native API Active' : 'Approximate Telemetry'}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-end justify-between text-[11px] font-mono">
                <span className="text-[#858585]">Active Heap</span>
                <span className="text-[#cccccc]">
                  <strong className={limitExceeded ? 'text-[#f44336] font-bold' : 'text-[#4ec9b0]'}>{usedMB} MB</strong> / 500 MB limit
                </span>
              </div>
              <div className="w-full bg-[#252526] h-1.5 rounded-[2px] overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-[2px] ${limitExceeded ? 'bg-[#f44336]' : 'bg-[#007acc]'}`} 
                  style={{ width: `${Math.min(100, (memoryUsage.used / (500 * 1024 * 1024)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#252526] text-[10px] font-mono text-[#858585]">
              <span>System Limit: {limitMB} MB</span>
              <span>Total Allocated: {totalMB} MB</span>
            </div>

            {limitExceeded && (
              <div className="p-2.5 bg-[#f44336]/10 border border-[#f44336]/30 text-[#f44336] text-[11px] rounded-[2px] leading-relaxed">
                <strong>⚠️ Warning:</strong> High JavaScript heap usage detected ({usedMB} MB). Exceeding 500 MB may cause slow responsiveness, freeze spikes, or application crashes on 4GB RAM mobile devices. Consider closing large source files or clearing diagnostic logs.
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#858585]">Test Warning Banner:</span>
              <button
                onClick={() => setSimulatedLoad(prev => !prev)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-[2px] border transition-all ${
                  simulatedLoad 
                    ? 'bg-[#f44336]/20 border-[#f44336]/40 text-[#f44336] hover:bg-[#f44336]/30' 
                    : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc] hover:bg-[#3c3c3c] hover:text-white'
                }`}
              >
                {simulatedLoad ? 'Disable Heavy Simulation' : 'Simulate Heavy Load (>500MB)'}
              </button>
            </div>
          </div>
        );
      }
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
                  {uiStyle === 'antd' ? (
                    <Input
                      placeholder="Search settings"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      prefix={<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-[#858585]"><path d="M15.7 14.3l-4.2-4.2c.8-1 1.3-2.2 1.3-3.6 0-3.1-2.5-5.6-5.6-5.6S1.6 3.4 1.6 6.5s2.5 5.6 5.6 5.6c1.4 0 2.6-.5 3.6-1.3l4.2 4.2c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.3zM7.2 10.6c-2.3 0-4.1-1.8-4.1-4.1S4.9 2.4 7.2 2.4s4.1 1.8 4.1 4.1-1.8 4.1-4.1 4.1z"/></svg>}
                      allowClear
                      className="antd-search-input"
                    />
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                {/* User vs Workspace Subtabs */}
                <div className="flex gap-4 text-[12px] select-none mb-2">
                  <button className={`pb-1.5 border-b-2 ${uiStyle === 'antd' ? 'border-[#1677ff] text-[#1677ff]' : 'border-[#007acc] text-[#e1e1e1]'} font-medium`}>User</button>
                  <button className="pb-1.5 border-b-2 border-transparent text-[#858585] hover:text-[#cccccc] cursor-not-allowed" title="Workspace settings not available in single-user mode">Workspace</button>
                </div>
              </div>

              {/* Settings Category Tabs (Horizontal) */}
              <div className={`flex overflow-x-auto no-scrollbar ${uiStyle === 'antd' ? 'bg-[#1e1e1e] border-t border-[#252526]' : 'bg-[#252526]'}`}>
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
                    className={`flex-shrink-0 px-4 h-9 flex items-center gap-2 text-[12px] transition-all relative ${
                      (settingsCategory === cat.id && !searchQuery)
                        ? uiStyle === 'antd' 
                          ? 'text-[#1677ff] font-medium' 
                          : 'bg-[#2d2d2d] text-white border-r border-[#1e1e1e]'
                        : uiStyle === 'antd'
                          ? 'text-[#858585] hover:text-[#cccccc]'
                          : 'bg-[#252526] text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc] border-r border-[#1e1e1e]'
                    }`}
                  >
                    {settingsCategory === cat.id && !searchQuery && (
                      <div className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full ${
                        uiStyle === 'antd' ? 'bg-[#1677ff]' : 'bg-[#007acc] shadow-[0_-2px_8px_rgba(0,122,204,0.4)]'
                      }`} />
                    )}
                    <span>{cat.label}</span>
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
