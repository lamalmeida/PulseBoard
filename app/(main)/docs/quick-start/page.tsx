import { DocsImage } from "@/ui/atoms/docs-image";
export default function QuickStartPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Quick Start Guide</h1>
                <p className="text-xl text-text-muted leading-relaxed">
                    Follow these steps to start monitoring your infrastructure in minutes.
                </p>
            </div>

            <hr className="border-black/5 dark:border-white/5" />

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">1. Create an Account</h2>
                <p>
                    Navigate to the <a href="/auth/sign-up" className="text-brand underline decoration-brand/30 hover:decoration-brand">Sign Up page</a> and create a new account using your email address. It's completely free for up to 10 endpoints.
                </p>
                <DocsImage
                    src="/docs/sign-up.png"
                    alt="Sign Up Page"
                    className="my-6 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                />
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">2. Add Your First Endpoint</h2>
                <p>
                    Once logged in, click the <strong>"Add Endpoint"</strong> button on your dashboard. You'll need to provide:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Name:</strong> A friendly name for your service (e.g., "Production API").</li>
                    <li><strong>URL:</strong> The full HTTP/HTTPS URL you want to monitor.</li>
                    <li><strong>Interval:</strong> How often we should check this endpoint (default is 1 hour).</li>
                </ul>
                <DocsImage
                    src="/docs/add-endpoint.png"
                    alt="Add Endpoint Form"
                    className="my-6 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                />
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">3. Verify Status</h2>
                <p>
                    After saving, PulseBoard will perform an immediate initial check. You can see the status (Online/Offline) and response time directly on your dashboard.
                </p>
            </section>
        </div>
    );
}
