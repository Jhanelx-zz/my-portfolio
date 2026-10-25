import { notFound } from "next/navigation";
import { getAdminContent, getAdminMediaOptions } from "@/lib/cms/admin-data";
import { isCmsSection } from "@/lib/cms/sections";
import ContentManager from "../ContentManager";

const availableSections = new Set([
  "profile",
  "skills",
  "projects",
  "achievements",
  "experience",
  "education",
  "contact",
  "socials",
  "creative-works",
]);

interface AdminSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  const { section } = await params;

  if (!availableSections.has(section) || !isCmsSection(section)) {
    notFound();
  }

  const [records, mediaOptions] = await Promise.all([
    getAdminContent(section),
    ["profile", "projects", "achievements", "creative-works"].includes(section)
      ? getAdminMediaOptions()
      : Promise.resolve([]),
  ]);

  return (
    <ContentManager
      section={section}
      records={records}
      mediaOptions={mediaOptions}
    />
  );
}
