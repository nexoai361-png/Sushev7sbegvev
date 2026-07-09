import React, { useState } from 'react';
import { useIcons } from '../lib/icons';
import { Skeleton } from './Skeleton';

const SyntaxHighlighter = React.lazy(() => import('./AsyncSyntaxHighlighter'));

interface CollapsibleCodeBlockProps {
  language: string;
  children: string;
  theme: any;
  themeName: string;
  themeBg: string;
}

export const CollapsibleCodeBlock = React.memo(({ 
  language, 
  children, 
  theme, 
  themeName, 
  themeBg
}: CollapsibleCodeBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { Code, ChevronDown } = useIcons();

  return (
    <div className="my-4 border border-border rounded-none overflow-hidden bg-foreground/[0.01]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-foreground/[0.03] transition-all text-[12px] tracking-widest text-foreground/20 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-none bg-foreground/5 text-foreground/75 group-hover:text-accent transition-colors">
            <Code size={12} />
          </div>
          <span className="tracking-tighter capitalize">{language || 'code'}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={14} />
          </div>
        </div>
      </button>
      
      <React.Fragment>
        {isExpanded && (
          <div
            
            
            
            
            className="overflow-hidden border-t border-white/5"
          >
            <React.Suspense fallback={<div className="p-4"><Skeleton className="h-24 w-full" /></div>}>
              <SyntaxHighlighter
                key={themeName}
                style={theme}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '1.5em',
                  fontSize: '13px',
                  fontFamily: '"JetBrains Mono", monospace',
                  background: themeBg,
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}
              >
                {children}
              </SyntaxHighlighter>
            </React.Suspense>
          </div>
        )}
      </React.Fragment>
    </div>
  );
});

CollapsibleCodeBlock.displayName = 'CollapsibleCodeBlock';
