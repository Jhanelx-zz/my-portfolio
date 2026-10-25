"use client";

import { useState } from "react";
import { BriefcaseBusiness, Check, Copy, Download, Globe, Mail, Phone, Send } from "lucide-react";
import type {
  PublicContact,
  PublicProfile,
  PublicSocialLink,
} from "@/lib/cms/public-data";

export default function ContactView({
  contact,
  socials,
  profile,
}: {
  contact: PublicContact | null;
  socials: PublicSocialLink[];
  profile: PublicProfile | null;
}) {
  const emailAddress = contact?.email ?? "";
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Get In Touch</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#536159] dark:text-[#b2c0b7]">
          {contact?.introduction || "For inquiries about my projects, skills, or background, feel free to reach out."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            01 / Personal Information
          </h2>
          <div className="space-y-4 text-sm text-[#536159] dark:text-[#b2c0b7]">
            <div className="border-b border-black/5 pb-3 dark:border-white/5">
              <p className="font-mono text-xs text-gray-500 dark:text-gray-400">FULL NAME</p>
              <p className="mt-1 font-bold text-gray-900 dark:text-gray-100">{profile?.fullName || "Jhunnel C. Carillo"}</p>
            </div>
            <div className="border-b border-black/5 pb-3 dark:border-white/5">
              <p className="font-mono text-xs text-gray-500 dark:text-gray-400">STATUS</p>
              <p className="mt-1 font-bold text-gray-900 dark:text-gray-100">Graduating BSIT Student • OJT Applicant</p>
            </div>
            <div>
              <p className="font-mono text-xs text-gray-500 dark:text-gray-400">INSTITUTION</p>
              <p className="mt-1 font-bold text-gray-900 dark:text-gray-100">Our Lady of Lourdes College Foundation (OLLCF)</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            02 / Professional Profiles
          </h2>
          <p className="mb-4 text-sm text-[#536159] dark:text-[#b2c0b7]">
            Connect with me on professional networks or explore my code repositories:
          </p>
          <div className="space-y-3 font-mono text-sm">
            {contact?.phone && <div className="rounded-lg border border-black/10 bg-[#edf1ed] p-3 dark:border-white/10 dark:bg-[#0e1511]">
              <span className="mb-1 block text-xs text-gray-500 dark:text-gray-400">{"// Phone"}</span>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                <Phone size={14} />
                <span>{contact.phone}</span>
              </a>
            </div>}
            <div className="rounded-lg border border-black/10 bg-[#edf1ed] p-3 dark:border-white/10 dark:bg-[#0e1511]">
              <span className="mb-1 block text-xs text-gray-500 dark:text-gray-400">{"// Email"}</span>
              {emailAddress && <a href={`mailto:${emailAddress}`} className="flex items-center gap-2 font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                <Mail size={14} />
                <span>{emailAddress}</span>
              </a>}
            </div>
            {socials.filter((social) => social.platform.toLowerCase() !== "email" && !social.url.toLowerCase().startsWith("mailto:")).map((social) => (
              <div key={social.id} className="rounded-lg border border-black/10 bg-[#edf1ed] p-3 dark:border-white/10 dark:bg-[#0e1511]">
                <span className="mb-1 block text-xs text-gray-500 dark:text-gray-400">{`// ${social.platform}`}</span>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                  {social.platform.toLowerCase() === "linkedin" ? <BriefcaseBusiness size={14} /> : <Globe size={14} />}
                  <span>{social.label}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        {emailAddress && <a href={`mailto:${emailAddress}`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-mono text-xs font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500">
          <Send size={14} />
          Email me
        </a>}
        {emailAddress && <button onClick={handleCopyEmail} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-5 py-3 font-mono text-xs font-semibold text-gray-900 transition hover:border-emerald-600 hover:bg-emerald-700/5 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-emerald-400 dark:hover:bg-white/10">
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Email"}
        </button>}
        <a href={profile?.resumeUrl || "/Jhunnel-Carillo-Resume.pdf?v=2026-10-19"} download className="inline-flex items-center gap-2 rounded-xl border border-emerald-700/30 bg-emerald-700/5 px-5 py-3 font-mono text-xs font-semibold text-emerald-800 transition hover:border-emerald-700 hover:bg-emerald-700/10 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/15">
          <Download size={14} />
          Download Resume (PDF)
        </a>
      </div>

      <div className="mt-12 rounded-xl border border-black/10 bg-[#edf1ed] p-6 dark:border-white/10 dark:bg-[#0e1511]">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          visitor@portfolio:~$ echo &quot;Looking forward to connecting with your team!&quot;
        </p>
      </div>
    </div>
  );
}
