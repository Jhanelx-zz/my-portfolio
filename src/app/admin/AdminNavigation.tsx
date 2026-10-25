import Link from "next/link";
import NextImage from "next/image";
import {
  Award,
  BriefcaseBusiness,
  Palette,
  FolderKanban,
  GraduationCap,
  Image,
  LayoutDashboard,
  Mail,
  Share2,
  UserRound,
  Wrench,
} from "lucide-react";
import { logoutAction } from "./actions";

const sections = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/achievements", label: "Achievements", icon: Award },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/socials", label: "Socials", icon: Share2 },
  { href: "/admin/creative-works", label: "Design & Creative", icon: Palette },
  { href: "/admin/media", label: "Media", icon: Image },
];

export default function AdminNavigation() {
  return (
    <aside className="border-b border-black/10 bg-white/95 dark:border-white/10 dark:bg-[#090e0b]/95 md:fixed md:inset-y-0 md:left-0 md:z-20 md:flex md:w-64 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-6">
        <Link
          href="/admin"
          aria-label="Portfolio Admin dashboard"
          className="inline-flex min-w-0 items-center gap-3 font-semibold text-gray-950 dark:text-white"
        >
          <NextImage
            src="/images/profile/logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="size-10 shrink-0 rounded-xl border border-emerald-500/30 object-cover"
          />
          <span>Portfolio Admin</span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-emerald-600 dark:border-white/10 dark:text-gray-200 dark:hover:border-emerald-400"
          >
            Sign out
          </button>
        </form>
      </div>
      <nav
        aria-label="Admin sections"
        className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-1 md:flex-col md:overflow-y-auto md:px-3 md:pb-6"
      >
        {sections.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex shrink-0 items-center gap-3 rounded-lg border border-black/10 bg-[#f4f7f5] px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:border-emerald-600/50 hover:text-emerald-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:text-emerald-300 md:border-transparent md:bg-transparent md:text-sm"
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
