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
    <div className="h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Find your Template</h2>
          <p className="text-muted-foreground">
            Jumpstart your email development process with pre-built solutions
            from our community.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="p-6 overflow-auto h-[calc(100%-140px)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border border-border bg-card"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <CardTitle className="text-sm font-semibold">
                        {template.name}
                      </CardTitle>
                    </div>
                    <Badge className="text-xs">{template.category}</Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mb-4">
                    {template.description}
                  </CardDescription>
                  <Button
                    size="sm"
                    className="w-full"
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
