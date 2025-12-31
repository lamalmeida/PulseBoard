import { DocsImage } from "@/ui/atoms/docs-image";
export default function AlertsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Alerts & Notifications</h1>
                <p className="text-xl text-text-muted leading-relaxed">
                    Never miss downtime. PulseBoard notifies you instantly when your services go offline.
                </p>
            </div>

            <hr className="border-black/5 dark:border-white/5" />

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Email Notifications</h2>
                <p>
                    Alerts are sent to your registered email address securely via our provider, Resend.
                </p>
                <DocsImage
                    src="/docs/email-notification.png"
                    alt="Email Notification"
                    className="my-6 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                />
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Thresholds & Sensitivity</h2>
                <p>
                    To prevent false alarms, you can configure the <strong>Consecutive Failures Threshold</strong>.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>1 Failure (Default):</strong> Alert immediately on first error.</li>
                    <li><strong>2+ Failures:</strong> Wait until the endpoint fails multiple times in a row before alerting. This is useful for filtering out transient network blips.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Rate Limiting (Cooldowns)</h2>
                <p>
                    We implement intelligent rate limiting to avoid flooding your inbox. By default, we will send one notification per incident window, followed by reminders if configured.
                </p>
            </section>
        </div>
    );
}
