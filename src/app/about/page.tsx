import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { getPublishedProfile } from "@/lib/cms/public-data";
import type { PublicProfile } from "@/lib/cms/public-data";

export const metadata = {
  title: "About",
  description: "About Jhunnel C. Carillo - BSIT Student and Developer",
};

const highlights = [
  {
    label: "Education",
    title: "BS Information Technology",
    detail:
      "Studying at Our Lady of Lourdes College Foundation in Daet, Camarines Norte.",
    icon: GraduationCap,
  },
  {
    label: "Hands-on experience",
    title: "MISITS Student Assistant",
    detail:
      "Supporting campus IT, computer labs, college events, and day-to-day technical needs.",
    icon: BriefcaseBusiness,
  },
  {
    label: "Areas of interest",
    title: "Web development & graphic design",
    detail:
      "Building applications with PHP, JavaScript, Next.js, and C#, while continuing to learn graphic design.",
    icon: Code2,
  },
];

const fallbackProfile: PublicProfile = {
  fullName: "Jhunnel C. Carillo",
  displayName: "Jhunnel",
  professionalTitle: "BSIT Student · OJT Candidate · Aspiring Developer",
  heroIntro: "",
  biography:
    "I’m an Information Technology student from Camarines Norte, Philippines, interested in making useful software for real-world needs. I enjoy learning by building projects and working alongside people who use technology every day.",
  professionalSummary: "",
  location: "Daet, Camarines Norte, Philippines",
  interests: [
    "Web development",
    "Graphic design",
    "IT support",
    "Creative multimedia",
  ],
  careerGoals: [],
  avatarUrl: null,
  resumeUrl: null,
};

export default async function AboutPage() {
  const result = await getPublishedProfile();
  const profile =
    result.mode === "database" && result.data ? result.data : fallbackProfile;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_0.72fr] lg:gap-16">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            A little about me
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Hi, I&apos;m {profile.displayName}.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#536159] dark:text-[#b2c0b7]">
            {profile.biography || profile.professionalSummary}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-sm text-[#536159] dark:border-white/10 dark:bg-white/5 dark:text-[#b2c0b7]">
            <MapPin
              size={15}
              aria-hidden="true"
              className="text-emerald-700 dark:text-emerald-400"
            />
            {profile.location}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Explore my projects
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl border border-black/10 bg-white/70 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-emerald-600/50 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:border-emerald-400/50"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[19rem] lg:mr-8">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white p-2 shadow-xl shadow-emerald-950/10 dark:border-white/10 dark:bg-[#111916]">
            <div className="relative aspect-[27/40] overflow-hidden rounded-2xl">
              <Image
                src={profile.avatarUrl ?? "/images/profile/about-portrait.jpg"}
                alt={`Portrait of ${profile.fullName}`}
                fill
                priority
                sizes="(max-width: 768px) 75vw, 300px"
                unoptimized={Boolean(profile.avatarUrl)}
                className="object-cover"
              />
            </div>
          </div>
        </figure>
      </section>

      <section aria-label="About me at a glance" className="mt-16 sm:mt-20">
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Background
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            What I bring to the table
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(result.mode === "database" && result.data
            ? [
                {
                  label: "Professional focus",
                  title: profile.professionalTitle,
                  detail: profile.professionalSummary || profile.biography,
                  icon: BriefcaseBusiness,
                },
                {
                  label: "Location",
                  title: profile.location,
                  detail: "Based in Camarines Norte, Philippines.",
                  icon: MapPin,
                },
                {
                  label: "Areas of interest",
                  title: profile.interests.join(" & "),
                  detail: "Topics I am exploring through study and hands-on projects.",
                  icon: Code2,
                },
              ]
            : highlights
          ).map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]/90"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <p className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {item.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
                  {item.detail}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]/90 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Learning by doing
        </p>
        <div className="mt-3 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            Technology is best learned hands-on.
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#536159] dark:text-[#b2c0b7]">
            <p>
              Beyond my coursework, I&apos;ve worked on practical projects such
              as Mendoza&apos;s Store System and the iSKalawihao youth budget
              portal, and explored hardware through Arduino.
            </p>
            <p>
              My role with the MISITS Department has also given me experience
              with computer lab maintenance, enrollment data validation,
              equipment setup, and technical support for college events. These
              experiences have helped me grow as a problem-solver and teammate.
            </p>
          </div>
        </div>
      </section>

      {profile.careerGoals.length > 0 && (
        <section className="mt-6 rounded-2xl border border-emerald-700/15 bg-emerald-700/5 p-6 dark:border-emerald-400/15 dark:bg-emerald-400/5 sm:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Looking ahead
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {profile.careerGoals.map((goal) => (
              <li key={goal} className="rounded-full border border-emerald-700/15 bg-white/70 px-4 py-2 text-sm dark:border-emerald-400/15 dark:bg-white/5">
                {goal}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
