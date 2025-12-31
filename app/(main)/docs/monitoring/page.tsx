
export default function MonitoringPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Monitoring Features</h1>
                <p className="text-xl text-text-muted leading-relaxed">
                    PulseBoard offers flexible monitoring capabilities to suit various endpoint types.
                </p>
            </div>

            <hr className="border-black/5 dark:border-white/5" />

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Supported Methods</h2>
                <p>
                    We support all standard HTTP methods involved in REST APIs:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><code>GET</code> - Standard retrieval requests</li>
                    <li><code>POST</code> - Data submission checks</li>
                    <li><code>PUT / PATCH</code> - Update verification</li>
                    <li><code>DELETE</code> - Deletion workflows</li>
                    <li><code>HEAD</code> - Lightweight availability checks (headers only)</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Custom Headers</h2>
                <p>
                    You can specific custom HTTP headers for your requests. This is useful for:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Authentication:</strong> <code>Authorization: Bearer caused...</code></li>
                    <li><strong>Content Negotiation:</strong> <code>Accept: application/json</code></li>
                    <li><strong>Custom Security Keys:</strong> <code>X-API-Key: ...</code></li>
                </ul>
                <div className="my-6 aspect-[3/1] w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden relative">
                    <img
                        src="/docs/headers-config.png"
                        alt="Headers Configuration"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center text-text-muted">
                        [Image: public/docs/headers-config.png]
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Request Body</h2>
                <p>
                    For methods like <code>POST</code> or <code>PUT</code>, you can define a request body (JSON, XML, or plain text). This allows you to simulate real user interactions or API payloads to verify your backend processes data correctly.
                </p>
            </section>
        </div>
    );
}
