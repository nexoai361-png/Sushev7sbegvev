/**
 * EditorAPI Client-Side SDK helper
 * Supports JS, TS, and Node.js environments.
 * Abstracts REST endpoints and handles live command queue dispatches.
 */

class EditorClient {
  /**
   * @param {string} baseURL - Base URL of the running editor backend (e.g. 'http://0.0.0.0:3000' or '')
   */
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * Get the complete code editor snapshot including files list, current active file, and selection.
   * @returns {Promise<any>}
   */
  async getState() {
    const res = await fetch(`${this.baseURL}/api/editor/state`);
    return res.json();
  }

  /**
   * Get a list of all files currently residing in the active workspace.
   * @returns {Promise<Record<string, { code: string, language: string }>>}
   */
  async getFiles() {
    const res = await fetch(`${this.baseURL}/api/editor/files`);
    return res.json();
  }

  /**
   * Get specific properties of a single target file.
   * @param {string} path - Target relative file path
   * @returns {Promise<any>}
   */
  async getFile(path) {
    const files = await this.getFiles();
    return files[path] || null;
  }

  /**
   * Get details on the currently opened active file and editor selection context.
   * @returns {Promise<any>}
   */
  async getActiveFile() {
    const res = await fetch(`${this.baseURL}/api/editor/active`);
    return res.json();
  }

  /**
   * Create or update code content on a specific workspace file.
   * @param {string} path - Target relative file path (e.g. 'src/index.css')
   * @param {string} code - New file body
   * @param {string} [language] - Code type (defaults to parsing path)
   * @param {boolean} [wait=true] - Synchronously wait for browser thread execution to resolve
   */
  async writeFile(path, code, language = 'javascript', wait = true) {
    return this.dispatch({
      type: 'writeFile',
      path,
      code,
      language,
      wait
    });
  }

  /**
   * Delete an existing workspace file.
   * @param {string} path - Relative file path to delete
   * @param {boolean} [wait=true] - Synchronously wait for browser thread to complete delete
   */
  async deleteFile(path, wait = true) {
    return this.dispatch({
      type: 'deleteFile',
      path,
      wait
    });
  }

  /**
   * Write multiple files at once (Bulk Write).
   * @param {Record<string, { code: string, language?: string }>} filesMap - Dictionary of files
   * @param {boolean} [wait=true] - Synchronously wait for browser thread to write files
   */
  async writeFiles(filesMap, wait = true) {
    return this.dispatch({
      type: 'bulkWrite',
      files: filesMap,
      wait
    });
  }

  /**
   * Delete multiple files at once (Bulk Delete).
   * @param {string[]} pathsArray - File paths list to delete
   * @param {boolean} [wait=true] - Synchronously wait for completion
   */
  async deleteFiles(pathsArray, wait = true) {
    return this.dispatch({
      type: 'bulkDelete',
      paths: pathsArray,
      wait
    });
  }

  /**
   * Read a specific line range or character range from a file.
   * @param {string} path - Relative file path
   * @param {{ startLine?: number, endLine?: number, offset?: number, length?: number }} options
   * @param {boolean} [wait=true] - Synchronously query browser state
   */
  async readRange(path, options, wait = true) {
    return this.dispatch({
      type: 'readRange',
      path,
      options,
      wait
    });
  }

  /**
   * Execute mixed batch operations of writes and deletes.
   * @param {Array<{ type: 'write'|'delete', path: string, code?: string, language?: string }>} operationsArray
   * @param {boolean} [wait=true]
   */
  async batch(operationsArray, wait = true) {
    return this.dispatch({
      type: 'batch',
      operations: operationsArray,
      wait
    });
  }

  /**
   * Set active file view in the editor.
   * @param {string} path - Name of file to open
   * @param {boolean} [wait=true]
   */
  async openFile(path, wait = true) {
    return this.dispatch({
      type: 'openFile',
      path,
      wait
    });
  }

  /**
   * Select a visual character range in the active editing screen.
   * @param {number} anchor - Cursor starting character position
   * @param {number} [head] - Cursor ending selection position
   * @param {boolean} [wait=true]
   */
  async setSelection(anchor, head = undefined, wait = true) {
    return this.dispatch({
      type: 'setSelection',
      anchor,
      head: head !== undefined ? head : anchor,
      wait
    });
  }

  /**
   * Insert characters at current editor insertion point.
   * @param {string} text - Segment of characters to insert
   * @param {boolean} [wait=true]
   */
  async insertText(text, wait = true) {
    return this.dispatch({
      type: 'insertText',
      text,
      wait
    });
  }

  /**
   * Execute general or custom command actions inside the workspace.
   * @param {string} id - Selected command identifier (built-in or custom)
   * @param {any[]} [args=[]] - Optional parameter arguments
   * @param {boolean} [wait=true]
   */
  async executeCommand(id, args = [], wait = true) {
    return this.dispatch({
      type: 'executeCommand',
      id_cmd: id,
      args,
      wait
    });
  }

  /**
   * Enqueues custom payloads directly to the bridge.
   * @private
   */
  async dispatch(payload) {
    const res = await fetch(`${this.baseURL}/api/editor/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to dispatch action in editor bridge');
    }
    return res.json();
  }

  /**
   * Continuous callback listener for real-time selection, file, and activation updates.
   * Connects via native EventSource Streams over network port 3000.
   * @param {Function} onEventCallback - Receiver function gets event parameters: { event, data, timestamp }
   * @returns {Function} Unsubscribe method
   */
  subscribeEvents(onEventCallback) {
    if (typeof window !== 'undefined' && (window.EventSource || (window.window && window['EventSource']))) {
      const source = new EventSource(`${this.baseURL}/api/editor/events/stream`);
      source.onmessage = (e) => {
        try {
          const raw = JSON.parse(e.data);
          onEventCallback(raw);
        } catch (err) {}
      };
      return () => source.close();
    } else {
      // Direct high-efficiency Node.js event logger fallback
      let lastChecked = Date.now();
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${this.baseURL}/api/editor/events/history`);
          if (!res.ok) return;
          const history = await res.json();
          const fresh = history.filter((ev) => ev.timestamp > lastChecked);
          if (fresh.length > 0) {
            lastChecked = fresh[fresh.length - 1].timestamp;
            fresh.forEach(onEventCallback);
          }
        } catch (e) {}
      }, 600);
      return () => clearInterval(interval);
    }
  }
}

// Support Node.js exports AND browser window scope binds
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EditorClient };
} else if (typeof window !== 'undefined') {
  window.EditorClient = EditorClient;
}
