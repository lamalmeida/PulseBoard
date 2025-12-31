"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <nav className="fixed top-0 left-0 w-full z-50 border-b border-black/5 dark:border-white/5 bg-[#F4F4F0]/95 dark:bg-[#050505]/95 backdrop-blur-lg backdrop-saturate-150 backdrop-contrast-125">
                <div className="max-w-[1800px] mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-4">
                        <img src="/logo-transparent.png" alt="Logo" className="w-12 h-12 dark:hidden" />
                        <img src="/logo-dark-transparent.png" alt="Logo" className="w-12 h-12 hidden dark:block" />
                        <span className="text-lg font-bold tracking-tighter uppercase">PulseBoard</span>
                    </Link>
                    {/* ... rest of the navbar ... */}
                </div>
            </nav>
        );
    }

    const isDark = theme === "dark";

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-black/5 dark:border-white/5 bg-[#F4F4F0]/95 dark:bg-[#050505]/95 backdrop-blur-lg backdrop-saturate-150 backdrop-contrast-125">
            <div className="max-w-[1800px] mx-auto px-6 h-20 flex justify-between items-center relative">
                <Link href="/" className="flex items-center gap-4">
                    <img src="/logo-transparent.png" alt="Logo" className="w-12 h-12 dark:hidden" />
                    <img src="/logo-dark-transparent.png" alt="Logo" className="w-12 h-12 hidden dark:block" />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tighter uppercase leading-none">PulseBoard</span>
                        <span className="text-[10px] text-text-muted font-mono tracking-tight leading-none pt-1">By Luis Almeida</span>
                    </div>
                </Link>
                {/* <div className="hidden md:flex items-center gap-12 text-xs font-mono uppercase tracking-widest opacity-60 absolute left-1/2 -translate-x-1/2">
                    <Link href="#" className="hover:opacity-100 transition-opacity">Features</Link>
                    <Link href="#" className="hover:opacity-100 transition-opacity">Pricing</Link>
                    <Link href="#" className="hover:opacity-100 transition-opacity">Docs</Link>
                </div> */}
                <div className="flex items-center gap-4">

                    <Link href="/auth/login" className="text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                        Sign In
                    </Link>
                    <Link href="/auth/sign-up" className="text-xs font-mono border border-black/20 dark:border-white/20 px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                        GET STARTED
                    </Link>
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
