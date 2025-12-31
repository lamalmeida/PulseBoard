import { AuthButton } from "@/ui/molecules/auth-button";
import { ThemeSwitcher } from "@/ui/molecules/theme-switcher";
import { AppSidebar } from "@/ui/organisms/app-sidebar";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full flex justify-center border-b border-black/5 dark:border-white/5 h-20 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125">
        <div className="w-full max-w-full flex justify-between items-center px-6 h-full text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/protected/endpoints" className="flex items-center gap-4">
              <img src="/logo-transparent.png" alt="Logo" className="w-12 h-12 dark:hidden" />
              <img src="/logo-dark-transparent.png" alt="Logo" className="w-12 h-12 hidden dark:block" />
              <span className="text-lg font-bold tracking-tighter uppercase">PulseBoard</span>
            </Link>
          </div>
          <AuthButton />
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <ThemeSwitcher />
      </footer>
    </div>
  );
}
