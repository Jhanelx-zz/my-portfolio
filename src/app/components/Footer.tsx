// src/app/components/Footer.tsx
import Link from "next/link";
import { BriefcaseBusiness, ExternalLink, Globe, Mail } from "lucide-react";
import type { PublicSocialLink } from "@/lib/cms/public-data";

export default function Footer({
  socialLinks,
  resumeUrl,
}: {
  socialLinks: PublicSocialLink[];
  resumeUrl: string | null;
}) {
  return (
    <footer className="border-t border-white/10 bg-[#090e0b]/80 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 text-sm text-[#a8b4ae] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-[#dce7df]">© 2026 Jhunnel C. Carillo</p>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-4 font-mono text-xs">
          <Link href="/projects" className="transition hover:text-emerald-300">
            Projects
          </Link>
          <Link href="/skills" className="transition hover:text-emerald-300">
            Skills
          </Link>
          <Link href="/experience" className="transition hover:text-emerald-300">
            Experience
          </Link>
          <Link href="/achievements" className="transition hover:text-emerald-300">
            Achievements
          </Link>
          <Link href="/contact" className="transition hover:text-emerald-300">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-[#dce7df]">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target={social.url.startsWith("mailto:") ? undefined : "_blank"}
              rel={social.url.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={social.platform}
              className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              {social.platform.toLowerCase() === "linkedin" ? (
                <BriefcaseBusiness size={14} />
              ) : social.platform.toLowerCase() === "email" ? (
                <Mail size={14} />
              ) : (
                <Globe size={14} />
              )}
            </a>
          ))}
          <a href={resumeUrl || "/Jhunnel-Carillo-Resume.pdf?v=2026-10-19"} download aria-label="Download resume" className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-emerald-400 hover:text-emerald-300">
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}