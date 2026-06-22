import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const SITE_URL = process.env.SITE_URL ?? "https://javierramos.dev";
const TITLE = "Javier Ramos — Developer Showroom";
const DESCRIPTION =
  "A full-stack showroom that proves the product and the agentic workflow behind each build.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Javier Ramos" },
  description: DESCRIPTION,
  applicationName: "Javier Ramos — Developer Showroom",
  authors: [{ name: "Javier Ramos", url: SITE_URL }],
  keywords: [
    "full-stack engineer",
    "agentic workflows",
    "developer tooling",
    "Next.js",
    "NestJS",
    "Claude Code",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Javier Ramos",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
