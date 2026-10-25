// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFrame from "./components/SiteFrame";
import { getPublicSocialLinks, getPublishedProfile } from "@/lib/cms/public-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jhunnel C. Carillo | BSIT Portfolio",
    template: "%s | Jhunnel C. Carillo",
  },
  description:
    "The personal portfolio of Jhunnel C. Carillo, a graduating BSIT student preparing for OJT opportunities.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [socials, profile] = await Promise.all([
    getPublicSocialLinks(),
    getPublishedProfile(),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { const theme = localStorage.getItem("theme"); const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.classList.toggle("dark", dark); } catch {}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteFrame
          socialLinks={socials.data}
          resumeUrl={profile.mode === "database" ? profile.data?.resumeUrl ?? null : null}
        >
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}