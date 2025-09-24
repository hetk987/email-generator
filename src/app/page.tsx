"use client";

import React, { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { EmailPreview } from "@/components/EmailPreview";
import { ResizablePanels } from "@/components/ResizablePanels";
import { Button } from "@/components/ui/button";
import { Mail, Code, Eye } from "lucide-react";

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
 * Default email template demonstrating React Email components with Tailwind CSS
 *
 * This template showcases:
 * - Proper <Tailwind> wrapper usage for className conversion
 * - All major React Email components (Html, Head, Body, Container, Section, Text, Heading, Button, Img)
 * - Responsive design with Tailwind utility classes
 * - Email client compatible structure
 *
 * Note: All content must be wrapped in <Tailwind> component for className support
 */
const DEFAULT_TEMPLATE = `const ShowcaseEmail = ({
  name = "Alex Johnson",
  companyName = "Acme Corporation",
  productName = "Premium Suite",
  price = "$99",
  logoUrl = "https://via.placeholder.com/150x60/3b82f6/ffffff?text=ACME"
} = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto max-w-2xl p-5">
            
            {/* Header Section */}
            <Section className="bg-white rounded-lg shadow-md mb-6 p-6">
              <Img 
                src={logoUrl}
                alt={companyName}
                className="mx-auto block mb-4 h-15"
              />
              <Heading className="text-3xl font-bold text-center text-gray-900 mb-2">
                Component Showcase Email
              </Heading>
              <Text className="text-center text-gray-600 text-lg">
                This email demonstrates all React Email components with Tailwind styling
              </Text>
            </Section>

            {/* Welcome Section */}
            <Section className="bg-blue-50 rounded-lg p-6 mb-6">
              <Heading className="text-2xl font-semibold text-blue-900 mb-4">
                Welcome, {name}! 👋
              </Heading>
              <Text className="text-blue-800 text-base leading-relaxed mb-4">
                Thank you for joining {companyName}. We're excited to have you as part of our community. 
                This email showcases various React Email components styled with Tailwind CSS utilities.
              </Text>
              <Text className="text-blue-700 text-sm">
                <strong>Account Status:</strong> ✅ Active and verified
              </Text>
            </Section>

            {/* Product Features */}
            <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Heading className="text-xl font-semibold text-gray-900 mb-4">
                🚀 {productName} Features
              </Heading>
              
              <div className="mb-4">
                <Text className="text-gray-800 font-medium mb-2">
                  ✨ Premium Analytics Dashboard
                </Text>
                <Text className="text-gray-600 text-sm">
                  Get detailed insights into your performance metrics
                </Text>
              </div>
              
              <div className="mb-4">
                <Text className="text-gray-800 font-medium mb-2">
                  🔒 Advanced Security Features
                </Text>
                <Text className="text-gray-600 text-sm">
                  Two-factor authentication and encrypted data storage
                </Text>
              </div>
              
              <div className="mb-4">
                <Text className="text-gray-800 font-medium mb-2">
                  📊 Real-time Collaboration
                </Text>
                <Text className="text-gray-600 text-sm">
                  Work seamlessly with your team members
                </Text>
              </div>
            </Section>

            {/* Pricing Card */}
            <Section className="bg-blue-600 rounded-xl p-6 text-center mb-6">
              <Heading className="text-2xl font-bold text-white mb-2">
                Special Launch Offer
              </Heading>
              <Text className="text-blue-100 mb-4">
                Get started with {productName} for just
              </Text>
              <Text className="text-4xl font-bold text-white mb-4">
                {price}<span className="text-lg font-normal">/month</span>
              </Text>
              <Button
                href="https://example.com/subscribe"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold no-underline inline-block"
              >
                Start Free Trial
              </Button>
            </Section>

            {/* Alert/Notice Section */}
            <Section className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <Heading className="text-red-800 text-lg font-semibold mb-2">
                ⚠️ Important Notice
              </Heading>
              <Text className="text-red-700 text-sm">
                This is an example of an alert or warning message. You can use different color schemes 
                for various types of notifications (success, warning, error, info).
              </Text>
            </Section>

            {/* Success Message */}
            <Section className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <Text className="text-green-800 font-medium">
                ✅ Account successfully activated! You can now access all premium features.
              </Text>
            </Section>

            {/* Action Buttons */}
            <Section className="text-center mb-6">
              <Heading className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </Heading>
              <div className="text-center">
                <Button
                  href="https://example.com/dashboard"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium no-underline inline-block mr-3 mb-2"
                >
                  Go to Dashboard
                </Button>
                <Button
                  href="https://example.com/support"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium no-underline inline-block mb-2"
                >
                  Contact Support
                </Button>
              </div>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 rounded-lg p-6 text-center">
              <Text className="text-gray-600 text-sm mb-2">
                © 2024 {companyName}. All rights reserved.
              </Text>
              <Text className="text-gray-500 text-xs mb-3">
                123 Business Street, Suite 100, City, ST 12345
              </Text>
              <Text className="text-gray-500 text-xs">
                You're receiving this email because you signed up for {companyName}.
                <br />
                <a href="#" className="text-blue-600 underline">
                  Unsubscribe
                </a> | 
                <a href="#" className="text-blue-600 underline">
                  Update Preferences
                </a>
              </Text>
            </Section>
            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};`;

/**
 * Main Email Generator Component
 *
 * Manages the state and functionality for the email template editor and preview.
 * Handles JSX compilation, React Email rendering, and Tailwind CSS processing.
 */
export default function EmailGenerator() {
  // Component state
  const [code, setCode] = useState(DEFAULT_TEMPLATE);
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generates HTML from the user's React Email code
   *
   * Process:
   * 1. Validates input code
   * 2. Imports React Email components dynamically
   * 3. Transforms JSX to JavaScript using Babel
   * 4. Executes the transformed code in a sandboxed environment
   * 5. Renders the React component to HTML using React Email's render function
   * 6. Updates the preview with the generated HTML
   */
  const generateHtml = async () => {
    // Input validation
    if (!code.trim()) {
      setError("Please enter some code to generate the email");
      return;
    }

    setIsGenerating(true);
    setError("");

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

      // Step 2: Transform JSX to JavaScript using Babel
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
        transformedCode = code;
      }

      // Step 3: Create sandboxed execution environment
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
        `
        ${transformedCode}
        
        // Find and return the email component
        // Supports multiple common naming conventions
        const component = ShowcaseEmail || WelcomeEmail || PasswordResetEmail || NewsletterEmail;
        if (!component) {
          throw new Error("No email component found. Please define ShowcaseEmail, WelcomeEmail, PasswordResetEmail, or NewsletterEmail.");
        }
        return component({});
        `
      );

      // Step 4: Execute the template code with React Email components
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
        Tailwind
      );

      // Step 5: Render React component to email-compatible HTML
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
      </header>

      {/* Main Editor and Preview Area */}
      <main className="container mx-auto px-4 py-6 h-[calc(100vh-200px)]">
        <ResizablePanels
          leftPanel={
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b bg-card">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="font-medium text-sm">React Email Code</span>
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
      </main>
    </div>
  );
}
