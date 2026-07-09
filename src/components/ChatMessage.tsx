import React from 'react';
import { Message, Attachment } from '../types';
import { CollapsibleCodeBlock } from './CollapsibleCodeBlock';
import { FileAttachment } from './FileAttachment';

const MarkdownRenderer = React.lazy(() => import('./MarkdownRenderer'));

interface ChatMessageProps {
  msg: Message;
  theme: any;
  themeName: string;
  onEditAttachment?: (att: Attachment) => void;
  isGenerating?: boolean;
  getPlatformConfig?: () => any;
}

export const ChatMessage = React.memo(React.forwardRef<HTMLDivElement, ChatMessageProps>(({ 
  msg, 
  theme, 
  themeName, 
  onEditAttachment, 
  isGenerating, 
  getPlatformConfig 
}, ref) => {
  return (
    <div 
      ref={ref}
      
      
      
      
      className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full mb-6 relative group/msg`}
    >
      <div className={`
        relative px-4 py-3 rounded-none text-[14px] leading-relaxed max-w-[95%] break-words
        ${msg.role === 'user' 
          ? 'bg-foreground/5 text-foreground border border-foreground/10' 
          : 'bg-foreground/[0.02] text-foreground/90 border border-border'
        }
        hover:border-foreground/20 transition-colors duration-200 shadow-sm
        ${isGenerating ? 'ring-1 ring-accent/30 shadow-[0_0_15px_rgba(0,122,204,0.1)]' : ''}
      `}>
        {isGenerating && (
          <div
            
            
            className="absolute inset-0 pointer-events-none rounded-none overflow-hidden"
          />
        )}

        <div className="markdown-content" style={{ fontFamily: '"Fira Code", monospace' }}>
          <React.Suspense fallback={<div className="animate-pulse h-8 bg-foreground/5 rounded w-1/2"></div>}>
            <MarkdownRenderer
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const themeBg = theme['pre[class*="language-"]']?.background || theme['pre[class*="language-"]']?.backgroundColor || 'rgba(255,255,255,0.05)';
                  
                  return !inline && match ? (
                    <CollapsibleCodeBlock
                      language={match[1]}
                      theme={theme}
                      themeName={themeName}
                      themeBg={themeBg}
                    >
                      {String(children).replace(/\n$/, '')}
                    </CollapsibleCodeBlock>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {msg.content}
            </MarkdownRenderer>
          </React.Suspense>
        </div>
        {msg.attachments && msg.attachments.length > 0 && (
          <div className={`flex flex-col gap-1 mt-3 pt-3 border-t border-white/5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.attachments.map((att, idx) => (
              <FileAttachment 
                key={idx} 
                attachment={att} 
                isUser={msg.role === 'user'} 
                onEdit={onEditAttachment ? () => onEditAttachment(att) : undefined} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}));

ChatMessage.displayName = 'ChatMessage';
