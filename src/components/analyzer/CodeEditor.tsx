/**
 * CodeEditor Component - Monaco Editor for Move code
 */

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
    const handleEditorChange = (newValue: string | undefined) => {
        if (onChange) {
            onChange(newValue || '');
        }
    };

    return (
        <div className="h-full w-full bg-black">
            <Editor
                height="100%"
                defaultLanguage="rust" // Using Rust syntax highlighting as closest to Move
                value={value}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    readOnly,
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    lineNumbers: 'on',
                    rulers: [80, 120],
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    insertSpaces: true,
                    renderWhitespace: 'selection',
                    bracketPairColorization: {
                        enabled: true
                    },
                    padding: {
                        top: 16,
                        bottom: 16
                    }
                }}
                loading={
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <div className="text-zinc-400">Loading editor...</div>
                    </div>
                }
            />
        </div>
    );
}
