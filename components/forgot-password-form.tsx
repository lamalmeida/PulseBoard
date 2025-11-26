"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="group border border-black/10 dark:border-white/10 p-8 md:p-12 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125">
        {success ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold leading-tight mb-2">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">
                Password reset instructions sent
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive
              a password reset email.
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold leading-tight mb-2">Reset Your Password</h2>
              <p className="text-sm text-muted-foreground">
                Type in your email and we&apos;ll send you a link to reset your
                password
              </p>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-transparent border-black/10 dark:border-white/10"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full group relative overflow-hidden" size="xl" disabled={isLoading}>
                  <span className="relative z-10 font-medium text-sm flex items-center justify-center gap-2">
                    {isLoading ? "Sending..." : "Send reset email"} <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
