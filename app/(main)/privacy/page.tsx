import { Navbar } from "@/ui/organisms/navbar";
import { Footer } from "@/ui/organisms/footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-brand selection:text-white transition-colors duration-500">
            {/* Grid Background Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}
            />

            <Navbar />

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Statement</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg opacity-80 mb-6">
                        Last updated: November 22, 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                        <p className="opacity-80 mb-4">
                            When you use PulseBoard, we collect and store:
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Account Information</h3>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Your email address (used for login and notifications)</li>
                            <li>Encrypted password</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Endpoint Data</h3>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Endpoint names you provide</li>
                            <li>URLs of endpoints you monitor</li>
                            <li>Check intervals you configure</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Monitoring Data</h3>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>HTTP status codes from monitored endpoints</li>
                            <li>Response times</li>
                            <li>Error messages</li>
                            <li>Timestamps of checks</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                        <p className="opacity-80 mb-4">
                            We use your information to:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Authenticate your access to the service</li>
                            <li>Perform health checks on your specified endpoints</li>
                            <li>Send you email notifications when endpoints fail</li>
                            <li>Display monitoring history and statistics in your dashboard</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Data Storage</h2>
                        <p className="opacity-80 mb-4">
                            Your data is stored using Supabase, a third-party database provider. Authentication and data storage follow industry-standard security practices.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Email Notifications</h2>
                        <p className="opacity-80 mb-4">
                            We use Resend, a third-party email service, to send failure notifications to your registered email address. Notifications are sent only when:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>An endpoint transitions from online to offline status</li>
                            <li>At most once per endpoint per 24-hour period</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
                        <p className="opacity-80 mb-4">
                            We do not sell, rent, or share your personal information with third parties for marketing purposes. Your data is only processed by:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Supabase (database and authentication)</li>
                            <li>Resend (email delivery)</li>
                            <li>Upstash QStash (scheduled task management)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
                        <p className="opacity-80 mb-4">
                            We retain your account data and monitoring history while your account is active. When you delete your account:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Your endpoints are removed</li>
                            <li>Your check history is deleted</li>
                            <li>Your account information is removed from our database</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                        <p className="opacity-80 mb-4">
                            We use session cookies to maintain your authenticated session. These cookies are essential for the service to function.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                        <p className="opacity-80 mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Access your data through the dashboard</li>
                            <li>Delete your account and associated data at any time</li>
                            <li>Update your email address and password</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Security</h2>
                        <p className="opacity-80 mb-4">
                            We implement standard security measures including:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Encrypted password storage</li>
                            <li>HTTPS for all connections</li>
                            <li>Row-level security policies in our database</li>
                        </ul>
                        <p className="opacity-80 mt-4">
                            However, no system is completely secure, and we cannot guarantee absolute security of your data.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Changes to Privacy Statement</h2>
                        <p className="opacity-80 mb-4">
                            We may update this privacy statement. Continued use of PulseBoard after changes constitutes acceptance of the updated statement.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Contact</h2>
                        <p className="opacity-80 mb-4">
                            For privacy-related questions or to exercise your rights, please contact us through our support channels.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}