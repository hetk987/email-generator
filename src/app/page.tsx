"use client";

import React, { useState, useCallback, useEffect } from "react";
import { render } from "@react-email/render";
import { CodeEditor } from "@/components/CodeEditor";
import { EmailPreview } from "@/components/EmailPreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Code, Eye } from "lucide-react";

// Default template code
const DEFAULT_TEMPLATE = `const WelcomeEmail = ({ 
  name = "User", 
  companyName = "Your Company",
  loginUrl = "https://example.com/login"
} = {}) => {
  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Body, { 
      style: { 
        fontFamily: 'Arial, sans-serif', 
        backgroundColor: '#f6f6f6', 
        margin: 0, 
        padding: 0 
      } 
    },
      React.createElement(Container, { 
        style: { 
          margin: '0 auto', 
          padding: '20px', 
          maxWidth: '600px' 
        } 
      },
        React.createElement(Section, { 
          style: { 
            backgroundColor: '#ffffff', 
            padding: '40px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          } 
        },
          React.createElement(Heading, { 
            style: { 
              color: '#333333', 
              fontSize: '28px', 
              marginBottom: '20px', 
              textAlign: 'center' 
            } 
          }, "Welcome to " + companyName + "!"),
          React.createElement(Text, { 
            style: { 
              color: '#666666', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              marginBottom: '20px' 
            } 
          }, "Hello " + name + ","),
          React.createElement(Text, { 
            style: { 
              color: '#666666', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              marginBottom: '30px' 
            } 
          }, "We're excited to have you join our community! Your account has been successfully created and you're ready to get started."),
          React.createElement('div', { 
            style: { 
              textAlign: 'center', 
              marginBottom: '30px' 
            } 
          },
            React.createElement(Button, {
              href: loginUrl,
              style: {
                backgroundColor: '#007cba',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold'
              }
            }, 'Get Started')
          ),
          React.createElement(Text, { 
            style: { 
              color: '#999999', 
              fontSize: '14px', 
              lineHeight: '1.5', 
              textAlign: 'center', 
              marginTop: '30px' 
            } 
          }, "If you have any questions, feel free to reach out to our support team.")
        )
      )
    )
  );
};`;

export default function EmailGenerator() {
  const [code, setCode] = useState(DEFAULT_TEMPLATE);
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string>("");
  const [showTemplates, setShowTemplates] = useState(true);
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

      // Create execution environment - much simpler approach
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
        `
        ${code}
        
        // Find and return the component
        const component = WelcomeEmail || PasswordResetEmail || NewsletterEmail;
        if (!component) {
          throw new Error("No email component found. Please define WelcomeEmail, PasswordResetEmail, or NewsletterEmail.");
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
        Img
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

  const handleTemplateSelect = (template: { code: string }) => {
    setCode(template.code);
    setShowTemplates(false);
  };

  const handleShowTemplates = () => {
    setShowTemplates(true);
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShowTemplates}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Templates
              </Button>
              {!showTemplates && (
                <Button
                  onClick={generateHtml}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Preview"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {showTemplates ? (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Choose a Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelector onSelectTemplate={handleTemplateSelect} />
              </CardContent>
            </Card>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
