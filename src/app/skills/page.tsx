import { getPublishedSkills } from "@/lib/cms/public-data";
import SkillsView from "./SkillsView";

export default async function SkillsPage() {
  const result = await getPublishedSkills();
  return (
    <SkillsView
      skills={result.mode === "database" ? result.data : null}
    />
  );
}
