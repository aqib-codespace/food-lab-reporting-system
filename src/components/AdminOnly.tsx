"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clientAuth } from "@/lib/auth";

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = clientAuth.getUser();
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const user = clientAuth.getUser();
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Only administrators can access Master Data.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
