"use client";

// src/app/page.tsx

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Code2, FolderGit2 } from "lucide-react";
import type { Project } from "./data/projects";
import type { PublicExperience, PublicProfile } from "@/lib/cms/public-data";
import FadeIn from "./components/FadeIn";

const skills = [
  "Basic Programming",
  "HTML & CSS",
  "JavaScript, TypeScript & PHP",
  "Exploring React & Next.js",
  "AI-assisted Learning",
  "Basic SQL",
  "Website Layout Exploration",
  "Basic Graphic Design",
  "IT Support & Event Setup",
];

export default function HomeView({
  projects,
  profile,
  experiences,
  skills: publishedSkills,
}: {
  projects: Project[];
  profile: PublicProfile | null;
  experiences: PublicExperience[] | null;
  skills: string[] | null;
}) {
  const displaySkills = publishedSkills ?? skills;
  const featuredProjects = projects.filter((project) => project.isFeatured !== false);

  return (
    <div className="min-h-screen selection:bg-emerald-500 selection:text-white">
      <section id="home" className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <FadeIn delay={0.1}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-emerald-700 dark:text-emerald-400">
            <span className="flex items-center gap-2">
              <span className="status-dot" />
              status: operational
            </span>
            <span className="editorial-badge">Available for OJT 2026</span>
          </div>
        </FadeIn>

        <div className="grid items-stretch gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <FadeIn delay={0.2} className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#111916] p-3 shadow-lg">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/profile/canva-hero.jpg"
                alt="Jhunnel C. Carillo Portfolio Banner"
                fill
                className="object-contain object-center rounded-2xl"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="editorial-card glow-card flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                <span className="block">{profile?.displayName || "Jhunnel C."}</span>
                <span className="text-gradient block">
                  {profile?.fullName.replace(profile.displayName, "").trim() || "Carillo"}
                </span>
              </h1>
              <p className="mt-2 font-mono text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                {profile?.professionalTitle || "BSIT Student • OJT Candidate • Aspiring Developer"}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#39473f] dark:text-[#b2c0b7]">
                {profile?.heroIntro || "I am learning to build software and web applications one step at a time. I practice basic coding with AI as a learning aid, and enjoy exploring website layouts and creative ideas as I grow my skills through projects and hands-on experience."}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-6 dark:border-white/10 sm:flex-row">
              <a
                href="#projects"
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-center font-mono text-xs font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500"
              >
                Explore projects <ArrowRight className="ml-1 inline-block" size={14} />
              </a>
              <Link
                href="/contact"
                className="flex-1 rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-center font-mono text-xs font-semibold text-gray-900 transition hover:border-emerald-600 hover:bg-emerald-700/5 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-emerald-400 dark:hover:bg-white/10"
              >
                Get in touch
              </Link>
            </div>
          </FadeIn>
        </div>

      </section>

      <section id="about" className="border-y border-black/10 bg-[#e9efeb] dark:border-white/10 dark:bg-[#0c120f]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn delay={0.1}>
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Code2 size={14} />
              01 / about
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Get to know me</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#39473f] dark:text-[#b2c0b7]">
              I am pursuing a Bachelor of Science in Information Technology at <strong className="text-gray-950 dark:text-white">Our Lady of Lourdes College Foundation</strong>. I am still developing my programming skills, and I enjoy learning by building projects, exploring visual ideas, and asking questions. As a Student Assistant at the MISITS Department, I have also gained practical experience supporting IT equipment, campus activities, and day-to-day operations.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
        <FadeIn delay={0.1}>
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Code2 size={14} />
            02 / competencies
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Skills I&apos;m Developing</h2>
          <p className="mt-3 text-sm text-[#536159] dark:text-[#b2c0b7]">
            A snapshot of the areas I am practicing and exploring as a BSIT student.
          </p>
        </FadeIn>

        <div className="mt-8 flex flex-wrap gap-3">
          {displaySkills.map((skill, idx) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="inline-block rounded-xl border border-black/10 bg-white px-5 py-3 font-mono text-xs font-medium text-gray-800 shadow-sm transition hover:border-emerald-600 dark:border-white/10 dark:bg-[#111916] dark:text-white dark:hover:border-emerald-400"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>

      <section id="projects" className="border-y border-black/10 bg-[#e9efeb] dark:border-white/10 dark:bg-[#0c120f]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <FolderGit2 size={14} />
                  03 / portfolio
                </div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Featured Projects & Systems</h2>
              </div>
              <Link href="/projects" className="font-mono text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                View all projects <ArrowRight className="ml-1 inline-block" size={14} />
              </Link>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#536159] dark:text-[#b2c0b7]">
              Academic and personal projects where I practice what I am learning. Click a card to explore its screenshots and details.
            </p>
          </FadeIn>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, idx) => (
              <FadeIn key={project.slug} delay={0.2 + idx * 0.1}>
                <Link href={`/projects/${project.slug}`} className="editorial-card glow-card group flex h-full flex-col justify-between overflow-hidden p-0">
                  <div className="project-card relative h-48 w-full overflow-hidden bg-gray-900">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={`${project.name} screenshot`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.22),_transparent_55%),linear-gradient(135deg,_#edf3ef,_#dbe7df)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.18),_transparent_55%),linear-gradient(135deg,_#1b2921,_#101713)]"
                      />
                    )}
                    <div className="project-overlay flex items-end justify-end p-4 text-sm font-semibold text-white">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                        View Case Study <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{project.category}</p>
                        <span className="rounded-full border border-amber-600/30 bg-amber-500/10 px-3 py-0.5 text-[10px] font-mono text-amber-800 dark:border-amber-500/30 dark:text-amber-300">
                          {project.status}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-gray-950 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                        {project.name}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-xs leading-6 text-[#536159] dark:text-[#b2c0b7]">{project.shortDescription}</p>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 3).map((technology) => (
                          <span key={technology} className="rounded-md border border-black/10 bg-[#edf1ed] px-2.5 py-1 font-mono text-[10px] text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 font-mono text-xs text-emerald-700 dark:border-white/10 dark:text-emerald-400">
                      <span>View case study</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-6 py-20">
        <FadeIn delay={0.1}>
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <BriefcaseBusiness size={14} />
            04 / career & roles
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Practical Experience</h2>

          {(experiences?.length ? experiences : [{
            id: "student-assistant",
            jobTitle: "Student Assistant",
            organization: "MISITS Department · Our Lady of Lourdes College Foundation",
            employmentType: "Student role",
            location: "",
            startDate: "2025-01-01",
            endDate: null,
            isCurrent: true,
            description: "Supporting department operations involving IT laboratory maintenance, technical equipment setup for college events, enrollment document validation, and livestream/LED wall technical operation.",
            responsibilities: [],
            technologies: [],
            accomplishments: [],
            linkUrl: null,
          }]).slice(0, 2).map((experience) => (
            <article key={experience.id} className="editorial-card glow-card mt-8 p-8">
              <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {experience.startDate ? new Date(`${experience.startDate}T00:00:00`).getFullYear() : "—"} — {experience.isCurrent ? "PRESENT" : experience.endDate ? new Date(`${experience.endDate}T00:00:00`).getFullYear() : "—"}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">{experience.jobTitle}</h3>
              <p className="mt-1 font-mono text-xs text-[#536159] dark:text-[#b2c0b7]">{experience.organization}</p>
              <p className="mt-4 text-sm leading-8 text-[#39473f] dark:text-[#b2c0b7]">{experience.description}</p>
            </article>
          ))}
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-4">
        <FadeIn delay={0.1}>
          <div className="editorial-card flex flex-wrap items-center justify-between gap-6 border-emerald-700/20 bg-gradient-to-r from-emerald-100 via-white to-white p-10 dark:border-emerald-500/30 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:via-[#111916] dark:to-[#111916]">
            <div>
              <h3 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">Looking for an OJT student or collaborator?</h3>
              <p className="mt-1 text-sm text-[#536159] dark:text-[#b2c0b7]">
                I am ready to learn, contribute where I can, and keep growing through hands-on OJT experience.
              </p>
            </div>
            <Link href="/contact" className="rounded-xl bg-emerald-600 px-6 py-3 font-mono text-xs font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500">
              Get In Touch <ArrowRight className="ml-1 inline-block" size={14} />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}