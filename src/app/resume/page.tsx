// src/app/resume/page.tsx

export const metadata = {
  title: "Résumé",
  description: "Résumé overview of Jhunnel C. Carillo.",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
            visitor@portfolio:~$ view ./resume.pdf
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Online Résumé</h1>
        </div>

        <a
          href="/files/resume.pdf"
          download
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 font-mono text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-[#07110b] dark:hover:bg-emerald-400"
        >
          <span>Download PDF</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111916] space-y-8">
        {/* Header Summary */}
        <div className="border-b border-black/10 pb-6 dark:border-white/10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Jhunnel C. Carillo</h2>
          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
            Bachelor of Science in Information Technology (BSIT) Student
          </p>
          <p className="mt-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
            Our Lady of Lourdes College Foundation • Paracale / Daet, Camarines Norte
          </p>
        </div>

        {/* Education */}
        <section>
          <h3 className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
            Education
          </h3>
          <p className="font-bold text-gray-900 dark:text-gray-100">BS in Information Technology</p>
          <p className="text-sm text-[#536159] dark:text-[#b2c0b7]">Our Lady of Lourdes College Foundation (2023 – Present)</p>
        </section>

        {/* Experience */}
        <section>
          <h3 className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
            Experience
          </h3>
          <p className="font-bold text-gray-900 dark:text-gray-100">Student Assistant — MISITS Department</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">2025 – Present</p>
          <p className="mt-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
            Technical support for campus events, enrollment requirement validation, IT lab computer maintenance, and livestreaming operations.
          </p>
        </section>

        {/* Key Competencies */}
        <section>
          <h3 className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
            Key Competencies
          </h3>
          <p className="text-sm text-[#536159] dark:text-[#b2c0b7]">
            Web Development (PHP, Next.js, HTML, CSS, JavaScript, Tailwind), Databases (PostgreSQL, MySQL), .NET MAUI / C#, Basic Hardware Programming (Arduino).
          </p>
        </section>
      </div>
    </div>
  );
}