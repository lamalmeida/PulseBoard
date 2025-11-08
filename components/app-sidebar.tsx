"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Plus, User, Activity } from "lucide-react";

const navItems = [
  {
    title: "Endpoints",
    href: "/protected/endpoints",
    icon: Activity,
  },
  {
    title: "Add Endpoint",
    href: "/protected/endpoints/add",
    icon: Plus,
  },
  {
    title: "Profile",
    href: "/protected/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/40 min-h-screen p-4">
      <div className="mb-8">
        <Link href="/protected/endpoints" className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <span className="font-bold text-xl">PulseBoard</span>
        </Link>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}