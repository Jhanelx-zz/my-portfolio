// src/app/experience/page.tsx

import { BriefcaseBusiness } from "lucide-react";
import {
  getPublishedAchievements,
  getPublishedEducation,
  getPublishedExperience,
} from "@/lib/cms/public-data";

export const metadata = {
  title: "Experience",
  description: "Practical experience and responsibilities of Jhunnel C. Carillo",
};

export default async function ExperiencePage() {
  const [experienceResult, educationResult, achievementResult] =
    await Promise.all([
      getPublishedExperience(),
      getPublishedEducation(),
      getPublishedAchievements(),
    ]);
  const experiences =
    experienceResult.mode === "database"
      ? experienceResult.data
      : [
          {
            id: "student-assistant",
            jobTitle: "Student Assistant",
            organization:
              "MISITS Department · Our Lady of Lourdes College Foundation (OLLCF)",
            employmentType: "Student role",
            location: "Daet, Camarines Norte",
            startDate: "2025-01-01",
            endDate: null,
            isCurrent: true,
            description:
              "Supporting campus IT, computer labs, college events, and day-to-day technical needs.",
            responsibilities: [
              "Maintaining and inspecting computer laboratory equipment and network connections for daily student use.",
              "Setting up audio, visual, and livestream LED wall equipment for official college assemblies and events.",
              "Assisting enrollment officers with document processing, student records verification, and database entries.",
              "Providing hardware and software troubleshooting for campus faculty and students.",
            ],
            technologies: [],
            accomplishments: [],
            linkUrl: null,
          },
          {
            id: "project-development",
            jobTitle: "Custom Software & Web Application Developer",
            organization: "Mendoza's Store · Barangay Alawihao Youth Council",
            employmentType: "Academic & freelance",
            location: "",
            startDate: null,
            endDate: null,
            isCurrent: false,
            description: "",
            responsibilities: [
              "Designed database schemas and built PHP/PostgreSQL backend logic for Mendoza's Feeds and Rice Store POS system.",
              "Built the iSKalawihao youth budget portal to upload financial documents and present transparent project funding charts.",
              "Programmed Arduino microcontrollers with ultrasonic and flame sensors for automated hardware prototypes.",
            ],
            technologies: [],
            accomplishments: [],
            linkUrl: null,
          },
        ];
  const education =
    educationResult.mode === "database" ? educationResult.data : [];
  const achievements =
    achievementResult.mode === "database" ? achievementResult.data : [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10">
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Practical Experience</h1>
        <p className="mt-4 text-lg text-[#536159] dark:text-[#b2c0b7]">
          Hands-on technical roles and responsibilities in IT infrastructure, campus support, and system operations.
        </p>
      </div>

      <div className="space-y-6">
        {experiences.map((experience) => (
          <article key={experience.id} className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111916]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <BriefcaseBusiness size={14} aria-hidden="true" />
                {experience.startDate ? new Date(`${experience.startDate}T00:00:00`).getFullYear() : "—"} — {experience.isCurrent ? "PRESENT" : experience.endDate ? new Date(`${experience.endDate}T00:00:00`).getFullYear() : "—"}
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-600 dark:text-emerald-300">
                {experience.employmentType || "Experience"}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold">{experience.jobTitle}</h2>
            <p className="mt-1 font-mono text-sm text-[#536159] dark:text-[#b2c0b7]">
              {experience.organization}{experience.location ? ` · ${experience.location}` : ""}
            </p>
            {experience.description && <p className="mt-4 text-sm leading-7 text-[#536159] dark:text-[#b2c0b7]">{experience.description}</p>}
            {experience.responsibilities.length > 0 && (
              <ul className="mt-6 list-inside list-disc space-y-3 text-sm leading-7 text-[#536159] dark:text-[#b2c0b7]">
                {experience.responsibilities.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </article>
        ))}
      </div>

      {education.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold">Education</h2>
          <div className="space-y-4">
            {education.map((item) => (
              <article key={item.id} className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
                <h3 className="text-lg font-semibold">{item.qualification}</h3>
                <p className="mt-1 text-sm text-[#536159] dark:text-[#b2c0b7]">{item.institution} · {item.fieldOfStudy}</p>
                {item.details && <p className="mt-3 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">{item.details}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold">Achievements &amp; Certifications</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((item) => (
              <article key={item.id} className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
                <p className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">{item.kind}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-[#536159] dark:text-[#b2c0b7]">{item.issuer}</p>
                {item.description && <p className="mt-3 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">{item.description}</p>}
                {item.verificationUrl && <a className="mt-3 inline-block text-sm text-emerald-700 underline dark:text-emerald-400" href={item.verificationUrl} target="_blank" rel="noopener noreferrer">Verify credential</a>}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}