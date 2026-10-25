import type { Metadata } from "next";
import DesignGallery from "./DesignGallery";
import { getPublishedDesignWorks } from "@/lib/cms/public-data";

export const metadata: Metadata = {
  title: "Design & Creative Works",
  description:
    "Creative and multimedia work explored by Jhunnel C. Carillo alongside his BSIT studies.",
};

export default async function DesignPage() {
  const result = await getPublishedDesignWorks();
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10">
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Design &amp; Creative Works
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#536159] dark:text-[#b2c0b7]">
          Alongside my BSIT studies, I have explored graphic design and
          multimedia work through practical projects and creative learning.
          These skills complement my IT education by helping me think about
          visual communication, presentation, and the people who use technology.
        </p>
      </header>

      <section aria-labelledby="gallery-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              A growing collection
            </p>
            <h2 id="gallery-heading" className="mt-2 text-2xl font-bold">
              Creative work gallery
            </h2>
          </div>
        </div>

        {result.data.length > 0 ? (
          <DesignGallery works={result.data} />
        ) : (
          <p className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-[#536159] dark:border-white/10 dark:bg-[#111916] dark:text-[#b2c0b7]">
            No creative works have been published yet.
          </p>
        )}
      </section>

      <section className="mt-14 rounded-2xl border border-emerald-700/15 bg-emerald-700/5 p-6 sm:p-8 dark:border-emerald-400/15 dark:bg-emerald-400/5">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Still learning, still creating
        </p>
        <h2 className="mt-3 text-xl font-bold">
          Growing my technical and creative skills
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#536159] dark:text-[#b2c0b7]">
          Each project is an opportunity to learn, practice, and improve. I am
          continuing to develop both my IT skills and my creative approach as I
          prepare for OJT and future opportunities.
        </p>
      </section>
    </div>
  );
}
