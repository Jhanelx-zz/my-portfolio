// src/app/contact/page.tsx

export const metadata = {
  title: "Contact",
  description: "Get in touch with Jhunnel C. Carillo for OJT opportunities.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Terminal Command Header */}
      <div className="mb-10">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          visitor@portfolio:~$ ping --contact
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Get In Touch</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#536159] dark:text-[#b2c0b7]">
          I am actively preparing for On-the-Job Training (OJT) opportunities. If you have an open position or inquiries regarding my projects, skills, or background, feel free to reach out!
        </p>
      </div>

      {/* Grid Cards Matching About/Skills Style */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Primary Info */}
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]">
          <h2 className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-4">
            01 / Personal Information
          </h2>
          <div className="space-y-4 text-sm text-[#536159] dark:text-[#b2c0b7]">
            <div className="border-b border-black/5 dark:border-white/5 pb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">FULL NAME</p>
              <p className="font-bold text-gray-900 dark:text-gray-100 mt-1">Jhunnel C. Carillo</p>
            </div>
            <div className="border-b border-black/5 dark:border-white/5 pb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">STATUS</p>
              <p className="font-bold text-gray-900 dark:text-gray-100 mt-1">Graduating BSIT Student • OJT Applicant</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">INSTITUTION</p>
              <p className="font-bold text-gray-900 dark:text-gray-100 mt-1">Our Lady of Lourdes College Foundation (OLLCF)</p>
            </div>
          </div>
        </div>

        {/* Card 2: Professional Profiles */}
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111916]">
          <h2 className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-4">
            02 / Professional Profiles
          </h2>
          <p className="text-sm text-[#536159] dark:text-[#b2c0b7] mb-4">
            Connect with me on professional networks or explore my code repositories:
          </p>
          <div className="space-y-3 font-mono text-sm">
            <div className="rounded-lg border border-black/10 bg-[#edf1ed] p-3 dark:border-white/10 dark:bg-[#0e1511]">
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">// GitHub Repository</span>
              <a 
                href="https://github.com/jhunnel-carillo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium flex items-center gap-2"
              >
                <span>&gt; github.com/jhunnel-carillo</span>
              </a>
            </div>
            <div className="rounded-lg border border-black/10 bg-[#edf1ed] p-3 dark:border-white/10 dark:bg-[#0e1511]">
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">// LinkedIn Profile</span>
              <a 
                href="https://linkedin.com/in/jhunnel-carillo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium flex items-center gap-2"
              >
                <span>&gt; linkedin.com/in/jhunnel-carillo</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Footer Prompt */}
      <div className="mt-12 rounded-xl border border-black/10 bg-[#edf1ed] p-6 dark:border-white/10 dark:bg-[#0e1511]">
        <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
          visitor@portfolio:~$ echo &quot;Looking forward to connecting with your team!&quot;
        </p>
      </div>
    </div>
  );
}