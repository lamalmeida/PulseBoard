import Link from "next/link";
import { Button } from "@/ui/atoms/button";

export function CTASection() {
    return (
        <section className="py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                    READY TO<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600">START?</span>
                </h2>
                <p className="text-xl opacity-60 max-w-2xl mx-auto">
                    Join the developers who already trust PulseBoard to keep their <br />services running smoothly.
                </p>
                <div className="pt-8">
                    <Button variant="default" size="xl" className="text-xl font-bold" asChild>
                        <Link href="/auth/sign-up">
                            Get Started Now
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
