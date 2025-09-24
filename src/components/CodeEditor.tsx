"use client";

import { Editor } from "@monaco-editor/react";
import { useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  height = "100%",
}: CodeEditorProps) {
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      onChange(value || "");
    },
    [onChange]
  );

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        defaultLanguage="javascript"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        beforeMount={(monaco) => {
          // Completely disable TypeScript workers to prevent errors
          monaco.languages.typescript.typescriptDefaults.setWorkerOptions({
            workerOptions: {
              type: "disabled",
            },
          });

          monaco.languages.typescript.javascriptDefaults.setWorkerOptions({
            workerOptions: {
              type: "disabled",
            },
          });

          // Configure JavaScript with minimal settings
          monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowJs: true,
            checkJs: false,
            noLib: true,
            noEmit: true,
            skipLibCheck: true,
          });

          // Disable all diagnostics and validation
          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
            noSuggestionDiagnostics: true,
          });

          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
            noSuggestionDiagnostics: true,
          });
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          formatOnPaste: false,
          formatOnType: false,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off",
          tabCompletion: "off",
          wordBasedSuggestions: "off",
          parameterHints: { enabled: false },
          hover: { enabled: false },
          links: false,
          contextmenu: false,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          // Disable all language features that might trigger workers
          folding: false,
          foldingStrategy: "indentation",
          showFoldingControls: "never",
          unfoldOnClickAfterEnd: false,
          renderWhitespace: "none",
          renderControlCharacters: false,
          renderIndentGuides: false,
          renderLineHighlight: "none",
          occurrencesHighlight: false,
          selectionHighlight: false,
          codeLens: false,
          lightbulb: { enabled: false },
        }}
      />
    </div>
  );
}
