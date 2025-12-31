"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };
    const router = useRouter();
    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
    };
    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <nav className="fixed top-0 left-0 w-full z-50 border-b border-black/5 dark:border-white/5 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125">
                <div className="max-w-[1800px] mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-brand rounded-full" />
                        <span className="text-lg font-bold tracking-tighter uppercase">PulseBoard</span>
                    </Link>
                    {/* ... rest of the navbar ... */}
                </div>
            </nav>
        );
    }

    const isDark = theme === "dark";

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-black/5 dark:border-white/5 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125">
            <div className="max-w-[1800px] mx-auto px-6 h-20 flex justify-between items-center relative">
                <Link href="/" className="flex items-center gap-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                    </span>
                    <span className="text-lg font-bold tracking-tighter uppercase">PulseBoard</span>
                </Link>

                <div className="flex items-center gap-4">
                    <button onClick={logout} className="text-xs font-mono border border-black/20 dark:border-white/20 px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                        LOG OUT
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
