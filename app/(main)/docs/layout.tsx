"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Book, Zap, Activity, Bell, Shield, LayoutDashboard, ArrowLeft } from "lucide-react";
import { Navbar } from "@/ui/organisms/navbar";
import { Footer } from "@/ui/organisms/footer";
import { Button } from "@/ui/atoms/button";

const sidebarItems = [
    {
        title: "Getting Started",
        items: [
            { title: "Introduction", href: "/docs", icon: Book },
            { title: "Quick Start", href: "/docs/quick-start", icon: Zap },
        ],
    },
    {
        title: "Core Features",
        items: [
            { title: "Monitoring", href: "/docs/monitoring", icon: Activity },
            { title: "Alerts & Notifications", href: "/docs/alerts", icon: Bell },
            { title: "Status Pages", href: "/docs/status-pages", icon: LayoutDashboard },
        ],
    },
    {
        title: "Security & Privacy",
        items: [
            { title: "Data Security", href: "/docs/security", icon: Shield },
        ],
    },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex max-w-[1800px] w-full mx-auto pt-20">
                {/* Sidebar - mimicking AppSidebar style */}
                <aside className="hidden lg:block w-64 shrink-0 border-r border-border-subtle bg-surface-base backdrop-blur-md sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-4">
                    <div className="mb-6">
                        <Link href="/" className="flex items-center gap-2 text-sm text-text-muted hover:text-text-main transition-colors mb-4 px-3">
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                    </div>

                    <nav className="space-y-6">
                        {sidebarItems.map((section) => (
                            <div key={section.title}>
                                <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-2 px-3">
                                    {section.title}
                                </h3>
                                <div className="flex flex-col gap-1">
                                    {section.items.map((item) => {
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
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0 py-10 px-6 lg:px-12">
                    <div className="prose dark:prose-invert max-w-4xl mx-auto prose-headings:text-text-main prose-p:text-text-muted prose-li:text-text-muted prose-strong:text-text-main prose-code:text-brand prose-code:bg-brand/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                        {children}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
