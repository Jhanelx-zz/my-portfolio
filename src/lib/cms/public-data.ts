import "server-only";

import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { projectsData, type Project, type Screenshot } from "@/app/data/projects";
import {
  designWorks,
  type DesignWork,
} from "@/app/data/design-works";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

export type PublicSource<T> =
  | { mode: "static"; data: T }
  | { mode: "database"; data: T };

export interface PublicProfile {
  fullName: string;
  displayName: string;
  professionalTitle: string;
  heroIntro: string;
  biography: string;
  professionalSummary: string;
  location: string;
  interests: string[];
  careerGoals: string[];
  avatarUrl: string | null;
  resumeUrl: string | null;
}

export interface PublicSkill {
  id: string;
  category: string;
  name: string;
  description: string;
  proficiencyLabel: string | null;
  displayOrder: number;
}

export interface PublicExperience {
  id: string;
  jobTitle: string;
  organization: string;
  employmentType: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  accomplishments: string[];
  linkUrl: string | null;
}

export interface PublicEducation {
  id: string;
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  details: string;
}

export interface PublicAchievement {
  id: string;
  kind: string;
  title: string;
  description: string;
  issuer: string;
  issuedOn: string | null;
  expiresOn: string | null;
  verificationUrl: string | null;
  certificateUrl: string | null;
  certificateMimeType: string | null;
}

export interface PublicContact {
  introduction: string;
  email: string | null;
  phone: string | null;
}

export interface PublicSocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

function createPublicClient() {
  const config = getSupabasePublicConfig();
  if (!config) throw new Error("Supabase is not configured.");

  return createClient<Database>(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

const legacyGallerySchema = z.array(
  z.object({
    url: z.string().regex(/^\/images\/[A-Za-z0-9._/-]+$/),
    caption: z.string(),
  }),
);

async function getPublishedProjectsFromDatabase(): Promise<Project[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-projects");

  const supabase = createPublicClient();
  const { data: rows, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Unable to load published projects.", error);
    throw new Error("Published projects could not be loaded.");
  }

  if (rows.length === 0) return [];

  const projectIds = rows.map((row) => row.id);
  const mediaIds = [
    ...rows.flatMap((row) => (row.cover_media_id ? [row.cover_media_id] : [])),
  ];
  const { data: galleryRows, error: galleryError } = await supabase
    .from("project_gallery")
    .select("project_id, media_id, legacy_url, caption, display_order")
    .in("project_id", projectIds)
    .order("display_order");
  if (galleryError) {
    console.error("Unable to load published project galleries.", galleryError);
    throw new Error("Project galleries could not be loaded.");
  }
  mediaIds.push(
    ...galleryRows.flatMap((row) => (row.media_id ? [row.media_id] : [])),
  );

  const uniqueMediaIds = [...new Set(mediaIds)];
  const { data: mediaRows, error: mediaError } =
    uniqueMediaIds.length > 0
      ? await supabase
          .from("media_assets")
          .select("id, bucket_id, object_path, original_name, alt_text")
          .in("id", uniqueMediaIds)
      : { data: [], error: null };
  if (mediaError) {
    console.error("Unable to load published project media.", mediaError);
    throw new Error("Project media could not be loaded.");
  }

  const assetUrls = new Map(
    mediaRows.map((asset) => [
      asset.id,
      supabase.storage.from(asset.bucket_id).getPublicUrl(asset.object_path).data.publicUrl,
    ]),
  );
  const mediaById = new Map(mediaRows.map((asset) => [asset.id, asset]));

  return rows.map((row) => {
    const legacyGallery = legacyGallerySchema.safeParse(row.legacy_gallery);
    if (!legacyGallery.success) {
      console.error("A project has invalid legacy gallery data.", row.id);
      throw new Error("A project gallery contains invalid data.");
    }

    const gallery: Screenshot[] = galleryRows
      .filter((image) => image.project_id === row.id)
      .flatMap((image) => {
        if (image.legacy_url) {
          return [{ url: image.legacy_url, caption: image.caption }];
        }
        if (!image.media_id) return [];
        const asset = mediaById.get(image.media_id);
        const url = assetUrls.get(image.media_id);
        return asset && url
          ? [{ url, caption: image.caption || asset.alt_text || asset.original_name }]
          : [];
      });
    const screenshots =
      gallery.length > 0
        ? gallery
        : legacyGallery.data.map((image) => ({
            url: image.url,
            caption: image.caption,
          }));
    const coverImage =
      (row.cover_media_id ? assetUrls.get(row.cover_media_id) : undefined) ??
      row.legacy_cover_url;

    return {
      slug: row.slug,
      name: row.name,
      category: row.category,
      status: row.status,
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      problem: row.problem,
      solution: row.solution,
      role: row.role,
      stack: row.technologies,
      features: row.features,
      lessonsLearned: row.lessons_learned,
      coverImage,
      screenshots,
      ...(row.github_url ? { githubUrl: row.github_url } : {}),
      ...(row.demo_url ? { demoUrl: row.demo_url } : {}),
      isFeatured: row.is_featured,
    };
  });
}

async function getPublishedProfileFromDatabase(): Promise<PublicProfile | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-profile");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("portfolio_profile")
    .select("*")
    .eq("singleton", true)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.error("Unable to load the published profile.", error);
    throw new Error("Published profile could not be loaded.");
  }
  if (!data) return null;

  const imageIds = [
    ...(data.avatar_media_id ? [data.avatar_media_id] : []),
    ...(data.resume_media_id ? [data.resume_media_id] : []),
  ];
  const { data: media, error: mediaError } =
    imageIds.length > 0
      ? await supabase
          .from("media_assets")
          .select("id, bucket_id, object_path")
          .in("id", imageIds)
      : { data: [], error: null };
  if (mediaError) {
    console.error("Unable to load published profile media.", mediaError);
    throw new Error("Profile media could not be loaded.");
  }
  const mediaUrls = new Map(
    media.map((asset) => [
      asset.id,
      supabase.storage.from(asset.bucket_id).getPublicUrl(asset.object_path).data.publicUrl,
    ]),
  );

  return {
    fullName: data.full_name,
    displayName: data.display_name,
    professionalTitle: data.professional_title,
    heroIntro: data.hero_intro,
    biography: data.biography,
    professionalSummary: data.professional_summary,
    location: data.location,
    interests: data.interests,
    careerGoals: data.career_goals,
    avatarUrl:
      (data.avatar_media_id ? mediaUrls.get(data.avatar_media_id) : undefined) ??
      data.legacy_avatar_url,
    resumeUrl:
      (data.resume_media_id ? mediaUrls.get(data.resume_media_id) : undefined) ??
      data.legacy_resume_url,
  };
}

async function getPublishedSkillsFromDatabase(): Promise<PublicSkill[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-skills");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select("id, category, name, description, proficiency_label, display_order")
    .eq("is_published", true)
    .order("display_order")
    .order("name");
  if (error) {
    console.error("Unable to load published skills.", error);
    throw new Error("Published skills could not be loaded.");
  }
  return data.map((skill) => ({
    id: skill.id,
    category: skill.category,
    name: skill.name,
    description: skill.description,
    proficiencyLabel: skill.proficiency_label,
    displayOrder: skill.display_order,
  }));
}

async function getPublishedExperienceFromDatabase(): Promise<PublicExperience[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-experience");

  const { data, error } = await createPublicClient()
    .from("work_experience")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("start_date", { ascending: false });
  if (error) {
    console.error("Unable to load published work experience.", error);
    throw new Error("Published work experience could not be loaded.");
  }
  return data.map((item) => ({
    id: item.id,
    jobTitle: item.job_title,
    organization: item.organization,
    employmentType: item.employment_type,
    location: item.location,
    startDate: item.start_date,
    endDate: item.end_date,
    isCurrent: item.is_current,
    description: item.description,
    responsibilities: item.responsibilities,
    technologies: item.technologies,
    accomplishments: item.accomplishments,
    linkUrl: item.link_url,
  }));
}

async function getPublishedEducationFromDatabase(): Promise<PublicEducation[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-education");

  const { data, error } = await createPublicClient()
    .from("education")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("start_date", { ascending: false });
  if (error) {
    console.error("Unable to load published education.", error);
    throw new Error("Published education could not be loaded.");
  }
  return data.map((item) => ({
    id: item.id,
    institution: item.institution,
    qualification: item.qualification,
    fieldOfStudy: item.field_of_study,
    startDate: item.start_date,
    endDate: item.end_date,
    isCurrent: item.is_current,
    details: item.details,
  }));
}

async function getPublishedAchievementsFromDatabase(): Promise<PublicAchievement[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-achievements");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("id, kind, title, description, issuer, issued_on, expires_on, verification_url, certificate_media_id")
    .eq("is_published", true)
    .order("display_order")
    .order("issued_on", { ascending: false });
  if (error) {
    console.error("Unable to load published achievements.", error);
    throw new Error("Published achievements could not be loaded.");
  }
  const mediaIds = data.flatMap((item) =>
    item.certificate_media_id ? [item.certificate_media_id] : [],
  );
  const { data: media, error: mediaError } =
    mediaIds.length > 0
      ? await supabase
          .from("media_assets")
          .select("id, bucket_id, object_path, mime_type")
          .in("id", mediaIds)
          .eq("bucket_id", "portfolio-public")
          .eq("is_public", true)
      : { data: [], error: null };
  if (mediaError) {
    console.error("Unable to load published certificate media.", mediaError);
    throw new Error("Certificate media could not be loaded.");
  }
  const mediaById = new Map(media.map((asset) => [asset.id, asset]));
  return data.map((item) => ({
    id: item.id,
    kind: item.kind,
    title: item.title,
    description: item.description,
    issuer: item.issuer,
    issuedOn: item.issued_on,
    expiresOn: item.expires_on,
    verificationUrl: item.verification_url,
    certificateUrl: item.certificate_media_id
      ? (() => {
          const asset = mediaById.get(item.certificate_media_id);
          return asset
            ? supabase.storage.from(asset.bucket_id).getPublicUrl(asset.object_path).data.publicUrl
            : null;
        })()
      : null,
    certificateMimeType: item.certificate_media_id
      ? mediaById.get(item.certificate_media_id)?.mime_type ?? null
      : null,
  }));
}

async function getPublishedDesignWorksFromDatabase(): Promise<DesignWork[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-design-works");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("creative_works")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Unable to load published design and creative works.", error);
    throw new Error("Published design and creative works could not be loaded.");
  }
  const mediaIds = data.flatMap((work) =>
    work.image_media_id ? [work.image_media_id] : [],
  );
  const { data: media, error: mediaError } =
    mediaIds.length > 0
      ? await supabase
          .from("media_assets")
          .select("id, bucket_id, object_path")
          .in("id", mediaIds)
          .eq("bucket_id", "portfolio-public")
          .eq("is_public", true)
      : { data: [], error: null };
  if (mediaError) {
    console.error("Unable to load published creative-work images.", mediaError);
    throw new Error("Creative-work images could not be loaded.");
  }
  const imageUrls = new Map(
    media.map((asset) => [
      asset.id,
      supabase.storage.from(asset.bucket_id).getPublicUrl(asset.object_path).data.publicUrl,
    ]),
  );

  return data.map((work) => ({
    id: work.id,
    title: work.title,
    category: work.category,
    description: work.description,
    mediaType: work.media_type,
    image:
      (work.image_media_id ? imageUrls.get(work.image_media_id) : undefined) ??
      work.legacy_image_url,
    imageAlt: work.image_alt,
    ...(work.video_url ? { video: work.video_url } : {}),
    showCreatorCredit: work.show_creator_credit,
    ...(work.creator_credit ? { creatorCredit: work.creator_credit } : {}),
  }));
}

async function getPublicContactFromDatabase(): Promise<PublicContact | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-contact");

  const { data, error } = await createPublicClient()
    .from("public_contact_settings")
    .select("introduction, email, phone")
    .maybeSingle();
  if (error) {
    console.error("Unable to load public contact settings.", error);
    throw new Error("Public contact settings could not be loaded.");
  }
  return data;
}

async function getPublicSocialLinksFromDatabase(): Promise<PublicSocialLink[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("portfolio-socials");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("id, platform, label, url")
    .eq("is_enabled", true)
    .order("display_order")
    .order("label");
  if (error) {
    console.error("Unable to load public social links.", error);
    throw new Error("Public social links could not be loaded.");
  }
  const { data: contact, error: contactError } = await supabase
    .from("public_contact_settings")
    .select("email")
    .maybeSingle();
  if (contactError) {
    console.error("Unable to load the public email address.", contactError);
    throw new Error("Public email address could not be loaded.");
  }
  const alreadyHasEmailLink = data.some(
    (link) =>
      link.platform.toLowerCase() === "email" ||
      link.url.toLowerCase().startsWith("mailto:"),
  );
  return contact?.email && !alreadyHasEmailLink
    ? [
        ...data,
        {
          id: "public-email",
          platform: "Email",
          label: contact.email,
          url: `mailto:${contact.email}`,
        },
      ]
    : data;
}

function isDatabaseConfigured() {
  return getSupabasePublicConfig() !== null;
}

export async function getPublishedProjects(): Promise<PublicSource<Project[]>> {
  if (!isDatabaseConfigured()) return { mode: "static", data: projectsData };
  return {
    mode: "database",
    data: await getPublishedProjectsFromDatabase(),
  };
}

export async function getPublishedProfile(): Promise<
  PublicSource<PublicProfile | null>
> {
  if (!isDatabaseConfigured()) return { mode: "static", data: null };
  return {
    mode: "database",
    data: await getPublishedProfileFromDatabase(),
  };
}

export async function getPublishedSkills(): Promise<
  PublicSource<PublicSkill[]>
> {
  if (!isDatabaseConfigured()) return { mode: "static", data: [] };
  return {
    mode: "database",
    data: await getPublishedSkillsFromDatabase(),
  };
}

export async function getPublishedExperience(): Promise<
  PublicSource<PublicExperience[]>
> {
  if (!isDatabaseConfigured()) return { mode: "static", data: [] };
  return {
    mode: "database",
    data: await getPublishedExperienceFromDatabase(),
  };
}

export async function getPublishedEducation(): Promise<
  PublicSource<PublicEducation[]>
> {
  if (!isDatabaseConfigured()) return { mode: "static", data: [] };
  return {
    mode: "database",
    data: await getPublishedEducationFromDatabase(),
  };
}

export async function getPublishedAchievements(): Promise<
  PublicSource<PublicAchievement[]>
> {
  if (!isDatabaseConfigured()) return { mode: "static", data: [] };
  return {
    mode: "database",
    data: await getPublishedAchievementsFromDatabase(),
  };
}

export async function getPublishedDesignWorks(): Promise<
  PublicSource<DesignWork[]>
> {
  if (!isDatabaseConfigured()) return { mode: "static", data: designWorks };
  return {
    mode: "database",
    data: await getPublishedDesignWorksFromDatabase(),
  };
}

export async function getPublicContact(): Promise<
  PublicSource<PublicContact | null>
> {
  if (!isDatabaseConfigured()) {
    return {
      mode: "static",
      data: {
        introduction:
          "I am actively preparing for On-the-Job Training (OJT) opportunities. If you have an open position or inquiries regarding my projects, skills, or background, feel free to reach out!",
        email: "jhannellacarillo.official@gmail.com",
        phone: null,
      },
    };
  }
  return {
    mode: "database",
    data: await getPublicContactFromDatabase(),
  };
}

export async function getPublicSocialLinks(): Promise<
  PublicSource<PublicSocialLink[]>
> {
  if (!isDatabaseConfigured()) {
    return {
      mode: "static",
      data: [
        {
          id: "github",
          platform: "GitHub",
          label: "Jhanelx-zz",
          url: "https://github.com/Jhanelx-zz",
        },
        {
          id: "linkedin",
          platform: "LinkedIn",
          label: "Jhannella Carillo | LinkedIn",
          url: "https://www.linkedin.com/in/jhannella-carillo-bba780405/",
        },
        {
          id: "email",
          platform: "Email",
          label: "Email",
          url: "mailto:jhannellacarillo.official@gmail.com",
        },
      ],
    };
  }
  return {
    mode: "database",
    data: await getPublicSocialLinksFromDatabase(),
  };
}
