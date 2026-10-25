// src/app/projects/page.tsx

import Link from "next/link";
import { getPublishedProjects } from "@/lib/cms/public-data";

export const metadata = {
  title: "Projects",
  description: "Explore web and software development projects built by Jhunnel C. Carillo.",
};

export default async function ProjectsPage() {
  const result = await getPublishedProjects();
  const projects = result.data;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Featured Projects</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#536159] dark:text-[#b2c0b7]">
          A collection of software systems, web applications, and academic projects I have developed or conceptualized during my BSIT degree.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:border-white/10 dark:bg-[#111916]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                  {project.category}
                </span>
                <span className="rounded-full border border-amber-600/30 px-2.5 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                  {project.status}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold tracking-tight">
                {project.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
                {project.shortDescription}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-[#edf1ed] px-2 py-1 font-mono text-xs dark:bg-[#202a24]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                View case study <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}