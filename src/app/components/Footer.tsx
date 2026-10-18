// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-[#f5f7f5] dark:bg-[#0b100e] py-7 transition-colors">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-sm text-[#536159] dark:text-[#93a398] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Jhunnel C. Carillo</p>
        
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 font-mono text-xs">
          <Link href="/projects" className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Projects
          </Link>
          <Link href="/skills" className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Skills
          </Link>
          <Link href="/experience" className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Experience
          </Link>
          <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}