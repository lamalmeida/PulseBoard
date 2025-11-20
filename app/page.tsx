import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Zap,
  BarChart3,
  Bell,
  Shield,
  Clock
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative container mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Real-time API Monitoring</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Monitor Your APIs
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Keep your services healthy with real-time monitoring, instant alerts,
              and beautiful dashboards that make endpoint tracking effortless.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all">
                <Link href="/auth/sign-up">
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-12">
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Everything You Need to Stay Online
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful monitoring tools designed for modern development teams
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Watch your endpoints in real-time with live status updates and instant health checks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant notifications when your services experience issues or downtime.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Response Time Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track and analyze response times with detailed metrics and beautiful charts.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Stay informed with customizable alerts that notify you the moment something goes wrong.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Status History</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Review historical data and trends to understand your service reliability over time.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is encrypted and secure with enterprise-grade authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Monitor Your APIs?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join developers who trust PulseBoard to keep their services running smoothly.
            </p>
            <Button asChild size="lg" className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all">
              <Link href="/auth/sign-up">
                Start Monitoring Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}