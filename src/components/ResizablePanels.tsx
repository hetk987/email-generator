"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, X } from "lucide-react";

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftTitle: string;
  rightTitle: string;
  initialSplitRatio?: number; // 0-1, where 0.5 means 50/50 split
  minPanelWidth?: number; // Minimum width in pixels
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  leftTitle,
  rightTitle,
  initialSplitRatio = 0.5,
  minPanelWidth = 200,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(initialSplitRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeftFullscreen, setIsLeftFullscreen] = useState(false);
  const [isRightFullscreen, setIsRightFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate pixel values
  const leftWidthPx = leftWidth * (containerRef.current?.clientWidth || 800);
  const rightWidthPx =
    (1 - leftWidth) * (containerRef.current?.clientWidth || 800);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const newLeftWidth = (e.clientX - containerRect.left) / containerWidth;

      // Apply constraints
      const minWidth = minPanelWidth / containerWidth;
      const maxWidth = 1 - minWidth;
      const constrainedWidth = Math.max(
        minWidth,
        Math.min(maxWidth, newLeftWidth)
      );

      setLeftWidth(constrainedWidth);
    },
    [isDragging, minPanelWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleLeftFullscreen = useCallback(() => {
    setIsLeftFullscreen(!isLeftFullscreen);
    if (!isLeftFullscreen) {
      setIsRightFullscreen(false);
    }
  }, [isLeftFullscreen]);

  const toggleRightFullscreen = useCallback(() => {
    setIsRightFullscreen(!isRightFullscreen);
    if (!isRightFullscreen) {
      setIsLeftFullscreen(false);
    }
  }, [isRightFullscreen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "1") {
          e.preventDefault();
          toggleLeftFullscreen();
        } else if (e.key === "2") {
          e.preventDefault();
          toggleRightFullscreen();
        } else if (e.key === "0") {
          e.preventDefault();
          setIsLeftFullscreen(false);
          setIsRightFullscreen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleLeftFullscreen, toggleRightFullscreen]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full relative border border-border rounded-xl shadow-brand bg-card overflow-hidden"
    >
      {/* Left Panel */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          isLeftFullscreen
            ? "w-full"
            : isRightFullscreen
              ? "w-0 overflow-hidden"
              : "flex-shrink-0"
        }`}
        style={{
          width: isLeftFullscreen
            ? "100%"
            : isRightFullscreen
              ? "0px"
              : `${leftWidth * 100}%`,
        }}
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border bg-card">
            <h3 className="font-semibold text-sm text-brand-primary">
              {leftTitle}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLeftFullscreen}
              className="h-6 w-6 p-0 text-brand-primary hover:bg-brand-accent/10 transition-smooth"
              title={`${isLeftFullscreen ? "Exit" : "Enter"} fullscreen (Ctrl/Cmd + 1)`}
            >
              {isLeftFullscreen ? (
                <Minimize className="h-3 w-3" />
              ) : (
                <Maximize className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">{leftPanel}</div>
        </div>
      </div>

      {/* Resize Handle */}
      {!isLeftFullscreen && !isRightFullscreen && (
        <div
          className={`w-1 bg-border hover:bg-brand-primary/50 cursor-col-resize flex-shrink-0 transition-colors ${
            isDragging ? "bg-brand-primary" : ""
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-0.5 h-8 bg-brand-primary/40 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          isRightFullscreen
            ? "w-full"
            : isLeftFullscreen
              ? "w-0 overflow-hidden"
              : "flex-shrink-0"
        }`}
        style={{
          width: isRightFullscreen
            ? "100%"
            : isLeftFullscreen
              ? "0px"
              : `${(1 - leftWidth) * 100}%`,
        }}
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border bg-card">
            <h3 className="font-semibold text-sm text-brand-primary">
              {rightTitle}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRightFullscreen}
              className="h-6 w-6 p-0 text-brand-primary hover:bg-brand-accent/10 transition-smooth"
              title={`${isRightFullscreen ? "Exit" : "Enter"} fullscreen (Ctrl/Cmd + 2)`}
            >
              {isRightFullscreen ? (
                <Minimize className="h-3 w-3" />
              ) : (
                <Maximize className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">{rightPanel}</div>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      {showShortcuts && (
        <div className="absolute bottom-4 right-4 text-xs text-brand-primary bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border shadow-brand">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-semibold text-brand-primary">
              Keyboard Shortcuts
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(false)}
              className="h-4 w-4 p-0 text-brand-primary hover:bg-brand-accent/10 transition-smooth"
              title="Close shortcuts"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="font-medium">
            Ctrl/Cmd + 1: Toggle left fullscreen
          </div>
          <div className="font-medium">
            Ctrl/Cmd + 2: Toggle right fullscreen
          </div>
          <div className="font-medium">Ctrl/Cmd + 0: Reset to split view</div>
        </div>
      )}
    </div>
  );
}
