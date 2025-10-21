import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ApiProvider } from "@/contexts/ApiContext";
import { GoogleDriveProvider } from "@/contexts/GoogleDriveContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TD Email Generator",
  description: "Create beautiful emails with React Email",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider>
          <ApiProvider>
            <GoogleDriveProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#4ade80",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </GoogleDriveProvider>
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
