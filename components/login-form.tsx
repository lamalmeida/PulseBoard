"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="group border border-black/10 dark:border-white/10 p-8 md:p-12 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125">
        <div className="mb-8">
          <h2 className="text-2xl font-bold leading-tight mb-2">Login</h2>
        </div>
        <form onSubmit={handleLogin}>
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-transparent border-black/10 dark:border-white/10"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full group relative overflow-hidden" size="xl" disabled={isLoading}>
              <span className="relative z-10 font-medium text-sm flex items-center justify-center gap-2">
                {isLoading ? "Logging in..." : "Login"} <ArrowUpRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
