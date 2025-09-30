"use client";

import React, { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { EmailPreview } from "@/components/EmailPreview";
import { ResizablePanels } from "@/components/ResizablePanels";
import { Button } from "@/components/ui/button";
import { Mail, Code, Eye, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateGallery } from "@/components/TemplateGallery";
import { DEFAULT_TEMPLATE } from "@/templates/default";

/**
 * Email Generator Application
 *
 * A React application that allows users to create beautiful email templates
 * using React Email components with Tailwind CSS support via the Monaco Editor.
 *
 * Features:
 * - Live code editing with Monaco Editor
 * - JSX syntax support with React Email components
 * - Tailwind CSS className support via <Tailwind> wrapper
 * - Real-time email preview
 * - HTML export functionality
 */

/**
 * Main Email Generator Component
 *
 * Manages the state and functionality for the email template editor and preview.
 * Handles JSX compilation, React Email rendering, and Tailwind CSS processing.
 */
export default function EmailGenerator() {
  // Component state
  const [activeTab, setActiveTab] = useState("editor");
  const [code, setCode] = useState(DEFAULT_TEMPLATE.code);
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [detectedFunction, setDetectedFunction] = useState<string>("");

  /**
   * Generates HTML from the user's React Email code
   *
   * Process:
   * 1. Validates input code
   * 2. Imports React Email components dynamically
   * 3. Imports custom components and assets
   * 4. Transforms JSX to JavaScript using Babel
   * 5. Executes the transformed code in a sandboxed environment
   * 6. Renders the React component to HTML using React Email's render function
   * 7. Updates the preview with the generated HTML
   */
  const generateHtml = async () => {
    // Input validation
    if (!code.trim()) {
      setError("Please enter some code to generate the email");
      return;
    }

    setIsGenerating(true);
    setError("");
    setDetectedFunction("");

    try {
      // Step 1: Import React Email components dynamically
      const {
        Html,
        Head,
        Body,
        Container,
        Text,
        Button,
        Section,
        Heading,
        Img,
        Tailwind,
      } = await import("@react-email/components");

      // Step 2: Import custom components and assets
      const { CustomButton, Card, Header, Footer } = await import(
        "@/components/email"
      );
      const { logoUrl, heroBgUrl } = await import("@/assets");

      // Step 3: Transform JSX to JavaScript using Babel
      const { transform } = await import("@babel/standalone");

      let transformedCode;
      try {
        const result = transform(code, {
          presets: [["react", { runtime: "classic" }]],
          plugins: [],
        });
        transformedCode = result.code;
      } catch (babelError) {
        // Fallback: If JSX transformation fails, try to execute as-is
        // (might be React.createElement syntax)
        console.error(babelError);
        transformedCode = code;
      }

      // Step 4: Create sandboxed execution environment
      // The Tailwind component automatically handles className → inline styles conversion
      const executeTemplate = new Function(
        "React",
        "Html",
        "Head",
        "Body",
        "Container",
        "Text",
        "Button",
        "Section",
        "Heading",
        "Img",
        "Tailwind",
        "CustomButton",
        "Card",
        "Header",
        "Footer",
        "logoUrl",
        "heroBgUrl",
        "transformedCode",
        `
        ${transformedCode}
        
        // Simple function detection - find the single function in the code
        // Look for function declarations that start with a capital letter (React component convention)
        const functionRegex = /(?:const|let|var|function)\\s+([A-Z][a-zA-Z0-9_]*)/g;
        const matches = [...transformedCode.matchAll(functionRegex)];
        
        if (matches.length === 0) {
          throw new Error("No React component function found. Please define a function starting with a capital letter.");
        }
        
        // Get the first (and only) function name
        const functionName = matches[0][1];
        
        // Store the function name for display
        window.detectedFunctionName = functionName;
        
        // Get and execute the function
        const component = eval(functionName);
        
        if (typeof component !== 'function') {
          throw new Error(\`Found "\${functionName}" but it's not a function.\`);
        }
        
        return component({});
        `
      );

      // Step 5: Execute the template code with React Email components and custom components
      const emailElement = executeTemplate(
        React,
        Html,
        Head,
        Body,
        Container,
        Text,
        Button,
        Section,
        Heading,
        Img,
        Tailwind,
        CustomButton,
        Card,
        Header,
        Footer,
        logoUrl,
        heroBgUrl,
        transformedCode
      );

      // Step 6: Capture the detected function name
      const detectedFunctionName =
        (window as any).detectedFunctionName || "Unknown";
      setDetectedFunction(detectedFunctionName);

      // Step 7: Render React component to email-compatible HTML
      const { render } = await import("@react-email/render");
      const htmlResult = await render(emailElement);
      setHtmlContent(htmlResult);
    } catch (err) {
      // Error handling: Display user-friendly error messages
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate email";
      setError(errorMessage);
      setHtmlContent("");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handles code editor changes
   * Updates the code state when user types in the Monaco editor
   */
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleTemplateSelect = (templateCode: string) => {
    setCode(templateCode);
    setActiveTab("editor");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Application Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Email Generator</h1>
                <p className="text-muted-foreground">
                  Create beautiful emails with React Email & Tailwind CSS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {detectedFunction && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Function:</span>{" "}
                  {detectedFunction}
                </div>
              )}
              <Button
                onClick={generateHtml}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Preview"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor and Preview Area */}

      <main className="container mx-auto px-4 py-6 h-[calc(100vh-200px)]">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="justify-start w-fit">
            <TabsTrigger value="editor">
              <Code className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Palette className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1">
            <ResizablePanels
              leftPanel={
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-3 border-b bg-card">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        React Email Code
                      </span>
                    </div>
                    <Button
                      onClick={generateHtml}
                      disabled={isGenerating}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                  <div className="flex-1">
                    <CodeEditor
                      value={code}
                      onChange={handleCodeChange}
                      height="100%"
                    />
                  </div>
                </div>
              }
              rightPanel={
                <EmailPreview
                  htmlContent={htmlContent}
                  error={error}
                  isLoading={isGenerating}
                />
              }
              leftTitle="Code Editor"
              rightTitle="Email Preview"
              initialSplitRatio={0.5}
              minPanelWidth={250}
            />
          </TabsContent>
          <TabsContent value="templates" className="m-0 h-[calc(100vh-140px)]">
            <TemplateGallery onTemplateSelect={handleTemplateSelect} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
