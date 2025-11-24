import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                    READY TO<br />
                    <span className="text-brand">START?</span>
                </h2>
                <p className="text-xl opacity-60 max-w-2xl mx-auto">
                    Join the developers who already trust PulseBoard to keep their <br />services running smoothly.
                </p>
                <div className="pt-8">
                    <Link href="/auth/sign-up">
                        <Button variant="brand" size="xl" className="text-xl font-bold">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
