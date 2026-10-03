import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Geist } from "next/font/google";
import Navbar from "../components/ui/Navbar";
import AICopilot from "../components/ai/AICopilot";
import Footer from "../components/layout/Footer";
import { site } from "../data/siteConfig";
import { cn } from "@/lib/utils";
import Cursor from "@/components/ui/Cursor";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "WONK"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s | ${site.name}` },
  description: site.tagline,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
};

export const viewport: Viewport = { themeColor: "#F4EFE6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} font-sans bg-cream text-ink antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>
        <Cursor/>
        <Navbar />
        {children}
        <Footer />
        <AICopilot />
      </body>
    </html>
  );
}