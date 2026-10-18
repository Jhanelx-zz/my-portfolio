// src/app/about/page.tsx

export const metadata = {
  title: "About",
  description: "Learn more about Jhunnel C. Carillo, BSIT student and aspiring IT professional.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Terminal Command Header */}
      <div className="mb-10">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          visitor@portfolio:~$ cat ./about_me.txt
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">About Me</h1>
      </div>

      <div className="space-y-8 text-[#536159] dark:text-[#b2c0b7] leading-8">
        {/* Bio */}
        <section className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Educational Background & Focus
          </h2>
          <p>
            I am a graduating <strong className="text-gray-900 dark:text-gray-100">Bachelor of Science in Information Technology (BSIT)</strong> student 
            at <strong className="text-gray-900 dark:text-gray-100">Our Lady of Lourdes College Foundation (OLLCF)</strong> in Daet, Camarines Norte. 
            My primary interest lies in web development, database management, and hands-on IT operations.
          </p>
        </section>

        {/* Practical Journey */}
        <section className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Learning Journey & Practical Work
          </h2>
          <p>
            Throughout my academic journey, I have focused on understanding full-stack web fundamentals using technologies like PHP, PostgreSQL, MySQL, 
            JavaScript, Next.js, and Tailwind CSS. Beyond web development, I have gained valuable practical experience serving as a Student Assistant at the MISITS Department, where I assist with IT laboratory maintenance, equipment setups, livestreaming operations, and document validation.
          </p>
        </section>

        {/* OJT Objectives */}
        <section className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111916]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Goals for On-the-Job Training (OJT)
          </h2>
          <p>
            My objective for my upcoming OJT application is to contribute to real-world IT or software projects, adapt quickly to professional production workflows, 
            and collaborate with senior developers and technical teams to deepen my industry knowledge.
          </p>
        </section>
      </div>
    </div>
  );
}