"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const themeContext = useContext(ThemeContext);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !themeContext) {
    // Return a placeholder button with the same dimensions during SSR
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-smooth"
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="hidden sm:inline">Light</span>
      </Button>
    );
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-smooth"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </Button>
  );
}
