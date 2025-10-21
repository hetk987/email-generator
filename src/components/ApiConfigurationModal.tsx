"use client";

import React, { useState } from "react";
import { useApi } from "@/contexts/ApiContext";
import { ApiEndpoint, apiService } from "@/lib/apiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Edit2,
  Trash2,
  Settings,
  Globe,
  Code,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface ApiConfigurationModalProps {
  children?: React.ReactNode;
}

/**
 * API Configuration Modal Component
 * Provides interface for managing API endpoints with form validation
 */
export function ApiConfigurationModal({
  children,
}: ApiConfigurationModalProps) {
  const {
    endpoints,
    addEndpoint,
    updateEndpoint,
    deleteEndpoint,
    fetchAllApis,
    clearAllEndpoints,
    isLoading,
  } = useApi();

  // Debug logging
  console.log("🔧 ApiConfigurationModal - endpoints:", endpoints);

  const [isOpen, setIsOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<ApiEndpoint | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET" as "GET" | "POST" | "PUT" | "DELETE",
    headers: "",
    body: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset form to default values
   */
  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      method: "GET",
      headers: "",
      body: "",
    });
    setErrors([]);
    setEditingEndpoint(null);
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const endpointData: Partial<ApiEndpoint> = {
      name: formData.name.trim(),
      url: formData.url.trim(),
      method: formData.method,
      headers: formData.headers.trim()
        ? JSON.parse(formData.headers)
        : undefined,
      body: formData.body.trim() || undefined,
    };

    const validationErrors = apiService.validateEndpoint(endpointData);

    // Check for duplicate names (excluding current editing endpoint)
    const existingNames = endpoints
      .filter((ep) => ep.id !== editingEndpoint?.id)
      .map((ep) => ep.name.toLowerCase());

    if (existingNames.includes(formData.name.toLowerCase())) {
      validationErrors.push("Endpoint name already exists");
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const endpointData = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        method: formData.method,
        headers: formData.headers.trim()
          ? JSON.parse(formData.headers)
          : undefined,
        body: formData.body.trim() || undefined,
      };

      if (editingEndpoint) {
        updateEndpoint(editingEndpoint.id, endpointData);
      } else {
        addEndpoint(endpointData);
      }

      resetForm();
    } catch (error) {
      setErrors(["Failed to save endpoint configuration"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Start editing an endpoint
   */
  const startEditing = (endpoint: ApiEndpoint) => {
    setFormData({
      name: endpoint.name,
      url: endpoint.url,
      method: endpoint.method,
      headers: endpoint.headers
        ? JSON.stringify(endpoint.headers, null, 2)
        : "",
      body: endpoint.body || "",
    });
    setEditingEndpoint(endpoint);
    setErrors([]);
  };

  /**
   * Cancel editing
   */
  const cancelEditing = () => {
    resetForm();
  };

  /**
   * Test API endpoint
   */
  const testEndpoint = async (endpoint: ApiEndpoint) => {
    try {
      console.log(`🧪 Testing endpoint: ${endpoint.name}`);
      await apiService.makeRequest(endpoint);
    } catch (error) {
      console.error(`❌ Test failed for ${endpoint.name}:`, error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            API Config
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure API endpoints to fetch data for your email templates. Use{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-sm">
              API.endpointName
            </code>{" "}
            in your templates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Form Section */}
          <div className="space-y-4 overflow-auto pr-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {editingEndpoint ? (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Edit Endpoint
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Endpoint
                    </>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Endpoint Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Endpoint Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., product, users, orders"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={
                        errors.some((e) => e.includes("name"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>

                  {/* URL */}
                  <div className="space-y-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      placeholder="https://api.example.com/products"
                      value={formData.url}
                      onChange={(e) => handleInputChange("url", e.target.value)}
                      className={
                        errors.some((e) => e.includes("URL"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>

                  {/* HTTP Method */}
                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method *</Label>
                    <select
                      id="method"
                      value={formData.method}
                      onChange={(e) =>
                        handleInputChange("method", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  {/* Headers */}
                  <div className="space-y-2">
                    <Label htmlFor="headers">Headers (JSON)</Label>
                    <Textarea
                      id="headers"
                      placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                      value={formData.headers}
                      onChange={(e) =>
                        handleInputChange("headers", e.target.value)
                      }
                      rows={3}
                      className={
                        errors.some((e) => e.includes("Headers"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>

                  {/* Request Body */}
                  {formData.method !== "GET" && (
                    <div className="space-y-2">
                      <Label htmlFor="body">Request Body (JSON)</Label>
                      <Textarea
                        id="body"
                        placeholder='{"key": "value"}'
                        value={formData.body}
                        onChange={(e) =>
                          handleInputChange("body", e.target.value)
                        }
                        rows={4}
                        className={
                          errors.some((e) => e.includes("body"))
                            ? "border-red-500"
                            : ""
                        }
                      />
                    </div>
                  )}

                  {/* Error Messages */}
                  {errors.length > 0 && (
                    <div className="space-y-1">
                      {errors.map((error, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-red-600"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {editingEndpoint ? "Update" : "Add"} Endpoint
                    </Button>
                    {editingEndpoint && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Endpoints List Section */}
          <div className="space-y-4 flex flex-col w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Configured Endpoints</h3>
              <div className="flex gap-2">
                <Button
                  onClick={fetchAllApis}
                  disabled={isLoading || endpoints.length === 0}
                  size="sm"
                  variant="outline"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Code className="h-4 w-4 mr-2" />
                  )}
                  Test All APIs
                </Button>
                {endpoints.length > 0 && (
                  <Button
                    onClick={clearAllEndpoints}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Scrollable List */}
            <ScrollArea className="max-h-[65vh] w-full overflow-y-auto ">
              <div className="space-y-3">
                {endpoints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No API endpoints configured</p>
                    <p className="text-sm">
                      Add your first endpoint to get started
                    </p>
                  </div>
                ) : (
                  endpoints.map((endpoint) => (
                    <Card key={endpoint.id} className="relative p-3 w-fit ">
                      {/* Action Buttons - Fixed Top Right */}
                      <div className="absolute top-3 right-3 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => testEndpoint(endpoint)}
                          className="h-8 w-8 p-0"
                        >
                          <Code className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(endpoint)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEndpoint(endpoint.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-col gap-1 pr-20">
                        {/* add right padding to avoid overlap */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm bg-primary/10 px-2 py-1 rounded">
                            {endpoint.name}
                          </span>
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {endpoint.method}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {endpoint.url}
                        </p>
                        {endpoint.headers && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Headers: {Object.keys(endpoint.headers).length}{" "}
                            configured
                          </p>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
