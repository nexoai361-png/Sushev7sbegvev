import React, { useState } from 'react';
import { X, Minus, Plus, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { APP_THEMES } from '../App';
import { ICON_THEMES, Codicon } from '../lib/icons';
import { SYNTAX_THEMES } from '../utils/editorUtils';
import { SHORTCUT_PRESETS } from './MobileKeyboardToolbar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appThemeName: string;
  setAppThemeName: (theme: string) => void;
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
  const [settingsCategory, setSettingsCategory] = useState<'appearance' | 'editor' | 'application' | 'syntax' | 'shortcuts'>('appearance');
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  return (
    <React.Fragment>
      {isOpen && (
        <>
          <div 
            
            
            
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]"
          />
          <div
            
            
            
            className="fixed left-4 md:left-14 bottom-14 md:bottom-4 z-[90] w-[calc(100%-32px)] md:w-[600px] h-[450px] bg-sidebar border border-border shadow-2xl rounded-none flex flex-col overflow-hidden font-sans"
          >
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 text-[#858585] hover:text-white hover:bg-white/10 rounded-none transition-colors z-[100]"
            >
              <X size={14} />
            </button>
            <div className="flex-1 flex overflow-hidden">
              {/* Menu Sidebar */}
              <div className="w-40 border-r border-white/[0.05] py-2 flex-shrink-0 bg-background relative">
                <div className="px-4 py-2 mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#858585] tracking-wider">Settings</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    { id: 'appearance', label: 'Appearance' },
                    { id: 'editor', label: 'Text Editor' },
                    { id: 'syntax', label: 'Syntax' },
                    { id: 'shortcuts', label: 'Shortcuts Row' },
                    { id: 'application', label: 'Application' }
                  ].map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setSettingsCategory(cat.id as any)}
                      className={`w-full text-left px-4 py-1.5 text-[12px] transition-colors ${settingsCategory === cat.id ? 'bg-[#37373d] text-white border-l-2 border-[#007acc]' : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white border-l-2 border-transparent'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-sidebar p-6">
                {settingsCategory === 'appearance' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
                    <h3 className="text-xs font-semibold text-[#007acc] tracking-wider mb-4 border-b border-white/10 pb-1">Appearance</h3>
                    
                    <div>
                      <label className="block text-[12px] text-[#cccccc] mb-1.5 font-medium">App Theme</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {Object.keys(APP_THEMES).map((themeName) => (
                          <button
                            key={themeName}
                            onClick={() => setAppThemeName(themeName)}
                            className={`px-3 py-1.5 text-[12px] text-left transition-all ${
                              appThemeName === themeName 
                                ? 'bg-[#37373d] text-white' 
                                : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                            }`}
                          >
                            {themeName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] text-[#cccccc] mb-1.5 font-medium">Icon Theme</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {Object.keys(ICON_THEMES).map((themeName) => (
                          <button
                            key={themeName}
                            onClick={() => setIconThemeName(themeName)}
                            className={`px-3 py-1.5 text-[12px] text-left transition-all ${
                              iconThemeName === themeName 
                                ? 'bg-[#37373d] text-white' 
                                : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                            }`}
                          >
                            {themeName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] text-[#cccccc] mb-1.5 font-medium">System UI Fonts</label>
                      <div className="relative">
                        <button
                          onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                          className="w-full h-8 px-3 bg-[#3c3c3c] border border-white/10 text-white text-[12px] text-left flex items-center justify-between hover:bg-[#4a4a4a] transition-all focus:outline-none"
                        >
                          <span style={{ fontFamily: FONT_OPTIONS_MAP[appFontName] }}>{appFontName}</span>
                          {isFontDropdownOpen ? <ChevronUp size={14} className="text-[#858585]" /> : <ChevronDown size={14} className="text-[#858585]" />}
                        </button>
                        {isFontDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[#252526] border border-[#454545] shadow-[0_4px_12px_rgba(0,0,0,0.6)] z-[100] py-1 custom-scrollbar">
                            {Object.keys(FONT_OPTIONS_MAP).map((fontName) => (
                              <button
                                key={fontName}
                                onClick={() => {
                                  setAppFontName(fontName);
                                  setIsFontDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-[11px] transition-colors hover:bg-[#007acc] hover:text-white flex items-center justify-between ${
                                  appFontName === fontName ? 'bg-[#37373d] text-white font-medium border-l-2 border-[#007acc]' : 'text-[#cccccc]'
                                }`}
                                style={{ fontFamily: FONT_OPTIONS_MAP[fontName] }}
                              >
                                <span>{fontName}</span>
                                {appFontName === fontName && <CheckCircle2 size={11} className="text-[#007acc]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[12px] text-[#cccccc] font-medium">File Icon Size</label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setFileIconSize(Math.max(10, fileIconSize - 1))}
                            className="p-1 hover:bg-white/10 rounded-none transition-colors text-[#858585] hover:text-white"
                            title="Decrease icon size"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[10px] text-[#858585] min-w-[24px] text-center">{fileIconSize}px</span>
                          <button 
                            onClick={() => setFileIconSize(Math.min(32, fileIconSize + 1))}
                            className="p-1 hover:bg-white/10 rounded-none transition-colors text-[#858585] hover:text-white"
                            title="Increase icon size"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsCategory === 'editor' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
                    <h3 className="text-xs font-semibold text-[#007acc] tracking-wider mb-4 border-b border-white/10 pb-1">Text Editor</h3>
                    
                    <div>
                      <label className="block text-[12px] text-[#cccccc] mb-1.5 font-medium">Font Family</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          { name: 'VS Code Font', value: 'Consolas, Menlo, Monaco, "Courier New", monospace' },
                          { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
                          { name: 'Fira Code', value: '"Fira Code", monospace' },
                          { name: 'Inter', value: '"Inter", sans-serif' }
                        ].map((f) => (
                          <button
                            key={f.name}
                            onClick={() => setEditorFontFamily(f.value)}
                            className={`px-3 py-1.5 text-[12px] text-left transition-all ${
                              editorFontFamily === f.value 
                                ? 'bg-[#37373d] text-white' 
                                : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                            }`}
                            style={{ fontFamily: f.value }}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[12px] text-[#cccccc] font-medium">Font Size</label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditorFontSize(Math.max(10, editorFontSize - 1))}
                            className="p-0.5 hover:bg-white/10 rounded-none transition-colors text-[#858585] hover:text-white"
                            title="Decrease font size"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[10px] text-[#858585] min-w-[24px] text-center">{editorFontSize}px</span>
                          <button 
                            onClick={() => setEditorFontSize(Math.min(30, editorFontSize + 1))}
                            className="p-0.5 hover:bg-white/10 rounded-none transition-colors text-[#858585] hover:text-white"
                            title="Increase font size"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <input 
                        type="range" min="10" max="30" value={editorFontSize} 
                        onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
                        className="w-full accent-[#007acc] bg-[#3c3c3c] h-1 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[12px] text-[#cccccc] font-medium">Line Height</label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditorLineHeight(Math.max(1.0, Math.round((editorLineHeight - 0.1) * 10) / 10))}
                            className="p-0.5 hover:bg-white/10 rounded-none transition-colors text-[#858585] hover:text-white"
                            title="Decrease line height"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[10px] text-[#858585] min-w-[24px] text-center">{editorLineHeight.toFixed(1)}</span>
                          <button 
                            onClick={() => setEditorLineHeight(Math.min(2.2, Math.round((editorLineHeight + 0.1) * 10) / 10))}
                            className="p-0.5 hover:bg-white/10 rounded-none transition-colors text-[#858585] hover:text-white"
                            title="Increase line height"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <input 
                        type="range" min="1.0" max="2.2" step="0.1" value={editorLineHeight} 
                        onChange={(e) => setEditorLineHeight(parseFloat(e.target.value))}
                        className="w-full accent-[#007acc] bg-[#3c3c3c] h-1 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {settingsCategory === 'syntax' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
                    <h3 className="text-xs font-semibold text-[#007acc] tracking-wider mb-4 border-b border-white/10 pb-1">Syntax Highlighter</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(SYNTAX_THEMES).map((themeName) => (
                        <button
                          key={themeName}
                          onClick={() => setSyntaxThemeName(themeName)}
                          className={`px-3 py-2 text-[11px] text-left transition-all rounded-[2px] border ${
                            syntaxThemeName === themeName 
                              ? 'bg-[#37373d] text-white border-[#007acc]' 
                              : 'text-[#cccccc] hover:bg-[#2a2d2e] border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{themeName}</span>
                            {syntaxThemeName === themeName && <CheckCircle2 size={12} className="text-[#007acc]" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                 {settingsCategory === 'shortcuts' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
                    <h3 className="text-xs font-semibold text-[#007acc] tracking-wider mb-4 border-b border-white/10 pb-1">Shortcuts Row Layout</h3>
                    
                    <div>
                      <label className="block text-[12px] text-[#cccccc] mb-1.5 font-medium">Layout Design</label>
                      <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {[
                          ...SHORTCUT_PRESETS,
                          { name: 'Custom Layout', description: 'Create your own layout design below' }
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setShortcutPresetName(preset.name)}
                            className={`px-3 py-2 text-[11px] text-left transition-all border rounded-[2px] flex flex-col gap-0.5 ${
                              shortcutPresetName === preset.name 
                                ? 'bg-[#37373d] text-white border-[#007acc]' 
                                : 'text-[#cccccc] hover:bg-[#2a2d2e] border-transparent'
                            }`}
                          >
                            <span className="font-semibold">{preset.name}</span>
                            <span className="text-[10px] text-[#858585]">{preset.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {shortcutPresetName === 'Custom Layout' && (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="block text-[12px] text-[#cccccc] font-medium">Custom Symbols</label>
                        <p className="text-[10px] text-[#858585]">Enter your favorite symbols separated by spaces or commas.</p>
                        <input
                          type="text"
                          value={customSymbolsStr}
                          onChange={(e) => setCustomSymbolsStr(e.target.value)}
                          className="w-full h-8 px-3 bg-[#3c3c3c] border border-white/10 text-white text-[11px] hover:bg-[#4a4a4a] transition-all focus:outline-none focus:border-[#007acc] font-mono"
                          placeholder="e.g. <, >, /, {, }, ;, (, )"
                        />
                      </div>
                    )}
                  </div>
                )}

                {settingsCategory === 'application' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
                    <h3 className="text-xs font-semibold text-[#007acc] tracking-wider mb-4 border-b border-white/10 pb-1">Application</h3>
                    
                    {isInstallable && (
                      <div className="bg-background p-4 rounded-[2px] border border-white/5">
                        <h4 className="text-[12px] font-medium text-white mb-1">Install App</h4>
                        <p className="text-[11px] text-[#858585] mb-3">Install on your device for offline access.</p>
                        <button
                          onClick={handleInstallClick}
                          className="w-full py-1.5 bg-[#007acc] hover:bg-[#0062a3] active:bg-[#005a9e] text-white text-[11px] rounded-[2px] transition-colors"
                        >
                          Install Now
                        </button>
                      </div>
                    )}

                    <div className="text-[11px] text-[#858585] space-y-1">
                      <p>Version: 1.0.0 (Preview)</p>
                      <p>Status: Production Ready</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="h-8 border-t border-white/[0.05] bg-[#007acc] flex items-center px-4 shrink-0">
              <span className="text-[10px] text-white font-medium">ReversX Settings Preview</span>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};
