"use client";

import Link from "next/link";
import { ArrowUpRight, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { getEndpointCount } from "@/app/actions/get-stats";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [activeMonitorsCount, setActiveMonitorsCount] = useState<number | null>(null);
    const words = ["APIs", "Websites", "Apps", "Endpoints"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        async function fetchCount() {
            const count = await getEndpointCount();
            setActiveMonitorsCount(count);
        }
        fetchCount();
    }, []);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12 mb-32 pb-24">
            <div className="lg:col-span-8">
                <h1 className="text-[8vw] lg:text-[7vw] leading-[0.9] font-bold tracking-tighter mb-12 mix-blend-difference text-black dark:text-white">
                    Monitor<br />
                    Your <span className="text-brand">{words[currentWordIndex]}</span><br />
                    With Confidence
                </h1>
                <div className="flex flex-col md:flex-row gap-8 md:items-end">
                    <p className="max-w-2xl text-lg md:text-xl leading-snug opacity-80">
                        Keep your services healthy with real-time monitoring, instant alerts, and beautiful dashboards that make endpoint tracking effortless.
                    </p>


                </div>
            </div>

            {/* Decorative / Info Column */}
            <div className="lg:col-span-4 flex flex-col justify-center pl-0 lg:pl-12">
                <div className="space-y-8 flex flex-col items-center text-center w-full">
                    <div className="flex flex-col items-center">
                        <span className="block text-xs font-mono opacity-50 mb-1">SYSTEM STATUS</span>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                            </span>
                            <span className="font-medium">All Systems Operational</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="block text-xs font-mono opacity-50 mb-1">ACTIVE MONITORS</span>
                        <span className="font-mono">
                            {activeMonitorsCount !== null ? activeMonitorsCount.toLocaleString() : "..."}
                        </span>
                    </div>
                    <div>
                        <Link href="/auth/sign-up">
                            <Button variant="brand" size="xl" className="group relative overflow-hidden">
                                <span className="relative z-10 font-medium text-sm flex items-center gap-2">
                                    Start Monitoring <ArrowUpRight className="w-4 h-4" />
                                </span>
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Link href="/auth/login">
                            <Button variant="outline" size="xl" className="group border-black/20 dark:border-white/20 transition-colors">
                                <span className="font-medium text-sm group-hover:tracking-wider transition-all duration-300">
                                    Sign In
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section >
    );
}
