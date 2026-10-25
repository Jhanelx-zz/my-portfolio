import type { Metadata } from "next";
import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import { getPublishedAchievements } from "@/lib/cms/public-data";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Published certifications, awards, and achievements of Jhunnel C. Carillo.",
};

export default async function AchievementsPage() {
  const result = await getPublishedAchievements();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Learning milestones
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Achievements &amp; Certifications
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#536159] dark:text-[#b2c0b7]">
          Awards, training, certifications, and other milestones I have chosen
          to share.
        </p>
      </header>

      {result.data.length === 0 ? (
        <p className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-[#536159] dark:border-white/10 dark:bg-[#111916] dark:text-[#b2c0b7]">
          No achievements have been published yet.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {result.data.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                <Award size={20} aria-hidden="true" />
              </span>
              <p className="mt-5 font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {item.kind}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
              {item.issuer && (
                <p className="mt-1 text-sm text-[#536159] dark:text-[#b2c0b7]">
                  {item.issuer}
                </p>
              )}
              {item.description && (
                <p className="mt-4 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
                  {item.description}
                </p>
              )}
              {item.certificateUrl &&
                (item.certificateMimeType === "application/pdf" ? (
                  <div className="mt-5">
                    <object
                      data={item.certificateUrl}
                      type="application/pdf"
                      aria-label={`Certificate for ${item.title}`}
                      className="h-80 w-full rounded-xl border border-black/10 dark:border-white/10"
                    >
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        View certificate PDF
                      </a>
                    </object>
                  </div>
                ) : item.certificateMimeType?.startsWith("image/") ? (
                  <a
                    href={item.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
                  >
                    <Image
                      src={item.certificateUrl}
                      alt={`Certificate for ${item.title}`}
                      width={1200}
                      height={850}
                      unoptimized
                      className="h-auto max-h-96 w-full object-contain"
                    />
                    <span className="sr-only">Open certificate image</span>
                  </a>
                ) : null)}
              {item.issuedOn && (
                <p className="mt-4 text-xs text-[#68766e] dark:text-[#8f9d94]">
                  Issued {new Date(`${item.issuedOn}T00:00:00`).toLocaleDateString()}
                </p>
              )}
              {item.verificationUrl && (
                <a
                  href={item.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  Verify credential <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
