import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-10 h-10">
        {/* Light mode logo */}
        <Image
          src="/logo.png"
          alt="FoodLab Logo"
          width={40}
          height={40}
          className="dark:hidden"
          priority
        />
        {/* Dark mode logo */}
        <Image
          src="/dark-logo.png"
          alt="FoodLab Logo"
          width={40}
          height={40}
          className="hidden dark:block"
          priority
        />
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
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
      <div className="relative w-6 h-6">
        <Image
          src="/logo.png"
          alt="FoodLab Logo"
          width={24}
          height={24}
          className="dark:hidden"
        />
        <Image
          src="/dark-logo.png"
          alt="FoodLab Logo"
          width={24}
          height={24}
          className="hidden dark:block"
        />
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white">
        FoodLab
      </span>
    </div>
  );
}

export function LogoIcon({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/logo.png"
        alt="FoodLab Logo"
        width={size}
        height={size}
        className="dark:hidden"
      />
      <Image
        src="/dark-logo.png"
        alt="FoodLab Logo"
        width={size}
        height={size}
        className="hidden dark:block"
      />
    </div>
  );
}
