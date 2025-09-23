"use client";

import { render } from "@react-email/render";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download } from "lucide-react";
import { useState } from "react";

interface EmailPreviewProps {
  htmlContent: string;
  error?: string;
}

export function EmailPreview({ htmlContent, error }: EmailPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Email Preview</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy HTML"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {error ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-red-500 text-sm font-medium mb-2">
                  Error generating preview
                </div>
                <div className="text-xs text-muted-foreground bg-red-50 p-3 rounded border">
                  {error}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <iframe
                srcDoc={htmlContent}
                title="Email Preview"
                className="w-full h-full border-0 rounded-b-lg"
                sandbox="allow-same-origin"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
