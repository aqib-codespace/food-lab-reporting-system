"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clientAuth } from "@/lib/auth";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = clientAuth.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsChecking(false);

      // If not authenticated and not on login page, redirect to login
      if (!authenticated && pathname !== "/login") {
        router.push("/login");
      }

      // If authenticated and on login page, redirect to home
      if (authenticated && pathname === "/login") {
        router.push("/");
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If on protected route and not authenticated, show loading (redirect will happen)
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
