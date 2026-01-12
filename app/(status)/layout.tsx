import { Inter, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
    title: "PulseBoard Status",
    description: "System Status Page",
};

export default function StatusLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/logo-transparent.png" />
            </head>
            <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen bg-background text-foreground antialiased transition-colors duration-500`}>
                <div className="cosmic-grid" />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="relative flex min-h-screen flex-col">
                        <main className="flex-1">{children}</main>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
