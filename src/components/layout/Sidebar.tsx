"use client";

import { Logo } from "@/components/Logo";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  Package,
  X,
  BookOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Report", href: "/new-report", icon: FileText },
  { name: "All Reports", href: "/reports", icon: FolderOpen },
  { name: "Employees", href: "/employees", icon: Users },

  { name: "Documentation", href: "/documentation", icon: BookOpen },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800",
          "shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-18 flex items-center  justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/">
            <img src="/logo.png" alt="FoodLab Logo" className=" w-auto" />
          {/* </Link> */}
          <button
            className="lg:hidden bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col h-[calc(100vh-5rem)] p-4">
          <div className="space-y-2 flex-1">
            <p className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Main Menu
            </p>
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    "hover:translate-x-1",
                    isActive
                      ? "bg-gray-800 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={onClose}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-400 group-hover:scale-110"
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <LogoutButton
              variant="text"
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium  w-full justify-start",
                "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              )}
            />
          </div>
        </nav>
      </aside>
    </>
  );
}
