var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_vite = require("vite");
var import_axios = __toESM(require("axios"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use((0, import_cors.default)());
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  app.post("/api/github/token", async (req, res) => {
    const { code } = req.body;
    const client_id = process.env.VITE_GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;
    if (!client_id || !client_secret) {
      return res.status(500).json({ error: "GitHub credentials not configured in environment" });
    }
    try {
      const response = await import_axios.default.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id,
          client_secret,
          code
        },
        {
          headers: {
            Accept: "application/json"
          }
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("GitHub OAuth Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to exchange code for token" });
    }
  });
  let lastStateSnapshot = {
    files: {},
    activeFile: "",
    selection: null,
    timestamp: 0
  };
  let pendingActions = [];
  const actionResolutions = /* @__PURE__ */ new Map();
  const recentEvents = [];
  const eventSSEClients = [];
  let sseIdCounter = 0;
  app.post("/api/editor/sync", (req, res) => {
    const { files, activeFile, selection } = req.body;
    lastStateSnapshot = {
      files: files || {},
      activeFile: activeFile || "",
      selection: selection || null,
      timestamp: Date.now()
    };
    res.json({ success: true, timestamp: lastStateSnapshot.timestamp });
  });
  app.get("/api/editor/state", (req, res) => {
    res.json(lastStateSnapshot);
  });
  app.get("/api/editor/files", (req, res) => {
    res.json(lastStateSnapshot.files);
  });
  app.get("/api/editor/active", (req, res) => {
    const activeFile = lastStateSnapshot.activeFile;
    res.json({
      activeFile,
      selection: lastStateSnapshot.selection,
      file: activeFile ? lastStateSnapshot.files[activeFile] || null : null
    });
  });
  app.post("/api/editor/action", async (req, res) => {
    const { type, path: path2, code, language, text, id_cmd, args, anchor, head, files, paths, operations, options, wait = true } = req.body;
    if (!type) {
      return res.status(400).json({ error: "Missing action type" });
    }
    const actionId = "act_" + Math.random().toString(36).substring(2, 9);
    const action = {
      id: actionId,
      type,
      path: path2,
      code,
      language,
      text,
      id_cmd,
      args,
      anchor,
      head,
      files,
      paths,
      operations,
      options,
      timestamp: Date.now()
    };
    pendingActions.push(action);
    eventSSEClients.forEach((client) => {
      client.res.write(`data: ${JSON.stringify({ event: "action_queued", action })}

`);
    });
    if (!wait) {
      return res.json({ status: "queued", actionId });
    }
    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        actionResolutions.delete(actionId);
        pendingActions = pendingActions.filter((a) => a.id !== actionId);
        reject(new Error(`Timeout waiting for browser code editor to resolve action ${actionId}`));
      }, 15e3);
      actionResolutions.set(actionId, {
        resolve: (val) => {
          clearTimeout(timeout);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timeout);
          reject(err);
        }
      });
    });
    try {
      const result = await promise;
      res.json({ status: "resolved", actionId, result });
    } catch (err) {
      console.error(`Action ${actionId} failure:`, err.message);
      res.status(504).json({ status: "error", actionId, error: err.message });
    }
  });
  app.get("/api/editor/actions/pending", (req, res) => {
    res.json(pendingActions);
  });
  app.post("/api/editor/actions/resolve", (req, res) => {
    const { actionId, result, error } = req.body;
    pendingActions = pendingActions.filter((a) => a.id !== actionId);
    const resolution = actionResolutions.get(actionId);
    if (resolution) {
      actionResolutions.delete(actionId);
      if (error) {
        resolution.reject(new Error(error));
      } else {
        resolution.resolve(result);
      }
      res.json({ success: true, message: `Resolved caller promise for ${actionId}` });
    } else {
      res.json({ success: false, message: `No active listener found for action ID ${actionId} (may have timed out)` });
    }
  });
  app.post("/api/editor/emit-event", (req, res) => {
    const { event, data } = req.body;
    if (!event) {
      return res.status(400).json({ error: "Missing event name" });
    }
    const editorEvent = {
      event,
      data,
      timestamp: Date.now()
    };
    recentEvents.push(editorEvent);
    if (recentEvents.length > 100) {
      recentEvents.shift();
    }
    eventSSEClients.forEach((client) => {
      client.res.write(`data: ${JSON.stringify(editorEvent)}

`);
    });
    res.json({ success: true });
  });
  app.get("/api/editor/events/stream", (req, res) => {
    const clientId = ++sseIdCounter;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write(`data: ${JSON.stringify({ event: "connected", clientId, timestamp: Date.now() })}

`);
    const clientObj = { id: clientId, res };
    eventSSEClients.push(clientObj);
    const heartbeatTimer = setInterval(() => {
      res.write(`: heartbeat

`);
    }, 2e4);
    req.on("close", () => {
      clearInterval(heartbeatTimer);
      const index = eventSSEClients.findIndex((c) => c.id === clientId);
      if (index !== -1) {
        eventSSEClients.splice(index, 1);
      }
      console.log(`SSE Client extension ${clientId} disconnected.`);
    });
  });
  app.get("/api/editor/events/history", (req, res) => {
    res.json(recentEvents);
  });
  app.post("/api/lsp/completions", (req, res) => {
    const { language, code, cursor } = req.body;
    try {
      res.json({
        success: true,
        items: [
          { label: "intelligent_completion", detail: `Professional LSP for ${language || "all"}`, insertText: `// Auto-complete via Professional LSP` }
        ]
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
