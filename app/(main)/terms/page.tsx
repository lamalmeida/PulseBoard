import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-brand selection:text-white transition-colors duration-500">
            {/* Grid Background Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}
            />

            <Navbar />

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg opacity-80 mb-6">
                        Last updated: November 22, 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
                        <p className="opacity-80 mb-4">
                            By creating an account and using PulseBoard, you agree to these Terms of Service. If you do not agree, please do not use our service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Description of Service</h2>
                        <p className="opacity-80 mb-4">
                            PulseBoard is a monitoring tool that periodically checks the availability of web endpoints you specify. The service provides:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Endpoint health monitoring</li>
                            <li>Response time tracking</li>
                            <li>Email notifications when endpoints fail</li>
                            <li>Historical check data</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Account Registration</h2>
                        <p className="opacity-80 mb-4">
                            You must provide a valid email address to create an account. You are responsible for maintaining the security of your account credentials.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Usage Limits</h2>
                        <p className="opacity-80 mb-4">
                            Your account is subject to the following limitations:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Maximum of 10 monitored endpoints per account</li>
                            <li>Minimum check interval of 1 hour per endpoint</li>
                            <li>Email notifications limited to one per endpoint per 24-hour period</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Your Responsibilities</h2>
                        <p className="opacity-80 mb-4">
                            You agree to:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Only monitor endpoints you own or have permission to monitor</li>
                            <li>Provide accurate contact information</li>
                            <li>Not use the service to monitor endpoints excessively or maliciously</li>
                            <li>Not attempt to circumvent stated usage limits</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Service Availability</h2>
                        <p className="opacity-80 mb-4">
                            PulseBoard is provided "as is" without warranties of any kind. We do not guarantee:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Continuous, uninterrupted service availability</li>
                            <li>That monitoring checks will occur at exact scheduled times</li>
                            <li>That all notifications will be delivered successfully</li>
                            <li>Data retention for any specific period</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Account Termination</h2>
                        <p className="opacity-80 mb-4">
                            We reserve the right to suspend or terminate accounts that violate these terms or use the service in ways that could harm our infrastructure or other users.
                        </p>
                        <p className="opacity-80 mt-4">
                            You may delete your account at any time. Upon deletion, your endpoints and check history will be removed from our system.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                        <p className="opacity-80 mb-4">
                            We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                        <p className="opacity-80 mb-4">
                            PulseBoard and its operators are not liable for:
                        </p>
                        <ul className="list-disc pl-6 opacity-80 space-y-2">
                            <li>Missed alerts or notifications</li>
                            <li>Downtime of monitored endpoints</li>
                            <li>Data loss</li>
                            <li>Any damages resulting from use or inability to use the service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Contact</h2>
                        <p className="opacity-80 mb-4">
                            For questions about these terms, please contact us through our support channels.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}