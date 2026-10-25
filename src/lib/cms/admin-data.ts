import "server-only";

import { requirePortfolioAdmin } from "@/lib/supabase/admin";
import type { CmsRecord, CmsSection } from "./sections";

export interface MediaOption {
  id: string;
  bucket_id: "portfolio-public" | "portfolio-private";
  object_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  is_public: boolean;
  alt_text: string | null;
}

export interface DashboardSummary {
  counts: {
    projects: number;
    skills: number;
    achievements: number;
    experience: number;
    education: number;
  };
  recent: { id: string; label: string; title: string; updatedAt: string }[];
}

function toRecord(values: Record<string, string | number | boolean | null | string[]>): CmsRecord {
  return values;
}

function throwQueryError(message: string, error: { message: string }): never {
  console.error(message, error);
  throw new Error(message);
}

export async function getAdminMediaOptions(): Promise<MediaOption[]> {
  const { supabase } = await requirePortfolioAdmin();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, bucket_id, object_path, original_name, mime_type, size_bytes, is_public, alt_text")
    .order("created_at", { ascending: false });

  if (error) throwQueryError("Unable to load media library.", error);
  return data;
}

export async function getAdminContent(section: CmsSection): Promise<CmsRecord[]> {
  const { supabase } = await requirePortfolioAdmin();

  switch (section) {
    case "profile": {
      const { data, error } = await supabase
        .from("portfolio_profile")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throwQueryError("Unable to load the profile.", error);
      if (!data) return [];
      return [
        toRecord({
          full_name: data.full_name,
          display_name: data.display_name,
          professional_title: data.professional_title,
          hero_intro: data.hero_intro,
          biography: data.biography,
          professional_summary: data.professional_summary,
          location: data.location,
          interests: data.interests,
          career_goals: data.career_goals,
          avatar_media_id: data.avatar_media_id,
          resume_media_id: data.resume_media_id,
          is_published: data.is_published,
          updated_at: data.updated_at,
        }),
      ];
    }
    case "skills": {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order")
        .order("updated_at", { ascending: false });
      if (error) throwQueryError("Unable to load skills.", error);
      return data.map((row) =>
        toRecord({
          id: row.id,
          category: row.category,
          name: row.name,
          description: row.description,
          proficiency_label: row.proficiency_label,
          display_order: row.display_order,
          is_published: row.is_published,
          updated_at: row.updated_at,
        }),
      );
    }
    case "projects": {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order")
        .order("updated_at", { ascending: false });
      if (error) throwQueryError("Unable to load projects.", error);

      const projectIds = projects.map((project) => project.id);
      const { data: galleries, error: galleryError } =
        projectIds.length > 0
          ? await supabase
              .from("project_gallery")
              .select("project_id, media_id, legacy_url, caption")
              .in("project_id", projectIds)
              .order("display_order")
          : { data: [], error: null };
      if (galleryError) throwQueryError("Unable to load project galleries.", galleryError);

      return projects.map((row) =>
        toRecord({
          id: row.id,
          slug: row.slug,
          name: row.name,
          category: row.category,
          status: row.status,
          short_description: row.short_description,
          full_description: row.full_description,
          problem: row.problem,
          solution: row.solution,
          role: row.role,
          technologies: row.technologies,
          features: row.features,
          lessons_learned: row.lessons_learned,
          project_date: row.project_date,
          github_url: row.github_url,
          demo_url: row.demo_url,
          documentation_url: row.documentation_url,
          cover_media_id: row.cover_media_id,
          gallery_entries: galleries
            .filter((gallery) => gallery.project_id === row.id)
            .map((gallery) =>
              gallery.media_id
                ? `media:${gallery.media_id}`
                : `legacy:${gallery.legacy_url}`,
            ),
          gallery_captions: galleries
            .filter((gallery) => gallery.project_id === row.id)
            .map((gallery) => gallery.caption),
          is_featured: row.is_featured,
          is_published: row.is_published,
          display_order: row.display_order,
          updated_at: row.updated_at,
        }),
      );
    }
    case "achievements": {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("display_order")
        .order("updated_at", { ascending: false });
      if (error) throwQueryError("Unable to load achievements and certifications.", error);
      return data.map((row) =>
        toRecord({
          id: row.id,
          kind: row.kind,
          title: row.title,
          description: row.description,
          issuer: row.issuer,
          issued_on: row.issued_on,
          expires_on: row.expires_on,
          verification_url: row.verification_url,
          certificate_media_id: row.certificate_media_id,
          is_published: row.is_published,
          display_order: row.display_order,
          updated_at: row.updated_at,
        }),
      );
    }
    case "experience": {
      const { data, error } = await supabase
        .from("work_experience")
        .select("*")
        .order("display_order")
        .order("updated_at", { ascending: false });
      if (error) throwQueryError("Unable to load work experience.", error);
      return data.map((row) =>
        toRecord({
          id: row.id,
          job_title: row.job_title,
          organization: row.organization,
          employment_type: row.employment_type,
          location: row.location,
          start_date: row.start_date,
          end_date: row.end_date,
          is_current: row.is_current,
          description: row.description,
          responsibilities: row.responsibilities,
          technologies: row.technologies,
          accomplishments: row.accomplishments,
          link_url: row.link_url,
          is_published: row.is_published,
          display_order: row.display_order,
          updated_at: row.updated_at,
        }),
      );
    }
    case "education": {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order")
        .order("updated_at", { ascending: false });
      if (error) throwQueryError("Unable to load education.", error);
      return data.map((row) =>
        toRecord({
          id: row.id,
          institution: row.institution,
          qualification: row.qualification,
          field_of_study: row.field_of_study,
          start_date: row.start_date,
          end_date: row.end_date,
          is_current: row.is_current,
          details: row.details,
          is_published: row.is_published,
          display_order: row.display_order,
          updated_at: row.updated_at,
        }),
      );
    }
    case "contact": {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throwQueryError("Unable to load contact settings.", error);
      if (!data) return [];
      return [
        toRecord({
          introduction: data.introduction,
          email: data.email,
          email_is_public: data.email_is_public,
          phone: data.phone,
          phone_is_public: data.phone_is_public,
          updated_at: data.updated_at,
        }),
      ];
    }
    case "socials": {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order")
        .order("updated_at", { ascending: false });
      if (error) throwQueryError("Unable to load social links.", error);
      return data.map((row) =>
        toRecord({
          id: row.id,
          platform: row.platform,
          label: row.label,
          url: row.url,
          is_enabled: row.is_enabled,
          display_order: row.display_order,
          updated_at: row.updated_at,
        }),
      );
    }
    case "creative-works": {
      const { data, error } = await supabase
        .from("creative_works")
        .select("*")
        .order("display_order")
        .order("updated_at", { ascending: false });
      if (error) throwQueryError("Unable to load design and creative works.", error);
      return data.map((row) =>
        toRecord({
          id: row.id,
          title: row.title,
          category: row.category,
          description: row.description,
          media_type: row.media_type,
          image_media_id: row.image_media_id,
          legacy_image_url: row.legacy_image_url,
          image_alt: row.image_alt,
          video_url: row.video_url,
          show_creator_credit: row.show_creator_credit,
          creator_credit: row.creator_credit,
          display_order: row.display_order,
          is_published: row.is_published,
          updated_at: row.updated_at,
        }),
      );
    }
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { supabase } = await requirePortfolioAdmin();
  const [projects, skills, achievements, experience, education, recentProjects, recentSkills, recentAchievements, recentExperience, recentEducation] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("achievements").select("id", { count: "exact", head: true }),
      supabase.from("work_experience").select("id", { count: "exact", head: true }),
      supabase.from("education").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id, name, updated_at").order("updated_at", { ascending: false }).limit(5),
      supabase.from("skills").select("id, name, updated_at").order("updated_at", { ascending: false }).limit(5),
      supabase.from("achievements").select("id, title, updated_at").order("updated_at", { ascending: false }).limit(5),
      supabase.from("work_experience").select("id, job_title, updated_at").order("updated_at", { ascending: false }).limit(5),
      supabase.from("education").select("id, qualification, updated_at").order("updated_at", { ascending: false }).limit(5),
    ]);

  const queryErrors = [
    projects.error,
    skills.error,
    achievements.error,
    experience.error,
    education.error,
    recentProjects.error,
    recentSkills.error,
    recentAchievements.error,
    recentExperience.error,
    recentEducation.error,
  ];
  const failedQuery = queryErrors.find((error) => error !== null);
  if (failedQuery) throwQueryError("Unable to load dashboard statistics.", failedQuery);
  if (
    !recentProjects.data ||
    !recentSkills.data ||
    !recentAchievements.data ||
    !recentExperience.data ||
    !recentEducation.data
  ) {
    throw new Error("Dashboard content queries returned no result.");
  }

  const recent = [
    ...recentProjects.data.map((row) => ({
      id: row.id,
      label: "Project",
      title: row.name,
      updatedAt: row.updated_at,
    })),
    ...recentSkills.data.map((row) => ({
      id: row.id,
      label: "Skill",
      title: row.name,
      updatedAt: row.updated_at,
    })),
    ...recentAchievements.data.map((row) => ({
      id: row.id,
      label: "Achievement",
      title: row.title,
      updatedAt: row.updated_at,
    })),
    ...recentExperience.data.map((row) => ({
      id: row.id,
      label: "Experience",
      title: row.job_title,
      updatedAt: row.updated_at,
    })),
    ...recentEducation.data.map((row) => ({
      id: row.id,
      label: "Education",
      title: row.qualification,
      updatedAt: row.updated_at,
    })),
  ]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);

  return {
    counts: {
      projects: projects.count ?? 0,
      skills: skills.count ?? 0,
      achievements: achievements.count ?? 0,
      experience: experience.count ?? 0,
      education: education.count ?? 0,
    },
    recent,
  };
}
