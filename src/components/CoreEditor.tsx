import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { Skeleton } from './Skeleton';

interface CoreEditorProps {
  value: string;
  language: string;
  theme: any;
  extensions: any[];
  onChange: (val: string) => void;
  onUpdate: (update: any) => void;
  onCreateEditor: (view: any) => void;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

export const CoreEditor = React.memo(({ 
  value, 
  language, 
  theme, 
  extensions, 
  onChange, 
  onUpdate, 
  onCreateEditor, 
  fontSize, 
  lineHeight,
  fontFamily 
}: CoreEditorProps) => {
  return (
    <React.Suspense fallback={<div className="h-full w-full"><Skeleton className="h-full w-full" /></div>}>
      <CodeMirror
        value={value}
        height="100%"
        className="w-full h-full"
        theme={theme}
        extensions={extensions}
        onChange={onChange}
        onUpdate={onUpdate}
        onCreateEditor={onCreateEditor}
        style={{ 
          fontSize: `${fontSize}px`, 
          fontFamily: fontFamily,
          lineHeight: lineHeight
        }}
      />
    </React.Suspense>
  );
});

CoreEditor.displayName = 'CoreEditor';
