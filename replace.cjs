const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  const handleCodeChange = useCallback\(\(value: string \| undefined, specificFile\?: string\) => \{[\s\S]*?  \}, \[activeFile\]\);/m;

const replacement = `  const handleCodeChange = useCallback((value: string | undefined, specificFile?: string) => {
    const targetFile = specificFile || activeFile;
    if (value !== undefined && targetFile) {
      setFiles(prev => {
        if (prev[targetFile]?.code === value) return prev;
        return {
          ...prev,
          [targetFile]: {
            ...prev[targetFile],
            code: value
          }
        };
      });

      if (showPreview) {
        if (previewTimeout.current) clearTimeout(previewTimeout.current);
        previewTimeout.current = setTimeout(() => {
          setPreviewFiles(prev => ({
            ...prev,
            [targetFile]: {
              ...prev[targetFile],
              code: value
            }
          }));
        }, 1000);
      }
    }
  }, [activeFile, showPreview]);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
