import { LoginForm } from "@/ui/organisms/login-form";
import { Navbar } from "@/ui/organisms/navbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-brand selection:text-white transition-colors duration-500">
      {/* Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}
      />

      <Navbar />

      <div className="relative z-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10 pt-32">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
