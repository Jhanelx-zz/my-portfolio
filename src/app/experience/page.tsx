// src/app/experience/page.tsx

export const metadata = {
  title: "Experience",
  description: "Student Assistant experience and responsibilities of Jhunnel C. Carillo.",
};

export default function ExperiencePage() {
  const experiences = [
    {
      role: "Student Assistant",
      department: "MISITS Department",
      institution: "Our Lady of Lourdes College Foundation",
      period: "2025 — Present",
      tasks: [
        "Assisted in validating freshman enrollment requirements and documentation.",
        "Provided technical support and setup for college events, including live streaming operations.",
        "Operated LED wall control setups during institutional programs and ceremonies.",
        "Supported technical teams during automated tabulation for campus competitions.",
        "Maintained and cleaned IT laboratory computers and technical equipment.",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          visitor@portfolio:~$ history --experience
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Practical Experience</h1>
        <p className="mt-3 text-[#536159] dark:text-[#b2c0b7]">
          Hands-on roles and campus responsibilities where I have applied my IT skills.
        </p>
      </div>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <article
            key={index}
            className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-4 dark:border-white/10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{exp.role}</h2>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {exp.department} • {exp.institution}
                </p>
              </div>
              <span className="font-mono text-xs rounded-full border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                {exp.period}
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-[#536159] dark:text-[#b2c0b7]">
              {exp.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-6">
                  <span className="font-mono text-emerald-500">&gt;</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}