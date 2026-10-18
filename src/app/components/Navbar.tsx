
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const useDark = savedTheme
      ? savedTheme === "dark"
      : prefersDark;

    document.documentElement.classList.toggle("dark", useDark);
    setDark(useDark);
  }, []);

  function toggleTheme() {
    const nextTheme = !dark ? "dark" : "light";

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    );

    localStorage.setItem("portfolio-theme", nextTheme);
    setDark(nextTheme === "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f7f5]/95 backdrop-blur dark:border-white/10 dark:bg-[#0b100e]/95">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4"
      >
        <Link href="/" className="shrink-0 font-mono text-sm font-bold">
          <span className="text-emerald-600 dark:text-emerald-400">
            ~/{" "}
          </span>
          portfolio
        </Link>

        <div className="hidden items-center gap-5 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#536159] transition hover:text-emerald-600 dark:text-[#b2c0b7] dark:hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm hover:border-emerald-600 dark:border-white/15 dark:hover:border-emerald-400"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm md:hidden dark:border-white/15"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-black/10 px-6 py-3 md:hidden dark:border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
