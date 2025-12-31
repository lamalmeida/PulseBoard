"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Plus, User, Activity } from "lucide-react";
import { Button } from "@/ui/atoms/button";

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
  {
    title: "Status Pages",
    href: "/protected/status-pages",
    icon: Activity,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-border-subtle bg-surface-base backdrop-blur-md h-full p-4">
      <nav className="flex flex-col gap-2 w-max">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start w-full",
                isActive ? "shadow-none bg-surface-glass border-border-subtle" : "text-text-muted hover:text-text-main"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4 mr-2" />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}