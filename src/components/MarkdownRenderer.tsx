import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clipboard, Check, Sun, Moon } from 'lucide-react';

class MarkdownErrorBoundary extends React.Component<
  { children: React.ReactNode; rawText: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; rawText: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Markdown rendering error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md text-sm">
          <p className="font-semibold mb-1">Error rendering markdown/math equations.</p>
          <p className="text-xs font-mono opacity-80">{this.state.error?.message}</p>
          <div className="mt-3">
            <p className="font-semibold text-xs text-red-900 mb-1">Raw content fallback:</p>
            <pre className="text-xs p-2 bg-red-100/50 rounded font-mono overflow-auto max-h-60 select-text whitespace-pre-wrap">
              {this.props.rawText}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface CodeBlockComponentProps {
  language: string;
  code: string;
  isDark: boolean;
}

const CodeBlockComponent = React.memo(function CodeBlockComponent({ language, code, isDark, ...props }: CodeBlockComponentProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div 
      className="relative my-4 rounded-lg overflow-hidden border transition-all group"
      style={{
        borderColor: '#3c3c3c',
        backgroundColor: '#1e1e1e',
      }}
    >
      {/* Code block header with language and Copy button */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 text-[11px] font-mono select-none border-b"
        style={{
          backgroundColor: '#252526',
          borderColor: '#3c3c3c',
          color: '#cccccc',
        }}
      >
        <span className="font-semibold tracking-wider text-blue-400">{language.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 transition-colors px-2 py-1 rounded text-[11px] font-medium border"
          style={{
            backgroundColor: '#1e1e1e',
            borderColor: '#3c3c3c',
            color: '#cccccc',
          }}
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard size={12} className="text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Syntax Highlighter */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '12px 16px',
          fontSize: '13px',
          backgroundColor: '#1e1e1e',
          fontFamily: 'var(--font-mono)',
        }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

const MarkdownRenderer = React.memo(function MarkdownRenderer(props: any) {
  const { children, isDark = true, ...rest } = props;
  const [debouncedChildren, setDebouncedChildren] = React.useState(children);
  const prevDebouncedRef = React.useRef(debouncedChildren);

  React.useEffect(() => {
    const prevDebounced = prevDebouncedRef.current;
    if (!prevDebounced || !children || Math.abs(children.length - prevDebounced.length) > 50) {
      setDebouncedChildren(children);
      prevDebouncedRef.current = children;
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedChildren(children);
      prevDebouncedRef.current = children;
    }, 400);

    return () => clearTimeout(timer);
  }, [children]);

  const rawText = typeof debouncedChildren === 'string' ? debouncedChildren : '';

  const components = React.useMemo(() => ({
    code({ node, className, children, ...codeProps }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const codeText = String(children).replace(/\n$/, '');
      const isInline = !match && !codeText.includes('\n');

      if (!isInline) {
        const language = match ? match[1] : 'text';
        return <CodeBlockComponent language={language} code={codeText} isDark={isDark} {...codeProps} />;
      }

      return (
        <code className={className} {...codeProps}>
          {children}
        </code>
      );
    }
  }), [isDark]);

  return (
    <MarkdownErrorBoundary rawText={rawText}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={components}
        {...rest}
      >
        {rawText}
      </ReactMarkdown>
    </MarkdownErrorBoundary>
  );
});

export const MarkdownPreview = React.memo(function MarkdownPreview({
  code,
  appThemeName,
  setAppThemeName,
}: {
  code: string;
  appThemeName: string;
  setAppThemeName: (theme: string) => void;
}) {
  const themeKeys = ['VS Code Dark', 'One Dark Pro', 'Dracula', 'Nord', 'Github Dark'];

  const handleCycleTheme = () => {
    const currentIndex = themeKeys.indexOf(appThemeName);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setAppThemeName(themeKeys[nextIndex]);
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col transition-colors duration-200 markdown-preview-pane-dark"
      style={{
        backgroundColor: 'var(--color-background, #1e1e1e)',
        color: 'var(--color-foreground, #d4d4d4)',
      }}
    >
      {/* Floating Header with Cycle Theme Button */}
      <div 
        className="flex items-center justify-between px-4 py-2 border-b shrink-0 select-none"
        style={{
          borderColor: 'var(--color-border, #333333)',
          backgroundColor: 'var(--color-sidebar, #252526)',
        }}
      >
        <div className="flex items-center gap-2">
          <Moon size={14} className="text-purple-400 fill-purple-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80" style={{ color: 'var(--color-foreground)' }}>
            Markdown Live Preview (Dark Mode)
          </span>
        </div>
        <button
          onClick={handleCycleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border hover:brightness-110 active:scale-95 shadow-sm"
          style={{
            backgroundColor: 'var(--color-subtle, #454545)',
            borderColor: 'var(--color-border, #333333)',
            color: 'var(--color-foreground, #d4d4d4)',
          }}
          title="Change Dark Theme"
        >
          <Sun size={13} className="text-yellow-400" />
          <span>Theme: {appThemeName}</span>
        </button>
      </div>

      {/* Markdown Content */}
      <div 
        className="flex-1 overflow-auto p-6 md:p-8 markdown-preview-pane select-text custom-scrollbar markdown-preview-pane-dark"
        style={{
          backgroundColor: 'var(--color-background, #1e1e1e)',
        }}
      >
        <MarkdownRenderer isDark={true}>{code}</MarkdownRenderer>
      </div>
    </div>
  );
});

export default MarkdownRenderer;
