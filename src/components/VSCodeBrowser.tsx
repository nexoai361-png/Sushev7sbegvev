import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  X, 
  Star, 
  History as HistoryIcon, 
  Plus, 
  Moon, 
  Sun, 
  Search, 
  Globe, 
  Home, 
  ExternalLink, 
  BookOpen, 
  Check, 
  Trash2, 
  Compass, 
  Sparkles,
  Info
} from 'lucide-react';
import { MarkdownPreview } from './MarkdownRenderer';

export interface Tab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
}

export interface BookmarkItem {
  title: string;
  url: string;
  createdAt: number;
}

interface VSCodeBrowserProps {
  combinedHtml: string;
  isMarkdownFile?: boolean;
  markdownCode?: string;
  appThemeName?: string;
  onClose: () => void;
}

const DEFAULT_SHORTCUTS = [
  { title: 'Local Preview', url: 'app://preview', icon: Sparkles, isLocal: true },
  { title: 'Markdown View', url: 'app://markdown', icon: BookOpen, isLocal: true },
  { title: 'React Docs', url: 'https://react.dev' },
  { title: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
  { title: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  { title: 'Google', url: 'https://google.com' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com' },
];

export function VSCodeBrowser({
  combinedHtml,
  isMarkdownFile = false,
  markdownCode = '',
  appThemeName = 'dark',
  onClose
}: VSCodeBrowserProps) {
  // Theme state: default to matching current editor theme, but user can toggle
  const [isDark, setIsDark] = useState(appThemeName.toLowerCase().includes('dark') || appThemeName.toLowerCase().includes('midnight') || appThemeName.toLowerCase().includes('ocean'));

  // Initial tab setup
  const initialUrl = isMarkdownFile ? 'app://markdown' : 'app://preview';
  const initialTitle = isMarkdownFile ? 'Markdown View' : 'Local Preview';

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: initialTitle,
      url: initialUrl,
      history: [initialUrl],
      historyIndex: 0
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Input value for the URL bar (changes as user types)
  const [urlInput, setUrlInput] = useState<string>(initialUrl);

  // Bookmarks & History lists
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('vscode_browser_bookmarks');
      return saved ? JSON.parse(saved) : [
        { title: 'React Official Docs', url: 'https://react.dev', createdAt: Date.now() },
        { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com', createdAt: Date.now() }
      ];
    } catch {
      return [];
    }
  });

  const [globalHistory, setGlobalHistory] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('vscode_browser_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dropdown states
  const [showBookmarksDropdown, setShowBookmarksDropdown] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // Loading animations state
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0); // key to force reload iframe/markdown

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Find active tab helper
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Sync url bar when active tab changes
  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId, activeTab?.url]);

  // Save Bookmarks and History
  useEffect(() => {
    localStorage.setItem('vscode_browser_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('vscode_browser_history', JSON.stringify(globalHistory));
  }, [globalHistory]);

  // Simulate progress bar loading
  const triggerLoadingProgress = () => {
    setIsIframeLoading(true);
    setLoadingProgress(10);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);
  };

  const finishLoadingProgress = () => {
    setLoadingProgress(100);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setTimeout(() => {
      setLoadingProgress(0);
      setIsIframeLoading(false);
    }, 200);
  };

  // Add search/url navigation
  const navigateTabTo = (targetUrl: string, updateHistory = true) => {
    let finalUrl = targetUrl.trim();
    if (!finalUrl) return;

    // Check if it's a direct browser action or local virtual app
    const isLocalApp = finalUrl.startsWith('app://');

    if (!isLocalApp) {
      // Regex check if input looks like a valid domain or IP
      const hasProtocol = /^https?:\/\//i.test(finalUrl);
      const isDomain = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(finalUrl);
      const isLocalhost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:[0-9]{1,5})?(\/.*)?$/i.test(finalUrl);

      if (hasProtocol) {
        // has valid http or https
      } else if (isDomain || isLocalhost) {
        finalUrl = 'https://' + finalUrl;
      } else {
        // treat as search query on DuckDuckGo (iframe-friendly)
        finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(finalUrl)}`;
      }

      // If running natively inside Capacitor APK, open natively!
      if (Capacitor.isNativePlatform()) {
        try {
          Browser.open({ url: finalUrl });
        } catch (err) {
          console.error("Error opening natively with @capacitor/browser:", err);
        }
      }
    }

    // Determine title
    let tabTitle = 'Loading...';
    if (finalUrl === 'app://preview') tabTitle = 'Local Preview';
    else if (finalUrl === 'app://markdown') tabTitle = 'Markdown View';
    else if (finalUrl === 'app://newtab') tabTitle = 'New Tab';
    else {
      try {
        const urlObj = new URL(finalUrl);
        if (urlObj.hostname.includes('duckduckgo.com')) {
          const q = urlObj.searchParams.get('q');
          tabTitle = q ? `Search: ${q}` : 'DuckDuckGo';
        } else {
          tabTitle = urlObj.hostname.replace('www.', '');
        }
      } catch {
        tabTitle = 'Web Page';
      }
    }

    // Trigger loading
    triggerLoadingProgress();

    // Update global history list
    if (finalUrl !== 'app://newtab') {
      setGlobalHistory(prev => {
        const filtered = prev.filter(h => h.url !== finalUrl);
        return [{ title: tabTitle, url: finalUrl, createdAt: Date.now() }, ...filtered].slice(0, 50);
      });
    }

    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        let newHistory = [...t.history];
        let newIndex = t.historyIndex;

        if (updateHistory) {
          // slice history to remove forward items if we were in middle of stack
          newHistory = newHistory.slice(0, newIndex + 1);
          newHistory.push(finalUrl);
          newIndex = newHistory.length - 1;
        }

        return {
          ...t,
          title: tabTitle,
          url: finalUrl,
          history: newHistory,
          historyIndex: newIndex
        };
      }
      return t;
    }));

    setUrlInput(finalUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigateTabTo(urlInput);
    }
  };

  // Browser control bar actions
  const goBack = () => {
    if (activeTab && activeTab.historyIndex > 0) {
      const nextIndex = activeTab.historyIndex - 1;
      const targetUrl = activeTab.history[nextIndex];
      
      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) {
          return {
            ...t,
            url: targetUrl,
            historyIndex: nextIndex
          };
        }
        return t;
      }));
      setUrlInput(targetUrl);
      triggerLoadingProgress();
    }
  };

  const goForward = () => {
    if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
      const nextIndex = activeTab.historyIndex + 1;
      const targetUrl = activeTab.history[nextIndex];

      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) {
          return {
            ...t,
            url: targetUrl,
            historyIndex: nextIndex
          };
        }
        return t;
      }));
      setUrlInput(targetUrl);
      triggerLoadingProgress();
    }
  };

  const handleReload = () => {
    setReloadKey(prev => prev + 1);
    triggerLoadingProgress();
  };

  const handleHome = () => {
    navigateTabTo('app://newtab');
  };

  // Toggle bookmark for current active URL
  const toggleBookmark = () => {
    const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url));
    } else {
      setBookmarks(prev => [...prev, {
        title: activeTab.title,
        url: activeTab.url,
        createdAt: Date.now()
      }]);
    }
  };

  const isCurrentUrlBookmarked = bookmarks.some(b => b.url === activeTab?.url);

  // Tab management
  const createNewTab = (url = 'app://newtab') => {
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newId,
      title: url === 'app://newtab' ? 'New Tab' : 'Web Page',
      url: url,
      history: [url],
      historyIndex: 0
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    triggerLoadingProgress();
  };

  const closeTab = (tabIdToClose: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Don't close last tab, just make it New Tab
      setTabs([{
        id: 'tab-1',
        title: 'New Tab',
        url: 'app://newtab',
        history: ['app://newtab'],
        historyIndex: 0
      }]);
      setActiveTabId('tab-1');
      return;
    }

    const indexToClose = tabs.findIndex(t => t.id === tabIdToClose);
    const newTabs = tabs.filter(t => t.id !== tabIdToClose);
    setTabs(newTabs);

    if (activeTabId === tabIdToClose) {
      // switch active tab to previous or next
      const newActiveIndex = Math.max(0, indexToClose - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
    }
  };

  // Open the loaded page in an actual new browser window
  const openInNewExternalWindow = () => {
    if (activeTab.url === 'app://preview') {
      // Open our preview in actual new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(combinedHtml);
        newWindow.document.close();
      }
    } else if (activeTab.url === 'app://markdown') {
      const blob = new Blob([markdownCode], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else if (!activeTab.url.startsWith('app://')) {
      if (Capacitor.isNativePlatform()) {
        try {
          Browser.open({ url: activeTab.url });
        } catch (err) {
          console.error("Error opening natively with @capacitor/browser:", err);
        }
      } else {
        window.open(activeTab.url, '_blank');
      }
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-zinc-100 text-zinc-800'} select-none font-sans transition-colors duration-150 relative overflow-hidden`}>
      
      {/* 1. Multiple tabs header bar */}
      <div className={`flex items-center justify-between shrink-0 h-9 px-2 border-b border-solid ${isDark ? 'bg-[#252526] border-[#2b2b2b]' : 'bg-zinc-200 border-zinc-300'}`}>
        <div className="flex items-end h-full overflow-x-auto overflow-y-hidden custom-scrollbar max-w-[85%] pr-4">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center h-8 px-3 ml-[1px] rounded-t-sm cursor-pointer border-r border-solid transition-all min-w-[110px] max-w-[180px] shrink-0 ${
                  isActive 
                    ? isDark ? 'bg-[#1e1e1e] border-[#1e1e1e] text-white font-medium' : 'bg-zinc-100 border-zinc-100 text-zinc-900 font-medium'
                    : isDark ? 'bg-[#2d2d2d] border-[#252526] text-zinc-400 hover:bg-[#333333]' : 'bg-zinc-300 border-zinc-200 text-zinc-600 hover:bg-zinc-400/50'
                }`}
              >
                <Globe size={11} className={`mr-1.5 shrink-0 ${isActive ? 'text-accent' : 'text-zinc-400'}`} />
                <span className="text-[11px] truncate select-none flex-1 tracking-wide">{tab.title}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className={`ml-1.5 w-3.5 h-3.5 rounded-full items-center justify-center flex hover:bg-black/25 text-zinc-400 group-hover:opacity-100 opacity-60`}
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}

          {/* Plus icon to open new browser tab */}
          <button
            onClick={() => createNewTab()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors self-center mb-0.5 ml-1 ${
              isDark ? 'text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900'
            }`}
            title="Open New Tab"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Toolbar general window controls */}
        <div className="flex items-center gap-1">
          {/* Toggle dark/light mode inside the preview browser */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-1 rounded transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-700' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-300'}`}
            title={isDark ? "Switch to Light Frame" : "Switch to Dark Frame"}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* Close browser overlay */}
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Close Preview Browser"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 2. Browser Navigation / Control Toolbar */}
      <div className={`flex items-center gap-2 h-10 px-3 border-b border-solid shrink-0 ${isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-zinc-50 border-zinc-200'}`}>
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            disabled={!activeTab || activeTab.historyIndex <= 0}
            onClick={goBack}
            className={`p-1.5 rounded transition-all ${
              activeTab && activeTab.historyIndex > 0
                ? isDark ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-700 hover:bg-zinc-200'
                : 'text-zinc-500 opacity-30 cursor-not-allowed'
            }`}
            title="Back"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
          </button>
          <button
            disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1}
            onClick={goForward}
            className={`p-1.5 rounded transition-all ${
              activeTab && activeTab.historyIndex < activeTab.history.length - 1
                ? isDark ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-700 hover:bg-zinc-200'
                : 'text-zinc-500 opacity-30 cursor-not-allowed'
            }`}
            title="Forward"
          >
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
          <button
            onClick={handleReload}
            className={`p-1.5 rounded transition-all ${isDark ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-700 hover:bg-zinc-200'}`}
            title="Reload Page"
          >
            <RotateCw size={12} strokeWidth={2.5} className={isIframeLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleHome}
            className={`p-1.5 rounded transition-all ${isDark ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-700 hover:bg-zinc-200'}`}
            title="Browser Homepage"
          >
            <Home size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* URL and Search Bar */}
        <div className="flex-1 relative flex items-center">
          <div className={`absolute left-2.5 flex items-center ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <Search size={11} />
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type web URL or search query..."
            className={`w-full text-[11px] h-6.5 pl-7 pr-8 rounded border border-solid font-mono focus:outline-none transition-all ${
              isDark 
                ? 'bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc] focus:border-accent/50 focus:text-white' 
                : 'bg-white border-zinc-300 text-zinc-800 focus:border-accent/60 focus:ring-1 focus:ring-accent/20'
            }`}
          />
          {/* Bookmark Star Icon at right of URL bar */}
          <button
            onClick={toggleBookmark}
            className={`absolute right-2.5 p-0.5 rounded transition-colors ${
              isCurrentUrlBookmarked 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
            }`}
            title={isCurrentUrlBookmarked ? "Remove Bookmark" : "Bookmark this page"}
          >
            <Star size={12} className={isCurrentUrlBookmarked ? "fill-current" : ""} />
          </button>
        </div>

        {/* Global actions: Bookmarks, History, Open Externally */}
        <div className="flex items-center gap-1 shrink-0 relative">
          
          {/* Bookmarks Dropdown Toggle */}
          <button
            onClick={() => {
              setShowBookmarksDropdown(!showBookmarksDropdown);
              setShowHistoryDropdown(false);
            }}
            className={`p-1.5 rounded transition-all ${
              showBookmarksDropdown 
                ? 'bg-accent/10 text-accent' 
                : isDark ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-700 hover:bg-zinc-200'
            }`}
            title="Saved Bookmarks"
          >
            <Star size={13} strokeWidth={2.5} />
          </button>

          {/* History Dropdown Toggle */}
          <button
            onClick={() => {
              setShowHistoryDropdown(!showHistoryDropdown);
              setShowBookmarksDropdown(false);
            }}
            className={`p-1.5 rounded transition-all ${
              showHistoryDropdown 
                ? 'bg-accent/10 text-accent' 
                : isDark ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-700 hover:bg-zinc-200'
            }`}
            title="Browser History"
          >
            <HistoryIcon size={13} strokeWidth={2.5} />
          </button>

          {/* Open in Standard Browser Window */}
          <button
            onClick={openInNewExternalWindow}
            className={`p-1.5 rounded transition-all ${isDark ? 'text-zinc-200 hover:bg-zinc-700' : 'text-zinc-700 hover:bg-zinc-200'}`}
            title="Open in System Browser"
          >
            <ExternalLink size={12} strokeWidth={2.5} />
          </button>

          {/* --- Dropdown Menus --- */}
          {/* Bookmarks list */}
          {showBookmarksDropdown && (
            <div className={`absolute top-full right-6 mt-1.5 z-50 w-64 rounded border border-solid shadow-2xl overflow-hidden py-1 ${
              isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-white border-zinc-200'
            }`}>
              <div className="flex items-center justify-between px-3 py-1 border-b border-solid border-inherit">
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">Bookmarks</span>
                <span className="text-[9px] opacity-40">{bookmarks.length} saved</span>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {bookmarks.length === 0 ? (
                  <div className="px-3 py-4 text-center text-[10px] opacity-50">No bookmarks saved yet</div>
                ) : (
                  bookmarks.map((b, i) => (
                    <div 
                      key={`${b.url}-${i}`}
                      className={`flex items-center justify-between px-3 py-1.5 text-[11px] cursor-pointer ${
                        isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                      }`}
                      onClick={() => {
                        navigateTabTo(b.url);
                        setShowBookmarksDropdown(false);
                      }}
                    >
                      <div className="flex flex-col truncate flex-1 mr-2">
                        <span className="font-medium truncate">{b.title}</span>
                        <span className="text-[9px] opacity-40 font-mono truncate">{b.url}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookmarks(prev => prev.filter(item => item.url !== b.url));
                        }}
                        className="text-zinc-400 hover:text-red-500 p-0.5 rounded"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* History list */}
          {showHistoryDropdown && (
            <div className={`absolute top-full right-0 mt-1.5 z-50 w-64 rounded border border-solid shadow-2xl overflow-hidden py-1 ${
              isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-white border-zinc-200'
            }`}>
              <div className="flex items-center justify-between px-3 py-1 border-b border-solid border-inherit">
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">Recent History</span>
                <button
                  onClick={() => {
                    setGlobalHistory([]);
                    setShowHistoryDropdown(false);
                  }}
                  className="text-[9px] text-red-500 hover:underline hover:opacity-100 opacity-75"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {globalHistory.length === 0 ? (
                  <div className="px-3 py-4 text-center text-[10px] opacity-50">No history entries</div>
                ) : (
                  globalHistory.map((h, i) => (
                    <div 
                      key={`${h.url}-${i}`}
                      className={`flex flex-col px-3 py-1.5 text-[11px] cursor-pointer ${
                        isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                      }`}
                      onClick={() => {
                        navigateTabTo(h.url);
                        setShowHistoryDropdown(false);
                      }}
                    >
                      <span className="font-medium truncate">{h.title}</span>
                      <span className="text-[9px] opacity-40 font-mono truncate">{h.url}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Loading progress bar */}
      {loadingProgress > 0 && (
        <div className="w-full h-[2px] bg-transparent shrink-0 relative overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-150 shadow-[0_0_8px_var(--accent-color)]"
            style={{ width: `${loadingProgress}%`, '--accent-color': '#007acc' } as React.CSSProperties}
          />
        </div>
      )}

      {/* 4. MAIN VIEWPORT AREA */}
      <div className="flex-1 w-full overflow-hidden relative bg-white">
        
        {/* VIEW 1: Browser Landing / New Tab page */}
        {activeTab.url === 'app://newtab' && (
          <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto custom-scrollbar ${
            isDark ? 'bg-[#1e1e1e] text-zinc-300' : 'bg-zinc-50 text-zinc-800'
          }`}>
            <div className="max-w-md w-full flex flex-col items-center">
              
              {/* Branding Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-md bg-[#007acc] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  B
                </div>
                <div className="text-left">
                  <h1 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>VS Code Browser</h1>
                  <p className="text-[10px] opacity-60 tracking-wider uppercase font-semibold">Web Development Utility</p>
                </div>
              </div>

              <p className="text-[12px] opacity-70 mb-6 max-w-sm leading-relaxed">
                A custom built-in workspace explorer. Load local live previews or test web resources securely.
              </p>

              {/* Large Homepage Search and URL Input */}
              <div className="w-full relative mb-8">
                <input
                  type="text"
                  placeholder="Enter web address or search query..."
                  onKeyDown={handleKeyPress}
                  className={`w-full h-10 px-4 pl-10 rounded-lg border border-solid shadow-md focus:outline-none text-[12px] transition-all font-mono ${
                    isDark 
                      ? 'bg-[#2d2d2d] border-[#3c3c3c] text-white focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/30' 
                      : 'bg-white border-zinc-200 text-zinc-800 focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/10'
                  }`}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <div className="absolute left-3.5 top-3 text-zinc-400">
                  <Search size={14} />
                </div>
              </div>

              {/* Speed Dial / Shortcuts Grid */}
              <div className="w-full text-left mb-6">
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-50 block mb-3 pl-1">Speed Dial / Shortcuts</span>
                <div className="grid grid-cols-4 gap-2">
                  {DEFAULT_SHORTCUTS.map((shortcut, i) => {
                    const IconComp = shortcut.icon || Globe;
                    return (
                      <button
                        key={i}
                        onClick={() => navigateTabTo(shortcut.url)}
                        className={`p-2.5 rounded-lg border border-solid flex flex-col items-center justify-center gap-1.5 transition-all group ${
                          isDark 
                            ? 'bg-[#252526] border-[#2d2d2d] hover:bg-[#2d2d30] hover:border-zinc-700' 
                            : 'bg-white border-zinc-100 hover:bg-zinc-100 hover:border-zinc-300 shadow-sm'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${shortcut.isLocal ? 'bg-[#007acc]/10 text-[#007acc]' : 'bg-zinc-500/10 text-zinc-400'}`}>
                          <IconComp size={15} />
                        </div>
                        <span className="text-[9px] font-medium truncate w-full text-center tracking-wide group-hover:text-accent transition-colors">
                          {shortcut.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Information Footnote */}
              <div className={`w-full p-2.5 rounded flex items-start gap-2.5 text-left border border-solid ${
                isDark ? 'bg-zinc-800/40 border-zinc-700/50' : 'bg-zinc-100/60 border-zinc-200'
              }`}>
                <Info size={13} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed opacity-60">
                  <strong>Sandbox Notice:</strong> Certain highly-secure third party websites like Google, YouTube or StackOverflow forbid framing. Use DuckDuckGo or web-docs links for perfect in-app browsing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Local Application Live Preview (srcDoc) */}
        {activeTab.url === 'app://preview' && (
          <div className="w-full h-full relative bg-white">
            <iframe
              key={`preview-iframe-${reloadKey}`}
              title="VS Code App Live Preview"
              srcDoc={combinedHtml}
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
              onLoad={finishLoadingProgress}
            />
          </div>
        )}

        {/* VIEW 3: Markdown Preview Panel */}
        {activeTab.url === 'app://markdown' && (
          <div className={`w-full h-full overflow-hidden flex flex-col ${isDark ? 'bg-[#1e1e1e]' : 'bg-zinc-50'}`}>
            <div className="flex-1 overflow-auto p-6 custom-scrollbar">
              <MarkdownPreview
                code={markdownCode}
                appThemeName={isDark ? 'dark' : 'light'}
                setAppThemeName={() => {}}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: External Webpages Viewport */}
        {activeTab.url !== 'app://newtab' && activeTab.url !== 'app://preview' && activeTab.url !== 'app://markdown' && (
          <div className="w-full h-full relative bg-white flex flex-col">
            
            {/* Friendly frame overlay helper informing about potential iframe blockages */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1 flex items-center justify-between text-amber-500 text-[10px] shrink-0">
              <div className="flex items-center gap-1.5">
                <Info size={11} className="shrink-0" />
                <span>Websites restricting iframe embedding may load blank. Click external icon to open directly.</span>
              </div>
              <button
                onClick={openInNewExternalWindow}
                className="flex items-center gap-1 hover:underline font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded"
              >
                Open External <ExternalLink size={8} />
              </button>
            </div>

            <iframe
              key={`web-iframe-${activeTab.url}-${reloadKey}`}
              title="VS Code Browser Webpage Frame"
              src={activeTab.url}
              className="flex-1 w-full border-none bg-white"
              sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
              onLoad={finishLoadingProgress}
            />
          </div>
        )}
      </div>

      {/* Inline customized styles for web-iframe overlays */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.25);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.45);
        }
      `}</style>
    </div>
  );
}
