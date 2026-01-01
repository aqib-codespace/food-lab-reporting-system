import { NavLink } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  Settings,
  Package,
  ClipboardList,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Report", href: "/new-report", icon: FileText },
  { name: "All Reports", href: "/reports", icon: FolderOpen },
  { name: "Samples", href: "/samples", icon: Package },
  { name: "Employees", href: "/employees", icon: Users },
];

const secondaryNav = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">SampleTrack</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100vh-4rem)] p-4">
        <div className="space-y-1 flex-1">
          <p className="px-3 py-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <NavLink
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-sidebar-primary")} />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Secondary nav */}
        <div className="pt-4 border-t border-sidebar-border space-y-1">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <NavLink
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
