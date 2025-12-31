
export default function StatusPagesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Status Pages</h1>
                <p className="text-xl text-text-muted leading-relaxed">
                    Communicate system health to your users with beautiful, public status pages.
                </p>
            </div>

            <hr className="border-black/5 dark:border-white/5" />

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Creating a Page</h2>
                <p>
                    Go to the <strong>Status Pages</strong> tab in your dashboard and click "Create New Page". A Status Page can display one or multiple endpoints.
                </p>
                <div className="my-6 aspect-[2/1] w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden relative">
                    <img
                        src="/docs/status-page-form.png"
                        alt="Status Page Form"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center text-text-muted">
                        [Image: public/docs/status-page-form.png]
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Public Access</h2>
                <p>
                    Each Status Page gets a unique, public URL that you can share with your customers or team. The page automatically updates with the latest checking results.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Customization</h2>
                <p>
                    You can customize the title and slug of your status page to match your brand identity.
                </p>
            </section>
        </div>
    );
}
