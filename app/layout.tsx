import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PulseBoard",
  icons: { icon: '../public/logo-transparent.png' },
  description: "Monitor the health of your APIs and services",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="nUAk9RGSE3bElxCeyrQa3SDlXSGGffB_9_bDL_7MA3o" />
        <link rel="icon" href="/logo-transparent.png" />
        <meta property="og:title" content="PulseBoard – Uptime Monitoring Made Simple" />
        <meta property="og:description" content="Check endpoints, get alerts, and stay online. Free for up to 10 monitors." />
        <meta property="og:image" content="https://cbjyjerfpoqcvfuzkbds.supabase.co/storage/v1/object/public/Website%20Images/Screenshot%202025-11-24%20at%204.44.02%20PM.png" />
        <meta property="og:url" content="https://pulseboard.lamas-co.com" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
