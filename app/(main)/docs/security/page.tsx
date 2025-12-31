
export default function SecurityPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Data Security</h1>
                <p className="text-xl text-text-muted leading-relaxed">
                    Security is our top priority. Here’s how we protect your data.
                </p>
            </div>

            <hr className="border-black/5 dark:border-white/5" />

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Infrastructure</h2>
                <p>
                    PulseBoard is built on <strong>Supabase</strong>, leveraging their enterprise-grade security features:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Data Encryption:</strong> All data is encrypted at rest and in transit (TLS/SSL).</li>
                    <li><strong>Row Level Security (RLS):</strong> Our database enforces strict access policies, ensuring you - and only you - can access your data.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Authentication</h2>
                <p>
                    We use secure, standard authentication flows. We do not store plain-text passwords. All credentials are hashed and salted securely.
                </p>
            </section>
        </div>
    );
}
