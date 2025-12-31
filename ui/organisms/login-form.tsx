"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import { Label } from "@/ui/atoms/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/ui/atoms/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Mail, Lock } from "lucide-react";
import { toast } from "@/lib/toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        // Map Supabase errors to user-friendly messages
        const errorMessages: Record<string, string> = {
          'Invalid login credentials': 'Email or password is incorrect',
          'Email not confirmed': 'Please confirm your email before logging in',
        };
        throw new Error(errorMessages[error.message] || error.message);
      }

      toast.success("Welcome back!");
      router.push("/protected/endpoints");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-brand/20 dark:border-brand/20 bg-surface-base/50">
        <CardHeader className="p-8 pb-4 border-b-0 bg-transparent">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-text-muted">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-muted transition-colors group-focus-within:text-brand" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-surface-input border-border-subtle focus:border-brand/50 focus:bg-surface-highlight transition-all"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-text-muted">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-xs uppercase tracking-wider text-text-muted hover:text-brand transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-muted transition-colors group-focus-within:text-brand" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-surface-input border-border-subtle focus:border-brand/50 focus:bg-surface-highlight transition-all"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-error bg-error/10 p-3 rounded border border-error/20">{error}</p>}
              <Button type="submit" className="w-full group relative overflow-hidden font-bold" size="lg" disabled={isLoading}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? "Logging in..." : "Sign In"} <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-0 text-center text-sm text-text-muted justify-center border-t-0 bg-transparent">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-brand font-medium hover:underline underline-offset-4 ml-1"
            >
              Sign up
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

