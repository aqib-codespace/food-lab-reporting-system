import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
