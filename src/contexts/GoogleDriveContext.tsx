"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  googleDriveService,
  GoogleDriveUser,
  GoogleDriveFile,
} from "@/lib/googleDriveService";

interface GoogleDriveContextType {
  isSignedIn: boolean;
  user: GoogleDriveUser | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  downloadFile: (fileId: string) => Promise<GoogleDriveFile>;
  listFiles: () => Promise<GoogleDriveFile[]>;
  uploadHtml: (htmlContent: string, filename?: string) => Promise<string>;
  uploadJsx: (jsxContent: string, filename?: string) => Promise<string>;
  error: string | null;
  clearError: () => void;
}

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(
  undefined
);

interface GoogleDriveProviderProps {
  children: ReactNode;
}

/**
 * Google Drive Context Provider
 * Manages Google Drive authentication and file operations
 * Provides state management for Drive integration across the app
 */
export function GoogleDriveProvider({ children }: GoogleDriveProviderProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<GoogleDriveUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Drive service on mount
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    const initializeDrive = async () => {
      try {
        setIsLoading(true);
        await googleDriveService.initialize();

        // Check if user is already signed in
        const signedIn = googleDriveService.getIsSignedIn();
        const currentUser = googleDriveService.getCurrentUser();

        setIsSignedIn(signedIn);
        setUser(currentUser);

        // Check for OAuth success in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
          // Clear the URL parameter
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('auth');
          window.history.replaceState({}, '', newUrl.toString());
          
          // Refresh the auth status
          await googleDriveService.initialize();
          const newSignedIn = googleDriveService.getIsSignedIn();
          const newUser = googleDriveService.getCurrentUser();
          
          setIsSignedIn(newSignedIn);
          setUser(newUser);
        }
      } catch (err) {
        console.error("Failed to initialize Google Drive:", err);
        setError(
          "Failed to initialize Google Drive. Please check your configuration."
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeDrive();
  }, []);

  /**
   * Sign in to Google Drive
   */
  const signIn = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      setIsLoading(true);
      setError(null);

      // This will redirect to OAuth, so we don't expect a return value
      await googleDriveService.signIn();
      
      // The promise will never resolve due to redirect, so we'll handle
      // the success case when the user returns from OAuth callback
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out from Google Drive
   */
  const signOut = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      setIsLoading(true);
      setError(null);

      await googleDriveService.signOut();
      setIsSignedIn(false);
      setUser(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign out failed";
      setError(errorMessage);
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Download file from Google Drive by file ID
   */
  const downloadFile = useCallback(
    async (fileId: string): Promise<GoogleDriveFile> => {
      if (typeof window === "undefined") {
        throw new Error("Google Drive is only available in the browser");
      }

      try {
        setIsLoading(true);
        setError(null);

        const file = await googleDriveService.downloadFile(fileId);
        return file;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Download failed";
        setError(errorMessage);
        console.error("Download error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * List files from Google Drive
   */
  const listFiles = useCallback(async (): Promise<GoogleDriveFile[]> => {
    if (typeof window === "undefined") {
      throw new Error("Google Drive is only available in the browser");
    }

    try {
      setIsLoading(true);
      setError(null);

      const files = await googleDriveService.listFiles();
      return files;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to list files";
      setError(errorMessage);
      console.error("List files error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Upload HTML content to Google Drive
   */
  const uploadHtml = useCallback(
    async (htmlContent: string, filename?: string): Promise<string> => {
      if (typeof window === "undefined") {
        throw new Error("Google Drive is only available in the browser");
      }

      try {
        setIsLoading(true);
        setError(null);

        const fileId = await googleDriveService.uploadHtmlToDrive(
          htmlContent,
          filename
        );
        return fileId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        console.error("Upload error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Upload JSX content to Google Drive
   */
  const uploadJsx = useCallback(
    async (jsxContent: string, filename?: string): Promise<string> => {
      if (typeof window === "undefined") {
        throw new Error("Google Drive is only available in the browser");
      }

      try {
        setIsLoading(true);
        setError(null);

        const fileId = await googleDriveService.uploadJsxToDrive(
          jsxContent,
          filename
        );
        return fileId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        console.error("Upload error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: GoogleDriveContextType = {
    isSignedIn,
    user,
    isLoading,
    signIn,
    signOut,
    downloadFile,
    listFiles,
    uploadHtml,
    uploadJsx,
    error,
    clearError,
  };

  return (
    <GoogleDriveContext.Provider value={value}>
      {children}
    </GoogleDriveContext.Provider>
  );
}

/**
 * Hook to use the Google Drive context
 */
export function useGoogleDrive() {
  const context = useContext(GoogleDriveContext);
  if (context === undefined) {
    throw new Error("useGoogleDrive must be used within a GoogleDriveProvider");
  }
  return context;
}
