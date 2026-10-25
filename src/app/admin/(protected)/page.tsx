import Link from "next/link";
import { getDashboardSummary } from "@/lib/cms/admin-data";

const managementLinks = [
  { href: "/admin/profile", label: "Edit profile" },
  { href: "/admin/projects", label: "Add a project" },
  { href: "/admin/skills", label: "Manage skills" },
  { href: "/admin/achievements", label: "Add an achievement" },
  { href: "/admin/creative-works", label: "Manage design & creative works" },
];

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();
  const metricCards = [
    { label: "Projects", value: summary.counts.projects, href: "/admin/projects" },
    { label: "Skills", value: summary.counts.skills, href: "/admin/skills" },
    { label: "Achievements", value: summary.counts.achievements, href: "/admin/achievements" },
    { label: "Experience records", value: summary.counts.experience, href: "/admin/experience" },
    { label: "Education records", value: summary.counts.education, href: "/admin/education" },
  ];

  return (
    <section>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
        Portfolio management
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
        Overview of saved portfolio content. Draft and unpublished records are
        included in these counts.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-emerald-600/50 dark:border-white/10 dark:bg-[#111916] dark:hover:border-emerald-400/50"
          >
            <p className="text-sm text-[#536159] dark:text-[#b2c0b7]">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <ul className="mt-4 space-y-3">
            {managementLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <h2 className="text-lg font-semibold">Recently updated</h2>
          {summary.recent.length === 0 ? (
            <p className="mt-4 text-sm text-[#536159] dark:text-[#b2c0b7]">
              No content has been added yet.
            </p>
          ) : (
            <ol className="mt-4 divide-y divide-black/5 dark:divide-white/5">
              {summary.recent.map((item) => (
                <li
                  key={`${item.label}-${item.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-[#536159] dark:text-[#b2c0b7]">
                      {item.label}
                    </p>
                  </div>
                  <time
                    dateTime={item.updatedAt}
                    className="text-xs text-[#536159] dark:text-[#b2c0b7]"
                  >
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </section>
  );
}
