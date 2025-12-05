import { Activity, Zap, BarChart3, Bell, Shield, Clock } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/ui/hero-section";
import { FeatureCard } from "@/components/ui/feature-card";
import { CTASection } from "@/components/ui/cta-section";
import { Footer } from "@/components/ui/footer";

export default function NewPage() {
    const features = [
        {
            icon: <Activity className="w-8 h-8" />,
            title: "Automated Health Checks",
            description: "Set up scheduled monitoring for your endpoints with customizable check intervals starting from one hour."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Downtime Notifications",
            description: "Receive email alerts when your services experience issues, with smart rate limiting to avoid notification fatigue."
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Performance Metrics",
            description: "Track response times and uptime statistics with detailed historical data and visual charts."
        },
        {
            icon: <Bell className="w-8 h-8" />,
            title: "Proactive Alerts",
            description: "Stay informed about endpoint failures with automatic email notifications during scheduled checks."
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Historical Analytics",
            description: "Review past performance data and trends to identify patterns and improve service reliability."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Enterprise Security",
            description: "Built on Supabase with encrypted passwords, HTTPS connections, and row-level database security."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-brand selection:text-white transition-colors duration-500">
            {/* Grid Background Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}
            />

            <Navbar />

            <main className="relative z-10 pt-32 pb-20 px-12 max-w-[1800px] mx-auto">
                <HeroSection />

                {/* Features Grid */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-bold tracking-tight">EVERYTHING YOU NEED</h2>
                        <div className="text-xs font-mono opacity-50">SCROLL FOR MORE</div>
                    </div>

                    <div className="grid md:grid-cols-3">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </section>

                <CTASection />
            </main>

            <Footer />
        </div>
    );
}
