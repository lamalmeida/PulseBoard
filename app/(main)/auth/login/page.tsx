import { LoginForm } from "@/ui/organisms/login-form";
import { Navbar } from "@/ui/organisms/navbar";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative z-10">
      <Navbar />
      <div className="w-full max-w-sm mt-12">
        <LoginForm />
      </div>
    </div>
  );
}
