"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Upload } from "lucide-react";

interface FileNamingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filename: string) => void;
  defaultFilename?: string;
  fileType: "html" | "jsx";
  isLoading?: boolean;
}

export function FileNamingDialog({
  isOpen,
  onClose,
  onConfirm,
  defaultFilename,
  fileType,
  isLoading = false,
}: FileNamingDialogProps) {
  const [filename, setFilename] = useState(defaultFilename || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filename.trim()) {
      onConfirm(filename.trim());
    }
  };

  const handleClose = () => {
    setFilename(defaultFilename || "");
    onClose();
  };

  const getFileExtension = () => (fileType === "html" ? ".html" : ".jsx");
  const getPlaceholder = () =>
    `email-template-${Date.now()}${getFileExtension()}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Name Your File
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <div className="flex items-center gap-2">
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder={getPlaceholder()}
                className="flex-1"
                disabled={isLoading}
                autoFocus
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {getFileExtension()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose a descriptive name for your {fileType.toUpperCase()} file
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!filename.trim() || isLoading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isLoading ? "Uploading..." : "Upload to Drive"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
