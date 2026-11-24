import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--ff-inter", subsets: ["latin"], display: "swap" });
const display = Space_Grotesk({ variable: "--ff-display", subsets: ["latin"], display: "swap", preload: false });
const wide = Unbounded({ variable: "--ff-wide", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--ff-mono", subsets: ["latin"], display: "swap", preload: false });

const SITE = "https://santhanamsandel.github.io";
const TITLE = "Santhanam L — AI/ML Engineer, Generative AI Specialist & Technical Trainer";
const DESC =
  "Portfolio of Santhanam L: AI/ML engineering, Generative AI agents, data analytics and technical training. 380+ learners and professionals trained in Python, SQL, Power BI, machine learning and AI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  keywords: [
    "Santhanam L",
    "AI/ML Engineer",
    "Generative AI",
    "Technical Trainer",
    "Machine Learning",
    "Data Analytics",
    "Power BI",
    "Python Trainer",
    "Tamil Nadu",
  ],
  authors: [{ name: "Santhanam L", url: SITE }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE,
    title: TITLE,
    description: DESC,
    siteName: "Santhanam L",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Santhanam L — AI/ML Engineer & Technical Trainer" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/images/og.jpg"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Santhanam L",
  url: SITE,
  jobTitle: "AI/ML Engineer & Technical Trainer",
  alumniOf: "Bharathiar University",
  image: `${SITE}/images/og.jpg`,
  email: "mailto:santhanaml2605@gmail.com",
  knowsAbout: ["Machine Learning", "Generative AI", "Python", "SQL", "Power BI", "Data Analytics", "Technical Training"],
  sameAs: ["https://www.linkedin.com/in/santhanam-l26/", "https://github.com/santhanamsandel"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable} ${wide.variable}`}>
      <head>
        {/* LCP: start fetching the hero portrait immediately (matches the <picture> sources in Hero) */}
        <link rel="preload" as="image" href="/images/hero-cinematic-sm.webp" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/hero-cinematic.webp" media="(min-width: 768px)" fetchPriority="high" />
      </head>
      <body className="antialiased bg-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <noscript>
          <style>{`[data-reveal],[data-heading] *{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
