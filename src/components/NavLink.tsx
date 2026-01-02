"use client";
import { Link } from "@/i18n/routing";
import { forwardRef } from "react";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type NavLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string;
  activeClassName?: string;
  pendingClassName?: string;
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    { className, activeClassName, pendingClassName, href, children, ...props },
    ref
  ) => {
    const pathname = usePathname() ?? "/";
    const isActive =
      pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
      <Link href={href}>
        <a
          ref={ref}
          className={cn(className, isActive && activeClassName)}
          {...props}
        >
          {children}
        </a>
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
