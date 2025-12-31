import { AuthButton } from "@/ui/molecules/auth-button";
import { ThemeSwitcher } from "@/ui/molecules/theme-switcher";
import { AppSidebar } from "@/ui/organisms/app-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/atoms/sheet";
import { Button } from "@/ui/atoms/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/ui/organisms/footer";

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

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav >

      {/* Main Content with Sidebar */}
      < div className="flex flex-1" >
        {/* Desktop Sidebar - hidden below lg */}
        < div className="hidden lg:block" >
          <AppSidebar />
        </div >

        <main className="flex-1 p-8 relative">
          {/* Mobile Menu Trigger - visible below lg */}
          <div className="lg:hidden absolute top-8 left-6 z-10">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <AppSidebar />
              </SheetContent>
            </Sheet>
          </div>

          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div >

      {/* Footer */}
      < Footer />
    </div >
  );
}
