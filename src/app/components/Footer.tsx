// src/app/components/Footer.tsx
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  Globe,
  Mail,
} from "lucide-react";
import type { PublicSocialLink } from "@/lib/cms/public-data";

export default function Footer({
  socialLinks,
  resumeUrl,
}: {
  socialLinks: PublicSocialLink[];
  resumeUrl: string | null;
}) {
  return (
    <footer className="border-t border-white/10 bg-[#080d0a] text-[#a8b4ae]">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 rounded-md text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
              <span className="flex size-11 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 font-mono text-sm font-bold text-emerald-300">
                JC
              </span>
              <span>
                <span className="block text-sm font-semibold tracking-wide">Jhunnel C. Carillo</span>
                <span className="mt-1 block text-xs text-[#84938a]">BSIT student · Aspiring developer</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#a8b4ae]">
              Building practical digital experiences while learning, creating, and growing through hands-on work.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Explore</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              <li><Link href="/projects" className="transition-colors hover:text-emerald-300 focus-visible:text-emerald-300">Projects</Link></li>
              <li><Link href="/skills" className="transition-colors hover:text-emerald-300 focus-visible:text-emerald-300">Skills</Link></li>
              <li><Link href="/experience" className="transition-colors hover:text-emerald-300 focus-visible:text-emerald-300">Experience</Link></li>
              <li><Link href="/achievements" className="transition-colors hover:text-emerald-300 focus-visible:text-emerald-300">Achievements</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Let&apos;s connect</h2>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#07110c] transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080d0a]"
            >
              Get in touch <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {socialLinks.map((social) => {
                const platform = social.platform.toLowerCase();
                const isEmail = social.url.startsWith("mailto:");
                const Icon = platform === "linkedin"
                  ? BriefcaseBusiness
                  : platform === "github"
                    ? Code2
                    : platform === "email"
                      ? Mail
                      : Globe;

                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    aria-label={social.platform}
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#c0ccc4] transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <Icon size={17} aria-hidden="true" />
                  </a>
                );
              })}
              <a
                href={resumeUrl || "/Jhunnel-Carillo-Resume.pdf?v=2026-10-19"}
                download
                aria-label="Download résumé"
                className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#c0ccc4] transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Download size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-[#84938a] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Jhunnel C. Carillo. All rights reserved.</p>
          <p>Designed and built with care.</p>
        </div>
      </div>
    </footer>
  );
}