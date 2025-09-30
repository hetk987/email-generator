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
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary rounded-xl shadow-brand">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-primary">
                  TD Email Generator
                </h1>
                <p className="text-muted-foreground font-medium">
                  Create beautiful emails with React Email & Tailwind CSS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {detectedFunction && (
                <div className="px-3 py-2 bg-brand-light/30 rounded-lg border border-brand-accent/20">
                  <div className="text-sm text-brand-primary font-medium">
                    <span className="text-muted-foreground">Function:</span>{" "}
                    <code className="px-2 py-1 bg-brand-primary/10 rounded text-brand-primary">
                      {detectedFunction}
                    </code>
                  </div>
                </div>
              )}
              <Button
                onClick={generateHtml}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand transition-smooth hover-lift"
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
          <TabsList className="justify-start w-fit bg-card border border-border rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-brand transition-smooth"
            >
              <Code className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-brand transition-smooth"
            >
              <Palette className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1">
            <ResizablePanels
              leftPanel={
                <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-brand">
                  <div className="flex items-center justify-between p-4 border-b border-border bg-card rounded-t-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-primary rounded-lg">
                        <Code className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-brand-primary">
                        React Email Code
                      </span>
                    </div>
                    <Button
                      onClick={generateHtml}
                      disabled={isGenerating}
                      size="sm"
                      className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand transition-smooth hover-lift"
                    >
                      <Eye className="h-4 w-4" />
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                  <div className="flex-1 rounded-b-xl overflow-hidden">
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
