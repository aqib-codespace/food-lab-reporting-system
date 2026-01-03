"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { clientAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  className?: string;
  variant?: "flat" | "solid" | "outline" | "text";
}

export function LogoutButton({
  className,
  variant = "text",
}: LogoutButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear auth
      clientAuth.clearAuth();

      // Call logout API
      await fetch("/api/auth/logout", { method: "POST" });

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={variant}
        className={`w-full justify-start shadow-none  ${className}`}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>

      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isLoggingOut && setIsOpen(false)}
            />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoggingOut}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Confirm Logout
                  </h2>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to log out? You'll need to sign in again
                to access your account.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoggingOut}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-6"
                >
                  {isLoggingOut ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Yes, Logout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
