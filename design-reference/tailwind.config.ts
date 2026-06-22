/* =============================================================================
   Javier Ramos Portfolio — tailwind.config.ts
   For Tailwind v3 + shadcn/ui. (If you're on Tailwind v4, you do NOT need this
   file — the @theme block in globals.css already wires the tokens. Keep v4's
   globals.css instead.)

   Pair this with the :root / .dark token blocks from globals.css.
   ========================================================================== */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // extra semantic tokens
        surface: "var(--surface)",
        success: { DEFAULT: "var(--success)", foreground: "var(--success-foreground)" },
        warning: { DEFAULT: "var(--warning)", foreground: "var(--warning-foreground)" },

        // chart palette
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      borderRadius: {
        sm: "calc(var(--radius) - 6px)", // 6px
        md: "calc(var(--radius) - 3px)", // 9px
        lg: "var(--radius)",             // 12px
        xl: "calc(var(--radius) + 4px)", // 16px
        "2xl": "calc(var(--radius) + 8px)", // 20px
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        // the single allowed gradient — primary CTA only
        "gradient-primary": "var(--gradient-primary)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(.2,.7,.2,1)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

/* -----------------------------------------------------------------------------
   NOTE ON OPACITY MODIFIERS (e.g. bg-primary/12)
   These hex var() colors work for solid fills. If you need Tailwind's `/<alpha>`
   opacity modifiers on tokens, switch the token values to channel form, e.g.
   `--primary: 187 92% 53%;` and reference as `hsl(var(--primary) / <alpha-value>)`.
   The mock relies on `color-mix(in srgb, var(--primary) 12%, transparent)` for
   tinted fills — that is the simplest 1:1 port and works in all evergreen browsers.
   ----------------------------------------------------------------------------- */
