"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download, Eye, Upload } from "lucide-react";
import { useState } from "react";
import { useGoogleDrive } from "@/contexts/GoogleDriveContext";

interface EmailPreviewProps {
  htmlContent: string;
  error?: string;
  isLoading?: boolean;
}

export function EmailPreview({
  htmlContent,
  error,
  isLoading = false,
}: EmailPreviewProps) {
  const [copied, setCopied] = useState(false);
  const {
    isSignedIn,
    isLoading: driveLoading,
    uploadHtml,
    error: driveError,
  } = useGoogleDrive();

  const handleCopy = async () => {
    if (!htmlContent.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    if (!htmlContent.trim()) {
      return;
    }

    try {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "email-template.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  const handleUploadToDrive = async () => {
    if (!htmlContent.trim()) {
      return;
    }

    try {
      await uploadHtml(htmlContent);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to upload to Drive:", err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Action buttons */}
      <div className="flex gap-2 p-3 border-b border-border bg-card flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!htmlContent.trim() || isLoading}
          className="flex items-center gap-2 border-border text-brand-primary hover:bg-brand-accent/10 transition-smooth"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy HTML"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!htmlContent.trim() || isLoading}
          className="flex items-center gap-2 border-border text-brand-primary hover:bg-brand-accent/10 transition-smooth"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUploadToDrive}
          disabled={
            !htmlContent.trim() || isLoading || !isSignedIn || driveLoading
          }
          className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#357ABD] text-white border-[#4285F4] transition-smooth"
        >
          <Upload className="h-4 w-4" />
          Upload to Drive
        </Button>
      </div>

      {/* Preview content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <div className="text-sm text-brand-primary font-medium">
                Generating preview...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-red-500 text-sm font-medium mb-2">
                Error generating preview
              </div>
              <div className="text-xs text-muted-foreground bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            </div>
          </div>
        ) : htmlContent ? (
          <iframe
            srcDoc={htmlContent}
            title="Email Preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center text-muted-foreground">
              <div className="p-4 bg-card rounded-xl border border-border shadow-sm mb-4">
                <Eye className="h-8 w-8 text-brand-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-brand-primary">
                  Click "Generate Preview" to see your email
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
