"use client";

import { ArrowRight, BarChart3, Code2, Activity, Bell, Clock, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/ui/organisms/navbar";
import { Footer } from "@/ui/organisms/footer";
import { Button } from "@/ui/atoms/button";
import { Card, CardContent } from "@/ui/atoms/card";
import { CTASection } from "@/ui/organisms/cta-section";
import { useState, useEffect } from "react";

export default function LandingPage() {
    const words = ["API", "Endpoints", "Apps", "Website", "Services"];
    const [currentWord, setCurrentWord] = useState(words[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => {
                const currentIndex = words.indexOf(prev);
                return words[(currentIndex + 1) % words.length];
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="pt-32 pb-16 px-6 relative z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-text-main max-w-4xl leading-[0.9]">
                        Monitor Your <br /> <span className="text-brand transition-all duration-300">{currentWord}</span> <br /> With Confidence
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed">
                        Keep your services healthy with real-time monitoring, instant alerts, and beautiful dashboards that make endpoint tracking effortless.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Button size="lg" asChild className="gap-2">
                            <Link href="/auth/sign-up">
                                Explore Dashboard <ArrowRight size={18} />
                            </Link>
                        </Button>
                        <Button variant="secondary" size="lg" className="gap-2" asChild>
                            <Link href="/docs">
                                <Code2 size={18} /> Read Documentation
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="hover:border-brand/30 transition-all duration-300">
                            <CardContent className="space-y-4 pt-6">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                    <Activity size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main">Automated Health Checks</h3>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    Set up scheduled monitoring for your endpoints with customizable check intervals starting from one hour.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-brand/30 transition-all duration-300">
                            <CardContent className="space-y-4 pt-6">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main">Downtime Notifications</h3>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    Receive email alerts when your services experience issues, with smart rate limiting to avoid notification fatigue.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-brand/30 transition-all duration-300">
                            <CardContent className="space-y-4 pt-6">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main">Performance Metrics</h3>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    Track response times and uptime statistics with detailed historical data and visual charts.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-brand/30 transition-all duration-300">
                            <CardContent className="space-y-4 pt-6">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                    <Bell size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main">Proactive Alerts</h3>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    Stay informed about endpoint failures with automatic email notifications during scheduled checks.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-brand/30 transition-all duration-300">
                            <CardContent className="space-y-4 pt-6">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                    <Clock size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main">Historical Analytics</h3>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    Review past performance data and trends to identify patterns and improve service reliability.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-brand/30 transition-all duration-300">
                            <CardContent className="space-y-4 pt-6">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main">Enterprise Security</h3>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    Built on Supabase with encrypted passwords, HTTPS connections, and row-level database security.
                                </p>
                            </CardContent>
                        </Card>

                    </div>
                </section>

                <CTASection />
            </main>

            <Footer />
        </div>
    );
}
