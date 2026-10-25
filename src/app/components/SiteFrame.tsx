"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import type { PublicSocialLink } from "@/lib/cms/public-data";

function SiteFrameContent({
  children,
  socialLinks,
  resumeUrl,
}: {
  children: ReactNode;
  socialLinks: PublicSocialLink[];
  resumeUrl: string | null;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar resumeUrl={resumeUrl} />}
      <main className="flex-1">
        {isAdminRoute ? children : <PageTransition>{children}</PageTransition>}
      </main>
      {!isAdminRoute && <Footer socialLinks={socialLinks} resumeUrl={resumeUrl} />}
    </>
  );
}

export default function SiteFrame({
  children,
  socialLinks,
  resumeUrl,
}: {
  children: ReactNode;
  socialLinks: PublicSocialLink[];
  resumeUrl: string | null;
}) {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-[#090e0b]" />}>
      <SiteFrameContent socialLinks={socialLinks} resumeUrl={resumeUrl}>{children}</SiteFrameContent>
    </Suspense>
  );
}
