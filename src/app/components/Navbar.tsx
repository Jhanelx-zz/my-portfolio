// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Achievements", href: "/achievements" },
  { name: "Design", href: "/design" },
  { name: "Experience", href: "/experience" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({ resumeUrl }: { resumeUrl: string | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-[#090e0b]/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          aria-label="Jhunnel C. Carillo home"
          title="Jhunnel C. Carillo"
          className="inline-flex size-10 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/15"
        >
          <Image
            src="/images/profile/logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-full w-full object-cover"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-black/10 bg-[#edf1ed] p-1.5 shadow-md dark:border-white/10 dark:bg-[#111916] md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-1.5 font-mono text-xs font-medium transition-colors duration-200 ${
                  isActive ? "text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 z-0 rounded-full bg-emerald-600 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
          href={resumeUrl || "/Jhunnel-Carillo-Resume.pdf?v=2026-10-19"}
          download
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-semibold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/15"
        >
          <Download size={12} />
          Resume
          </a>
        </div>
      </div>
    </header>
  );
}