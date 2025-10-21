import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ApiProvider } from "@/contexts/ApiContext";

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
          <ApiProvider>{children}</ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
