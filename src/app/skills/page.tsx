// src/app/skills/page.tsx

export const metadata = {
  title: "Skills",
  description: "Technical skills, tools, and competencies of Jhunnel C. Carillo.",
};

export default function SkillsPage() {
  const practicalSkills = [
    { name: "Web Development", level: "PHP, HTML5, CSS3, JavaScript, Tailwind CSS" },
    { name: "Frameworks & Modern Tech", level: "Next.js, React, TypeScript" },
    { name: "Databases", level: "PostgreSQL, MySQL, Relational Schema Design" },
    { name: "Cross-Platform Mobile", level: "C# & .NET MAUI (MVVM Pattern)" },
    { name: "Hardware & IoT Fundamentals", level: "Arduino C++, Ultrasonic & Flame Sensors" },
  ];

  const ITSupportSkills = [
    "IT Laboratory Maintenance & Workstation Setup",
    "Enrollment Document & Data Validation",
    "Livestreaming Setup & LED Wall Controller Operation",
    "Technical Equipment Assistance for Events",
    "Computer Encoding & Data Entry Tasks",
  ];

  const currentlyLearning = [
    "Laravel E-commerce Architectures & Routing",
    "Advanced Next.js App Router & Server Components",
    "Figma UI/UX Prototyping & Layout Systems",
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          visitor@portfolio:~$ check --skills --all
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Technical Skills & Competencies</h1>
        <p className="mt-3 text-[#536159] dark:text-[#b2c0b7]">
          An honest breakdown of software development technologies I use and practical IT tasks I perform.
        </p>
      </div>

      <div className="space-y-10">
        {/* Development & Programming */}
        <section>
          <h2 className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-4">
            01 / Software & Web Development
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {practicalSkills.map((skill) => (
              <div
                key={skill.name}
                className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#111916]"
              >
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{skill.name}</h3>
                <p className="mt-2 font-mono text-xs text-emerald-600 dark:text-emerald-400">{skill.level}</p>
              </div>
            ))}
          </div>
        </section>

        {/* IT Operations & Support */}
        <section>
          <h2 className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-4">
            02 / IT Operations & Technical Support
          </h2>
          <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
              {ITSupportSkills.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-emerald-500">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Currently Learning */}
        <section>
          <h2 className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-4">
            03 / Currently Expanding
          </h2>
          <div className="rounded-xl border border-black/10 bg-[#edf1ed] p-6 dark:border-white/10 dark:bg-[#0e1511]">
            <ul className="space-y-2 font-mono text-xs text-[#536159] dark:text-[#b2c0b7]">
              {currentlyLearning.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-amber-500">[learning]</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}