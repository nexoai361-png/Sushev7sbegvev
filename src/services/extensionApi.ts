/**
 * Code Editor Extension API Support
 * Exposes clean, typed JavaScript/TypeScript interfaces for in-app extension scripting
 * and interacts with the React and CodeMirror environments.
 */

export interface FileInfo {
  path: string;
  code: string;
  language: string;
}

export interface ExtensionConfig {
  id: string;
  name: string;
  description?: string;
  version?: string;
  author?: string;
  activate: (context: ExtensionContext) => void | Promise<void>;
  deactivate?: () => void | Promise<void>;
}

export interface ExtensionContext {
  editor: typeof extensionEditorAPI;
  commands: typeof extensionCommandsAPI;
  events: typeof extensionEventsAPI;
  ui: typeof extensionUiAPI;
}

// Global active editor reference managed inside React
let activeEditorView: any = null;
let appState: {
  files: Record<string, { code: string; language: string }>;
  setFiles: React.Dispatch<React.SetStateAction<Record<string, { code: string; language: string }>>>;
  activeFile: string;
  setActiveFile: (path: string) => void;
  openFiles: string[];
  setOpenFiles: React.Dispatch<React.SetStateAction<string[]>>;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  executeProjectCommand?: (id: string, ...args: any[]) => any;
} | null = null;

// Registry of commands
const commandsRegistry = new Map<string, (...args: any[]) => any>();

// Event listeners
const eventListeners = new Map<string, Set<(...args: any[]) => void>>();

export function registerEventListener(event: string, callback: (...args: any[]) => void) {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, new Set());
  }
  eventListeners.get(event)!.add(callback);
}

export function unregisterEventListener(event: string, callback: (...args: any[]) => void) {
  const listeners = eventListeners.get(event);
  if (listeners) {
    listeners.delete(callback);
  }
}

export function triggerEvent(event: string, ...args: any[]) {
  const listeners = eventListeners.get(event);
  if (listeners) {
    listeners.forEach(callback => {
      try {
        callback(...args);
      } catch (e) {
        console.error(`Error in event listener for ${event}:`, e);
      }
    });
  }

  // Forward events to Backend Express API if in browser context
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    window.fetch('/api/editor/emit-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data: args[0] })
    }).catch(err => {
      // Sliently fail if backend offline
    });
  }
}

// Synchronize state from React App to Extension Manager
export function syncReactState(
  view: any,
  state: typeof appState,
) {
  activeEditorView = view;
  appState = state;
}

// ----------------------------------------------------
// Editor API Implementation
// ----------------------------------------------------
export const extensionEditorAPI = {
  // File operations
  files: {
    list(): string[] {
      if (!appState) return [];
      return Object.keys(appState.files);
    },

    read(path: string): FileInfo | null {
      if (!appState || !appState.files[path]) return null;
      return {
        path,
        code: appState.files[path].code,
        language: appState.files[path].language
      };
    },

    /**
     * Reads a specific portion of a file's content
     */
    readRange(
      path: string,
      options: { startLine?: number; endLine?: number; offset?: number; length?: number }
    ): string | null {
      if (!appState || !appState.files[path]) return null;
      const code = appState.files[path].code;

      if (options.offset !== undefined) {
        const offset = options.offset;
        const length = options.length !== undefined ? options.length : code.length - offset;
        return code.substring(offset, offset + length);
      }

      if (options.startLine !== undefined) {
        const lines = code.split('\n');
        const start = Math.max(0, options.startLine - 1);
        const end = options.endLine !== undefined ? Math.min(lines.length, options.endLine) : start + 1;
        return lines.slice(start, end).join('\n');
      }

      return code;
    },

    write(path: string, code: string, language?: string): boolean {
      if (!appState) return false;
      
      appState.setFiles(prev => {
        const existing = prev[path];
        const finalLanguage = language || existing?.language || 'javascript';
        return {
          ...prev,
          [path]: { code, language: finalLanguage }
        };
      });

      triggerEvent('file:changed', { path, code, language });
      return true;
    },

    /**
     * Write multiple files at once (Bulk Write)
     */
    writeFiles(filesMap: Record<string, { code: string; language?: string }>): Record<string, boolean> {
      const results: Record<string, boolean> = {};
      if (!appState) return results;

      appState.setFiles(prev => {
        const next = { ...prev };
        Object.entries(filesMap).forEach(([path, data]) => {
          const finalLanguage = data.language || prev[path]?.language || 'javascript';
          next[path] = { code: data.code, language: finalLanguage };
          results[path] = true;
          triggerEvent('file:changed', { path, code: data.code, language: finalLanguage });
        });
        return next;
      });

      return results;
    },

    delete(path: string): boolean {
      if (!appState) return false;
      if (!appState.files[path]) return false;

      appState.setFiles(prev => {
        const next = { ...prev };
        delete next[path];
        return next;
      });

      triggerEvent('file:deleted', { path });
      return true;
    },

    /**
     * Delete multiple files at once (Bulk Delete)
     */
    deleteFiles(paths: string[]): Record<string, boolean> {
      const results: Record<string, boolean> = {};
      if (!appState) return results;

      appState.setFiles(prev => {
        const next = { ...prev };
        paths.forEach(path => {
          if (prev[path]) {
            delete next[path];
            results[path] = true;
            triggerEvent('file:deleted', { path });
          } else {
            results[path] = false;
          }
        });
        return next;
      });

      return results;
    },

    /**
     * Execute a transaction/batch of mixed file updates and deletions
     */
    batch(operations: Array<
      | { type: 'write'; path: string; code: string; language?: string }
      | { type: 'delete'; path: string }
    >): { success: boolean; results: Record<string, boolean> } {
      const results: Record<string, boolean> = {};
      if (!appState) return { success: false, results };

      appState.setFiles(prev => {
        const next = { ...prev };
        operations.forEach((op, index) => {
          const key = `${op.type}_${op.path}_${index}`;
          try {
            if (op.type === 'write') {
              const finalLanguage = op.language || prev[op.path]?.language || 'javascript';
              next[op.path] = { code: op.code, language: finalLanguage };
              results[key] = true;
              triggerEvent('file:changed', { path: op.path, code: op.code, language: finalLanguage });
            } else if (op.type === 'delete') {
              if (prev[op.path] || next[op.path]) {
                delete next[op.path];
                results[key] = true;
                triggerEvent('file:deleted', { path: op.path });
              } else {
                results[key] = false;
              }
            }
          } catch (e) {
            results[key] = false;
          }
        });
        return next;
      });

      return { success: true, results };
    },

    // Active File operations
    active: {
      get(): { path: string; code: string; language: string; selection?: any } | null {
        if (!appState || !appState.activeFile) return null;
        const file = appState.files[appState.activeFile];
        if (!file) return null;

        let selection = null;
        if (activeEditorView) {
          try {
            if (activeEditorView.state?.selection?.main) {
              const mainSelection = activeEditorView.state.selection.main;
              selection = {
                anchor: mainSelection.anchor,
                head: mainSelection.head,
                from: mainSelection.from,
                to: mainSelection.to
              };
            } else if (typeof activeEditorView.getSelection === 'function') {
              selection = activeEditorView.getSelection();
            }
          } catch (e) {
            console.warn("Could not retrieve selection:", e);
          }
        }

        return {
          path: appState.activeFile,
          code: file.code,
          language: file.language,
          selection
        };
      },

      set(path: string): boolean {
        if (!appState || !appState.files[path]) return false;
        appState.setActiveFile(path);
        
        if (appState.setOpenFiles && !appState.openFiles.includes(path)) {
          appState.setOpenFiles(prev => prev.includes(path) ? prev : [...prev, path]);
        }
        
        triggerEvent('activeFile:changed', { path });
        return true;
      },

      getContent(): string {
        if (!appState || !appState.activeFile) return '';
        return appState.files[appState.activeFile]?.code || '';
      },

      setContent(code: string): boolean {
        if (!appState || !appState.activeFile) return false;
        const curPath = appState.activeFile;
        const lang = appState.files[curPath]?.language || 'javascript';
        
        appState.setFiles(prev => ({
          ...prev,
          [curPath]: { code, language: lang }
        }));

        triggerEvent('file:changed', { path: curPath, code, language: lang });
        return true;
      },

      getSelection(): { text: string; from: number; to: number } | null {
        if (!activeEditorView) return null;
        try {
          if (activeEditorView.state) {
            const selection = activeEditorView.state.selection.main;
            const text = activeEditorView.state.doc.sliceString(selection.from, selection.to);
            return {
              text,
              from: selection.from,
              to: selection.to
            };
          }
        } catch (e) {
          console.warn("Error getting selection", e);
        }
        return null;
      },

      setSelection(anchor: number, head?: number): boolean {
        if (!activeEditorView) return false;
        try {
          activeEditorView.dispatch({
            selection: { anchor, head: head !== undefined ? head : anchor },
            scrollIntoView: true
          });
          return true;
        } catch (e) {
          console.error("Error setting selection:", e);
          return false;
        }
      },

      insertText(text: string): boolean {
        if (!activeEditorView) return false;
        try {
          const selection = activeEditorView.state.selection.main;
          activeEditorView.dispatch({
            changes: { from: selection.from, to: selection.to, insert: text },
            selection: { anchor: selection.from + text.length }
          });
          return true;
        } catch (e) {
          console.error("Error inserting text:", e);
          return false;
        }
      }
    }
  }
};

const registeredExtensions = new Map<string, ExtensionConfig>();

export const extensionCommandsAPI = {
  register(id: string, callback: (...args: any[]) => any) {
    commandsRegistry.set(id, callback);
    triggerEvent('command:registered', { id });
  },

  unregister(id: string) {
    commandsRegistry.delete(id);
    triggerEvent('command:unregistered', { id });
  },

  execute(id: string, ...args: any[]): any {
    const cmd = commandsRegistry.get(id);
    if (cmd) {
      try {
        return cmd(...args);
      } catch (e) {
        console.error(`Error executing custom command ${id}:`, e);
        throw e;
      }
    }
    
    // Fall back to main React project native commands if configured
    if (appState && appState.executeProjectCommand) {
      return appState.executeProjectCommand(id, ...args);
    }

    console.warn(`Command "${id}" not found.`);
    return undefined;
  },

  list(): string[] {
    return Array.from(commandsRegistry.keys());
  }
};

export const extensionEventsAPI = {
  on: registerEventListener,
  off: unregisterEventListener
};

export const extensionUiAPI = {
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    if (appState && typeof appState.showNotification === 'function') {
      appState.showNotification(message, type);
    } else {
      console.log(`[Notification - ${type}] ${message}`);
    }
  }
};

const extensionContext: ExtensionContext = {
  editor: extensionEditorAPI,
  commands: extensionCommandsAPI,
  events: extensionEventsAPI,
  ui: extensionUiAPI
};

export const extensionManagerAPI = {
  register(config: ExtensionConfig) {
    if (registeredExtensions.has(config.id)) {
      console.warn(`Extension "${config.id}" is already registered. Re-activating.`);
      this.unregister(config.id);
    }
    
    registeredExtensions.set(config.id, config);
    try {
      config.activate(extensionContext);
      console.log(`Extension "${config.name}" (${config.id}) activated successfully!`);
    } catch (e) {
      console.error(`Failed to activate extension "${config.id}":`, e);
    }
  },

  unregister(id: string) {
    const config = registeredExtensions.get(id);
    if (config) {
      if (typeof config.deactivate === 'function') {
        try {
          config.deactivate();
        } catch (e) {
          console.error(`Error deactivating extension "${id}":`, e);
        }
      }
      registeredExtensions.delete(id);
      console.log(`Extension "${config.name}" (${id}) unregistered.`);
    }
  },

  listActive(): { id: string; name: string; description?: string }[] {
    return Array.from(registeredExtensions.values()).map(ext => ({
      id: ext.id,
      name: ext.name,
      description: ext.description
    }));
  }
};

// Export raw APIs combined into a global object
export const EditorAPI = {
  editor: extensionEditorAPI,
  commands: extensionCommandsAPI,
  events: extensionEventsAPI,
  ui: extensionUiAPI,
  extensions: extensionManagerAPI
};

// Set on window for browser-side access
if (typeof window !== 'undefined') {
  (window as any).EditorAPI = EditorAPI;
}
