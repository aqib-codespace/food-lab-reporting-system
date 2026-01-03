import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { RouteGuard } from "@/components/route-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Food Lab Reporting System | Professional Lab Management",
    template: "%s | Food Lab Reporting System",
  },
  description:
    "Comprehensive food laboratory reporting system for managing samples, employees, and generating professional reports. Streamline your lab operations with advanced tracking and reporting capabilities.",
  keywords: [
    "food lab",
    "laboratory management",
    "sample tracking",
    "report generation",
    "quality control",
    "food safety",
    "lab automation",
    "employee management",
  ],
  authors: [{ name: "Food Lab Team" }],
  creator: "Food Lab Team",
  publisher: "Food Lab Reporting System",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Food Lab Reporting System",
    description: "Professional laboratory management and reporting solution",
    siteName: "Food Lab Reporting System",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Lab Reporting System",
    description: "Professional laboratory management and reporting solution",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <ThemeProvider>
          <RouteGuard>{children}</RouteGuard>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
