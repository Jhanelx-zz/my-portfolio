"use client";

import { motion } from "framer-motion";
import type { PublicSkill } from "@/lib/cms/public-data";
import {
  BookOpen,
  Code2,
  Database,
  Palette,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SkillCategory = {
  category: string;
  description: string;
  focus: string;
  skills: string[];
  icon: LucideIcon;
};

const skillCategories: SkillCategory[] = [
  {
    category: "Programming & Web Foundations",
    description:
      "I practice coding through coursework and personal projects, using AI as a learning aid when I need guidance.",
    icon: Code2,
    focus: "Building confidence",
    skills: [
      "Basic programming with JavaScript, TypeScript, and PHP",
      "HTML, CSS, and Tailwind CSS for page structure and styling",
      "Exploring React and Next.js website layouts",
      "Learning by reviewing, testing, and improving code with AI assistance",
    ],
  },
  {
    category: "Databases & Data",
    description:
      "Foundational experience working with data for academic and practical application projects.",
    icon: Database,
    focus: "Practicing fundamentals",
    skills: [
      "Basic SQL and relational database concepts",
      "Exposure to MySQL and PostgreSQL",
      "Organizing application data and understanding table relationships",
    ],
  },
  {
    category: "IT Support & Campus Operations",
    description:
      "Hands-on experience developed through my Student Assistant role with the MISITS Department.",
    icon: Wrench,
    focus: "Practical experience",
    skills: [
      "Assisting with computer laboratory maintenance and troubleshooting",
      "Helping set up audio-visual equipment and event livestreams",
      "Supporting document processing and student data verification",
      "Learning through day-to-day technical support tasks",
    ],
  },
  {
    category: "Creative & UI Exploration",
    description:
      "I enjoy trying visual ideas and multimedia work alongside my IT studies, and continue to build these skills through practice.",
    icon: Palette,
    focus: "Exploring and creating",
    skills: [
      "Exploring website layouts and different interface ideas",
      "Basic graphic design and digital editing",
      "Creating event materials, certificates, and visual layouts",
      "Trying multimedia edits, audio, and visual transitions",
    ],
  },
];

export default function SkillsView({ skills }: { skills: PublicSkill[] | null }) {
  const categoryIcon = (category: string): LucideIcon => {
    const normalizedCategory = category.toLowerCase();
    if (normalizedCategory.includes("creative")) return Palette;
    if (normalizedCategory.includes("data")) return Database;
    if (normalizedCategory.includes("support")) return Wrench;
    return Code2;
  };
  const categories: SkillCategory[] = skills
    ? Array.from(
        skills.reduce((groups, skill) => {
          const group = groups.get(skill.category) ?? {
            category: skill.category,
            description: "",
            focus: skill.proficiencyLabel ?? "Developing through practice",
            skills: [],
            icon: categoryIcon(skill.category),
          };
          if (!group.description && skill.description) group.description = skill.description;
          group.skills.push(skill.name);
          groups.set(skill.category, group);
          return groups;
        }, new Map<string, SkillCategory>()),
      ).map(([, group]) => group)
    : skillCategories;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10">
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Skills &amp; Learning Journey
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#536159] dark:text-[#b2c0b7]">
          I am a BSIT student building my skills step by step. I have a
          foundation in basic coding and enjoy exploring website layouts and
          creative ideas. I use AI as a learning aid, and I know I still have
          plenty to practice as I gain experience.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((group, idx) => {
          const Icon = group.icon;

          return (
            <motion.article
              key={group.category}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-700/15 bg-emerald-700/5 text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/5 dark:text-emerald-400">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="rounded-full border border-emerald-700/15 bg-emerald-700/5 px-3 py-1 font-mono text-[10px] text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/5 dark:text-emerald-300">
                  {group.focus}
                </span>
              </div>

              <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                0{idx + 1} / {group.category}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
                {group.description}
              </p>

              <ul className="mt-5 space-y-3 border-t border-black/5 pt-4 dark:border-white/5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex gap-3 text-sm leading-6 text-[#39473f] dark:text-[#d0dbd4]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500"
                    />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-emerald-700/15 bg-emerald-700/5 p-6 sm:p-8 dark:border-emerald-400/15 dark:bg-emerald-400/5">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-emerald-700 dark:bg-white/5 dark:text-emerald-400">
            <BookOpen size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              How I approach learning
            </p>
            <h2 className="mt-2 text-xl font-bold">
              Curious, adaptable, and improving through practice
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#536159] dark:text-[#b2c0b7]">
              I am willing to ask questions, learn unfamiliar tools, and try
              ideas outside my comfort zone. AI can help me get unstuck, but I
              aim to understand what I build, test it, and keep improving. I am
              looking forward to learning from hands-on OJT experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
