"use client";

import { Editor } from "@monaco-editor/react";
import { useCallback, useRef, useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useGoogleDrive } from "@/contexts/GoogleDriveContext";
import { Button } from "@/components/ui/button";
import { Download, Upload, LogIn, LogOut, User } from "lucide-react";

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
  const editorRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const themeContext = useContext(ThemeContext);
  const {
    isSignedIn,
    user,
    isLoading: driveLoading,
    signIn,
    signOut,
    downloadFile,
    uploadJsx,
    error: driveError,
  } = useGoogleDrive();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to light theme if context is not available
  const theme = themeContext?.theme || "light";

  /**
   * Handles editor value changes and normalizes undefined to empty string
   */
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      onChange(value || "");
    },
    [onChange]
  );

  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor;

      // Create a model with a specific URI to avoid inmemory issues
      const model = monaco.editor.createModel(
        value,
        "javascript",
        monaco.Uri.parse("file:///email-template.js")
      );

      editor.setModel(model);
    },
    [value]
  );

  /**
   * Handle downloading file from Google Drive
   */
  const handleDownloadFromDrive = useCallback(async () => {
    try {
      const file = await downloadFile();
      if (file.content) {
        onChange(file.content);
      }
    } catch (error) {
      console.error("Failed to download from Drive:", error);
    }
  }, [downloadFile, onChange]);

  /**
   * Handle uploading JSX to Google Drive
   */
  const handleUploadToDrive = useCallback(async () => {
    try {
      await uploadJsx(value);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to upload to Drive:", error);
    }
  }, [uploadJsx, value]);

  return (
    <div className="h-full w-full ">
      <div className="flex flex-row items-center justify-between gap-2 p-3 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2">
          {!isSignedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={signIn}
              disabled={driveLoading}
              className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#357ABD] text-white border-[#4285F4] transition-smooth"
            >
              <LogIn className="h-4 w-4" />
              Sign in to Drive
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                <User className="h-4 w-4" />
                {user?.name || user?.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                disabled={driveLoading}
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-smooth"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadFromDrive}
            disabled={!isSignedIn || driveLoading || !value.trim()}
            className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#357ABD] text-white border-[#4285F4] transition-smooth"
          >
            <Download className="h-4 w-4" />
            Download from Drive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadToDrive}
            disabled={!isSignedIn || driveLoading || !value.trim()}
            className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#357ABD] text-white border-[#4285F4] transition-smooth"
          >
            <Upload className="h-4 w-4" />
            Upload to Drive
          </Button>
        </div>
      </div>
      <Editor
        height={height}
        defaultLanguage="javascript"
        value={value}
        onChange={handleEditorChange}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        onMount={handleEditorDidMount}
        beforeMount={(monaco) => {
          // Configure TypeScript compiler for JSX support
          monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowJs: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            esModuleInterop: true,
          });

          // Add TypeScript definitions for React Email components and custom components
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

            // Custom Email Components - Available globally
            declare var CustomButton: (props: {
              href?: string;
              className?: string;
              children?: any;
              variant?: 'primary' | 'secondary' | 'outline';
              size?: 'sm' | 'md' | 'lg';
            }) => any;
            
            declare var Card: (props: {
              className?: string;
              children?: any;
              variant?: 'default' | 'elevated' | 'outlined';
              padding?: 'sm' | 'md' | 'lg';
            }) => any;
            
            declare var Header: (props: {
              logoUrl?: string;
              companyName?: string;
              title?: string;
              subtitle?: string;
              className?: string;
            }) => any;
            
            declare var Footer: (props: {
              companyName?: string;
              address?: string;
              showUnsubscribe?: boolean;
              className?: string;
            }) => any;

            // Assets - Available globally
            declare var logoUrl: string;
            declare var heroBgUrl: string;
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
