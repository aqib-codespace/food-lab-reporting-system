"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen dark:bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-gradient-to-br from-background via-background to-accent/5 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div
        className={`relative z-10 max-w-3xl w-full text-center transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Link href="/" className="mb-12 animate-fade-in flex justify-center">
            <img src="/logo.png" alt="FoodLab Logo" className="h-24" />
        </Link>

        <div className="relative mb-8">
          <div className="text-[120px]  sm:text-[180px] font-bold leading-none select-none">
            <span className="inline-block dark:text-gray-200 animate-bounce-slow text-foreground">
              4
            </span>
            <span className="inline-block relative mx-2">
              <span className="text-accent animate-pulse">0</span>
              <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse" />
            </span>
            <span className="inline-block dark:text-gray-200 animate-bounce-slow animation-delay-300 text-foreground">
              4
            </span>
          </div>

          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-slide" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-slide animation-delay-500" />
        </div>

        <h1 className="text-3xl sm:text-4xl dark:text-gray-200 font-bold text-foreground mb-4 animate-fade-in animation-delay-300">
          Page Not Found
        </h1>

        <p className="text-lg text-muted-foreground dark:text-gray-400 mb-10 max-w-md mx-auto animate-fade-in animation-delay-500">
          Oops! It seems the page you are looking for does not exist. Please
          check the URL or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-700">
          <button
            onClick={() => router.push("/")}
            className="group relative overflow-hidden px-8 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            Go Home
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          <button
            onClick={() => router.back()}
            className="group relative overflow-hidden px-8 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-700 bg-gray-800  dark:hover:bg-blue-950 text-gray-900 dark:text-gray-100 font-semibold transition-all duration-300 flex items-center gap-2"
          >
            Go Back
          </button>
        </div>

   
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000 pointer-events-none" />
    </div>
  );
}
