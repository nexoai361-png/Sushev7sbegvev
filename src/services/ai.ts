import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are ReversX, powered by the Windsurf (Flow Framework) philosophy. You are a Senior Principal Software Architect and Full-Stack Expert.

### Your Mission
Create **highly complex, production-grade, and innovative** web applications using Deep Context awareness. You are a sovereign developer who MUST prioritize **Clean Code** and **Perfect Architecture**. You can:
- **NO DUPLICATES**: Never provide duplicate files or repetitive logic. Every line must have a purpose.
- **Agentic Flow**: Operate with the precision of the Flow framework, maintaining perfect logical continuity across all files.
- **Architect Multi-Tier Systems**: Design scalable architectures with clear separation of concerns (Services, Hooks, Components, Utils).
- **Master Modern Tech Stacks**: Expertly use React 18+, TypeScript, Framer Motion, Tailwind CSS, Lucide Icons, and advanced state management (Zustand, Redux, or Context).
- **Implement Sophisticated Logic**: Write optimized algorithms, handle complex data structures, and implement design patterns (Factory, Observer, Strategy, etc.).
- **Focus on UX/UI Excellence**: Build polished, accessible, and high-performance interfaces with a focus on micro-interactions and visual rhythm.

### Flow-Based Generation Guidelines (CRITICAL)
1. **Prioritize Accuracy Over Speed**: Take your time. Do not rush into code generation. Use Deep Context to understand the entire project state.
2. **Deep Technical Reasoning**: You MUST perform a thorough analysis of the requirements before writing a single line of code. Identify potential edge cases, state management complexities, and UI performance bottlenecks.
3. **Incremental Implementation**: Build the project logically. Ensure that every file you create or modify fits perfectly into the overall architecture.
4. **Validation**: Mentally simulate the execution of your code to ensure bug-free output.

### Large Project & Flow-State Protocol (CRITICAL)
1. **Modular Architecture**: For large projects, ALWAYS break down functionality into small, reusable components and dedicated service files. Never put too much logic in a single file.
2. **Type Safety**: Use strict TypeScript types. Avoid 'any' at all costs. Define clear interfaces for component props and service data.
3. **Error Handling**: Implement robust error boundaries and graceful degradation. Always check for null/undefined before accessing nested properties.
4. **State Management**: Choose the right state management tool (Context vs. Props) based on project complexity. For large apps, prefer a centralized store or clean Context providers.

### Professional Flow Standards (MANDATORY)
1. **Clean Code**: Follow SOLID principles. Use descriptive variable names and keep functions small and focused on a single task.
2. **Architectural Integrity**: Maintain a clear folder structure. Separate UI (components), business logic (services/hooks), and data definitions (types).
3. **Performance Optimization**: Use React.memo, useMemo, and useCallback where appropriate to prevent unnecessary re-renders in large applications.
4. **Scalability**: Design for the future. Even if the project is small now, architect it as if it will grow 10x larger.

### Flow Context & Quality Control (MANDATORY)
1. **Edge Case Awareness**: Proactively identify and handle potential edge cases (e.g., empty states, network errors, invalid inputs).
2. **Self-Correction Protocol**: Mentally "dry-run" your code before streaming. If you spot a logical flaw or a missing import, correct it internally before outputting.
3. **Design-to-Code Precision**: Use consistent spacing (Tailwind), fluid typography, and professional color palettes. Ensure the UI feels premium and polished.
4. **Context Preservation**: When modifying existing code, ensure you don't inadvertently break unrelated features. Check the impact of your changes on the entire codebase.
5. **Component Interaction**: Clearly define how components communicate. Use standard patterns for lifting state up or handling events.

### Flow Architecture & Robustness
1. **Separation of Concerns**: Logic should be separated from presentation. Use custom hooks for complex state logic.
2. **Standardization**: Use consistent naming conventions and project structure.
3. **Optimized Data Flow**: Avoid prop drilling. Use Context or State Management libraries for global state.
4. **Defensive Coding**: Validate all external inputs and API responses. Provide fallback UIs for unexpected errors.
5. **Atomic Design**: Build small, independent components that can be composed into complex layouts.

### Intelligent Refactoring & Logic Sync
1. **Deep Context Logic**: Before making a change, understand the full "Flow" of the application logic.
2. **Synchronized State**: Ensure that when state changes, all dependent UI elements and side effects are consistently updated.
3. **Legacy Maintenance**: Keep existing code clean while adding new features. Don't leave unused imports or dead code.
4. **Reliable Documentation**: Add clear comments for complex logic to maintain code readability for long-term project growth.
5. **Multi-File Consistency**: When creating multiple files, ensure they work together seamlessly without missing exports or incorrect relative paths.

### Flow Patching Protocol (STRICT)
You communicate file changes using markdown code blocks. You MUST support creating and patching multiple files in a single response seamlessly, honoring relationships across them.

1. **Creation**: When creating a NEW file, use: \`### path/to/file.ext\` followed by the complete code block.
2. **Updates (MANDATORY Patching)**: If the file exists, you MUST use the patch protocol to save tokens and prevent breaking the whole code. Start with \`PATCH: path/to/file.ext\` then use:
   \`\`\`patch
   <<<< SEARCH
   exact code to find
   ====
   replacement code
   >>>>
   \`\`\`
   - **Requirement**: Use multiple chunks inside the same code block for non-contiguous changes in the same file. Just use multiple \`<<<< SEARCH ... === ... >>>>\` blocks.
   - **Requirement**: SEARCH block must match EXACTLY (whitespaces/tabs/new-lines) what is in the file.
   - **Indentation**: You MUST preserve the exact indentation of the existing code in the SEARCH block to prevent breaking the code.
   - **Important**: NEVER change or replace other parts of the code unless explicitly asked by the user. Only patch what is needed.
3. **Small Files Exception**: If the file is extremely small (under 20 lines) or you are asked to replace the whole file, you may use \`PATCH: path/to/file.ext\` followed by a regular code block without the SEARCH/REPLACE syntax.
4. **Deletion**: Use \`[DELETE: path/to/file.ext]\` on its own line.
5. **Accuracy**: Ensure the code blocks are strictly typed (e.g., \`patch\`, \`typescript\`). Do not add extra comments inside the patch blocks.

### Chain of Thought (CoT) Requirement
You MUST maintain a high-fidelity "Chain of Thought" process. You are a mentor and a collaborator.
1. **Thinking Steps**: Present your thought process as logical technical milestones. Start every new phase with: "Now I am doing: [Step Title]. [Analysis]".
   - [Step Title]: Professional technical phase.
   - [Analysis]: Deep technical insight into *why* you are making specific choices.
2. **Human Communication**: Stay friendly and professional. 
   - **Language**: If the user speaks in Bengali, you MUST respond in eloquent, natural Bengali for the reasoning and chat parts (use "তুমি" style).
3. **Advanced Architecture**: Explain the architectural "Trade-offs" and "Invariants" in your CoT.
4. **Visibility**: The user must see your deep reasoning before the implementation begins.
5. **Polished Output**: Use standard Sentence Case for labels.

Always prioritize code maintainability, type safety, and clean engineering principles.`;

const baseURLMap: Record<string, string> = {
  'mistral': 'https://api.mistral.ai/v1',
  'openrouter': 'https://openrouter.ai/api/v1',
  'cerebras': 'https://api.cerebras.ai/v1',
  'sambanova': 'https://api.sambanova.ai/v1',
  'cohere': 'https://api.cohere.ai/v1',
};

async function* streamOpenAI(
  apiKey: string,
  baseURL: string,
  model: string,
  systemPrompt: string,
  history: any[],
  message: string,
  isReasoning: boolean = false
) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.parts[0].text
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            yield { type: isReasoning ? 'reasoning' : 'content', content };
          }
        } catch (e) {
          console.error("Error parsing stream chunk", e);
        }
      }
    }
  }
}

async function* streamCohere(
  apiKey: string,
  model: string,
  systemPrompt: string,
  history: any[],
  message: string,
  isReasoning: boolean = false
) {
  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'command-r-plus',
      message,
      preamble: systemPrompt,
      chat_history: history.map(h => ({
        role: h.role === 'user' ? 'USER' : 'CHATBOT',
        message: h.parts[0].text
      })),
      stream: true
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const json = JSON.parse(trimmed);
        if (json.event_type === 'text-generation') {
          yield { type: isReasoning ? 'reasoning' : 'content', content: json.text };
        }
      } catch (e) {}
    }
  }
}

async function* streamGemini(
  apiKey: string,
  modelName: string,
  systemPrompt: string,
  history: any[],
  message: any[],
  isReasoning: boolean = false
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let modelId = modelName || "gemini-2.0-flash";
  
  // Robust model name handling
  if (modelId === "gemini-1.5-pro") modelId = "gemini-1.5-pro-latest";
  if (modelId === "gemini-1.5-flash") modelId = "gemini-1.5-flash-latest";
  
  const finalModelName = modelId.includes('/') ? modelId : `models/${modelId}`;

  const model = genAI.getGenerativeModel({ 
    model: finalModelName,
    systemInstruction: systemPrompt
  });

  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: h.parts
    }))
  });

  const result = await chat.sendMessageStream(message);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield { type: isReasoning ? 'reasoning' : 'content', content: text };
    }
  }
}

export const simpleChat = async (
  message: string,
  apiKey?: string,
  model?: string,
  platform: string = 'gemini',
  extra?: { baseURL?: string }
) => {
  let effectiveApiKey = apiKey?.trim();
  if ((!effectiveApiKey || effectiveApiKey === 'env-key') && platform === 'gemini') {
    effectiveApiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || "";
  }
  
  const platformDefaults: Record<string, string> = {
    mistral: 'mistral-large-latest',
    openrouter: 'openrouter/auto',
    cerebras: 'llama3.1-70b',
    sambanova: 'Meta-Llama-3.1-405B-Instruct',
    cohere: 'command-r-plus'
  };

  const effectiveModel = model?.trim() || platformDefaults[platform] || (platform === 'gemini' ? "gemini-2.0-flash" : "");
  
  if (platform === 'gemini') {
    const genAI = new GoogleGenerativeAI(effectiveApiKey);
    const model = genAI.getGenerativeModel({ model: effectiveModel });
    const result = await model.generateContent(message);
    return result.response.text();
  } else if (platform === 'cohere') {
     const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${effectiveApiKey}`
      },
      body: JSON.stringify({
        model: effectiveModel,
        message,
      })
    });
    const data = await response.json();
    return data.text;
  } else {
    const baseURL = extra?.baseURL || baseURLMap[platform as keyof typeof baseURLMap];
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${effectiveApiKey}`
      },
      body: JSON.stringify({
        model: effectiveModel,
        messages: [{ role: 'user', content: message }],
        temperature: 0.2
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
};

export const chatWithAIStream = async function*(
  message: string, 
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  apiKey?: string,
  model?: string,
  platform: string = 'gemini',
  attachments: { name: string, type: string, content: string }[] = [],
  extra?: { baseURL?: string }
) {
  const maxHistoryTurns = 12;
  const trimmedHistory = history.slice(-(maxHistoryTurns * 2));

  let effectiveApiKey = apiKey?.trim();
  if ((!effectiveApiKey || effectiveApiKey === 'env-key') && platform === 'gemini') {
    effectiveApiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || "";
  }
  const platformDefaults: Record<string, string> = {
    mistral: 'mistral-large-latest',
    openrouter: 'openrouter/auto',
    cerebras: 'llama3.1-70b',
    sambanova: 'Meta-Llama-3.1-405B-Instruct',
    cohere: 'command-r-plus'
  };

  const effectiveModel = model?.trim() || platformDefaults[platform] || (platform === 'gemini' ? "gemini-2.0-flash" : "");

  if (!effectiveApiKey || effectiveApiKey === 'env-key' || (platform !== 'gemini' && !effectiveModel)) {
    const platformDisplayNames: Record<string, string> = {
      gemini: 'Gemini',
      mistral: 'Mistral',
      openrouter: 'OpenRouter',
      cerebras: 'Cerebras',
      sambanova: 'SambaNova',
      cohere: 'Cohere'
    };
    const platformName = platformDisplayNames[platform] || platform;
    yield { 
      type: 'content', 
      content: `\n\n**Configuration Required**: No API Key found for **${platformName}**. Please go to the **Settings (BYOK Hub)** tab and provide your **${platformName} API Key**.` 
    };
    return;
  }

  // Format message with attachments
  const messageParts: any[] = [{ text: message }];
  attachments.forEach(att => {
    if (att.type.startsWith('image/')) {
        const base64Data = att.content.split(',')[1];
        if (platform === 'gemini') {
            messageParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: att.type
                }
            });
        }
    } else {
        messageParts.push({ text: `[Attached File: ${att.name}]\nContent:\n${att.content}` });
    }
  });

  const messageText = messageParts.filter(p => p.text).map(p => p.text).join('\n\n');

  try {
    let planningContent = "";

    const planningPrompt = `${SYSTEM_INSTRUCTION}\n\nYou are currently in the PLANNING phase. Perform a comprehensive technical decomposition. 
    **MANDATORY**: You MUST be slow, meticulous, and exhaustive in this phase. Do not rush. 
    1. Analyze every detail of the user request.
    2. Design a complete folder structure and architectural flow.
    3. Identify all necessary components, hooks, and services.
    4. Explicitly state how you will handle state, side effects, and UI performance.
    
    Show your thinking process step-by-step using high-level engineering milestones. 
    CRITICAL: You MUST start every new thinking step with the exact block: 'Now I am doing: [Professional Title]. [In-depth Analysis]'. 
    Focus on: Architecture, State Management, UI/UX consistency, and Performance. Talk like a friendly human mentor. If user spoke in Bengali, use eloquent Bengali for the reasoning. NO CODE BLOCKS HERE.`;

    if (platform === 'gemini') {
      const stream = streamGemini(effectiveApiKey, effectiveModel, planningPrompt, trimmedHistory, messageParts, true);
      for await (const chunk of stream) {
        planningContent += chunk.content;
        yield chunk;
      }
    } else if (platform === 'cohere') {
      const stream = streamCohere(effectiveApiKey, effectiveModel, planningPrompt, trimmedHistory, messageText, true);
      for await (const chunk of stream) {
        planningContent += chunk.content;
        yield chunk;
      }
    } else {
      const baseURL = extra?.baseURL || baseURLMap[platform as keyof typeof baseURLMap];
      const stream = streamOpenAI(effectiveApiKey, baseURL, effectiveModel, planningPrompt, trimmedHistory, messageText, true);
      for await (const chunk of stream) {
        planningContent += chunk.content;
        yield chunk;
      }
    }

    const implementationPrompt = `${SYSTEM_INSTRUCTION}\n\nYou are now in the IMPLEMENTATION phase. Use your previous ARCHITECTURAL PLAN to generate the final code and documentation. 
           
    PLAN RECAP:
    ${planningContent}
    
    Now, implement the project with the highest quality standards. 
    1. **Format**: Follow the File Operation Protocol. Use \`### path/to/file.ext\` on its own line before every code block.
    2. **Naming**: Use descriptive Latin filenames. NEVER use single-letter names.
    3. **Completeness**: Stream ALL required code files first. 
    4. **Deletions**: If files are no longer needed, use \`[DELETE: path/to/file.ext]\` on its own line.
    
    Provide a detailed analysis and explanation of the project ONLY after all code files have been generated.`;

    if (platform === 'gemini') {
      const stream = streamGemini(effectiveApiKey, effectiveModel, implementationPrompt, trimmedHistory, messageParts, false);
      for await (const chunk of stream) yield chunk;
    } else if (platform === 'cohere') {
      const stream = streamCohere(effectiveApiKey, effectiveModel, implementationPrompt, trimmedHistory, messageText, false);
      for await (const chunk of stream) yield chunk;
    } else {
      const baseURL = extra?.baseURL || baseURLMap[platform as keyof typeof baseURLMap];
      const stream = streamOpenAI(effectiveApiKey, baseURL, effectiveModel, implementationPrompt, trimmedHistory, messageText, false);
      for await (const chunk of stream) yield chunk;
    }

  } catch (error: any) {
    console.error("Agent Error:", error);
    let errorMessage = `### ⚠️ Chat Error\n${error.message || "An unknown error occurred."}`;
    yield { type: 'content', content: `\n\n${errorMessage}` };
  }
};

export const chatWithAI = async (
  message: string, 
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  apiKey?: string,
  model?: string,
  platform: string = 'gemini',
  attachments: { name: string, type: string, content: string }[] = [],
  extra?: { baseURL?: string }
) => {
  const generator = chatWithAIStream(message, history, apiKey, model, platform, attachments, extra);
  let finalContent = "";
  for await (const chunk of generator) {
    if (chunk.type === 'content') finalContent += chunk.content;
  }
  return finalContent;
};
