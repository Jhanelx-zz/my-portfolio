// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Download, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileMenuOpen) {
          setMobileMenuOpen(false);
          mobileMenuButtonRef.current?.focus();
        }
      }}
      className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-[#090e0b]/85"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          href="/"
          aria-label="Jhunnel C. Carillo home"
          title="Jhunnel C. Carillo"
          className="inline-flex size-10 shrink-0 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/15"
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

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-black/10 bg-[#edf1ed] p-1.5 shadow-md dark:border-white/10 dark:bg-[#111916] lg:flex"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
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
            aria-label="Download resume"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-500/15 dark:text-emerald-300"
          >
            <Download size={12} aria-hidden="true" />
            <span className="hidden sm:inline">Resume</span>
          </a>
          <button
            ref={mobileMenuButtonRef}
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 text-gray-700 transition hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <div id="mobile-navigation" className="lg:hidden">
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.nav
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-2 gap-2 overflow-hidden border-t border-black/10 px-4 py-3 sm:grid-cols-3 sm:px-6 dark:border-white/10"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex min-h-11 items-center rounded-xl px-3 py-2 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700 hover:bg-emerald-600/10 dark:text-gray-200 dark:hover:bg-emerald-400/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}