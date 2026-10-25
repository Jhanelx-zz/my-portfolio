// src/app/projects/[slug]/page.tsx

import { getPublishedProjects } from "@/lib/cms/public-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await getPublishedProjects();
  return result.data.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const result = await getPublishedProjects();
  const project = result.data.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center font-mono text-xs text-emerald-700 hover:underline dark:text-emerald-400"
      >
        &larr; Back to all projects
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="editorial-badge">{project.category}</span>
        <span className="rounded-full border border-amber-600/30 bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-800 dark:border-amber-500/30 dark:text-amber-300">
          {project.status}
        </span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
        {project.name}
      </h1>
      <p className="mt-4 text-lg leading-8 text-[#39473f] dark:text-[#b2c0b7]">
        {project.fullDescription}
      </p>

      {/* Cover Image */}
      <div className="relative mt-10 flex h-72 w-full items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-[#e9efeb] shadow-xl dark:border-white/10 dark:bg-[#17211b] sm:h-96">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`${project.name} screenshot`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.22),_transparent_55%),linear-gradient(135deg,_#edf3ef,_#dbe7df)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.18),_transparent_55%),linear-gradient(135deg,_#1b2921,_#101713)]"
          />
        )}
      </div>

      {/* Project Details Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="editorial-card p-8">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {"// The Problem"}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#39473f] dark:text-[#b2c0b7]">
            {project.problem}
          </p>
        </div>

        <div className="editorial-card p-8">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {"// The Solution"}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#39473f] dark:text-[#b2c0b7]">
            {project.solution}
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="editorial-card mt-8 p-8">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {"// Technologies Used"}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-black/10 bg-[#edf1ed] px-3 py-1.5 font-mono text-xs text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {project.role && (
        <div className="editorial-card mt-8 p-8">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            My Role
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#39473f] dark:text-[#b2c0b7]">{project.role}</p>
        </div>
      )}

      {project.features.length > 0 && (
        <div className="editorial-card mt-8 p-8">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Key Features
          </h3>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-7 text-[#39473f] dark:text-[#b2c0b7]">
            {project.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </div>
      )}

      {project.lessonsLearned.length > 0 && (
        <div className="editorial-card mt-8 p-8">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            What I Learned
          </h3>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-7 text-[#39473f] dark:text-[#b2c0b7]">
            {project.lessonsLearned.map((lesson) => <li key={lesson}>{lesson}</li>)}
          </ul>
        </div>
      )}

      {(project.githubUrl || project.demoUrl) && (
        <div className="mt-8 flex flex-wrap gap-4">
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-700 underline dark:text-emerald-400">Source code</a>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-700 underline dark:text-emerald-400">Live demo</a>}
        </div>
      )}

      {/* Screenshots Section */}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-950 dark:text-white">System Screenshots</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {project.screenshots.map((shot, idx) => (
              <div key={idx} className="editorial-card overflow-hidden p-0">
                <div className="relative h-64 w-full bg-[#e9efeb] dark:bg-gray-900">
                  <Image
                    src={shot.url}
                    alt={shot.caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-white p-4 dark:bg-[#111916]">
                  <p className="font-mono text-xs text-[#536159] dark:text-[#b2c0b7]">{shot.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}