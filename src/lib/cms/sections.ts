import { z } from "zod";

export const cmsSections = [
  "profile",
  "skills",
  "projects",
  "achievements",
  "experience",
  "education",
  "contact",
  "socials",
  "creative-works",
] as const;

export type CmsSection = (typeof cmsSections)[number];

export function isCmsSection(section: string): section is CmsSection {
  return cmsSections.some((candidate) => candidate === section);
}
export type CmsFieldType =
  | "text"
  | "textarea"
  | "date"
  | "url"
  | "email"
  | "checkbox"
  | "number"
  | "list"
  | "select"
  | "media"
  | "mediaMulti";

export interface CmsField {
  name: string;
  label: string;
  type: CmsFieldType;
  required?: boolean;
  help?: string;
  options?: { label: string; value: string }[];
}

interface CmsSectionConfig {
  title: string;
  table: string;
  singleton?: boolean;
  fields: CmsField[];
}

export const cmsSectionConfig: Record<CmsSection, CmsSectionConfig> = {
  profile: {
    title: "Profile",
    table: "portfolio_profile",
    singleton: true,
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true },
      { name: "display_name", label: "Display name", type: "text", required: true },
      { name: "professional_title", label: "Professional title", type: "text" },
      { name: "hero_intro", label: "Hero introduction", type: "textarea" },
      { name: "biography", label: "About biography", type: "textarea" },
      { name: "professional_summary", label: "Professional summary", type: "textarea" },
      { name: "location", label: "Location", type: "text" },
      {
        name: "interests",
        label: "Professional interests",
        type: "list",
        help: "Enter one item per line.",
      },
      {
        name: "career_goals",
        label: "Career goals",
        type: "list",
        help: "Enter one item per line.",
      },
      { name: "avatar_media_id", label: "Profile image", type: "media" },
      { name: "resume_media_id", label: "Resume or CV", type: "media" },
      { name: "is_published", label: "Publish profile", type: "checkbox" },
    ],
  },
  skills: {
    title: "Skills",
    table: "skills",
    fields: [
      { name: "category", label: "Category", type: "text", required: true },
      { name: "name", label: "Skill", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "proficiency_label",
        label: "Proficiency label (optional)",
        type: "text",
      },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Publish skill", type: "checkbox" },
    ],
  },
  projects: {
    title: "Projects",
    table: "projects",
    fields: [
      { name: "name", label: "Project name", type: "text", required: true },
      {
        name: "slug",
        label: "URL slug",
        type: "text",
        required: true,
        help: "Use lowercase letters, numbers, and hyphens.",
      },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "status", label: "Status", type: "text" },
      { name: "short_description", label: "Short description", type: "textarea" },
      { name: "full_description", label: "Full description", type: "textarea" },
      { name: "problem", label: "Problem addressed", type: "textarea" },
      { name: "solution", label: "Solution", type: "textarea" },
      { name: "role", label: "Your role", type: "text" },
      {
        name: "technologies",
        label: "Technologies used",
        type: "list",
        help: "Enter one technology per line.",
      },
      { name: "features", label: "Features", type: "list" },
      { name: "lessons_learned", label: "Lessons learned", type: "list" },
      { name: "project_date", label: "Project date", type: "date" },
      { name: "github_url", label: "GitHub repository URL", type: "url" },
      { name: "demo_url", label: "Live demo URL", type: "url" },
      { name: "documentation_url", label: "Documentation URL", type: "url" },
      { name: "cover_media_id", label: "Cover image", type: "media" },
      {
        name: "gallery_entries",
        label: "Gallery images",
        type: "mediaMulti",
        help: "Add public images, write captions, and use the arrow buttons to set their order.",
      },
      { name: "is_featured", label: "Feature on homepage", type: "checkbox" },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Publish project", type: "checkbox" },
    ],
  },
  achievements: {
    title: "Achievements & Certifications",
    table: "achievements",
    fields: [
      {
        name: "kind",
        label: "Record type",
        type: "select",
        required: true,
        options: [
          { label: "Achievement", value: "achievement" },
          { label: "Award", value: "award" },
          { label: "Certification", value: "certification" },
          { label: "Training", value: "training" },
          { label: "Workshop", value: "workshop" },
          { label: "Competition", value: "competition" },
          { label: "Recognition", value: "recognition" },
          { label: "Milestone", value: "milestone" },
        ],
      },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "issuer", label: "Issuing organization", type: "text" },
      { name: "issued_on", label: "Issue date", type: "date" },
      { name: "expires_on", label: "Expiration date", type: "date" },
      { name: "verification_url", label: "Verification URL", type: "url" },
      {
        name: "certificate_media_id",
        label: "Certificate file",
        type: "media",
      },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Publish record", type: "checkbox" },
    ],
  },
  experience: {
    title: "Work Experience",
    table: "work_experience",
    fields: [
      { name: "job_title", label: "Job title", type: "text", required: true },
      { name: "organization", label: "Company or organization", type: "text", required: true },
      {
        name: "employment_type",
        label: "Employment type",
        type: "select",
        options: [
          { label: "Internship / OJT", value: "Internship / OJT" },
          { label: "Full-time", value: "Full-time" },
          { label: "Part-time", value: "Part-time" },
          { label: "Freelance", value: "Freelance" },
          { label: "Volunteer", value: "Volunteer" },
          { label: "Student role", value: "Student role" },
          { label: "Other", value: "Other" },
        ],
      },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start date (optional)", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "is_current", label: "Current role", type: "checkbox" },
      { name: "description", label: "Summary", type: "textarea" },
      { name: "responsibilities", label: "Responsibilities", type: "list" },
      { name: "technologies", label: "Skills and technologies", type: "list" },
      { name: "accomplishments", label: "Accomplishments", type: "list" },
      { name: "link_url", label: "Supporting link", type: "url" },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Publish experience", type: "checkbox" },
    ],
  },
  education: {
    title: "Education",
    table: "education",
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "qualification", label: "Degree or qualification", type: "text", required: true },
      { name: "field_of_study", label: "Field of study", type: "text" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "is_current", label: "Currently studying", type: "checkbox" },
      { name: "details", label: "Academic details", type: "textarea" },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Publish education", type: "checkbox" },
    ],
  },
  contact: {
    title: "Contact Information",
    table: "contact_settings",
    singleton: true,
    fields: [
      { name: "introduction", label: "Contact section introduction", type: "textarea" },
      { name: "email", label: "Public email", type: "email" },
      { name: "email_is_public", label: "Display email publicly", type: "checkbox" },
      { name: "phone", label: "Contact number", type: "text" },
      { name: "phone_is_public", label: "Display contact number publicly", type: "checkbox" },
    ],
  },
  socials: {
    title: "Social Links",
    table: "social_links",
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "label", label: "Display label", type: "text", required: true },
      { name: "url", label: "Profile URL", type: "url", required: true },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_enabled", label: "Show publicly", type: "checkbox" },
    ],
  },
  "creative-works": {
    title: "Design & Creative Works",
    table: "creative_works",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "media_type",
        label: "Media type",
        type: "select",
        required: true,
        options: [
          { label: "Photo", value: "photo" },
          { label: "Video", value: "video" },
        ],
      },
      { name: "image_media_id", label: "Uploaded public image", type: "media" },
      {
        name: "legacy_image_url",
        label: "Existing/local image path",
        type: "text",
        help: "Keep existing /images/... paths here; new uploads should use the public image selector.",
      },
      { name: "image_alt", label: "Image/video alternative text", type: "text" },
      {
        name: "video_url",
        label: "Existing/local video path",
        type: "text",
        help: "Existing videos stay at their local /images/... paths; video uploads are not supported.",
      },
      { name: "show_creator_credit", label: "Show creator credit", type: "checkbox" },
      { name: "creator_credit", label: "Creator credit text", type: "text" },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Publish work", type: "checkbox" },
    ],
  },
};

const text = z.string().trim().max(5000);
const shortText = z.string().trim().min(1).max(300);
const textList = z.array(z.string().trim().min(1).max(500)).max(100);
const nullableUrl = z
  .union([
    z.url({ protocol: /^https?$/ }).max(2048),
    z.literal(""),
  ])
  .transform((value) => (value === "" ? null : value));
const nullableDate = z.union([z.iso.date(), z.literal("")]).transform((value) =>
  value === "" ? null : value,
);
const nullableMediaId = z.union([z.uuid(), z.literal("")]).transform((value) =>
  value === "" ? null : value,
);
const nullableLocalPath = z
  .union([z.string().trim().max(2048), z.literal("")])
  .transform((value) => (value === "" ? null : value));
const commonOrder = z.coerce.number().int().min(0).max(100000).default(0);

const schemas = {
  profile: z.object({
    full_name: shortText,
    display_name: shortText,
    professional_title: text,
    hero_intro: text,
    biography: text,
    professional_summary: text,
    location: text,
    interests: textList,
    career_goals: textList,
    avatar_media_id: nullableMediaId,
    resume_media_id: nullableMediaId,
    is_published: z.boolean(),
  }),
  skills: z.object({
    category: shortText,
    name: shortText,
    description: text,
    proficiency_label: z.union([z.string().trim().max(100), z.literal("")]),
    display_order: commonOrder,
    is_published: z.boolean(),
  }),
  projects: z.object({
    slug: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(100),
    name: shortText,
    category: shortText,
    status: z.string().trim().max(100),
    short_description: text,
    full_description: text,
    problem: text,
    solution: text,
    role: text,
    technologies: textList,
    features: textList,
    lessons_learned: textList,
    project_date: nullableDate,
    github_url: nullableUrl,
    demo_url: nullableUrl,
    documentation_url: nullableUrl,
    cover_media_id: nullableMediaId,
    gallery_entries: z
      .array(
        z.string().refine((entry) => {
          if (entry.startsWith("media:")) {
            return z.uuid().safeParse(entry.slice("media:".length)).success;
          }
          return (
            entry.startsWith("legacy:/images/") &&
            !entry.includes("..") &&
            /^legacy:\/images\/[A-Za-z0-9._/-]+$/.test(entry)
          );
        }, "Choose an existing gallery image or a public image asset."),
      )
      .max(20),
    gallery_captions: z.array(z.string().trim().max(300)).max(20),
    is_featured: z.boolean(),
    is_published: z.boolean(),
    display_order: commonOrder,
  }).superRefine((values, context) => {
    if (values.gallery_entries.length !== values.gallery_captions.length) {
      context.addIssue({
        code: "custom",
        path: ["gallery_captions"],
        message: "Each gallery image must have one caption.",
      });
    }
    if (new Set(values.gallery_entries).size !== values.gallery_entries.length) {
      context.addIssue({
        code: "custom",
        path: ["gallery_entries"],
        message: "Gallery images cannot be duplicated.",
      });
    }
  }),
  achievements: z.object({
    kind: z.enum([
      "achievement",
      "award",
      "certification",
      "training",
      "workshop",
      "competition",
      "recognition",
      "milestone",
    ]),
    title: shortText,
    description: text,
    issuer: z.string().trim().max(300),
    issued_on: nullableDate,
    expires_on: nullableDate,
    verification_url: nullableUrl,
    certificate_media_id: nullableMediaId,
    is_published: z.boolean(),
    display_order: commonOrder,
  }),
  experience: z.object({
    job_title: shortText,
    organization: shortText,
    employment_type: z.string().trim().max(100),
    location: z.string().trim().max(300),
    start_date: nullableDate,
    end_date: nullableDate,
    is_current: z.boolean(),
    description: text,
    responsibilities: textList,
    technologies: textList,
    accomplishments: textList,
    link_url: nullableUrl,
    is_published: z.boolean(),
    display_order: commonOrder,
  }),
  education: z.object({
    institution: shortText,
    qualification: shortText,
    field_of_study: z.string().trim().max(300),
    start_date: nullableDate,
    end_date: nullableDate,
    is_current: z.boolean(),
    details: text,
    is_published: z.boolean(),
    display_order: commonOrder,
  }),
  contact: z.object({
    introduction: text,
    email: z.union([z.email().max(254), z.literal("")]),
    email_is_public: z.boolean(),
    phone: z.string().trim().max(50),
    phone_is_public: z.boolean(),
  }),
  socials: z.object({
    platform: shortText,
    label: shortText,
    url: z.url({ protocol: /^https?$/ }).max(2048),
    is_enabled: z.boolean(),
    display_order: commonOrder,
  }),
  "creative-works": z.object({
    title: shortText,
    category: shortText,
    description: text,
    media_type: z.enum(["photo", "video"]),
    image_media_id: nullableMediaId,
    legacy_image_url: nullableLocalPath,
    image_alt: z.string().trim().max(300),
    video_url: nullableLocalPath,
    show_creator_credit: z.boolean(),
    creator_credit: z.string().trim().max(300),
    display_order: commonOrder,
    is_published: z.boolean(),
  }),
};

export type ValidatedContent =
  | { section: "profile"; values: z.infer<typeof schemas.profile> }
  | { section: "skills"; values: z.infer<typeof schemas.skills> }
  | { section: "projects"; values: z.infer<typeof schemas.projects> }
  | { section: "achievements"; values: z.infer<typeof schemas.achievements> }
  | { section: "experience"; values: z.infer<typeof schemas.experience> }
  | { section: "education"; values: z.infer<typeof schemas.education> }
  | { section: "contact"; values: z.infer<typeof schemas.contact> }
  | { section: "socials"; values: z.infer<typeof schemas.socials> }
  | { section: "creative-works"; values: z.infer<typeof schemas["creative-works"]> };

export type CmsValue = string | number | boolean | null | string[];
export type CmsRecord = Record<string, CmsValue>;

function readFormValues(section: CmsSection, formData: FormData) {
  const values: Record<string, unknown> = Object.fromEntries(formData.entries());
  const fields = cmsSectionConfig[section].fields;

  for (const field of fields) {
    if (field.type === "checkbox") {
      values[field.name] = formData.get(field.name) === "on";
    } else if (field.type === "list") {
      values[field.name] = String(formData.get(field.name) ?? "")
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (field.type === "mediaMulti") {
      values[field.name] = formData
        .getAll(field.name)
        .filter((value): value is string => typeof value === "string" && value.length > 0);
    } else if (field.type === "date" || field.type === "url" || field.type === "media") {
      const value = formData.get(field.name);
      values[field.name] = typeof value === "string" && value.length > 0 ? value : "";
    }
  }

  if (section === "projects") {
    values.gallery_captions = formData
      .getAll("gallery_captions")
      .filter((value): value is string => typeof value === "string");
  }

  return values;
}

function validationMessage(issues: { path: PropertyKey[]; message: string }[]) {
  return issues
    .map((issue) => `${issue.path.join(".") || "Form"}: ${issue.message}`)
    .join(" ");
}

export function parseContentForm(
  section: CmsSection,
  formData: FormData,
):
  | { success: false; error: string }
  | { success: true; content: ValidatedContent } {
  const values = readFormValues(section, formData);

  switch (section) {
    case "profile": {
      const result = schemas.profile.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "skills": {
      const result = schemas.skills.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "projects": {
      const result = schemas.projects.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "achievements": {
      const result = schemas.achievements.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "experience": {
      const result = schemas.experience.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "education": {
      const result = schemas.education.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "contact": {
      const result = schemas.contact.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "socials": {
      const result = schemas.socials.safeParse(values);
      return result.success
        ? { success: true, content: { section, values: result.data } }
        : { success: false, error: validationMessage(result.error.issues) };
    }
    case "creative-works": {
      const result = schemas["creative-works"].safeParse(values);
      if (!result.success) {
        return { success: false, error: validationMessage(result.error.issues) };
      }
      for (const [field, value] of [
        ["legacy_image_url", result.data.legacy_image_url],
        ["video_url", result.data.video_url],
      ] as const) {
        if (
          value &&
          (!/^\/images\/[A-Za-z0-9._/-]+$/.test(value) || value.includes(".."))
        ) {
          return {
            success: false,
            error: `${field}: use a safe /images/ path.`,
          };
        }
      }
      return { success: true, content: { section, values: result.data } };
    }
  }
}
