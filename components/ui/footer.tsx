import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-black/5 dark:border-white/5 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125">
            <div className="max-w-[1800px] mx-auto px-6 h-20 flex justify-between items-center relative">
                <Link href="/" className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-brand rounded-full" />
                    <span className="text-lg font-bold tracking-tighter uppercase">PulseBoard</span>
                </Link>
                <div className="hidden md:flex items-center gap-12 text-xs font-mono uppercase tracking-widest opacity-60 absolute left-1/2 -translate-x-1/2">
                    <span>© 2025 LAMAs. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/privacy" className="text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                        Privacy
                    </Link>
                    <Link href="/terms" className="text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                        Terms
                    </Link>
                </div>
            </div>
        </footer>
    );
}
