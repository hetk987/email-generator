"use client";

import { Editor } from "@monaco-editor/react";
import { useCallback } from "react";

/**
 * Props for the CodeEditor component
 */
interface CodeEditorProps {
  /** Current code value displayed in the editor */
  value: string;
  /** Callback fired when the code changes */
  onChange: (value: string) => void;
  /** Height of the editor (default: "100%") */
  height?: string;
}

/**
 * Monaco Code Editor Component
 *
 * A React wrapper around Monaco Editor configured for React Email development.
 * Features:
 * - JavaScript/JSX syntax highlighting and IntelliSense
 * - React Email component type definitions
 * - Tailwind CSS className support
 * - Auto-completion and error detection
 * - Dark theme optimized for development
 */

export function CodeEditor({
  value,
  onChange,
  height = "100%",
}: CodeEditorProps) {
  /**
   * Handles editor value changes and normalizes undefined to empty string
   */
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
          // Configure TypeScript compiler for JSX support
          monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowJs: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            esModuleInterop: true,
          });

          // Add TypeScript definitions for React Email components
          // This enables IntelliSense and autocomplete for React Email components
          const reactEmailTypes = `
            declare module 'react' {
              export type ReactNode = any;
              export function createElement(type: any, props?: any, ...children: any[]): any;
              export const Fragment: any;
            }

            declare namespace JSX {
              interface IntrinsicElements { 
                [elemName: string]: {
                  className?: string;
                  style?: any;
                  children?: any;
                  href?: string;
                  src?: string;
                  alt?: string;
                  [key: string]: any;
                };
              }
            }

            // React Email Components with className support
            declare var Html: (props: {className?: string, children?: any}) => any;
            declare var Head: (props: {className?: string, children?: any}) => any;
            declare var Body: (props: {className?: string, children?: any}) => any;
            declare var Container: (props: {className?: string, children?: any}) => any;
            declare var Section: (props: {className?: string, children?: any}) => any;
            declare var Text: (props: {className?: string, children?: any}) => any;
            declare var Heading: (props: {className?: string, children?: any}) => any;
            declare var Button: (props: {className?: string, href?: string, children?: any}) => any;
            declare var Img: (props: {className?: string, src?: string, alt?: string}) => any;
            declare var Tailwind: (props: {config?: any, children?: any}) => any;
            declare var React: any;
          `;

          monaco.languages.typescript.javascriptDefaults.addExtraLib(
            reactEmailTypes,
            "react-email.d.ts"
          );
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          bracketPairColorization: { enabled: true },
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          parameterHints: { enabled: true },
          hover: { enabled: true },
        }}
      />
    </div>
  );
}
