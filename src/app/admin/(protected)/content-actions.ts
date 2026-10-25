"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requirePortfolioAdmin } from "@/lib/supabase/admin";
import {
  cmsSections,
  parseContentForm,
  type CmsSection,
  type ValidatedContent,
} from "@/lib/cms/sections";

export interface ContentActionState {
  error: string | null;
  message: string | null;
}

const mediaTypeByMime = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["application/pdf", "pdf"],
]);
const uuidSchema = z.uuid();

function invalidInputMessage(issues: { path: PropertyKey[]; message: string }[]) {
  return issues
    .map((issue) => `${issue.path.join(".") || "Record"}: ${issue.message}`)
    .join(" ");
}

function revalidatePortfolio(slug?: string) {
  for (const tag of [
    "portfolio-profile",
    "portfolio-skills",
    "portfolio-projects",
    "portfolio-achievements",
    "portfolio-experience",
    "portfolio-education",
    "portfolio-contact",
    "portfolio-socials",
    "portfolio-design-works",
  ]) {
    updateTag(tag);
  }
  revalidatePath("/", "page");
  revalidatePath("/about", "page");
  revalidatePath("/skills", "page");
  revalidatePath("/projects", "page");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/experience", "page");
  revalidatePath("/achievements", "page");
  revalidatePath("/contact", "page");
  revalidatePath("/resume", "page");
  revalidatePath("/design", "page");
  revalidatePath("/admin", "layout");
  if (slug) revalidatePath(`/projects/${slug}`);
}

async function validateMediaIds(
  supabase: Awaited<ReturnType<typeof requirePortfolioAdmin>>["supabase"],
  mediaIds: string[],
  requirePublic: boolean,
  expectedMime?: "image" | "pdf",
) {
  if (mediaIds.length === 0) return { ok: true as const };

  const { data, error } = await supabase
    .from("media_assets")
    .select("id, bucket_id, is_public, mime_type")
    .in("id", mediaIds);

  if (error) {
    console.error("Unable to verify CMS media references.", error);
    return { ok: false as const, message: "Unable to verify the selected media." };
  }

  if (data.length !== new Set(mediaIds).size) {
    return { ok: false as const, message: "One or more selected media files no longer exist." };
  }

  if (
    requirePublic &&
    data.some(
      (asset) =>
        asset.bucket_id !== "portfolio-public" || !asset.is_public,
    )
  ) {
    return {
      ok: false as const,
      message: "Published content can only reference media marked as public.",
    };
  }
  if (
    expectedMime === "image" &&
    data.some((asset) => !asset.mime_type.startsWith("image/"))
  ) {
    return { ok: false as const, message: "Select image files for image fields." };
  }
  if (
    expectedMime === "pdf" &&
    data.some((asset) => asset.mime_type !== "application/pdf")
  ) {
    return { ok: false as const, message: "Select a PDF file for the résumé." };
  }

  return { ok: true as const };
}

async function saveProject(
  supabase: Awaited<ReturnType<typeof requirePortfolioAdmin>>["supabase"],
  id: string | null,
  values: Extract<ValidatedContent, { section: "projects" }>["values"],
): Promise<{ error: string | null; slug: string | null }> {
  const {
    gallery_entries: galleryEntries,
    gallery_captions: galleryCaptions,
    ...projectValues
  } = values;
  if (galleryEntries.length !== galleryCaptions.length) {
    return { error: "Each gallery image must have one caption.", slug: null };
  }
  const galleryMediaIds = galleryEntries.map((entry) =>
    entry.startsWith("media:") ? entry.slice("media:".length) : null,
  );
  const galleryLegacyUrls = galleryEntries.map((entry) =>
    entry.startsWith("legacy:") ? entry.slice("legacy:".length) : null,
  );
  const mediaCheck = await validateMediaIds(
    supabase,
    [
      ...(projectValues.cover_media_id ? [projectValues.cover_media_id] : []),
      ...galleryMediaIds.filter((id): id is string => id !== null),
    ],
    projectValues.is_published,
    "image",
  );
  if (!mediaCheck.ok) return { error: mediaCheck.message, slug: null };

  let projectId: string;
  let previousSlug: string | null = null;

  if (id) {
    projectId = id;
    const { data: existing, error: existingError } = await supabase
      .from("projects")
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    if (existingError) {
      console.error("Unable to read project before update.", existingError);
      return { error: "Unable to load the project before saving.", slug: null };
    }
    if (!existing) return { error: "Project not found.", slug: null };
    previousSlug = existing.slug;

    const { data, error } = await supabase
      .from("projects")
      .update(projectValues)
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("Unable to update project.", error);
      return { error: "Unable to save the project. Check for a duplicate URL slug.", slug: null };
    }
    if (!data) return { error: "Project not found.", slug: null };
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(projectValues)
      .select("id")
      .single();
    if (error) {
      console.error("Unable to create project.", error);
      return { error: "Unable to create the project. Check for a duplicate URL slug.", slug: null };
    }
    projectId = data.id;
  }

  const { error: galleryError } = await supabase.rpc("replace_project_gallery", {
    p_project_id: projectId,
    p_media_ids: galleryMediaIds,
    p_legacy_urls: galleryLegacyUrls,
    p_captions: galleryCaptions,
  });
  if (galleryError) {
    console.error("Project was saved but its gallery was not updated.", galleryError);
    return {
      error: "Project details were saved, but gallery images were not. Reopen the project and try again.",
      slug: projectValues.slug,
    };
  }

  if (previousSlug && previousSlug !== projectValues.slug) {
    revalidatePortfolio(previousSlug);
  }
  return { error: null, slug: projectValues.slug };
}

export async function saveContentAction(
  section: CmsSection,
  id: string | null,
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  if (!cmsSections.includes(section)) {
    return { error: "Unsupported content section.", message: null };
  }

  if (id && !uuidSchema.safeParse(id).success) {
    return { error: "The selected record ID is invalid.", message: null };
  }

  const parsed = parseContentForm(section, formData);
  if (!parsed.success) {
    return { error: parsed.error, message: null };
  }

  const { supabase } = await requirePortfolioAdmin();
  let writeError: string | null = null;
  let savedSlug: string | null = null;

  switch (parsed.content.section) {
    case "profile": {
      const { values } = parsed.content;
      const [avatarCheck, resumeCheck] = await Promise.all([
        validateMediaIds(
          supabase,
          values.avatar_media_id ? [values.avatar_media_id] : [],
          values.is_published,
          "image",
        ),
        validateMediaIds(
          supabase,
          values.resume_media_id ? [values.resume_media_id] : [],
          values.is_published,
          "pdf",
        ),
      ]);
      if (!avatarCheck.ok) {
        return { error: avatarCheck.message, message: null };
      }
      if (!resumeCheck.ok) {
        return { error: resumeCheck.message, message: null };
      }
      const { error } = await supabase
        .from("portfolio_profile")
        .upsert({ singleton: true, ...values });
      if (error) {
        console.error("Unable to save portfolio profile.", error);
        writeError = "Unable to save the profile.";
      }
      break;
    }
    case "skills": {
      const { error } = id
        ? await supabase.from("skills").update(parsed.content.values).eq("id", id)
        : await supabase.from("skills").insert(parsed.content.values);
      if (error) {
        console.error("Unable to save skill.", error);
        writeError = "Unable to save the skill.";
      }
      break;
    }
    case "projects": {
      const result = await saveProject(supabase, id, parsed.content.values);
      writeError = result.error;
      savedSlug = result.slug;
      break;
    }
    case "achievements": {
      const values = parsed.content.values;
      const mediaCheck = await validateMediaIds(
        supabase,
        values.certificate_media_id ? [values.certificate_media_id] : [],
        values.is_published,
      );
      if (!mediaCheck.ok) {
        return { error: mediaCheck.message, message: null };
      }
      const { error } = id
        ? await supabase.from("achievements").update(values).eq("id", id)
        : await supabase.from("achievements").insert(values);
      if (error) {
        console.error("Unable to save achievement.", error);
        writeError = "Unable to save the achievement or certification.";
      }
      break;
    }
    case "experience": {
      const { error } = id
        ? await supabase.from("work_experience").update(parsed.content.values).eq("id", id)
        : await supabase.from("work_experience").insert(parsed.content.values);
      if (error) {
        console.error("Unable to save work experience.", error);
        writeError = "Unable to save the work experience.";
      }
      break;
    }
    case "education": {
      const { error } = id
        ? await supabase.from("education").update(parsed.content.values).eq("id", id)
        : await supabase.from("education").insert(parsed.content.values);
      if (error) {
        console.error("Unable to save education.", error);
        writeError = "Unable to save the education record.";
      }
      break;
    }
    case "contact": {
      const { error } = await supabase
        .from("contact_settings")
        .upsert({ singleton: true, ...parsed.content.values });
      if (error) {
        console.error("Unable to save contact settings.", error);
        writeError = "Unable to save the contact settings.";
      }
      break;
    }
    case "socials": {
      const { error } = id
        ? await supabase.from("social_links").update(parsed.content.values).eq("id", id)
        : await supabase.from("social_links").insert(parsed.content.values);
      if (error) {
        console.error("Unable to save social link.", error);
        writeError = "Unable to save the social link.";
      }
      break;
    }
    case "creative-works": {
      const values = parsed.content.values;
      const mediaCheck = await validateMediaIds(
        supabase,
        values.image_media_id ? [values.image_media_id] : [],
        values.is_published,
        "image",
      );
      if (!mediaCheck.ok) {
        return { error: mediaCheck.message, message: null };
      }
      const { error } = id
        ? await supabase.from("creative_works").update(values).eq("id", id)
        : await supabase.from("creative_works").insert(values);
      if (error) {
        console.error("Unable to save design or creative work.", error);
        writeError = "Unable to save the design or creative work.";
      }
      break;
    }
  }

  if (writeError) {
    return { error: writeError, message: null };
  }

  revalidatePortfolio(savedSlug ?? undefined);
  return { error: null, message: "Changes saved." };
}

export async function deleteContentAction(
  section: CmsSection,
  id: string,
): Promise<ContentActionState> {
  if (!cmsSections.includes(section) || section === "profile" || section === "contact") {
    return { error: "This content cannot be deleted.", message: null };
  }
  if (!uuidSchema.safeParse(id).success) {
    return { error: "The selected record ID is invalid.", message: null };
  }

  const { supabase } = await requirePortfolioAdmin();
  let slug: string | null = null;

  if (section === "projects") {
    const { data, error } = await supabase
      .from("projects")
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("Unable to load project before deletion.", error);
      return { error: "Unable to load the project.", message: null };
    }
    slug = data?.slug ?? null;
  }

  let error: { message: string } | null = null;
  switch (section) {
    case "skills":
      ({ error } = await supabase.from("skills").delete().eq("id", id));
      break;
    case "projects":
      ({ error } = await supabase.from("projects").delete().eq("id", id));
      break;
    case "achievements":
      ({ error } = await supabase.from("achievements").delete().eq("id", id));
      break;
    case "experience":
      ({ error } = await supabase.from("work_experience").delete().eq("id", id));
      break;
    case "education":
      ({ error } = await supabase.from("education").delete().eq("id", id));
      break;
    case "socials":
      ({ error } = await supabase.from("social_links").delete().eq("id", id));
      break;
    case "creative-works":
      ({ error } = await supabase.from("creative_works").delete().eq("id", id));
      break;
  }

  if (error) {
    console.error("Unable to delete portfolio content.", error);
    return { error: "Unable to delete this record.", message: null };
  }

  revalidatePortfolio(slug ?? undefined);
  return { error: null, message: "Record deleted." };
}

export async function uploadMediaAction(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const { supabase } = await requirePortfolioAdmin();
  const file = formData.get("file");
  const altTextValue = formData.get("alt_text");
  const altText = typeof altTextValue === "string" ? altTextValue.trim() : "";
  const replaceIdValue = formData.get("replace_media_id");
  const replaceId = typeof replaceIdValue === "string" ? replaceIdValue : "";
  const replaceIdResult = replaceId ? uuidSchema.safeParse(replaceId) : null;

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload.", message: null };
  }
  if (file.size > 6 * 1024 * 1024) {
    return { error: "Files must be 6 MB or smaller.", message: null };
  }
  const extension = mediaTypeByMime.get(file.type);
  if (!extension) {
    return {
      error: "Use a JPEG, PNG, WebP, GIF, or PDF file.",
      message: null,
    };
  }
  if (replaceIdResult && !replaceIdResult.success) {
    return { error: "Choose a valid media file to replace.", message: null };
  }
  if (altText.length > 300) {
    return { error: "Alternative text must be 300 characters or fewer.", message: null };
  }
  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const signatureMatches =
    file.type === "image/jpeg"
      ? signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff
      : file.type === "image/png"
        ? signature[0] === 0x89 &&
          signature[1] === 0x50 &&
          signature[2] === 0x4e &&
          signature[3] === 0x47 &&
          signature[4] === 0x0d &&
          signature[5] === 0x0a &&
          signature[6] === 0x1a &&
          signature[7] === 0x0a
        : file.type === "image/webp"
          ? String.fromCharCode(...signature.slice(0, 4)) === "RIFF" &&
            String.fromCharCode(...signature.slice(8, 12)) === "WEBP"
          : file.type === "image/gif"
            ? ["GIF87a", "GIF89a"].includes(
                String.fromCharCode(...signature.slice(0, 6)),
              )
            : String.fromCharCode(...signature.slice(0, 5)) === "%PDF-";

  if (!signatureMatches) {
    return {
      error: "The file contents do not match the selected file type.",
      message: null,
    };
  }

  const isReplacement = Boolean(replaceId);
  const replacement = replaceId
    ? await supabase
        .from("media_assets")
        .select("id, bucket_id, object_path, is_public, mime_type")
        .eq("id", replaceId)
        .maybeSingle()
    : null;
  if (replacement?.error) {
    console.error("Unable to load media before replacement.", replacement.error);
    return { error: "Unable to load the selected media file.", message: null };
  }
  if (replaceId && !replacement?.data) {
    return { error: "The selected media file no longer exists.", message: null };
  }
  if (
    replacement?.data &&
    (replacement.data.mime_type === "application/pdf") !==
      (file.type === "application/pdf")
  ) {
    return {
      error: "Replacement files must remain in the same category (image or PDF).",
      message: null,
    };
  }

  const isPublic = replacement
    ? replacement.data?.is_public === true
    : formData.get("is_public") === "on";
  if (isPublic && !altText) {
    return {
      error: "Add alternative text before publishing this file.",
      message: null,
    };
  }

  const bucketId =
    replacement?.data?.bucket_id ??
    (isPublic ? "portfolio-public" : "portfolio-private");
  const objectPath = `media/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(bucketId)
    .upload(objectPath, file, {
      contentType: file.type,
      cacheControl: "60",
      upsert: false,
    });

  if (uploadError) {
    console.error("Unable to upload portfolio media.", uploadError);
    return { error: "The file could not be uploaded.", message: null };
  }

  const metadataMutation = replacement?.data
    ? await supabase
        .from("media_assets")
        .update({
          object_path: objectPath,
          original_name: file.name.slice(0, 255),
          mime_type: file.type,
          size_bytes: file.size,
          alt_text: altText || null,
        })
        .eq("id", replacement.data.id)
    : await supabase.from("media_assets").insert({
        bucket_id: bucketId,
        object_path: objectPath,
        original_name: file.name.slice(0, 255),
        mime_type: file.type,
        size_bytes: file.size,
        is_public: isPublic,
        alt_text: altText || null,
      });

  if (metadataMutation.error) {
    console.error("Unable to save uploaded media metadata.", metadataMutation.error);
    const { error: cleanupError } = await supabase.storage
      .from(bucketId)
      .remove([objectPath]);
    if (cleanupError) {
      console.error("Unable to clean up an uploaded file without metadata.", cleanupError);
    }
    return { error: "The file uploaded, but its media record could not be saved.", message: null };
  }

  if (replacement?.data) {
    const { error: cleanupError } = await supabase.storage
      .from(replacement.data.bucket_id)
      .remove([replacement.data.object_path]);
    if (cleanupError) {
      console.error("Replacement is active but the previous file could not be removed.", cleanupError);
      revalidatePortfolio();
      return {
        error: "The replacement is active, but the previous stored file could not be removed. Check the storage bucket before retrying.",
        message: null,
      };
    }
  }

  revalidatePortfolio();
  return {
    error: null,
    message: isReplacement ? "File replaced." : "File uploaded.",
  };
}

export async function deleteMediaAction(id: string): Promise<ContentActionState> {
  if (!uuidSchema.safeParse(id).success) {
    return { error: "The selected media ID is invalid.", message: null };
  }

  const { supabase } = await requirePortfolioAdmin();
  const { data: media, error: lookupError } = await supabase
    .from("media_assets")
    .select("id, bucket_id, object_path")
    .eq("id", id)
    .maybeSingle();

  if (lookupError) {
    console.error("Unable to load media before deletion.", lookupError);
    return { error: "Unable to load the selected media file.", message: null };
  }
  if (!media) return { error: "The selected media file no longer exists.", message: null };

  const { data: galleryReferences, error: referenceError } = await supabase
    .from("project_gallery")
    .select("id")
    .eq("media_id", id)
    .limit(1);
  if (referenceError) {
    console.error("Unable to check project gallery references.", referenceError);
    return { error: "Unable to check whether this file is in use.", message: null };
  }
  if (galleryReferences.length > 0) {
    return {
      error: "Remove this image from its project gallery before deleting it.",
      message: null,
    };
  }

  const { error: storageError } = await supabase.storage
    .from(media.bucket_id)
    .remove([media.object_path]);
  if (storageError) {
    console.error("Unable to delete stored portfolio media.", storageError);
    return { error: "The stored file could not be deleted.", message: null };
  }

  const { error: recordError } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (recordError) {
    console.error("Stored file was removed but media metadata remains.", recordError);
    return {
      error: "The file was removed from storage, but its media record could not be deleted. Retry the delete to remove the record.",
      message: null,
    };
  }

  revalidatePortfolio();
  return { error: null, message: "Media file deleted." };
}

export async function createMediaUrlAction(
  id: string,
): Promise<{ error: string | null; url: string | null }> {
  if (!uuidSchema.safeParse(id).success) {
    return { error: "The selected media ID is invalid.", url: null };
  }

  const { supabase } = await requirePortfolioAdmin();
  const { data: media, error } = await supabase
    .from("media_assets")
    .select("bucket_id, object_path")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load media for preview.", error);
    return { error: "Unable to load the selected media file.", url: null };
  }
  if (!media) return { error: "The selected media file no longer exists.", url: null };

  if (media.bucket_id === "portfolio-public") {
    const { data } = supabase.storage
      .from("portfolio-public")
      .getPublicUrl(media.object_path);
    return { error: null, url: data.publicUrl };
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from("portfolio-private")
    .createSignedUrl(media.object_path, 60);

  if (signedUrlError) {
    console.error("Unable to create a private media preview.", signedUrlError);
    return { error: "Unable to create a secure file preview.", url: null };
  }

  return { error: null, url: data.signedUrl };
}

export async function updateMediaDetailsAction(
  id: string,
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  if (!uuidSchema.safeParse(id).success) {
    return { error: "The selected media ID is invalid.", message: null };
  }

  const originalNameValue = formData.get("original_name");
  const altTextValue = formData.get("alt_text");
  const parsed = z
    .object({
      original_name: z.string().trim().min(1).max(255),
      alt_text: z.string().trim().max(300),
    })
    .safeParse({
      original_name: originalNameValue,
      alt_text: altTextValue,
    });

  if (!parsed.success) {
    return {
      error: invalidInputMessage(parsed.error.issues),
      message: null,
    };
  }

  const { supabase } = await requirePortfolioAdmin();
  const { data: media, error: lookupError } = await supabase
    .from("media_assets")
    .select("id, is_public")
    .eq("id", id)
    .maybeSingle();
  if (lookupError) {
    console.error("Unable to load media before updating details.", lookupError);
    return { error: "Unable to load the selected media file.", message: null };
  }
  if (!media) return { error: "The selected media file no longer exists.", message: null };
  if (media.is_public && !parsed.data.alt_text) {
    return { error: "Public media needs alternative text.", message: null };
  }

  const { error } = await supabase
    .from("media_assets")
    .update({
      original_name: parsed.data.original_name,
      alt_text: parsed.data.alt_text || null,
    })
    .eq("id", id);
  if (error) {
    console.error("Unable to update media details.", error);
    return { error: "Unable to update media details.", message: null };
  }

  return { error: null, message: "Media details updated." };
}
