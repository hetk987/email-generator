"use client";

import React, { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { EmailPreview } from "@/components/EmailPreview";
import { ResizablePanels } from "@/components/ResizablePanels";
import { Button } from "@/components/ui/button";
import { Mail, Code, Eye, Palette, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateGallery } from "@/components/TemplateGallery";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ApiConfigurationModal } from "@/components/ApiConfigurationModal";
import { useApi, getApiDataForTemplate } from "@/contexts/ApiContext";
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
  const [activeTab, setActiveTab] = useState("editor");
  const [code, setCode] = useState(DEFAULT_TEMPLATE.code);
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [detectedFunction, setDetectedFunction] = useState<string>("");

  const { fetchAllApis, apiData, isLoading: isApiLoading } = useApi();

  const generateHtml = async () => {
    if (!code.trim()) {
      setError("Please enter some code to generate the email");
      return;
    }

    setIsGenerating(true);
    setError("");
    setDetectedFunction("");

    try {
      console.log("🔄 Starting email generation...");
      await fetchAllApis();

      const apiDataForTemplate = getApiDataForTemplate(apiData);
      console.log("📊 API Data for template:", apiDataForTemplate);

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

      const { CustomButton, Card, Header, Footer } = await import(
        "@/components/email"
      );
      const { logoUrl, heroBgUrl } = await import("@/assets");

      const { transform } = await import("@babel/standalone");

      let transformedCode;
      try {
        const result = transform(code, {
          presets: [["react", { runtime: "classic" }]],
          plugins: [],
        });
        transformedCode = result.code;
      } catch (babelError) {
        console.error(babelError);
        transformedCode = code;
      }

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
        "API",
        "transformedCode",
        `
        ${transformedCode}
        
        const functionRegex = /(?:const|let|var|function)\\s+([A-Z][a-zA-Z0-9_]*)/g;
        const matches = [...transformedCode.matchAll(functionRegex)];
        
        if (matches.length === 0) {
          throw new Error("No React component function found. Please define a function starting with a capital letter.");
        }
        
        const functionName = matches[0][1];
        window.detectedFunctionName = functionName;
        
        const component = eval(functionName);
        
        if (typeof component !== 'function') {
          throw new Error(\`Found "\${functionName}" but it's not a function.\`);
        }
        
        return component({});
        `
      );

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
        apiDataForTemplate,
        transformedCode
      );

      const detectedFunctionName =
        (window as any).detectedFunctionName || "Unknown";
      setDetectedFunction(detectedFunctionName);

      const { render } = await import("@react-email/render");
      const htmlResult = await render(emailElement);
      setHtmlContent(htmlResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate email";
      setError(errorMessage);
      setHtmlContent("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleTemplateSelect = (templateCode: string) => {
    setCode(templateCode);
    setActiveTab("editor");
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Application Header */}
      <header className="border-b bg-card shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary rounded-xl shadow-brand">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-primary">
                  TD Email Generator
                </h1>
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
              <ApiConfigurationModal />
              <ThemeToggle />
              <Button
                onClick={generateHtml}
                disabled={isGenerating || isApiLoading}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground shadow-brand transition-smooth hover-lift"
              >
                <Eye className="h-4 w-4" />
                {isGenerating
                  ? "Generating..."
                  : isApiLoading
                    ? "Fetching APIs..."
                    : "Generate Preview"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor and Preview Area */}
      <main className="flex-1 min-h-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="justify-start w-fit bg-card border border-border rounded-xl p-1 shadow-sm mb-4 mx-4 mt-4 flex-shrink-0">
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-brand transition-smooth"
            >
              <Code className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-brand transition-smooth"
            >
              <Palette className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 min-h-0 mt-0 px-4 pb-4">
            <ResizablePanels
              leftPanel={
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  height="100%"
                />
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

          <TabsContent
            value="templates"
            className="flex-1 min-h-0 mt-0 px-4 pb-4"
          >
            <TemplateGallery onTemplateSelect={handleTemplateSelect} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
