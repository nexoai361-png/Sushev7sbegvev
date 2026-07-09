# Code Editor Extension & Full-Stack System APIs

স্বাগতম! এই প্রজেক্টটিকে একটি **Extension-Based Code Editor** হিসেবে প্রস্তুত করা হয়েছে। ডেভেলপাররা তাদের নিজস্ব এক্সটেনশন (যেমন: AI অ্যাসিস্ট্যান্ট, অটো-ফরমেটার, কোড অডিটর ইত্যাদি) তৈরি করতে পারবেন এবং সহজেই এই কোড এডিটরটির সাথে কানেক্ট করতে পারবেন।

রিয়েল-টাইম ইন্টিগ্রেশনের সুবিধার্থে এখানে **Client-side (in-browser) API** এবং **Server-side (Node.js/TS) REST & Server-Sent Events (SSE) API** দুটোই তৈরি করা হয়েছে। 

নিচে বিস্তারিত এপিআই এবং ব্যবহারবিধি দেওয়া হলো যাতে মোবাইল বা যেকোনো ডিভাইস থেকে এটি সহজে ডেভেলপ করা যায়।

---

## ১. ইন-ব্রাউজার ক্লায়েন্ট এপিআই (Browser-Side Extension API)

এডিটর রেন্ডার হওয়ার সাথে সাথে উইন্ডো স্কোপে একটি গ্লোবাল অবজেক্ট `window.EditorAPI` রেজিস্টার হয়ে যায়। যেকোনো ব্রাউজার এক্সটেনশন বা স্ক্রিপ্ট সরাসরি এই অবজেক্টের মাধ্যমে এডিটরের ফাইল ও স্টেট কন্ট্রোল করতে পারে।

### ক) গ্লোবাল এক্সটেনশন রেজিস্ট্রেশনের নিয়ম
```javascript
// একটি নতুন AI অথবা সাধারণ এক্সটেনশন ব্রাউজারে রেজিস্টার করা
EditorAPI.extensions.register({
  id: "my-ai-helper",
  name: "AI Code Assistant",
  description: "AI-powered tool to suggest code inside the editor",
  activate(context) {
    console.log("AI Assistant activated!");
    
    // ১. একটি কাস্টম কমান্ড রেজিস্ট্রেশন
    context.commands.register("ai.explain", async () => {
      const activeText = context.editor.active.getContent();
      const selection = context.editor.active.getSelection();
      
      const targetText = selection ? selection.text : activeText;
      context.ui.showNotification("Analyzing selection code with AI...", "info");
    });
  }
});
```

### খ) ব্রাউজার-সাইড ফাইল এপিআই (Browser-Side File API)
সরাসরি ব্রাউজার কনসোল বা আপনার এক্সটেনশন কোডে নিচের গ্লোবাল ফাংশনগুলো ব্যবহার করতে পারবেন:
- `EditorAPI.editor.files.list()` - এডিটরে ওপেন থাকা সব ফাইলের নামের লিস্ট (Array of paths) দেখাবে।
- `EditorAPI.editor.files.read(path)` - নির্দিষ্ট ফাইলের কোড এবং ল্যাঙ্গুয়েজ অবজেক্ট ফিরিয়ে দেবে।
- `EditorAPI.editor.files.readRange(path, options)` - নির্দিষ্ট লাইন রেঞ্জ বা ক্যারেক্টার অফসেটের কোড পড়তে পারবেন।
- `EditorAPI.editor.files.write(path, code, language)` - ফাইলে নতুন কোড লিখতে বা ওভাররাইট করতে পারবেন।
- `EditorAPI.editor.files.writeFiles(filesMap)` - একসাথে একাধিক ফাইল রাইট/এডিট করতে পারবেন (Batch Write)।
- `EditorAPI.editor.files.delete(path)` - নির্দিষ্ট ফাইল ডিলিট করতে পারবেন।
- `EditorAPI.editor.files.deleteFiles(paths)` - একসাথে একাধিক ফাইল ডিলিট করতে পারবেন (Batch Delete)।
- `EditorAPI.editor.files.batch(operations)` - একসাথে ফাইল রাইট ও ডিলিটের মিক্সড ট্রানজেকশন ব্যাচ রান করতে পারবেন।

---

## ২. নোডজেএস / টাইপস্ক্রিপ্ট এপিআই (Node.js / TS/ JS Server API)

আপনার এক্সটেনশন যদি বাইরে কোনো পৃথক সার্ভারে, CLI হ্যান্ডলারে কিংবা ব্যাকএন্ডে চলে, তবে সেটি পোর্ট `3000` এ রান করা এক্সপ্রেস সার্ভারের এপিআই ব্যবহার করে রিয়েল-টাইম কাজ করতে পারবে।

ক্লায়েন্ট সুবিধার্থে একটি SDK তৈরি করা আছে যা ব্যাকএন্ড এবং ফ্রন্টএন্ড দুই জায়গাতেই ইম্পোর্ট করা সম্ভব: 
`http://localhost:3000/editor-api-sdk.js`

### Node.js-এ SDK ব্যবহার করার দারুণ উদাহরণ:

```javascript
// editor-api-sdk.js ডাউনলোড বা রিকোয়ার করুন
const { EditorClient } = require('./editor-api-sdk.js');

// কোড एডিটরের ব্যাকএন্ডে কানেক্ট করুন
const editor = new EditorClient("http://localhost:3000");

async function startExtension() {
  // ১. বর্তমান এডিটরের ফাইলগুলোর তালিকা পড়া এবং সবগুলো ফাইল দেখা
  const state = await editor.getState();
  console.log("Current Opened File:", state.activeFile);
  console.log("Workspace Files List:", Object.keys(state.files));

  // ২. নির্দিষ্ট ফাইলের নির্দিষ্ট কোনো লাইন বা ক্যারেক্টার রেঞ্জ পড়া (Line Range / Character Offset)
  // উদাহরণঃ src/App.tsx ফাইলের ১ম লাইন থেকে ১০ম লাইন পর্যন্ত পড়া
  const linesRange = await editor.readRange("src/App.tsx", { startLine: 1, endLine: 10 });
  console.log("First 10 lines of src/App.tsx:", linesRange.text);

  // ক্যারেক্টার অফসেট অনুযায়ী কন্টেন্ট পড়াঃ ১ম ১০০টি ক্যারেক্টার পড়া
  const charRange = await editor.readRange("src/App.tsx", { offset: 0, length: 100 });
  console.log("First 100 characters:", charRange.text);

  // ৩. সিঙ্গেল ফাইলে কোড রাইট বা এডিট করা (এটি সরাসরি ব্রাউজারে আপডেট হবে!)
  await editor.writeFile("src/demo.js", "console.log('Hello from Node.js!');", "javascript");

  // ৪. একাধিক ফাইল একসাথে রাইট করা (Bulk Write / Batch Edit)
  await editor.writeFiles({
    "src/math.js": { code: "export const add = (a, b) => a + b;", language: "javascript" },
    "src/configs.json": { code: '{"theme": "dark"}', language: "json" }
  });

  // ৫. একাধিক ফাইল একসাথে ডিলিট করা (Bulk Delete)
  await editor.deleteFiles(["src/demo.js", "src/unused-file-invalid.js"]);

  // ৬. মিক্সড ট্রানজেকশনাল ব্যাচিং সিস্টেম (Atomic Batch Writes & Deletes)
  await editor.batch([
    { type: 'write', path: 'src/helpers.js', code: "console.log('Helper tool');", language: 'javascript' },
    { type: 'delete', path: 'old-config.json' }
  ]);

  // ৭. কার্সার পজিশনে টেক্সট ইনসার্ট করা
  await editor.insertText("const aiResponse = true;\n");
  
  // ৮. রিয়েল-টাইম ইভেন্টস স্ট্রিম লিসেন করা (Server-Sent Events)
  editor.subscribeEvents((eventPayload) => {
    console.log(`[Event Received] Type: ${eventPayload.event}`, eventPayload.data);
    
    if (eventPayload.event === 'file:changed') {
      console.log(`File Modified Name: ${eventPayload.data.path}`);
    }
  });
}

startExtension().catch(console.error);
```

---

## ৩. এপিআই এন্ডপয়েন্ট রেফারেন্স (Raw REST Endpoints)

আপনি টাইপস্ক্রিপ্ট বা নোডজেএস-এর সাধারণ `fetch` বা `axios` লাইব্রেরি দিয়ে নিচের এন্ডপয়েন্টগুলো সরাসরি অ্যাক্সেস করতে পারবেন:

### ১) সবগুলো ফাইনাল ফাইল অবজেক্ট লিস্ট নিন
* **URL:** `GET /api/editor/files`
* **Response:**
```json
{
  "src/App.tsx": { "code": "...code...", "language": "typescript" },
  "package.json": { "code": "...code...", "language": "json" }
}
```

### ২) অ্যাক্টিভ ফাইলের অবস্থান এবং সিলেকশন ডাটা
* **URL:** `GET /api/editor/active`
* **Response:**
```json
{
  "activeFile": "src/App.tsx",
  "selection": { "anchor": 15, "head": 40, "from": 15, "to": 40 },
  "file": { "code": "...", "language": "typescript" }
}
```

### ৩) ডাইরেক্ট অ্যাকশন সাবমিট করা (Write / Delete / Range / Bulk / Batch Actions)
* **URL:** `POST /api/editor/action`
* **Headers:** `Content-Type: application/json`
* **Body Parameters:**

১. **ফাইলের কন্টেন্ট রেঞ্জ দিয়ে নির্দিষ্ট পার্ট পড়া (`readRange`):**
```json
{
  "type": "readRange",
  "path": "src/App.tsx",
  "options": { "startLine": 1, "endLine": 10 }
}
```

২. **একসাথে একাধিক নতুন ফাইল এড/এডিট করা (`bulkWrite`):**
```json
{
  "type": "bulkWrite",
  "files": {
    "src/file1.js": { "code": "console.log(1);" },
    "src/file2.js": { "code": "console.log(2);" }
  }
}
```

৩. **একসাথে একাধিক ফাইল ডিলিট করা (`bulkDelete`):**
```json
{
  "type": "bulkDelete",
  "paths": ["temp1.js", "temp2.js"]
}
```

৪. **মিক্সড ব্যাচ ট্রানজেকশন চালানো (`batch`):**
```json
{
  "type": "batch",
  "operations": [
    { "type": "write", "path": "src/new.js", "code": "const text = 'batch';" },
    { "type": "delete", "path": "src/old-file.js" }
  ]
}
```

৫. **সাধারণ ফাইল রাইট করা (`writeFile`):**
```json
{
  "type": "writeFile",
  "path": "test.js",
  "code": "console.log('API Test');",
  "language": "javascript",
  "wait": true
}
```

### ৪) রিয়েলটাইম ইভেন্ট স্ট্রিম (SSE)
* **URL:** `GET /api/editor/events/stream`
* **বর্ণনা:** একটি ওপেন নেটওয়ার্ক কানেকশন ধরে রাখে এবং ব্রাউজারে ফাইলের লিস্ট চেইঞ্জ, সিলেক্ট হওয়া ও এডিট হওয়ার ইভেন্ট নোটিফিকেশন পাঠায়।
* **ইভেন্টের ধরনসমূহ:**
  * `file:changed` - যখন ফাইলে কোনো পরিবর্তন হবে
  * `file:deleted` - ফাইল ডিলিট হলে
  * `activeFile:changed` - একটি ফাইল ট্যাব থেকে অন্য ট্যাবে পরিবর্তন করলে
  * `selection:changed` - ব্রাউজারে ইউজার কার্সার সিলেকশন চেঞ্জ করলে

---

## ৪. মোবাইল ডিভাইসে এক্সটেনশন বানিয়ে টেস্ট করার গাইড

১. আপনার মোবাইল থেকে এই কোড এডিটর লিংকটি ওপেন করুন।
২. আপনার পিসি বা সার্ভারে একটি সাধারণ `Node.js` প্রজেক্ট চালু করুন:
   ```bash
   npm init -y
   npm install node-fetch
   ```
৩. উপরের কোড টেমপ্লেট অনুযায়ী একটি `index.js` ফাইল তৈরি করুন এবং আপনার এডিটরের ইউআরএল প্রোভাইড করে দিন।
৪. আপনার নোড কোড রান করুন! আপনি দেখতে পাবেন আপনার মোবাইলের কোড এডিটরে রিয়েল-টাইম ফাইল তৈরি হচ্ছে, টেক্সট সিলেক্ট হচ্ছে এবং ব্যাকএন্ড থেকে কোড কন্ট্রোল করা যাচ্ছে।

---
প্রজেক্টটি সম্পূর্ণ এক্সটেনশন-রেডি এবং JS/TS/Node.js ব্যবহারকারীদের জন্য সুরক্ষিত দ্বি-মুখী যোগসূত্র বজায় রাখতে সক্ষম। কোনো কোড সিনট্যাক্স বা লিন্ট ত্রুটি ছাড়া এটি সার্ভারে বিল্ড করা হয়েছে।

---

## ৫. Capacitor এবং GitHub Actions এর মাধ্যমে Android APK বিল্ড গাইড (Capacitor & GitHub Actions APK Build)

এই প্রজেক্টটিতে **Capacitor** ইন্টিগ্রেশন সম্পন্ন করা হয়েছে যাতে সহজে এটিকে একটি Android App (APK) এ রুপান্তর করা যায়। এছাড়া অটোমেটিক বিল্ডের জন্য **GitHub Actions CI/CD Workflow** সেটআপ করা হয়েছে।

### ক) কী কী ফাইল এবং কনফিগারেশন সেটআপ করা হয়েছে:
১. **`capacitor.config.ts`**: ক্যাডাসিটর কনফিগারেশন ফাইল, যেখানে অ্যাপ আইডি (`com.reversx.ide`) এবং অ্যাপ নাম (`ReversX`) ডিফাইন করা হয়েছে।
২. **`android/` ফোল্ডার**: ক্যাডাসিটর CLI এর মাধ্যমে সম্পূর্ণ অ্যান্ড্রয়েড নেটিভ প্রজেক্ট তৈরি ও কনফিগার করা হয়েছে।
৩. **`package.json`**: শর্টকাট স্ক্রিপ্টসমূহ অ্যাড করা হয়েছে (যেমন: `npm run cap:sync` এবং `npm run cap:build`)।
৪. **`/.github/workflows/build-apk.yml`**: GitHub Actions ওয়ার্কফ্লো কনফিগারেশন, যা আপনার প্রতিটি পুশ (push) বা পুল রিকোয়েস্টে (pull request) কোনো ইরর ছাড়াই অটোমেটিক সম্পূর্ণ অ্যান্ড্রয়েড বিল্ড শেষ করে একটি ইনস্টলযোগ্য **Debug APK** রিলিজ বা আর্টিফ্যাক্ট হিসেবে আপলোড করবে।

### খ) কাজের সুবিধার্থে নতুন স্ক্রিপ্টস:
- `npm run cap:build` - সম্পূর্ণ ওয়েব প্রোডাকশন বিল্ড তৈরি করবে এবং সেটি অ্যান্ড্রয়েড প্রজেক্টে সিনক্রোনাইজ (`sync`) করবে।
- `npm run cap:sync` - নতুন ওয়েব ফাইলগুলো অ্যান্ড্রয়েড এসেটে আপডেট করবে।

### গ) কিভাবে গিটহাবে পুশ করে এপিকে ডাউনলোড করবেন:
১. এই সোর্স কোডটি আপনার গিটহাব রিপোজিটরিতে পুশ করুন।
২. গিটহাবের **Actions** ট্যাবে যান।
৩. **Build Android APK** নামক ওয়ার্কফ্লোটি দেখতে পাবেন।
৪. বিল্ড সফলভাবে শেষ হওয়ার পর সেখান থেকে **ReversX-Debug-APK** জিপ ফাইলটি ডাউনলোড করে নিন। জিপটি আনজিপ করলেই পেয়ে যাবেন ইনস্টলযোগ্য `app-debug.apk` ফাইলটি!
