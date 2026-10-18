// src/app/projects/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { projectsData } from "../../data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      {/* Navigation back link */}
      <Link
        href="/projects"
        className="font-mono text-sm text-emerald-700 hover:underline dark:text-emerald-400"
      >
        &larr; Back to all projects
      </Link>

      {/* Header */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {project.category}
          </span>
          <span className="rounded-full border border-amber-600/30 px-3 py-0.5 text-xs text-amber-700 dark:text-amber-300">
            {project.status}
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{project.name}</h1>
        <p className="mt-4 text-lg text-[#536159] dark:text-[#b2c0b7]">
          {project.fullDescription}
        </p>
      </div>

      {/* Tech Stack Badges */}
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-black/10 bg-white px-3 py-1 font-mono text-xs dark:border-white/10 dark:bg-[#111916]"
          >
            {tech}
          </span>
        ))}
      </div>

      <hr className="my-10 border-black/10 dark:border-white/10" />

      {/* Role */}
      <section className="mb-10">
        <h2 className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          My Role & Contribution
        </h2>
        <p className="mt-2 text-[#536159] dark:text-[#b2c0b7]">
          {project.role}
        </p>
      </section>

      {/* Problem & Solution Grid */}
      <div className="grid gap-8 md:grid-cols-2 mb-10">
        <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <h3 className="font-mono text-sm font-bold text-red-600 dark:text-red-400">
            [Problem / Challenge]
          </h3>
          <p className="mt-3 leading-7 text-sm text-[#536159] dark:text-[#b2c0b7]">
            {project.problem}
          </p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <h3 className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
            [Solution / Approach]
          </h3>
          <p className="mt-3 leading-7 text-sm text-[#536159] dark:text-[#b2c0b7]">
            {project.solution}
          </p>
        </div>
      </div>

      {/* Key Features */}
      <section className="mb-10 rounded-xl border border-black/10 bg-[#edf1ed] p-6 dark:border-white/10 dark:bg-[#0e1511]">
        <h2 className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
          Key System Features
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
          {project.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-emerald-500">&gt;</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Lessons Learned */}
      <section className="mb-10">
        <h2 className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Lessons Learned & Technical Takeaways
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
          {project.lessonsLearned.map((lesson, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-emerald-500">&gt;</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}