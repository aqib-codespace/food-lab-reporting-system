"use client";

import { Menu, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string>("User");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-18 bg-white/80 dark:bg-gray-950 dark:border-gray-800 border-b border-gray-200 px-6 flex items-center justify-between gap-4 z-40 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden bg-gray-100 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

     
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 dark:bg-gray-700 bg-gray-100 px-3 py-2 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm dark:text-white font-semibold text-gray-900 leading-tight">
             Admin User
            </span>
            <span className="text-xs dark:text-gray-200 text-gray-600">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
