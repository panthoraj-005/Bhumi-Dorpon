"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Waves,
  CloudRain,
  Mountain,
  Compass,
  Anchor,
  Settings,
  Component,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home Dashboard", href: "/", icon: LayoutGrid },
  { id: "river-erosion", label: "River Erosion", href: "/river-erosion", icon: Waves },
  { id: "flood", label: "Flood Monitoring", href: "/flood", icon: CloudRain },
  { id: "landslide", label: "Landslide Hazards", href: "/landslide", icon: Mountain },
  { id: "char", label: "Char Islands", href: "/char", icon: Compass },
  { id: "coastal", label: "Coastal Erosion", href: "/coastal", icon: Anchor },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[72px] bg-surface border-r border-border z-40 flex flex-col items-center py-5 justify-between"
      aria-label="Main Navigation"
    >
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/"
          className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center text-accent-ink shadow-sm hover:scale-105 transition-transform"
          title="BhumiDorpon Land Records"
        >
          <div className="flex flex-col items-center font-display font-black text-xs leading-none tracking-tighter">
            <span>BD</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <div key={item.id} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                    isActive
                      ? "bg-accent-soft text-accent-deep font-semibold"
                      : "text-muted hover:text-ink hover:bg-surface-alt"
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-5 h-5" />
                </Link>

                {/* Tooltip on hover */}
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ink text-surface text-xs font-medium rounded-md whitespace-nowrap shadow-popover pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: /dev/components & Settings */}
      <div className="flex flex-col items-center gap-2">
        {/* Component Showcase Link */}
        <div className="relative group">
          <Link
            href="/dev/components"
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center transition-all",
              pathname.startsWith("/dev/components")
                ? "bg-accent text-accent-ink font-semibold"
                : "text-muted hover:text-ink hover:bg-surface-alt"
            )}
            title="Component Library Showcase"
          >
            <Component className="w-5 h-5" />
          </Link>
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ink text-surface text-xs font-medium rounded-md whitespace-nowrap shadow-popover pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
            UI Components (/dev)
          </div>
        </div>

        {/* Settings */}
        <div className="relative group">
          <button
            type="button"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface-alt transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ink text-surface text-xs font-medium rounded-md whitespace-nowrap shadow-popover pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Settings
          </div>
        </div>
      </div>
    </aside>
  );
}
