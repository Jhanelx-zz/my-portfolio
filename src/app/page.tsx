import { Suspense } from "react";
import HomeView from "./HomeView";
import {
  getPublishedExperience,
  getPublishedProfile,
  getPublishedProjects,
  getPublishedSkills,
} from "@/lib/cms/public-data";

function HomeLoading() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-6xl px-6 py-16">
      <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
        Loading portfolio...
      </p>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [projectsResult, profileResult, experienceResult, skillsResult] = await Promise.all([
    getPublishedProjects(),
    getPublishedProfile(),
    getPublishedExperience(),
    getPublishedSkills(),
  ]);

  return (
    <HomeView
      projects={projectsResult.data}
      profile={profileResult.mode === "database" ? profileResult.data : null}
      experiences={
        experienceResult.mode === "database" ? experienceResult.data : null
      }
      skills={
        skillsResult.mode === "database"
          ? skillsResult.data.map((skill) => skill.name)
          : null
      }
    />
  );
}
