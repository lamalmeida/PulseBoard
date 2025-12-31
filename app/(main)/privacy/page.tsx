import { Navbar } from "@/ui/organisms/navbar";
import { Footer } from "@/ui/organisms/footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-text-main mb-8">Privacy Statement</h1>

                <div className="prose dark:prose-invert max-w-none prose-headings:text-text-main prose-p:text-text-muted prose-li:text-text-muted prose-strong:text-text-main">
                    <p className="text-lg text-text-muted mb-6">
                        Last updated: December 31, 2025
                    </p>

                    <section className="mb-8">
                        <p className="text-text-muted mb-4">
                            This Privacy Statement describes how personal data is collected, used, and processed in connection with PulseBoard (the “Service”). The Service is operated by Luis Almeida, acting solely in his individual capacity. PulseBoard is not a separate legal entity. Any references to “PulseBoard,” “we,” “us,” or “our” refer exclusively to Luis Almeida individually.
                        </p>
                        <p className="text-text-muted mb-4">
                            By using the Service, you acknowledge and agree to the data practices described in this Privacy Statement.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">1. Information Collected</h2>
                        <p className="text-text-muted mb-4">
                            When you create an account or use the Service, the following categories of information may be collected and stored:
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6 text-text-main">Account Information</h3>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Email address (used for authentication and service-related notifications)</li>
                            <li>Encrypted password credentials</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6 text-text-main">Endpoint Configuration Data</h3>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Endpoint names provided by you</li>
                            <li>URLs of monitored endpoints</li>
                            <li>Monitoring intervals and configuration settings</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6 text-text-main">Monitoring and Technical Data</h3>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>HTTP status codes returned by monitored endpoints</li>
                            <li>Response times and latency metrics</li>
                            <li>Error messages generated during checks</li>
                            <li>Timestamps associated with monitoring activity</li>
                        </ul>
                        <p className="text-text-muted md-4">
                            The Service does not intentionally collect sensitive personal data beyond what is required to operate the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">2. Purpose of Data Use</h2>
                        <p className="text-text-muted mb-4">
                            Collected information is used solely to operate and improve the Service, including to:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Authenticate user access</li>
                            <li>Perform monitoring checks against configured endpoints</li>
                            <li>Generate and send failure notifications</li>
                            <li>Display monitoring history, metrics, and statistics</li>
                            <li>Maintain system security and reliability</li>
                        </ul>
                        <p className="text-text-muted md-4">
                            Data is not used for advertising, profiling, or marketing purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">3. Data Storage and Processing</h2>
                        <p className="text-text-muted mb-4">
                            Data is stored and processed using third-party infrastructure providers that support the operation of the Service, including:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Supabase – database storage and authentication</li>
                            <li>Resend – email delivery for service notifications</li>
                        </ul>
                        <p className="text-text-muted md-4">
                            <br></br>These providers process data only as necessary to deliver the Service and are selected based on industry-standard security and reliability practices.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">4. Email Notifications</h2>
                        <p className="text-text-muted mb-4">
                            Email notifications are sent only for service-related events, including when a monitored endpoint transitions from an online to an offline state. Notifications are rate-limited to no more than one (1) notification per endpoint within a thirty (30) minute period.
                        </p>
                        <p className="text-text-muted md-4">
                            No promotional or marketing emails are sent.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">5. Data Sharing</h2>
                        <p className="text-text-muted mb-4">
                            Personal data is not sold, rented, or shared with third parties for marketing or advertising purposes. Data is disclosed only to the service providers listed above to the extent necessary to operate the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">6. Data Retention</h2>
                        <p className="text-text-muted mb-4">
                            Account data and monitoring history are retained while an account remains active. Upon account deletion:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Endpoint configurations are removed</li>
                            <li>Monitoring history is deleted</li>
                            <li>Account credentials and identifying information are removed from active systems</li>
                        </ul>
                        <p className="text-text-muted md-4">
                            Certain technical logs may persist temporarily for security, operational, or legal purposes, after which they are routinely purged.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">7. Cookies</h2>
                        <p className="text-text-muted mb-4">
                            The Service uses essential session cookies to maintain authenticated user sessions. These cookies are required for core functionality and are not used for tracking or advertising.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">8. User Rights and Control</h2>
                        <p className="text-text-muted mb-4">
                            You may, at any time:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Access and review your data through the Service interface</li>
                            <li>Update your email address or password</li>
                            <li>Delete your account and associated data</li>
                        </ul>
                        <p className="text-text-muted md-4">
                            <br></br>Requests are executed through the dashboard or account settings and do not require separate support intervention.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">9. Security Measures</h2>
                        <p className="text-text-muted mb-4">
                            Reasonable technical and organizational safeguards are implemented to protect data, including:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Encrypted password storage</li>
                            <li>HTTPS for all network communications</li>
                            <li>Database-level access controls and row-level security</li>
                        </ul>
                        <p className="text-text-muted mt-4">
                            However, no system can be guaranteed to be completely secure, and use of the Service is at your own risk.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">10. Changes to Privacy Statement</h2>
                        <p className="text-text-muted mb-4">
                            This Privacy Statement may be updated from time to time. Continued use of the Service after any changes constitutes acceptance of the revised statement.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">11. Contact Information</h2>
                        <p className="text-text-muted mb-4">
                            For privacy-related questions or requests, you may contact the Service through its designated support channels. The Service is operated by Luis Almeida (individual).
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}