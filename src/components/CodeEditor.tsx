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
        defaultLanguage="typescript"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        beforeMount={(monaco) => {
          // Configure TypeScript compiler options
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowNonTsExtensions: true,
            moduleResolution:
              monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            noEmit: true,
            esModuleInterop: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            reactNamespace: "React",
            allowJs: true,
            typeRoots: ["node_modules/@types"],
          });

          // Add type definitions for react-email components
          const reactEmailTypes = `
            declare module "@react-email/components" {
              import { ReactNode, CSSProperties } from 'react';
              
              export interface ComponentProps {
                children?: ReactNode;
                style?: CSSProperties;
              }
              
              export function Html(props: ComponentProps): JSX.Element;
              export function Head(props: ComponentProps): JSX.Element;
              export function Body(props: ComponentProps): JSX.Element;
              export function Container(props: ComponentProps): JSX.Element;
              export function Section(props: ComponentProps): JSX.Element;
              export function Text(props: ComponentProps): JSX.Element;
              export function Heading(props: ComponentProps): JSX.Element;
              export function Button(props: ComponentProps & { href?: string }): JSX.Element;
              export function Link(props: ComponentProps & { href?: string }): JSX.Element;
              export function Img(props: ComponentProps & { src?: string; alt?: string }): JSX.Element;
              export function Hr(props: ComponentProps): JSX.Element;
              export function Preview(props: ComponentProps): JSX.Element;
            }
          `;

          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            reactEmailTypes,
            "file:///node_modules/@types/react-email-components/index.d.ts"
          );

          // Add React types
          const reactTypes = `
            declare namespace React {
              interface CSSProperties {
                [key: string]: any;
              }
              type ReactNode = any;
              interface JSX {
                Element: any;
              }
            }
          `;

          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            reactTypes,
            "file:///node_modules/@types/react/index.d.ts"
          );
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
          formatOnPaste: true,
          formatOnType: true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
        }}
      />
    </div>
  );
}
