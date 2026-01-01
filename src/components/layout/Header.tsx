import { Menu, Bell, Search, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-18 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between gap-4 z-40 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Search reports, samples, employees..."
            className="w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              Admin User
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
