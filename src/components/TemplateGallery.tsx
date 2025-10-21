"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_TEMPLATE } from "@/templates/default";
import { Badge } from "lucide-react";
import { templates } from "@/templates";

interface TemplateGalleryProps {
  onTemplateSelect: (template: string) => void;
}

export function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  console.log(templates);
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-brand-primary">
            Find your Template
          </h2>
          <p className="text-muted-foreground font-medium">
            Jumpstart your email development process with pre-built solutions
            from our community.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="p-6 overflow-auto flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-brand-lg transition-smooth hover-lift cursor-pointer border border-border bg-card shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-primary rounded-lg text-primary-foreground">
                        {template.icon}
                      </div>
                      <CardTitle className="text-sm font-semibold text-brand-primary">
                        {template.name}
                      </CardTitle>
                    </div>
                    <div className="px-3 py-1 bg-brand-accent/20 text-brand-primary text-xs font-medium rounded-full border border-brand-accent/30">
                      {template.category}
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {template.description}
                  </CardDescription>
                  <Button
                    size="sm"
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground shadow-brand transition-smooth hover-scale"
                    onClick={() => onTemplateSelect(template.code)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
