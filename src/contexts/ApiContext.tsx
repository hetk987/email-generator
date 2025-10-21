"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ApiEndpoint,
  ApiResponse,
  ApiError,
  apiService,
} from "@/lib/apiService";

interface ApiContextType {
  endpoints: ApiEndpoint[];
  apiData: Record<string, ApiResponse | ApiError>;
  isLoading: boolean;
  addEndpoint: (endpoint: Omit<ApiEndpoint, "id">) => void;
  updateEndpoint: (id: string, endpoint: Partial<ApiEndpoint>) => void;
  deleteEndpoint: (id: string) => void;
  fetchAllApis: () => Promise<void>;
  clearApiData: () => void;
  clearAllEndpoints: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const STORAGE_KEY = "email-generator-api-endpoints";

interface ApiProviderProps {
  children: ReactNode;
}

/**
 * API Context Provider
 * Manages API endpoint configurations and fetched data
 * Provides localStorage persistence and API calling functionality
 */
export function ApiProvider({ children }: ApiProviderProps) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [apiData, setApiData] = useState<
    Record<string, ApiResponse | ApiError>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  // Load endpoints from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("🔍 Loading endpoints from localStorage:", stored);
      if (stored) {
        const parsedEndpoints = JSON.parse(stored);
        console.log("📋 Parsed endpoints:", parsedEndpoints);
        setEndpoints(parsedEndpoints);
      } else {
        console.log("📭 No stored endpoints found");
      }
    } catch (error) {
      console.error("Failed to load API endpoints from localStorage:", error);
    }
  }, []);

  // Save endpoints to localStorage whenever they change
  useEffect(() => {
    // Only save if we have endpoints (avoid overwriting with empty array on initial load)
    if (endpoints.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(endpoints));
        console.log("💾 Saved endpoints to localStorage:", endpoints);
      } catch (error) {
        console.error("Failed to save API endpoints to localStorage:", error);
      }
    }
  }, [endpoints]);

  /**
   * Add a new API endpoint
   */
  const addEndpoint = (endpointData: Omit<ApiEndpoint, "id">) => {
    const newEndpoint: ApiEndpoint = {
      ...endpointData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    setEndpoints((prev) => {
      const updated = [...prev, newEndpoint];
      // Save to localStorage immediately
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log("💾 Saved new endpoint to localStorage:", newEndpoint);
      } catch (error) {
        console.error("Failed to save endpoint to localStorage:", error);
      }
      return updated;
    });
  };

  /**
   * Update an existing API endpoint
   */
  const updateEndpoint = (id: string, updates: Partial<ApiEndpoint>) => {
    setEndpoints((prev) => {
      const updated = prev.map((endpoint) =>
        endpoint.id === id ? { ...endpoint, ...updates } : endpoint
      );
      // Save to localStorage immediately
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log("💾 Updated endpoint in localStorage:", updates);
      } catch (error) {
        console.error("Failed to update endpoint in localStorage:", error);
      }
      return updated;
    });
  };

  /**
   * Delete an API endpoint
   */
  const deleteEndpoint = (id: string) => {
    setEndpoints((prev) => {
      const updated = prev.filter((endpoint) => endpoint.id !== id);
      // Save to localStorage immediately
      try {
        if (updated.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          console.log(
            "💾 Updated endpoints in localStorage after deletion:",
            updated
          );
        } else {
          localStorage.removeItem(STORAGE_KEY);
          console.log("🗑️ Cleared localStorage (no endpoints remaining)");
        }
      } catch (error) {
        console.error("Failed to update localStorage after deletion:", error);
      }
      return updated;
    });

    // Also remove the corresponding API data
    const endpointToDelete = endpoints.find((ep) => ep.id === id);
    if (endpointToDelete) {
      setApiData((prev) => {
        const newData = { ...prev };
        delete newData[endpointToDelete.name];
        return newData;
      });
    }
  };

  /**
   * Fetch data from all configured API endpoints
   */
  const fetchAllApis = async () => {
    if (endpoints.length === 0) {
      console.log("No API endpoints configured");
      return;
    }

    setIsLoading(true);
    setApiData({});

    try {
      console.log(`🔄 Fetching data from ${endpoints.length} API endpoints...`);
      const results = await apiService.makeMultipleRequests(endpoints);
      setApiData(results);
      console.log("✅ All API requests completed");
    } catch (error) {
      console.error("❌ Error fetching API data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear all API data
   */
  const clearApiData = () => {
    setApiData({});
  };

  /**
   * Clear all endpoints and localStorage
   */
  const clearAllEndpoints = () => {
    setEndpoints([]);
    setApiData({});
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("🗑️ Cleared all endpoints and localStorage");
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  };

  const value: ApiContextType = {
    endpoints,
    apiData,
    isLoading,
    addEndpoint,
    updateEndpoint,
    deleteEndpoint,
    fetchAllApis,
    clearApiData,
    clearAllEndpoints,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/**
 * Hook to use the API context
 */
export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}

/**
 * Get API data for template usage
 * Returns an object where each endpoint name maps to its response data
 */
export function getApiDataForTemplate(
  apiData: Record<string, ApiResponse | ApiError>
): Record<string, any> {
  const templateData: Record<string, any> = {};

  Object.entries(apiData).forEach(([endpointName, response]) => {
    if ("data" in response) {
      // Success response
      templateData[endpointName] = response.data;
    } else {
      // Error response - provide null for failed requests
      templateData[endpointName] = null;
    }
  });

  return templateData;
}
