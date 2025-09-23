"use client";

import React, { useState, useCallback, useEffect } from "react";
import { render } from "@react-email/render";
import { CodeEditor } from "@/components/CodeEditor";
import { EmailPreview } from "@/components/EmailPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Code, Eye } from "lucide-react";

// Default template code with JSX and Tailwind support
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
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f3f4f6", margin: 0, padding: 0 }}>
        <Container style={{ ...tw("mx-auto max-w-2xl"), padding: "20px" }}>
          
          {/* Header Section */}
          <Section style={{ ...tw("bg-white rounded-lg shadow-md mb-6 p-6") }}>
            <Img 
              src={logoUrl}
              alt={companyName}
              style={{ ...tw("mx-auto block mb-4"), height: "60px" }}
            />
            <Heading style={{ ...tw("text-3xl font-bold text-center text-gray-900 mb-2") }}>
              Component Showcase Email
            </Heading>
            <Text style={{ ...tw("text-center text-gray-600 text-lg") }}>
              This email demonstrates all React Email components with Tailwind styling
            </Text>
          </Section>

          {/* Welcome Section */}
          <Section style={{ ...tw("bg-blue-50 rounded-lg p-6 mb-6") }}>
            <Heading style={{ ...tw("text-2xl font-semibold text-blue-900 mb-4") }}>
              Welcome, {name}! 👋
            </Heading>
            <Text style={{ ...tw("text-blue-800 text-base leading-relaxed mb-4") }}>
              Thank you for joining {companyName}. We're excited to have you as part of our community. 
              This email showcases various React Email components styled with Tailwind CSS utilities.
            </Text>
            <Text style={{ ...tw("text-blue-700 text-sm") }}>
              <strong>Account Status:</strong> ✅ Active and verified
            </Text>
          </Section>

          {/* Product Features */}
          <Section style={{ ...tw("bg-white rounded-lg shadow-md p-6 mb-6") }}>
            <Heading style={{ ...tw("text-xl font-semibold text-gray-900 mb-4") }}>
              🚀 {productName} Features
            </Heading>
            
            <div style={{ ...tw("mb-4") }}>
              <Text style={{ ...tw("text-gray-800 font-medium mb-2") }}>
                ✨ Premium Analytics Dashboard
              </Text>
              <Text style={{ ...tw("text-gray-600 text-sm") }}>
                Get detailed insights into your performance metrics
              </Text>
            </div>
            
            <div style={{ ...tw("mb-4") }}>
              <Text style={{ ...tw("text-gray-800 font-medium mb-2") }}>
                🔒 Advanced Security Features
              </Text>
              <Text style={{ ...tw("text-gray-600 text-sm") }}>
                Two-factor authentication and encrypted data storage
              </Text>
            </div>
            
            <div style={{ ...tw("mb-4") }}>
              <Text style={{ ...tw("text-gray-800 font-medium mb-2") }}>
                📊 Real-time Collaboration
              </Text>
              <Text style={{ ...tw("text-gray-600 text-sm") }}>
                Work seamlessly with your team members
              </Text>
            </div>
          </Section>

          {/* Pricing Card */}
          <Section style={{ ...tw("bg-blue-600 rounded-xl p-6 text-center mb-6") }}>
            <Heading style={{ ...tw("text-2xl font-bold text-white mb-2") }}>
              Special Launch Offer
            </Heading>
            <Text style={{ ...tw("text-blue-100 mb-4") }}>
              Get started with {productName} for just
            </Text>
            <Text style={{ ...tw("text-4xl font-bold text-white mb-4") }}>
              {price}<span style={{ ...tw("text-lg font-normal") }}>/month</span>
            </Text>
            <Button
              href="https://example.com/subscribe"
              style={{
                ...tw("bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold"),
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Start Free Trial
            </Button>
          </Section>

          {/* Alert/Notice Section */}
          <Section style={{ ...tw("bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6") }}>
            <Heading style={{ ...tw("text-red-800 text-lg font-semibold mb-2") }}>
              ⚠️ Important Notice
            </Heading>
            <Text style={{ ...tw("text-red-700 text-sm") }}>
              This is an example of an alert or warning message. You can use different color schemes 
              for various types of notifications (success, warning, error, info).
            </Text>
          </Section>

          {/* Success Message */}
          <Section style={{ ...tw("bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6") }}>
            <Text style={{ ...tw("text-green-800 font-medium") }}>
              ✅ Account successfully activated! You can now access all premium features.
            </Text>
          </Section>

          {/* Action Buttons */}
          <Section style={{ ...tw("text-center mb-6") }}>
            <Heading style={{ ...tw("text-lg font-semibold text-gray-900 mb-4") }}>
              Quick Actions
            </Heading>
            <div style={{ ...tw("text-center") }}>
              <Button
                href="https://example.com/dashboard"
                style={{
                  ...tw("bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"),
                  textDecoration: "none",
                  display: "inline-block",
                  marginRight: "12px",
                  marginBottom: "8px"
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                href="https://example.com/support"
                style={{
                  ...tw("bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium"),
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: "8px"
                }}
              >
                Contact Support
              </Button>
            </div>
          </Section>

          {/* Footer */}
          <Section style={{ ...tw("bg-gray-100 rounded-lg p-6 text-center") }}>
            <Text style={{ ...tw("text-gray-600 text-sm mb-2") }}>
              © 2024 {companyName}. All rights reserved.
            </Text>
            <Text style={{ ...tw("text-gray-500 text-xs mb-3") }}>
              123 Business Street, Suite 100, City, ST 12345
            </Text>
            <Text style={{ ...tw("text-gray-500 text-xs") }}>
              You're receiving this email because you signed up for {companyName}.
              <br />
              <a href="#" style={{ color: "#3b82f6", textDecoration: "underline" }}>
                Unsubscribe
              </a> | 
              <a href="#" style={{ color: "#3b82f6", textDecoration: "underline" }}>
                Update Preferences
              </a>
            </Text>
          </Section>
          
        </Container>
      </Body>
    </Html>
  );
};`;

export default function EmailGenerator() {
  const [code, setCode] = useState(DEFAULT_TEMPLATE);
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHtml = async () => {
    if (!code.trim()) {
      setError("Please enter some code to generate the email");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Import React Email components first
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
      } = await import("@react-email/components");

      // Transform JSX to JavaScript using Babel
      const { transform } = await import("@babel/standalone");

      let transformedCode;
      try {
        const result = transform(code, {
          presets: [["react", { runtime: "classic" }]],
          plugins: [],
        });
        transformedCode = result.code;
      } catch (babelError) {
        // If JSX transformation fails, try to execute as-is (might be React.createElement syntax)
        transformedCode = code;
      }

      // Comprehensive Tailwind CSS to inline styles converter
      const tw = (classes: string) => {
        // Create a comprehensive class map with Tailwind utilities
        const classMap: Record<string, Record<string, string | number>> = {
          // Colors - Text
          "text-white": { color: "#ffffff" },
          "text-black": { color: "#000000" },
          "text-gray-50": { color: "#f9fafb" },
          "text-gray-100": { color: "#f3f4f6" },
          "text-gray-200": { color: "#e5e7eb" },
          "text-gray-300": { color: "#d1d5db" },
          "text-gray-400": { color: "#9ca3af" },
          "text-gray-500": { color: "#6b7280" },
          "text-gray-600": { color: "#4b5563" },
          "text-gray-700": { color: "#374151" },
          "text-gray-800": { color: "#1f2937" },
          "text-gray-900": { color: "#111827" },
          "text-blue-500": { color: "#3b82f6" },
          "text-blue-600": { color: "#2563eb" },
          "text-green-500": { color: "#10b981" },
          "text-green-600": { color: "#059669" },
          "text-red-500": { color: "#ef4444" },
          "text-red-600": { color: "#dc2626" },

          // Colors - Background
          "bg-white": { backgroundColor: "#ffffff" },
          "bg-black": { backgroundColor: "#000000" },
          "bg-gray-50": { backgroundColor: "#f9fafb" },
          "bg-gray-100": { backgroundColor: "#f3f4f6" },
          "bg-gray-200": { backgroundColor: "#e5e7eb" },
          "bg-gray-800": { backgroundColor: "#1f2937" },
          "bg-gray-900": { backgroundColor: "#111827" },
          "bg-blue-50": { backgroundColor: "#eff6ff" },
          "bg-blue-500": { backgroundColor: "#3b82f6" },
          "bg-blue-600": { backgroundColor: "#2563eb" },
          "bg-green-50": { backgroundColor: "#ecfdf5" },
          "bg-green-500": { backgroundColor: "#10b981" },
          "bg-red-50": { backgroundColor: "#fef2f2" },
          "bg-red-500": { backgroundColor: "#ef4444" },

          // Spacing - Padding
          "p-0": { padding: "0px" },
          "p-1": { padding: "4px" },
          "p-2": { padding: "8px" },
          "p-3": { padding: "12px" },
          "p-4": { padding: "16px" },
          "p-5": { padding: "20px" },
          "p-6": { padding: "24px" },
          "p-8": { padding: "32px" },
          "px-2": { paddingLeft: "8px", paddingRight: "8px" },
          "px-3": { paddingLeft: "12px", paddingRight: "12px" },
          "px-4": { paddingLeft: "16px", paddingRight: "16px" },
          "px-6": { paddingLeft: "24px", paddingRight: "24px" },
          "px-8": { paddingLeft: "32px", paddingRight: "32px" },
          "py-1": { paddingTop: "4px", paddingBottom: "4px" },
          "py-2": { paddingTop: "8px", paddingBottom: "8px" },
          "py-3": { paddingTop: "12px", paddingBottom: "12px" },
          "py-4": { paddingTop: "16px", paddingBottom: "16px" },
          "py-6": { paddingTop: "24px", paddingBottom: "24px" },
          "py-8": { paddingTop: "32px", paddingBottom: "32px" },

          // Spacing - Margin
          "m-0": { margin: "0px" },
          "m-2": { margin: "8px" },
          "m-4": { margin: "16px" },
          "mx-auto": { marginLeft: "auto", marginRight: "auto" },
          "mb-1": { marginBottom: "4px" },
          "mb-2": { marginBottom: "8px" },
          "mb-3": { marginBottom: "12px" },
          "mb-4": { marginBottom: "16px" },
          "mb-6": { marginBottom: "24px" },
          "mb-8": { marginBottom: "32px" },
          "mt-2": { marginTop: "8px" },
          "mt-4": { marginTop: "16px" },
          "mt-6": { marginTop: "24px" },
          "mt-8": { marginTop: "32px" },

          // Typography
          "text-xs": { fontSize: "12px", lineHeight: "16px" },
          "text-sm": { fontSize: "14px", lineHeight: "20px" },
          "text-base": { fontSize: "16px", lineHeight: "24px" },
          "text-lg": { fontSize: "18px", lineHeight: "28px" },
          "text-xl": { fontSize: "20px", lineHeight: "28px" },
          "text-2xl": { fontSize: "24px", lineHeight: "32px" },
          "text-3xl": { fontSize: "30px", lineHeight: "36px" },
          "text-4xl": { fontSize: "36px", lineHeight: "40px" },
          "font-normal": { fontWeight: "400" },
          "font-medium": { fontWeight: "500" },
          "font-semibold": { fontWeight: "600" },
          "font-bold": { fontWeight: "700" },
          "text-left": { textAlign: "left" },
          "text-center": { textAlign: "center" },
          "text-right": { textAlign: "right" },
          "leading-tight": { lineHeight: "1.25" },
          "leading-normal": { lineHeight: "1.5" },
          "leading-relaxed": { lineHeight: "1.625" },

          // Layout
          block: { display: "block" },
          inline: { display: "inline" },
          "inline-block": { display: "inline-block" },
          flex: { display: "flex" },
          "w-full": { width: "100%" },
          "w-auto": { width: "auto" },
          "h-auto": { height: "auto" },
          "max-w-sm": { maxWidth: "384px" },
          "max-w-md": { maxWidth: "448px" },
          "max-w-lg": { maxWidth: "512px" },
          "max-w-xl": { maxWidth: "576px" },
          "max-w-2xl": { maxWidth: "672px" },

          // Border Radius
          rounded: { borderRadius: "4px" },
          "rounded-md": { borderRadius: "6px" },
          "rounded-lg": { borderRadius: "8px" },
          "rounded-xl": { borderRadius: "12px" },
          "rounded-full": { borderRadius: "9999px" },

          // Box Shadow
          shadow: {
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          },
          "shadow-md": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          "shadow-lg": {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          "shadow-xl": {
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },

          // Borders
          border: { borderWidth: "1px" },
          "border-2": { borderWidth: "2px" },
          "border-gray-200": { borderColor: "#e5e7eb" },
          "border-gray-300": { borderColor: "#d1d5db" },
          "border-blue-500": { borderColor: "#3b82f6" },
        };

        return classes.split(" ").reduce(
          (styles, className) => {
            return { ...styles, ...(classMap[className] || {}) };
          },
          {} as Record<string, string | number>
        );
      };

      // Create execution environment with JSX support
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
        "tw",
        `
        ${transformedCode}
        
        // Find and return the component
        const component = ShowcaseEmail || WelcomeEmail || PasswordResetEmail || NewsletterEmail;
        if (!component) {
          throw new Error("No email component found. Please define ShowcaseEmail, WelcomeEmail, PasswordResetEmail, or NewsletterEmail.");
        }
        return component({});
        `
      );

      // Execute template with React and components
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
        tw
      );

      // Render to HTML
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Email Generator</h1>
                <p className="text-muted-foreground">
                  Create beautiful emails with React Email
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
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Code Editor */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  React Email Code
                </CardTitle>
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
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="h-full">
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  height="100%"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Preview */}
          <div className="flex flex-col">
            <EmailPreview
              htmlContent={htmlContent}
              error={error}
              isLoading={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
