// src/app/page.tsx

import Link from "next/link";
import { projectsData } from "./data/projects";

const skills = [
  "Web Development",
  "PHP & MySQL",
  "TypeScript & JavaScript",
  "Tailwind CSS",
  "C# / .NET MAUI",
  "Database Fundamentals",
  "Hardware & Arduino Programming",
  "IT Support & Equipment Setup",
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="home"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24"
      >
        <div>
          <p className="mb-5 font-mono text-sm text-emerald-700 dark:text-emerald-400">
            visitor@portfolio:~$ whoami
          </p>

          <p className="mb-3 text-sm font-medium text-[#536159] dark:text-[#b2c0b7]">
            Hello, I&apos;m
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Jhunnel C. Carillo
          </h1>

          <h2 className="mt-4 text-xl font-medium text-emerald-700 dark:text-emerald-400 sm:text-2xl">
            Graduating BSIT Student
          </h2>

          <p className="mt-6 max-w-xl leading-8 text-[#536159] dark:text-[#b2c0b7]">
            An aspiring IT professional building practical skills in software
            development, web applications, and technology-driven solutions.
            Currently preparing for an on-the-job training (OJT) opportunity to learn,
            contribute, and grow in a professional environment.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-[#07110b] dark:hover:bg-emerald-400"
            >
              Explore my projects
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-black/15 px-5 py-3 text-sm font-semibold transition hover:border-emerald-600 dark:border-white/20 dark:hover:border-emerald-400"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Terminal Window Widget */}
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#111916] dark:shadow-black/20">
          <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3 dark:border-white/10">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-xs text-[#68766d] dark:text-[#93a398]">
              profile.ts
            </span>
          </div>

          <div className="overflow-x-auto p-5 font-mono text-sm leading-7 sm:p-6">
            <p className="text-[#68766d] dark:text-[#93a398]">
              {"// A little about me"}
            </p>
            <p>
              <span className="text-purple-700 dark:text-purple-300">
                const
              </span>{" "}
              <span className="text-emerald-700 dark:text-emerald-300">
                developer
              </span>{" "}
              = {"{"}
            </p>
            <p className="pl-4">
              <span className="text-blue-700 dark:text-blue-300">name</span>:{" "}
              <span className="text-amber-700 dark:text-amber-300">
                &quot;Jhunnel C. Carillo&quot;
              </span>
              ,
            </p>
            <p className="pl-4">
              <span className="text-blue-700 dark:text-blue-300">role</span>:{" "}
              <span className="text-amber-700 dark:text-amber-300">
                &quot;BSIT Student&quot;
              </span>
              ,
            </p>
            <p className="pl-4">
              <span className="text-blue-700 dark:text-blue-300">focus</span>: [
            </p>
            <p className="pl-8 text-amber-700 dark:text-amber-300">
              &quot;Web & Mobile Apps&quot;,
            </p>
            <p className="pl-8 text-amber-700 dark:text-amber-300">
              &quot;IT Support & MIS Operations&quot;,
            </p>
            <p className="pl-8 text-amber-700 dark:text-amber-300">
              &quot;Continuous Learning&quot;,
            </p>
            <p className="pl-4">],</p>
            <p className="pl-4">
              <span className="text-blue-700 dark:text-blue-300">openToOJT</span>:{" "}
              <span className="text-purple-700 dark:text-purple-300">
                true
              </span>
            </p>
            <p>{"};"}</p>
            <p className="mt-4 text-emerald-700 dark:text-emerald-400">
              <span className="text-[#68766d] dark:text-[#93a398]">$ </span>
              Ready to learn and build.
              <span className="ml-1 animate-pulse">_</span>
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-y border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
            01 / about
          </p>
          <h2 className="mt-3 text-3xl font-bold">A little about me</h2>
          <p className="mt-5 max-w-3xl leading-8 text-[#536159] dark:text-[#b2c0b7]">
            I am pursuing a Bachelor of Science in Information Technology at
            Our Lady of Lourdes College Foundation. I am passionate about applying
            what I learn through practical projects, technical problem-solving,
            and collaboration. Through my experience as a Student Assistant at the MISITS
            Department, I&apos;ve built hands-on confidence with IT infrastructure, laboratory support,
            and software applications.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          02 / skills
        </p>
        <h2 className="mt-3 text-3xl font-bold">Tools & Skills</h2>
        <p className="mt-4 text-[#536159] dark:text-[#b2c0b7]">
          Technologies and practical IT competencies I have applied in academic and technical projects.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-black/10 bg-white px-4 py-3 font-mono text-sm dark:border-white/10 dark:bg-[#111916]"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section - Now linking to detail pages */}
      <section
        id="projects"
        className="border-y border-black/10 bg-[#edf1ed] dark:border-white/10 dark:bg-[#0e1511]"
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
                03 / projects
              </p>
              <h2 className="mt-3 text-3xl font-bold">Featured Projects</h2>
            </div>
            <Link
              href="/projects"
              className="font-mono text-sm text-emerald-700 hover:underline dark:text-emerald-400"
            >
              View all projects &rarr;
            </Link>
          </div>
          <p className="mt-4 max-w-2xl leading-7 text-[#536159] dark:text-[#b2c0b7]">
            Selected academic and software development projects I have built or am actively developing. Click any card to view the full case study.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projectsData.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md dark:border-white/10 dark:bg-[#111916]"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                      {project.category}
                    </p>
                    <span className="rounded-full border border-amber-600/30 px-3 py-1 text-xs text-amber-700 dark:text-amber-300">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="mt-3 leading-7 text-sm text-[#536159] dark:text-[#b2c0b7]">
                    {project.shortDescription}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-md bg-[#edf1ed] px-2.5 py-1.5 font-mono text-xs dark:bg-[#202a24]"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 font-mono text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  Read case study &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          04 / experience
        </p>
        <h2 className="mt-3 text-3xl font-bold">Practical Experience</h2>

        <article className="mt-7 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
            2025 — Present
          </p>
          <h3 className="mt-3 text-xl font-semibold">Student Assistant</h3>
          <p className="mt-1 text-[#536159] dark:text-[#b2c0b7]">
            MISITS Department · Our Lady of Lourdes College Foundation
          </p>
          <p className="mt-4 leading-7 text-[#536159] dark:text-[#b2c0b7]">
            Supporting department operations involving IT laboratory maintenance, technical equipment setup for college events, enrollment document validation, and livestream/LED wall technical operation.
          </p>
        </article>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          05 / contact
        </p>
        <h2 className="mt-3 text-3xl font-bold">Let&apos;s Connect</h2>
        <p className="mt-4 max-w-2xl leading-8 text-[#536159] dark:text-[#b2c0b7]">
          I am actively looking for On-the-Job Training (OJT) opportunities in software development, web application engineering, or IT support. Feel free to reach out!
        </p>
        <p className="mt-6 font-mono text-sm text-emerald-700 dark:text-emerald-400">
          visitor@portfolio:~$ echo &quot;Thank you for visiting!&quot;
        </p>
      </section>
    </div>
  );
}