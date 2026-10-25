// src/app/resume/page.tsx

import {
  getPublicContact,
  getPublishedEducation,
  getPublishedExperience,
  getPublishedProfile,
  getPublishedProjects,
  getPublishedSkills,
} from "@/lib/cms/public-data";

export const metadata = {
  title: "Résumé",
  description: "Résumé overview of Jhunnel C. Carillo.",
};

type ResumeEntry = {
  label?: string;
  meta?: string;
  description?: string;
};

export default async function ResumePage() {
  const [
    projectsResult,
    skillsResult,
    experienceResult,
    educationResult,
    profileResult,
    contactResult,
  ] = await Promise.all([
    getPublishedProjects(),
    getPublishedSkills(),
    getPublishedExperience(),
    getPublishedEducation(),
    getPublishedProfile(),
    getPublicContact(),
  ]);
  const resumeSections: { title: string; content: ResumeEntry[] }[] = [
    {
      title: "PROJECTS",
      content: projectsResult.data.map((project) => ({
        label: `${project.name}: ${project.shortDescription}`,
      })),
    },
    {
      title: "SKILLS",
      content:
        skillsResult.mode === "database"
          ? skillsResult.data.map((skill) => ({
              label: `${skill.category}: ${skill.name}${skill.proficiencyLabel ? ` (${skill.proficiencyLabel})` : ""}`,
            }))
          : [
              { label: "Technical: Event Technical Support (Live Streaming/LED Wall), Hardware Maintenance, Basic PHP & MySQL." },
              { label: "Soft Skills: Administrative Evaluation, Customer Relations, Team Collaboration, and Adaptability." },
            ],
    },
    ...(experienceResult.mode === "database" && experienceResult.data.length > 0
      ? [{
          title: "EXPERIENCE",
          content: experienceResult.data.map((item) => ({
            label: `${item.jobTitle} — ${item.organization}${item.description ? `: ${item.description}` : ""}`,
          })),
        }]
      : []),
    ...(educationResult.mode === "database" && educationResult.data.length > 0
      ? [{
          title: "EDUCATION",
          content: educationResult.data.map((item) => ({
            label: `${item.qualification}, ${item.fieldOfStudy} — ${item.institution}`,
          })),
        }]
      : []),
  ];
  const profile =
    profileResult.mode === "database" ? profileResult.data : null;
  const contact =
    contactResult.mode === "database"
      ? contactResult.data
      : { email: "jhannellacarillo.official@gmail.com", phone: null, introduction: "" };

  return (
    <div className="min-h-screen bg-[#2f2f2f] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden border border-[#d8d8d8] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.2)]">
        <div className="grid min-h-[760px] md:grid-cols-[320px_1fr]">
          <aside className="border-r border-[#d9d9d9] bg-[#f4f4f4] p-6">
            <div className="border-2 border-[#b8d5f7] bg-white p-4 shadow-sm">
              <div className="flex min-h-[430px] flex-col justify-between border border-[#d9d9d9] bg-white p-4 text-[10px] text-gray-700">
                <div>
                  <p className="font-semibold uppercase tracking-[0.18em] text-black">{profile?.fullName || "Jhunnel C. Carillo"}</p>
                  <div className="mt-4 space-y-2 border-t border-[#eaeaea] pt-3">
                    <p>Student Assistant</p>
                    <p>MISITS Department</p>
                    <p>OLLCF</p>
                    <p>BSIT Student</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#eaeaea] pt-3">
                  <p>Contact</p>
                  {contact?.email && <p>{contact.email}</p>}
                  {contact?.phone && <p>{contact.phone}</p>}
                </div>
              </div>
            </div>
          </aside>

          <main className="bg-white px-8 py-7 sm:px-10">
            <div className="mb-6 h-px bg-black/70" />

            <div className="space-y-8">
              {resumeSections.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                    {section.title}
                  </h3>

                  <div className="h-px bg-black/70" />

                  <div className="space-y-3 text-[15px] leading-7 text-black">
                    {section.content.map((item, index) => (
                      <div key={`${section.title}-${index}`} className="flex items-start gap-3">
                        <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-black" />
                        <p>{item.label || item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}