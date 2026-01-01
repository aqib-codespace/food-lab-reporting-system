import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg">
          <FlaskConical className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full -z-10" />
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent leading-tight">
            FoodLab
          </span>
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Reporting System
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoCompact({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500">
        <FlaskConical className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        FoodLab
      </span>
    </div>
  );
}

export function LogoIcon({
  className,
  size = 6,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg">
        <FlaskConical
          className={`w-${size} h-${size} text-white`}
          strokeWidth={2.5}
        />
      </div>
      <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full -z-10" />
    </div>
  );
}
