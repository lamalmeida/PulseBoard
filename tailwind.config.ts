import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Brand & Design Style Colors
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
          hover: "var(--brand-hover)",
          glow: "var(--brand-glow)",
        },
        surface: {
          base: 'var(--surface-base)',
          glass: 'var(--surface-glass)',
          highlight: 'var(--surface-highlight)',
          input: 'var(--surface-input)',
        },
        // border: { ... } // Can't easily override border key cleanly, so we add custom border colors
        // We will use semantic names
        'border-subtle': 'var(--border-subtle)',
        'border-highlight': 'var(--border-highlight)',
        'border-focus': 'var(--border-focus)',

        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          dim: 'var(--text-dim)',
          inverse: 'var(--text-on-brand)',
        },
        // Semantic Status Colors
        success: { DEFAULT: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
        warning: { DEFAULT: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
        error: { DEFAULT: 'var(--color-error)', bg: 'rgba(244, 63, 94, 0.1)' },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        'cosmic-card': 'var(--shadow-card)',
        'cosmic-button': 'var(--shadow-button)',
        'cosmic-button-hover': 'var(--shadow-button-hover)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
