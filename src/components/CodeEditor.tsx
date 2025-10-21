"use client";

import { Editor } from "@monaco-editor/react";
import { useCallback, useRef, useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useGoogleDrive } from "@/contexts/GoogleDriveContext";
import { Button } from "@/components/ui/button";
import { FileNamingDialog } from "@/components/FileNamingDialog";
import toast from "react-hot-toast";
import {
  Download,
  Upload,
  LogIn,
  LogOut,
  User,
  FileText,
  ChevronDown,
} from "lucide-react";

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
  const [files, setFiles] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNamingDialogOpen, setIsNamingDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const themeContext = useContext(ThemeContext);
  const {
    isSignedIn,
    user,
    isLoading: driveLoading,
    signIn,
    signOut,
    downloadFile,
    listFiles,
    uploadJsx,
    error: driveError,
  } = useGoogleDrive();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load files when user signs in
  useEffect(() => {
    if (isSignedIn && mounted) {
      loadFiles();
    }
  }, [isSignedIn, mounted]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest(".file-dropdown-container")) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  /**
   * Load files from Google Drive
   */
  const loadFiles = useCallback(async () => {
    try {
      const driveFiles = await listFiles();
      setFiles(driveFiles);
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  }, [listFiles]);

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
   * Handle file selection from dropdown
   */
  const handleFileSelect = useCallback(
    async (fileId: string) => {
      try {
        const file = await downloadFile(fileId);
        if (file.content) {
          onChange(file.content);
        }
        setIsDropdownOpen(false);
      } catch (error) {
        console.error("Failed to load file:", error);
      }
    },
    [downloadFile, onChange]
  );

  /**
   * Handle opening the file naming dialog
   */
  const handleUploadToDrive = useCallback(() => {
    if (!value.trim()) {
      toast.error("Please enter some content before uploading");
      return;
    }
    setIsNamingDialogOpen(true);
  }, [value]);

  /**
   * Handle confirming file upload with custom name
   */
  const handleConfirmUpload = useCallback(
    async (filename: string) => {
      try {
        setIsUploading(true);
        setIsNamingDialogOpen(false);

        await uploadJsx(value, filename);

        toast.success(
          `File "${filename}" uploaded successfully to Google Drive!`
        );

        // Refresh the file list
        await loadFiles();
      } catch (error) {
        console.error("Failed to upload to Drive:", error);
        toast.error(`Failed to upload "${filename}". Please try again.`);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadJsx, value, loadFiles]
  );

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
          {/* File Picker Dropdown */}
          {isSignedIn && files.length > 0 && (
            <div className="relative file-dropdown-container">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={driveLoading}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 transition-smooth"
              >
                <FileText className="h-4 w-4" />
                Select File
                <ChevronDown className="h-4 w-4" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleFileSelect(file.id)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(file.modifiedTime).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadToDrive}
            disabled={
              !isSignedIn || driveLoading || isUploading || !value.trim()
            }
            className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#357ABD] text-white border-[#4285F4] transition-smooth"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload to Drive"}
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

      <FileNamingDialog
        isOpen={isNamingDialogOpen}
        onClose={() => setIsNamingDialogOpen(false)}
        onConfirm={handleConfirmUpload}
        fileType="jsx"
        isLoading={isUploading}
      />
    </div>
  );
}
