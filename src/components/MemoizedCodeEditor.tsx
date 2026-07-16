import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Menu, X, FileCode, FileJson, File, SquareTerminal, 
  ChevronRight, Sparkles, Key, Bookmark,
  Scissors, Copy, Clipboard, CheckSquare
} from 'lucide-react';
import { keymap, EditorView } from '@codemirror/view';
import { undo, redo } from '@codemirror/commands';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { Clipboard as NativeClipboard } from '@capacitor/clipboard';

const KeyboardModifier = registerPlugin<any>('KeyboardModifier');

import { useIcons, Codicon } from '../lib/icons';
import { useFileIconSize, Bookmark as ProjectBookmark } from '../types';
import { CoreEditor } from './CoreEditor';
import { MobileKeyboardToolbar, SHORTCUT_PRESETS } from './MobileKeyboardToolbar';
import { 
  VSCodeDefaultFileIcon, 
  getOfficialIcon,
  getFolderIcon
} from './VSCodeIcons';
import { 
  SYNTAX_THEMES, 
  getCodeMirrorExtensions, 
  getLanguageFromPath 
} from '../utils/editorUtils';
import { simpleChat } from '../services/ai';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface MemoizedCodeEditorProps {
  code: string;
  language: string;
  filename?: string;
  onChange?: (value: string | undefined) => void;
  onSaveVersion?: (description: string) => void;
  onSaveToLocal?: () => void;
  onPlay?: () => void;
  onShowPreview?: (show: boolean) => void;
  onOpenFull?: () => void;
  onShowSettings?: () => void;
  onShowTerminal?: () => void;
  onBackToChat?: () => void;
  onMenuClick?: () => void;
  onCreateFile?: () => void;
  onRenameFile?: (name: string) => void;
  onDeleteFile?: (name: string) => void;
  appThemeName: string;
  allFiles?: Record<string, any>;
  activeFiles?: string[];
  onFileSelect?: (name: string) => void;
  onCloseFile?: (name: string) => void;
  fontSize?: number;
  lineHeight?: number;
  splitScreen?: boolean;
  isSplitPane?: boolean;
  isBottomPane?: boolean;
  onToggleSplit?: () => void;
  onClosePane?: () => void;
  onSetEditorTheme?: (name: string) => void;
  editorThemeName: string;
  onShowHelp?: () => void;
  onShowQuickOpen?: () => void;
  onShowCommandPalette?: () => void;
  onShowShortcuts?: () => void;
  isLandscape?: boolean;
  onSetActiveTab?: (tab: string) => void;
  onSetMobileView?: (view: string) => void;
  fontFamily?: string;
  activeFile?: string;
  setShowSnippetEditor?: (val: any) => void;
  onSetActiveEditor?: (editor: any) => void;
  onSaveSelectedAsSnippet?: () => void;
  onCreateFilesDirectly?: (files: string[]) => void;
  getPlatformConfig?: () => any;
  onCreateNewProject?: () => void;
  syntaxThemeName: string;
  isZenMode?: boolean;
  setIsZenMode?: (val: boolean) => void;
  bookmarks?: ProjectBookmark[];
  onToggleBookmark?: (filename: string, lineNumber: number, lineContent: string) => void;
  shortcutPresetName?: string;
  customSymbolsStr?: string;
}

export const MemoizedCodeEditor = React.memo(({ 
  code, 
  language, 
  filename = 'untitled.txt',
  onChange,
  onSaveVersion,
  onSaveToLocal,
  onPlay,
  onShowPreview,
  onOpenFull,
  onShowSettings,
  onShowTerminal,
  onBackToChat,
  onMenuClick,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  appThemeName,
  allFiles = {},
  activeFiles = [],
  onFileSelect,
  onCloseFile,
  fontSize = 13,
  lineHeight = 1.5,
  splitScreen = false,
  isSplitPane = false,
  isBottomPane = true,
  onToggleSplit,
  onClosePane,
  onSetEditorTheme,
  editorThemeName,
  onShowHelp,
  onShowQuickOpen,
  onShowCommandPalette,
  onShowShortcuts,
  isLandscape = false,
  onSetActiveTab,
  onSetMobileView,
  fontFamily = '"JetBrains Mono", monospace',
  activeFile,
  setShowSnippetEditor,
  onSetActiveEditor,
  onSaveSelectedAsSnippet,
  onCreateFilesDirectly,
  getPlatformConfig,
  onCreateNewProject,
  syntaxThemeName,
  isZenMode = false,
  setIsZenMode,
  bookmarks = [],
  onToggleBookmark,
  shortcutPresetName = 'VS Code Default',
  customSymbolsStr = ''
}: MemoizedCodeEditorProps) => {
  const [localValue, setLocalValue] = useState(code);
  const [currentLineNumber, setCurrentLineNumber] = useState(1);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFileOpsMenu, setShowFileOpsMenu] = useState(false);
  const [showInlineAI, setShowInlineAI] = useState(false);
  const [inlineAIPrompt, setInlineAIPrompt] = useState('');
  const [inlineAILoading, setInlineAILoading] = useState(false);
  const [isCtrlActive, setIsCtrlActive] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isAltActive, setIsAltActive] = useState(false);
  const [wordWrap, setWordWrap] = useState(() => {
    const saved = localStorage.getItem('reversx_wordwrap');
    return saved !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('reversx_wordwrap', wordWrap ? 'true' : 'false');
  }, [wordWrap]);

  const symbols = useMemo(() => {
    if (shortcutPresetName === 'Custom Layout') {
      return (customSymbolsStr || '')
        .split(/[,\s]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    const preset = SHORTCUT_PRESETS.find(p => p.name === shortcutPresetName);
    return preset ? preset.symbols : SHORTCUT_PRESETS[0].symbols;
  }, [shortcutPresetName, customSymbolsStr]);
  const [isMobileRow1Collapsed, setIsMobileRow1Collapsed] = useState(false);
  const [isMobileRow2Collapsed, setIsMobileRow2Collapsed] = useState(false);
  const [isKeyboardToolbarHidden, setIsKeyboardToolbarHidden] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      KeyboardModifier.setModifiers({ ctrl: isCtrlActive, shift: isShiftActive, alt: isAltActive }).catch((err: any) => {
        console.error("Failed to sync modifiers to native Android:", err);
      });
    }
  }, [isCtrlActive, isShiftActive, isAltActive]);
  const insertText = useCallback((text: string) => {
    if (viewRef.current) {
      const view = viewRef.current;
      const { state } = view;
      const { selection } = state;
      view.dispatch({
        changes: selection.ranges.map((range: any) => ({
          from: range.from,
          to: range.to,
          insert: text,
        })),
        selection: { anchor: selection.main.from + text.length },
      });
      view.focus();
    }
  }, []);

  const [floatingToolbar, setFloatingToolbar] = useState<{
    show: boolean;
    x: number;
    y: number;
    selectionEmpty: boolean;
  } | null>(null);

  const handleEditorContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;

    if (x === 0 && y === 0 && viewRef.current) {
      const selection = viewRef.current.state.selection.main;
      const coords = viewRef.current.coordsAtPos(selection.head);
      if (coords) {
        x = coords.left;
        y = coords.top;
      }
    }

    let selectionEmpty = true;
    if (viewRef.current) {
      const selection = viewRef.current.state.selection.main;
      selectionEmpty = selection.from === selection.to;
    }

    setFloatingToolbar({
      show: true,
      x,
      y,
      selectionEmpty
    });
  }, []);

  const handleCut = useCallback(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    const selection = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(selection.from, selection.to);
    if (selectedText) {
      navigator.clipboard.writeText(selectedText).catch(err => {
        console.error("Clipboard copy failed:", err);
      });
      view.dispatch({
        changes: { from: selection.from, to: selection.to, insert: "" },
        selection: { anchor: selection.from }
      });
      view.focus();
    }
    setFloatingToolbar(null);
  }, []);

  const handleCopy = useCallback(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    const selection = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(selection.from, selection.to);
    if (selectedText) {
      if (Capacitor.isNativePlatform()) {
        NativeClipboard.write({ string: selectedText }).catch(err => {
          console.error("Native Clipboard copy failed:", err);
        });
      } else {
        navigator.clipboard.writeText(selectedText).catch(err => {
          console.error("Clipboard copy failed:", err);
        });
      }
      view.focus();
    }
    setFloatingToolbar(null);
  }, []);

  const handlePaste = useCallback(() => {
    if (!viewRef.current) return;
    setFloatingToolbar(null);
    if (Capacitor.isNativePlatform()) {
      NativeClipboard.read().then(({ value }) => {
        if (value) {
          insertText(value);
        }
      }).catch(err => {
        console.error("Native Clipboard paste failed:", err);
        setShowPasteModal(true);
      });
    } else if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(text => {
        insertText(text);
      }).catch(err => {
        setShowPasteModal(true);
      });
    } else {
      setShowPasteModal(true);
    }
  }, [insertText]);

  const handleSelectAll = useCallback(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    view.dispatch({
      selection: { anchor: 0, head: view.state.doc.length }
    });
    view.focus();
    setFloatingToolbar(null);
  }, []);

  const executeVirtualShortcut = useCallback((key: string) => {
    if (!viewRef.current) return;
    const view = viewRef.current;

    switch (key.toLowerCase()) {
      case 'v':
        handlePaste();
        break;
      case 'c': {
        const selectedText = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to);
        if (selectedText) {
          if (Capacitor.isNativePlatform()) {
            NativeClipboard.write({ string: selectedText }).catch(() => {});
          } else {
            navigator.clipboard.writeText(selectedText).catch(() => {});
          }
        }
        break;
      }
      case 'x': {
        const { selection } = view.state;
        const selectedText = view.state.sliceDoc(selection.main.from, selection.main.to);
        if (selectedText) {
          const proceedCut = () => {
            view.dispatch({
              changes: { from: selection.main.from, to: selection.main.to, insert: '' },
              selection: { anchor: selection.main.from }
            });
          };
          if (Capacitor.isNativePlatform()) {
            NativeClipboard.write({ string: selectedText }).then(proceedCut).catch(() => {});
          } else {
            navigator.clipboard.writeText(selectedText).then(proceedCut).catch(() => {});
          }
        }
        break;
      }
      case 'z':
        undo(view);
        break;
      case 'y':
        redo(view);
        break;
      case 'a':
        view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } });
        break;
      case 'f':
        import('@codemirror/search').then(({ openSearchPanel }) => openSearchPanel(view));
        break;
      default:
        break;
    }

    // Clear active modifier states after the action is processed
    setIsCtrlActive(false);
    setIsShiftActive(false);
    setIsAltActive(false);
  }, [handlePaste]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setFloatingToolbar(null);
    };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalClick);
    window.addEventListener('scroll', handleGlobalClick, true);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
      window.removeEventListener('scroll', handleGlobalClick, true);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const handleViewportResize = () => {
      if (viewRef.current) {
        // Automatically scroll selection back into view on soft keyboard resize
        setTimeout(() => {
          if (viewRef.current) {
            viewRef.current.dispatch({
              scrollIntoView: true
            });
          }
        }, 150);
      }
    };
    window.visualViewport.addEventListener('resize', handleViewportResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  const viewRef = useRef<any>(null);
  const fileIconSize = useFileIconSize();

  const { 
    Undo2, Redo2, Search, Hash, Wand2, Save, Sparkles, FileText, Bug, 
    Copy, ClipboardPaste, Trash2, Menu: MenuIcon, Edit, Play: PlayIcon, MoreVertical, Plus,
    ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoveDown, MoveUp,
    ArrowLeftToLine, ArrowRightToLine, Palette, X, HelpCircle
  } = useIcons();

  const handleEditorUpdate = (update: any) => {
    if (update.selectionSet || update.docChanged) {
      try {
        const pos = update.state.selection.main.head;
        const lineNo = update.state.doc.lineAt(pos).number;
        setCurrentLineNumber(lineNo);
      } catch (e) {}
    }
  };

  const toggleCurrentLineBookmark = useCallback(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    try {
      const pos = view.state.selection.main.head;
      const line = view.state.doc.lineAt(pos);
      if (onToggleBookmark) {
        onToggleBookmark(filename, line.number, line.text);
      }
    } catch (e) {
      console.error("Failed to toggle bookmark", e);
    }
  }, [filename, onToggleBookmark]);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.lineNumber) {
        const lineNo = detail.lineNumber;
        if (viewRef.current) {
          try {
            const lineText = viewRef.current.state.doc.line(lineNo).text;
            onToggleBookmark?.(filename, lineNo, lineText);
          } catch (err) {
            console.error("Failed to toggle bookmark via gutter", err);
          }
        }
      }
    };
    window.addEventListener('toggle-bookmark', handleToggle);
    return () => {
      window.removeEventListener('toggle-bookmark', handleToggle);
    };
  }, [filename, onToggleBookmark]);

  useEffect(() => {
    const handleJump = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.filename === filename && detail.lineNumber) {
        if (viewRef.current) {
          try {
            const line = viewRef.current.state.doc.line(detail.lineNumber);
            viewRef.current.dispatch({
              selection: { anchor: line.from, head: line.from },
              scrollIntoView: true
            });
            viewRef.current.focus();
          } catch (err) {
            console.error("Failed to jump to bookmarked line", err);
          }
        }
      }
    };
    window.addEventListener('jump-to-line', handleJump);
    return () => {
      window.removeEventListener('jump-to-line', handleJump);
    };
  }, [filename]);

  const isCurrentLineBookmarked = useMemo(() => {
    return (bookmarks || []).some(b => b.filename === filename && b.lineNumber === currentLineNumber);
  }, [bookmarks, filename, currentLineNumber]);

  const handleKeyboardAction = (action: string) => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    
    switch (action) {
      case 'tab': 
        insertText('  '); 
        break;
      case 'save': 
        if (onSaveToLocal) onSaveToLocal(); 
        break;
      case 'undo': 
        import('@codemirror/commands').then(({ undo }) => undo(view));
        break;
      case 'redo': 
        import('@codemirror/commands').then(({ redo }) => redo(view));
        break;
      case 'search': 
        import('@codemirror/search').then(({ openSearchPanel }) => openSearchPanel(view));
        break;
      case 'left': {
        const head = view.state.selection.main.head;
        const nextHead = Math.max(0, head - 1);
        if (isShiftActive) {
          view.dispatch({ selection: { anchor: view.state.selection.main.anchor, head: nextHead } });
        } else {
          view.dispatch({ selection: { anchor: nextHead } });
        }
        break;
      }
      case 'right': {
        const head = view.state.selection.main.head;
        const nextHead = Math.min(view.state.doc.length, head + 1);
        if (isShiftActive) {
          view.dispatch({ selection: { anchor: view.state.selection.main.anchor, head: nextHead } });
        } else {
          view.dispatch({ selection: { anchor: nextHead } });
        }
        break;
      }
      case 'up': {
        const lineU = view.state.doc.lineAt(view.state.selection.main.head);
        if (lineU.number > 1) {
          const prevLine = view.state.doc.line(lineU.number - 1);
          const nextHead = prevLine.from + Math.min(prevLine.length, view.state.selection.main.head - lineU.from);
          if (isShiftActive) {
            view.dispatch({ selection: { anchor: view.state.selection.main.anchor, head: nextHead } });
          } else {
            view.dispatch({ selection: { anchor: nextHead } });
          }
        }
        break;
      }
      case 'down': {
        const lineD = view.state.doc.lineAt(view.state.selection.main.head);
        if (lineD.number < view.state.doc.lines) {
          const nextLine = view.state.doc.line(lineD.number + 1);
          const nextHead = nextLine.from + Math.min(nextLine.length, view.state.selection.main.head - lineD.from);
          if (isShiftActive) {
            view.dispatch({ selection: { anchor: view.state.selection.main.anchor, head: nextHead } });
          } else {
            view.dispatch({ selection: { anchor: nextHead } });
          }
        }
        break;
      }
      case 'bookmark':
        toggleCurrentLineBookmark();
        break;
      default: break;
    }
    view.focus();
  };

  const handleLocalChange = useCallback((value: string) => {
    if (value === localValue) return;
    setLocalValue(value);
    if (onChange) {
      onChange(value);
    }
  }, [localValue, onChange]);

  const handleAIAction = async (action: 'refactor' | 'document' | 'debug') => {
    if (!localValue || isAILoading) return;
    
    setIsAILoading(true);
    try {
      let newCode = '';
      const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra: currentExtra } = getPlatformConfig?.() as any || {};

      let prompt = "";
      if (action === 'refactor') {
        prompt = `Refactor the following ${language} code to improve readability, performance, and follow best practices. Return ONLY the code. Do not include markdown code blocks, explanations, or comments before/after the code:\n\n${localValue}`;
      } else if (action === 'document') {
        prompt = `Add professional JSDoc/comments to the following ${language} code. Return ONLY the code. Do not include markdown code blocks, explanations, or comments before/after the code:\n\n${localValue}`;
      } else if (action === 'debug') {
        prompt = `Analyze the following ${language} code for bugs or potential issues. Fix any bugs found and improve error handling. Return ONLY the code. Do not include markdown code blocks, explanations, or comments before/after the code:\n\n${localValue}`;
      }

      newCode = await simpleChat(prompt, currentApiKey, currentModel, currentPlatform, currentExtra);
      
      // Clean up markdown code blocks if AI included them despite instructions
      newCode = newCode.replace(/```[a-z]*\n/g, '').replace(/\n```/g, '').trim();
      
      if (newCode) {
        handleLocalChange(newCode);
        if (onSaveVersion) onSaveVersion(`AI ${action}`);
      }
    } catch (err) {
      console.error(`AI ${action} failed:`, err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Update local value when external code changes (e.g. from AI)
  useEffect(() => {
    if (code !== localValue) {
      setLocalValue(code);
    }
  }, [code]);

  const triggerAction = (actionId: string) => {
    if (viewRef.current) {
      if (actionId === 'undo') {
        viewRef.current.trigger('keyboard', 'undo', null);
      }
    }
  };

  const handleInlineAI = async () => {
    if (!inlineAIPrompt || inlineAILoading) return;
    
    setInlineAILoading(true);
    try {
      const selection = viewRef.current?.state.selection.main;
      const selectedText = selection ? viewRef.current?.state.doc.sliceString(selection.from, selection.to) : '';
      
      const config = getPlatformConfig ? getPlatformConfig() : {};
      const currentApiKey = config.apiKey === 'env-key' ? '' : config.apiKey;
      const currentModel = config.model;
      const currentPlatform = config.platform || 'gemini';
      const currentExtra = config.extra;

      const prompt = `Task: ${inlineAIPrompt}
Code Context:
${selectedText ? `Selected Code:\n${selectedText}` : `Entire File:\n${localValue}`}

Language: ${language}

Instructions: Modify the code according to the task. Return ONLY the modified code. No explanations, no markdown blocks.`;

      const result = await simpleChat(prompt, currentApiKey, currentModel, currentPlatform, currentExtra);
      let newCode = result.replace(/```[a-z]*\n/g, '').replace(/\n```/g, '').trim();
      
      if (newCode) {
        if (selectedText && selection) {
          viewRef.current?.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newCode }
          });
        } else {
          handleLocalChange(newCode);
        }
        setShowInlineAI(false);
        setInlineAIPrompt('');
      }
    } catch (err) {
      console.error("Inline AI failed:", err);
    } finally {
      setInlineAILoading(false);
    }
  };

  const handleManualPaste = () => {
    if (pasteValue) {
      insertText(pasteValue);
    }
    setShowPasteModal(false);
    setPasteValue('');
  };

  const handleFormat = async () => {
    if (!localValue) return;
    try {
      if (language === 'kotlin') {
        const { formatKotlin } = await import("../utils/customFormatters");
        const formatted = formatKotlin(localValue);
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'toml') {
        const { formatToml } = await import("../utils/customFormatters");
        const formatted = formatToml(localValue);
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'properties') {
        const { formatProperties } = await import("../utils/customFormatters");
        const formatted = formatProperties(localValue);
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'gradle') {
        const { formatKotlin } = await import("../utils/customFormatters");
        const formatted = formatKotlin(localValue);
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'xml') {
        const jsBeautify = await import("js-beautify");
        const formatted = jsBeautify.html(localValue, {
          indent_size: 4,
          indent_char: ' ',
          max_preserve_newlines: 2,
          preserve_newlines: true,
          end_with_newline: true
        });
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'cpp' || language === 'c' || language === 'c_cpp') {
        const { default: init, format } = await import("@wasm-fmt/clang-format/web");
        await init();
        const formatted = format(localValue, filename || 'main.cpp', 'LLVM');
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'go') {
        const { default: init, format } = await import("@wasm-fmt/gofmt/web");
        await init();
        const formatted = format(localValue);
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'bash' || language === 'sh') {
        const { default: init, format } = await import("@wasm-fmt/shfmt/web");
        await init();
        const formatted = format(localValue);
        if (formatted) handleLocalChange(formatted);
        return;
      }

      if (language === 'sql') {
        const { format } = await import("sql-formatter");
        const formatted = format(localValue, {
          language: 'postgresql',
          keywordCase: 'upper',
          tabWidth: 2
        });
        if (formatted) handleLocalChange(formatted);
        return;
      }

      const [prettierMod, babelMod, estreeMod, htmlMod, postcssMod, markdownMod, yamlMod, graphqlMod] = await Promise.all([
        import("prettier/standalone"),
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
        import("prettier/plugins/html"),
        import("prettier/plugins/postcss"),
        import("prettier/plugins/markdown"),
        import("prettier/plugins/yaml"),
        import("prettier/plugins/graphql")
      ]);

      const prettier = prettierMod.default || prettierMod;
      const prettierPluginBabel = babelMod.default || babelMod;
      const prettierPluginEstree = estreeMod.default || estreeMod;
      const prettierPluginHtml = htmlMod.default || htmlMod;
      const prettierPluginCss = postcssMod.default || postcssMod;
      const prettierPluginMarkdown = markdownMod.default || markdownMod;
      const prettierPluginYaml = yamlMod.default || yamlMod;
      const prettierPluginGraphql = graphqlMod.default || graphqlMod;

      let parser = "babel";
      let plugins: any[] = [prettierPluginBabel, prettierPluginEstree];

      if (language === 'html') {
        parser = "html";
        plugins = [prettierPluginHtml];
      } else if (language === 'css' || language === 'scss' || language === 'less') {
        parser = language;
        plugins = [prettierPluginCss];
      } else if (language === 'markdown' || language === 'md') {
        parser = "markdown";
        plugins = [prettierPluginMarkdown];
      } else if (language === 'yaml') {
        parser = "yaml";
        plugins = [prettierPluginYaml];
      } else if (language === 'graphql') {
        parser = "graphql";
        plugins = [prettierPluginGraphql];
      } else if (language === 'json') {
        parser = "json";
        plugins = [prettierPluginBabel, prettierPluginEstree];
      } else if (language === 'java') {
        const javaPluginMod = await import("prettier-plugin-java");
        const javaPlugin = javaPluginMod.default || javaPluginMod;
        parser = "java";
        plugins = [javaPlugin];
      } else if (language === 'python') {
        const pythonPluginMod = await import("@prettier/plugin-python");
        const pythonPlugin = pythonPluginMod.default || pythonPluginMod;
        parser = "python";
        plugins = [pythonPlugin];
      } else if (language === 'typescript' || language === 'tsx') {
        parser = "babel-ts";
        plugins = [prettierPluginBabel, prettierPluginEstree];
      } else if (language === 'javascript' || language === 'jsx') {
        parser = "babel";
        plugins = [prettierPluginBabel, prettierPluginEstree];
      }

      const formatted = await prettier.format(localValue, {
        parser,
        plugins,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "es5",
      });

      if (formatted) {
        handleLocalChange(formatted);
      }
    } catch (err) {
      console.error("Formatting error:", err);
    }
  };

  const activeFileBookmarks = useMemo(() => {
    return (bookmarks || [])
      .filter((b) => b.filename === filename)
      .map((b) => b.lineNumber);
  }, [bookmarks, filename]);

  const editorExtensions = useMemo(() => {
    let base = getCodeMirrorExtensions(language, activeFileBookmarks);
    if (!wordWrap) {
      base = base.filter(ext => ext !== EditorView.lineWrapping);
    }
    const shortcuts = keymap.of([
      { key: 'Mod-p', run: () => { onShowQuickOpen?.(); return true; } },
      { key: 'Mod-Shift-p', run: () => { onShowCommandPalette?.(); return true; } },
      { key: 'Mod-k', run: () => { setShowInlineAI(true); return true; } },
      { key: 'Mod-s', run: (view) => { onSaveToLocal?.(); return true; } },
      { key: 'Mod-Shift-s', run: () => { onSaveSelectedAsSnippet?.(); return true; } },
      { key: 'Mod-Alt-s', run: () => { onSetMobileView?.('chat'); return true; } },
      { key: 'Ctrl-Alt-b', run: () => { toggleCurrentLineBookmark(); return true; } },
    ]);

    const virtualShortcutsHandler = EditorView.domEventHandlers({
      keydown: (event, view) => {
        if (isCtrlActive) {
          const key = event.key.toLowerCase();
          if (['v', 'c', 'x', 'z', 'y', 'a', 'f'].includes(key)) {
            event.preventDefault();
            event.stopPropagation();
            executeVirtualShortcut(key);
            return true;
          }
        }
        return false;
      },
      beforeinput: (event: any, view) => {
        if (isCtrlActive && event.data) {
          const key = event.data.toLowerCase();
          if (['v', 'c', 'x', 'z', 'y', 'a', 'f'].includes(key)) {
            event.preventDefault();
            event.stopPropagation();
            executeVirtualShortcut(key);
            return true;
          }
        }
        return false;
      }
    });

    const mobileInputHandler = EditorView.inputHandler.of((view, from, to, text) => {
      if (isCtrlActive && text && text.length === 1) {
        const char = text.toLowerCase();
        if (['v', 'c', 'x', 'z', 'y', 'a', 'f'].includes(char)) {
          executeVirtualShortcut(char);
          return true; // handled, don't insert the character
        }
      }
      return false;
    });

    return [...base, shortcuts, virtualShortcutsHandler, mobileInputHandler];
  }, [language, activeFileBookmarks, wordWrap, onShowQuickOpen, onShowCommandPalette, onSaveToLocal, onSaveSelectedAsSnippet, onSetActiveTab, onSetMobileView, toggleCurrentLineBookmark, isCtrlActive, isShiftActive, isAltActive, executeVirtualShortcut]);

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* VS Code Style Dynamic Tabs */}
      <div className="h-9 flex items-center justify-between select-none border-b border-border bg-sidebar shrink-0">
        <button 
          onClick={onMenuClick}
          className="h-full px-3 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border-r border-[#2b2b2b] shrink-0"
          title="Toggle Sidebar"
        >
          <Menu size={16} />
        </button>
        <div className="flex items-center overflow-x-auto no-scrollbar h-full scroll-smooth flex-1 touch-pan-x">
          {activeFiles.map((fname) => {
            const isSelected = filename === fname;
            const extension = fname.split('.').pop()?.toLowerCase() || '';
            const fileName = fname.split('/').pop() || fname;
            const officialIconUrl = getOfficialIcon(fileName);
            
            let FileIcon = File;
            let iconColor = 'text-zinc-500';
            
            if (!officialIconUrl) {
              if (extension === 'html') { FileIcon = FileCode; iconColor = 'text-orange-500'; }
              if (extension === 'css') { FileIcon = FileCode; iconColor = 'text-blue-500'; }
              if (extension === 'js' || extension === 'ts' || extension === 'tsx') { FileIcon = FileJson; iconColor = 'text-yellow-500'; }
            }

            return (
              <div 
                key={fname}
                onClick={() => onFileSelect?.(fname)}
                className={`
                  h-full flex items-center gap-2 px-3 min-w-[120px] max-w-[200px] cursor-pointer group transition-all relative border-r border-border
                  ${isSelected ? 'bg-background text-white active-tab-indicator' : 'bg-sidebar/50 text-[#969696] hover:bg-sidebar'}
                `}
              >
                {isSelected && <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white z-10" />}
                {officialIconUrl ? (
                  <img src={officialIconUrl} alt={extension} className="object-contain" style={{ width: fileIconSize, height: fileIconSize }} />
                ) : (
                  <VSCodeDefaultFileIcon size={fileIconSize} className={iconColor} />
                )}
                <span className="text-[11px] truncate flex-1 font-sans">{fname.split('/').pop()}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onCloseFile?.(fname); }}
                  className={`p-0.5 rounded-sm hover:bg-white/10 transition-colors ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2 px-2 h-full bg-sidebar">
          <button 
            onClick={onToggleSplit}
            className="hidden p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            title="Split Editor"
          >
            <Codicon name="split-horizontal" size={16} />
          </button>

          {isSplitPane && (
            <button 
              onClick={onClosePane}
              className="flex p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              title="Close Pane"
            >
              <X size={16} />
            </button>
          )}

          <button 
            onClick={toggleCurrentLineBookmark}
            className={`w-7 h-7 rounded-none border transition-all flex items-center justify-center shrink-0 ${
              isCurrentLineBookmarked
                ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30'
                : 'bg-[#2d2d30] border-[#3e3e42] text-zinc-400 hover:text-white hover:bg-[#3d3d40]'
            }`}
            title="Toggle Bookmark (Ctrl+Alt+B)"
          >
            <Bookmark size={13} className={isCurrentLineBookmarked ? "fill-current" : ""} />
          </button>

          <div className="relative inline-flex flex-col items-start cursor-pointer select-none" style={{ touchAction: 'none' }}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="bg-[#2d2d30] border border-[#3e3e42] text-[#cccccc] w-7 h-7 rounded-none flex items-center justify-center shrink-0 outline-none hover:bg-[#3d3d40] transition-colors"
              aria-label="Menu"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                <path d="M12 3 L3 21 L12 14 L21 21 Z"/>
              </svg>
            </button>

            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute top-[100%] right-0 mt-2 bg-sidebar border border-border rounded-none shadow-[0_8px_24px_rgba(0,0,0,0.45)] min-w-[180px] p-1 z-50">
                  <div 
                    onClick={() => { onCreateNewProject?.(); setShowMoreMenu(false); }}
                    className="px-3 py-2 text-[#cccccc] text-[13px] flex items-center rounded cursor-pointer whitespace-nowrap transition-all duration-[50ms] hover:bg-[#094771] hover:text-white active:bg-[#094771]/70 outline-none"
                  >
                    New project
                  </div>
                  <div className="h-[1px] bg-[#3e3e42] mx-2 my-1"></div>
                  <div 
                    onClick={() => { handleFormat?.(); setShowMoreMenu(false); }}
                    className="px-3 py-2 text-[#cccccc] text-[13px] flex items-center rounded cursor-pointer whitespace-nowrap transition-all duration-[50ms] hover:bg-[#094771] hover:text-white active:bg-[#094771]/70 outline-none"
                  >
                    Format code
                  </div>
                  <div 
                    onClick={() => { onPlay?.(); setShowMoreMenu(false); }}
                    className="px-3 py-2 text-[#cccccc] text-[13px] flex items-center rounded cursor-pointer whitespace-nowrap transition-all duration-[50ms] hover:bg-[#094771] hover:text-white active:bg-[#094771]/70 outline-none"
                  >
                    Show Preview
                  </div>
                  {onToggleSplit && (
                    <div 
                      onClick={() => { onToggleSplit(); setShowMoreMenu(false); }}
                      className="px-3 py-2 text-[#cccccc] text-[13px] flex items-center rounded cursor-pointer whitespace-nowrap transition-all duration-[50ms] hover:bg-[#094771] hover:text-white active:bg-[#094771]/70 outline-none"
                    >
                      Split Editor
                    </div>
                  )}
                  {(!isSplitPane || isBottomPane) && (
                    <div 
                      onClick={() => { setIsKeyboardToolbarHidden(!isKeyboardToolbarHidden); setShowMoreMenu(false); }}
                      className="px-3 py-2 text-[#cccccc] text-[13px] flex items-center rounded cursor-pointer whitespace-nowrap transition-all duration-[50ms] hover:bg-[#094771] hover:text-white active:bg-[#094771]/70 outline-none"
                    >
                      {isKeyboardToolbarHidden ? 'Show Keyboard Toolbar' : 'Hide Keyboard Toolbar'}
                    </div>
                  )}
                  <div 
                    onClick={() => { setWordWrap(!wordWrap); setShowMoreMenu(false); }}
                    className="px-3 py-2 text-[#cccccc] text-[13px] flex items-center rounded cursor-pointer whitespace-nowrap transition-all duration-[50ms] hover:bg-[#094771] hover:text-white active:bg-[#094771]/70 outline-none"
                  >
                    {wordWrap ? 'Word Wrap – Disable' : 'Word Wrap – Enable'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      
      {/* VS Code Breadcrumb Bar */}
      <div 
        className="h-[22px] flex items-center px-4 gap-1 text-[11px] select-none border-b border-border overflow-x-auto no-scrollbar whitespace-nowrap" 
        style={{ 
          backgroundColor: 'var(--color-background)', 
          color: 'var(--color-foreground-muted)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}
      >
        <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
          <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="font-semibold">reversx-workspace</span>
        </div>
        
        {(() => {
          const cleanPath = filename.startsWith('/') ? filename.slice(1) : filename;
          const segments = cleanPath.split('/').filter(Boolean);
          
          return segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const isFolder = !isLast;
            
            let fileIcon = <File size={11} className="text-zinc-400" />;
            if (isLast) {
              const ext = segment.split('.').pop()?.toLowerCase() || '';
              const officialIconUrl = getOfficialIcon(segment);
              if (officialIconUrl) {
                fileIcon = (
                  <img 
                    src={officialIconUrl} 
                    alt={ext} 
                    className="object-contain shrink-0" 
                    style={{ width: 11, height: 11 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                );
              } else {
                if (ext === 'html') fileIcon = <FileCode size={11} className="text-orange-500" />;
                else if (ext === 'css') fileIcon = <FileCode size={11} className="text-teal-400" />;
                else if (ext === 'json') fileIcon = <FileJson size={11} className="text-yellow-500" />;
                else if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) fileIcon = <FileCode size={11} className="text-blue-400" />;
              }
            }
            
            return (
              <React.Fragment key={index}>
                <ChevronRight size={11} className="opacity-40 shrink-0" />
                <div 
                  className={`flex items-center gap-1 px-0.5 rounded transition-colors ${
                    isLast 
                      ? 'text-[#cccccc] font-semibold' 
                      : 'hover:text-white cursor-pointer'
                  }`}
                >
                  {isFolder ? (
                    <img 
                      src={getFolderIcon(segment, false)} 
                      alt={segment} 
                      className="object-contain shrink-0" 
                      style={{ width: 13, height: 13 }}
                    />
                  ) : (
                    <span className="shrink-0">{fileIcon}</span>
                  )}
                  <span>{segment}</span>
                </div>
              </React.Fragment>
            );
          });
        })()}
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden bg-background flex flex-col">
            {showInlineAI && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-sidebar border border-[#3e3e42] rounded-none shadow-2xl z-[100] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles size={14} />
                    <span className="text-[11px] font-bold  tracking-wider">AI Inline Edit</span>
                  </div>
                  <button onClick={() => setShowInlineAI(false)} className="text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    autoFocus
                    value={inlineAIPrompt}
                    onChange={(e) => setInlineAIPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleInlineAI();
                      }
                      if (e.key === 'Escape') {
                        setShowInlineAI(false);
                      }
                    }}
                    placeholder="Describe how to change the code... (Enter to apply)"
                    className="w-full bg-background border border-[#3e3e42] rounded-none p-2 text-[13px] text-white focus:outline-none focus:border-accent min-h-[80px] resize-none"
                  />
                  {inlineAILoading && (
                    <div className="absolute inset-0 bg-sidebar/50 flex items-center justify-center rounded-none">
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>ESC to cancel</span>
                  <span>ENTER to generate</span>
                </div>
              </div>
            )}
            {language === 'image' || filename.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i) ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto relative" style={{ backgroundColor: 'var(--color-background)' }}>
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 <img src={localValue} alt={filename} className="max-w-full max-h-full object-contain rounded shadow-lg ring-1 ring-white/10 z-10" />
                 <div className="mt-6 text-white/50 text-[11px] font-mono select-all z-10 bg-black/40 px-3 py-1.5 rounded border border-white/5 flex items-center justify-center">
                    {filename} • {Math.round(localValue.length / 1024)} KB
                 </div>
              </div>
            ) : (
              <div 
                className="flex-1 flex flex-col overflow-hidden relative"
                onContextMenu={handleEditorContextMenu}
              >
                <CoreEditor
                  value={localValue}
                  language={language}
                  theme={SYNTAX_THEMES[syntaxThemeName] || vscodeDark}
                  extensions={editorExtensions}
                  onChange={(val) => handleLocalChange(val || '')}
                  onUpdate={handleEditorUpdate}
                  onCreateEditor={(view) => {
                    viewRef.current = view;
                    onSetActiveEditor?.(view);
                  }}
                  fontSize={fontSize || 13}
                  lineHeight={lineHeight}
                  fontFamily={fontFamily || '"JetBrains Mono", monospace'}
                />

                {floatingToolbar?.show && (
                  <div 
                    style={{
                      position: 'fixed',
                      left: `${floatingToolbar.x}px`,
                      top: `${floatingToolbar.y}px`,
                      transform: 'translate(-50%, -130%)',
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="z-[9999] flex items-center bg-zinc-900/95 border border-zinc-800/80 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.4)] p-1 text-zinc-200 select-none animate-in fade-in zoom-in-95 duration-100 backdrop-blur-sm gap-1"
                  >
                    <button 
                      onClick={handleCut}
                      disabled={floatingToolbar.selectionEmpty}
                      title="Cut"
                      className="p-1.5 hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-full transition-colors"
                    >
                      <Scissors size={14} className="stroke-[2.5]" />
                    </button>
                    <button 
                      onClick={handleCopy}
                      disabled={floatingToolbar.selectionEmpty}
                      title="Copy"
                      className="p-1.5 hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-full transition-colors"
                    >
                      <Copy size={14} className="stroke-[2.5]" />
                    </button>
                    <button 
                      onClick={handlePaste}
                      title="Paste"
                      className="p-1.5 hover:bg-zinc-800 active:bg-zinc-700 rounded-full transition-colors"
                    >
                      <Clipboard size={14} className="stroke-[2.5]" />
                    </button>
                    <div className="w-[1px] h-4 bg-zinc-800 my-auto" />
                    <button 
                      onClick={handleSelectAll}
                      title="Select All"
                      className="p-1.5 hover:bg-zinc-800 active:bg-zinc-700 rounded-full transition-colors"
                    >
                      <CheckSquare size={14} className="stroke-[2.5]" />
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Professional Minimalist Mobile Keyboard Toolbar */}
      {!isKeyboardToolbarHidden && (!isSplitPane || isBottomPane) && (
        <MobileKeyboardToolbar 
          onAction={handleKeyboardAction}
          onInsert={insertText}
          onHide={() => setIsKeyboardToolbarHidden(true)}
          onShowQuickOpen={onShowQuickOpen}
          onShowCommandPalette={onShowCommandPalette}
          symbols={symbols}
          isCtrlActive={isCtrlActive}
          isShiftActive={isShiftActive}
          isAltActive={isAltActive}
          onToggleCtrl={() => setIsCtrlActive(prev => !prev)}
          onToggleShift={() => setIsShiftActive(prev => !prev)}
          onToggleAlt={() => setIsAltActive(prev => !prev)}
        />
      )}
    </div>

      {/* Paste Fallback Modal */}
      <React.Fragment>
        {showPasteModal && (
          <div key="paste-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div 
              
              
              
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-none p-6 shadow-2xl"
            >
              <h3 className="text-lg font-normal text-foreground mb-2">Paste Content</h3>
              <p className="text-sm text-foreground/50 mb-4">
                Direct clipboard access is blocked by your browser's security policy. 
                Please paste your code below and click "Insert".
              </p>
              <textarea
                autoFocus
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full h-40 bg-background border border-border rounded-none p-3 text-sm font-roboto text-foreground focus:outline-none focus:border-accent resize-none mb-4"
                placeholder="Paste your code here..."
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowPasteModal(false);
                    setPasteValue('');
                  }}
                  className="px-4 py-2 text-sm font-normal text-foreground/50 hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleManualPaste}
                  className="px-6 py-2 bg-accent text-accent-foreground text-sm font-normal rounded-none hover:bg-accent/90 transition-colors"
                >
                  Insert Code
                </button>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    </div>
  );
});

MemoizedCodeEditor.displayName = 'MemoizedCodeEditor';
