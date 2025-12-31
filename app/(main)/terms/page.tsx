import { Navbar } from "@/ui/organisms/navbar";
import { Footer } from "@/ui/organisms/footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-text-main mb-8">Terms of Service</h1>

                <div className="prose dark:prose-invert max-w-none prose-headings:text-text-main prose-p:text-text-muted prose-li:text-text-muted prose-strong:text-text-main">
                    <p className="text-lg text-text-muted mb-6">
                        Last updated: December 31, 2025
                    </p>

                    <section className="mb-8">
                        <p className="text-text-muted mb-4">
                            These Terms of Service (“Terms”) govern your access to and use of PulseBoard (the “Service”). PulseBoard is not a corporation, limited liability company, partnership, or other legal entity. The Service is operated and offered solely by Luis Almeida, an individual, in his personal capacity.
                        </p>
                        <p className="text-text-muted mb-4">
                            By creating an account, accessing, or using the Service, you acknowledge that you are entering into an agreement with Luis Almeida individually, and not with any separate business entity, brand, or organization named “PulseBoard.”
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">1. Operator Identity and No Separate Entity</h2>
                        <p className="text-text-muted mb-4">
                            PulseBoard is a trade name only and does not represent a registered business entity, company, or organization. All services are provided by Luis Almeida acting solely as an individual.
                        </p>
                        <p className="text-text-muted mb-4">
                            No partnership, corporation, limited liability company, or other separate legal entity exists under the name PulseBoard. Any references to “PulseBoard,” “we,” “us,” or “our” in these Terms refer exclusively to Luis Almeida in his individual capacity.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">2. Description of Service</h2>
                        <p className="text-text-muted mb-4">
                            PulseBoard is a web-based monitoring service that allows users to configure automated checks against specified web endpoints. The Service may include, without limitation:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Periodic availability checks of user-defined endpoints</li>
                            <li>Measurement and reporting of response times</li>
                            <li>Email-based notifications related to endpoint failures</li>
                            <li>Access to historical monitoring data</li>
                        </ul>
                        <p className="text-text-muted mb-4">
                            The Service is provided for informational and monitoring purposes only and does not guarantee the accuracy, completeness, or timeliness of any results.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">3. Account Registration and Security</h2>
                        <p className="text-text-muted mb-4">
                            To use the Service, you must create an account and provide a valid and current email address. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>
                        <p className="text-text-muted mb-4">
                            You agree to notify PulseBoard immediately of any unauthorized access to or use of your account. PulseBoard is not responsible for any loss or damage arising from your failure to safeguard your credentials.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">4. Acceptable Use and User Responsibilities</h2>
                        <p className="text-text-muted mb-4">
                            By using the Service, you represent and warrant that you:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Own or have lawful authority to monitor all endpoints you configure</li>
                            <li>Will provide accurate, current, and complete contact information</li>
                            <li>Will not use the Service for unlawful, abusive, excessive, or malicious monitoring activity</li>
                            <li>Will not attempt to bypass, disable, or circumvent any usage limits or technical restrictions</li>
                        </ul>
                        <p className="text-text-muted mb-4">
                            <br></br>PulseBoard reserves the right to investigate and take appropriate action, including suspension or termination of access, for any use that violates these Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">5. Usage Limits</h2>
                        <p className="text-text-muted mb-4">
                            Use of the Service is subject to the following limitations, which may be enforced through technical or administrative means:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>A maximum of ten (10) monitored endpoints per account</li>
                            <li>A minimum monitoring interval of five (5) minutes per endpoint</li>
                            <li>Email notifications limited to one (1) notification per endpoint within any thirty (30) minute period</li>
                        </ul>
                        <p className="text-text-muted mb-4">
                            <br></br>PulseBoard may modify usage limits at any time at its sole discretion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">6. Service Availability and Disclaimer of Warranties</h2>
                        <p className="text-text-muted mb-4">
                            The Service is provided on an “as is” and “as available” basis. To the maximum extent permitted by law, PulseBoard disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </p>
                        <p className="text-text-muted mb-4">
                            PulseBoard does not warrant that:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                            <li>Monitoring checks will occur at precise scheduled times</li>
                            <li>Notifications will always be delivered or received</li>
                            <li>Data will be retained for any specific duration</li>
                        </ul>
                        <p className="text-text-muted mb-4">
                            <br></br>You acknowledge that internet-based services are subject to limitations, delays, and other issues inherent in the use of communications networks.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">7. Data Retention</h2>
                        <p className="text-text-muted mb-4">
                            PulseBoard may retain, delete, or purge monitoring data, configuration data, or account information at its discretion, unless otherwise required by applicable law. No guarantee is made regarding the availability or longevity of historical data.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">8. Account Termination</h2>
                        <p className="text-text-muted mb-4">
                            PulseBoard reserves the right to suspend or terminate your account, with or without notice, if you violate these Terms or use the Service in a manner that may harm the Service, its infrastructure, or other users.
                        </p>
                        <p className="text-text-muted mb-4">
                            You may delete your account at any time. Upon account deletion, all associated endpoints, monitoring data, and historical records may be permanently removed and may not be recoverable.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">9. Limitation of Liability</h2>
                        <p className="text-text-muted mb-4">
                            To the maximum extent permitted by law, PulseBoard and its operator, Luis Almeida, shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 text-text-muted space-y-2">
                            <li>Missed alerts or delayed notifications</li>
                            <li>Downtime or failures of monitored endpoints</li>
                            <li>Loss or corruption of data</li>
                            <li>Business interruption, loss of profits, or loss of goodwill</li>
                        </ul>
                        <p className="text-text-muted mb-4">
                            <br></br>This limitation applies regardless of the legal theory under which liability is asserted and even if PulseBoard has been advised of the possibility of such damages.
                        </p>
                        <p className="text-text-muted mb-4">
                            All limitations, disclaimers, and exclusions of liability apply to Luis Almeida personally, as the sole operator of the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">10. Changes to These Terms</h2>
                        <p className="text-text-muted mb-4">
                            PulseBoard reserves the right to modify or update these Terms at any time. Updated Terms will become effective upon posting. Your continued use of the Service after any changes constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">11. Governing Law</h2>
                        <p className="text-text-muted mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the operator resides, without regard to conflict of law principles.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">12. Contact Information</h2>
                        <p className="text-text-muted mb-4">
                            The Service is operated by Luis Almeida (individual). For questions regarding these Terms or the Service, you may contact PulseBoard through its designated support channels.
                        </p>
                    </section>
                </div>
            </main >

            <Footer />
        </div >
    );
}