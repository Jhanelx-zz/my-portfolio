"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { deleteContentAction, saveContentAction } from "./content-actions";
import type { ContentActionState } from "./content-actions";
import {
  cmsSectionConfig,
  type CmsRecord,
  type CmsSection,
} from "@/lib/cms/sections";
import type { MediaOption } from "@/lib/cms/admin-data";

const initialState: ContentActionState = { error: null, message: null };

function fieldValue(record: CmsRecord, name: string) {
  const value = record[name];
  if (Array.isArray(value)) return value.join("\n");
  if (value === null || value === undefined) return "";
  return String(value);
}

function displayTitle(section: CmsSection, record: CmsRecord, index: number) {
  const fieldsBySection: Record<CmsSection, string> = {
    profile: "display_name",
    skills: "name",
    projects: "name",
    achievements: "title",
    experience: "job_title",
    education: "qualification",
    contact: "email",
    socials: "label",
    "creative-works": "title",
  };
  return fieldValue(record, fieldsBySection[section]) || `${cmsSectionConfig[section].title} ${index + 1}`;
}

export default function RecordEditor({
  section,
  record,
  mediaOptions,
  isNew = false,
  onCancel,
}: {
  section: CmsSection;
  record: CmsRecord;
  mediaOptions: MediaOption[];
  isNew?: boolean;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const recordId = typeof record.id === "string" ? record.id : null;
  const action = saveContentAction.bind(null, section, recordId);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [galleryItems, setGalleryItems] = useState(() => {
    const entries = Array.isArray(record.gallery_entries)
      ? record.gallery_entries
      : [];
    const captions = Array.isArray(record.gallery_captions)
      ? record.gallery_captions
      : [];
    return entries.map((entry, index) => ({
      entry,
      caption: captions[index] ?? "",
    }));
  });

  useEffect(() => {
    if (state.message) {
      router.refresh();
      if (isNew) onCancel?.();
    }
  }, [isNew, onCancel, router, state.message]);

  const config = cmsSectionConfig[section];

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111916] sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-gray-950 dark:text-white">
            {isNew ? `New ${config.title.replace(/s$/, "")}` : displayTitle(section, record, 0)}
          </p>
          {!isNew && typeof record.updated_at === "string" && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Updated {new Date(record.updated_at).toLocaleString()}
            </p>
          )}
        </div>
        {isNew && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium dark:border-white/10"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields.map((field) => {
          const id = `field-${section}-${recordId ?? "new"}-${field.name}`;
          const value = record[field.name];
          const labelClass =
            "mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200";
          const inputClass =
            "w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 dark:border-white/10 dark:bg-[#0e1511] dark:text-gray-100 dark:focus:border-emerald-400";

          if (section === "projects" && field.name === "gallery_entries") {
            const imageOptions = mediaOptions.filter(
              (media) =>
                media.bucket_id === "portfolio-public" &&
                media.is_public &&
                media.mime_type.startsWith("image/"),
            );
            return (
              <fieldset key={field.name} className="sm:col-span-2">
                <legend className={labelClass}>{field.label}</legend>
                <div className="space-y-3">
                  {galleryItems.map((item, index) => (
                    <div
                      key={`${recordId ?? "new"}-gallery-${index}`}
                      className="grid gap-2 rounded-lg border border-black/10 p-3 dark:border-white/10 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                    >
                      <label className="sr-only" htmlFor={`${id}-${index}-image`}>
                        Gallery image {index + 1}
                      </label>
                      <select
                        id={`${id}-${index}-image`}
                        name="gallery_entries"
                        required
                        value={item.entry}
                        onChange={(event) =>
                          setGalleryItems((items) =>
                            items.map((entry, entryIndex) =>
                              entryIndex === index
                                ? { ...entry, entry: event.target.value }
                                : entry,
                            ),
                          )
                        }
                        className={inputClass}
                      >
                        <option value="">Select a gallery image</option>
                        {galleryItems
                          .filter((entry) => entry.entry.startsWith("legacy:"))
                          .map((entry) => (
                            <option key={entry.entry} value={entry.entry}>
                              Existing image: {entry.entry.slice("legacy:".length)}
                            </option>
                          ))}
                        {imageOptions.map((media) => (
                          <option key={media.id} value={`media:${media.id}`}>
                            {media.original_name}
                          </option>
                        ))}
                      </select>
                      <label className="sr-only" htmlFor={`${id}-${index}-caption`}>
                        Caption for gallery image {index + 1}
                      </label>
                      <input
                        id={`${id}-${index}-caption`}
                        name="gallery_captions"
                        type="text"
                        maxLength={300}
                        value={item.caption}
                        onChange={(event) =>
                          setGalleryItems((items) =>
                            items.map((entry, entryIndex) =>
                              entryIndex === index
                                ? { ...entry, caption: event.target.value }
                                : entry,
                            ),
                          )
                        }
                        placeholder="Image caption"
                        className={inputClass}
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Move gallery image ${index + 1} up`}
                          disabled={index === 0}
                          onClick={() =>
                            setGalleryItems((items) => {
                              const next = [...items];
                              [next[index - 1], next[index]] = [
                                next[index],
                                next[index - 1],
                              ];
                              return next;
                            })
                          }
                          className="rounded-md border border-black/10 p-2 disabled:opacity-40 dark:border-white/10"
                        >
                          <ArrowUp size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move gallery image ${index + 1} down`}
                          disabled={index === galleryItems.length - 1}
                          onClick={() =>
                            setGalleryItems((items) => {
                              const next = [...items];
                              [next[index], next[index + 1]] = [
                                next[index + 1],
                                next[index],
                              ];
                              return next;
                            })
                          }
                          className="rounded-md border border-black/10 p-2 disabled:opacity-40 dark:border-white/10"
                        >
                          <ArrowDown size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove gallery image ${index + 1}`}
                          onClick={() =>
                            setGalleryItems((items) =>
                              items.filter((_, entryIndex) => entryIndex !== index),
                            )
                          }
                          className="rounded-md border border-red-500/30 p-2 text-red-700 dark:text-red-300"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={galleryItems.length >= 20 || imageOptions.length === 0}
                  onClick={() =>
                    setGalleryItems((items) => [
                      ...items,
                      { entry: "", caption: "" },
                    ])
                  }
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold disabled:opacity-40 dark:border-white/10"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add gallery image
                </button>
                {field.help && (
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {field.help}
                  </p>
                )}
                {imageOptions.length === 0 && (
                  <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">
                    Upload public images in the Media section before adding gallery items.
                  </p>
                )}
              </fieldset>
            );
          }

          if (field.type === "checkbox") {
            return (
              <label
                key={field.name}
                htmlFor={id}
                className="flex min-h-11 items-center gap-3 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
              >
                <input
                  id={id}
                  name={field.name}
                  type="checkbox"
                  defaultChecked={value === true}
                  className="size-4 accent-emerald-600"
                />
                {field.label}
              </label>
            );
          }

          if (field.type === "media" || field.type === "mediaMulti") {
            const options = mediaOptions
              .filter(
                (media) =>
                  section !== "creative-works" ||
                  (media.bucket_id === "portfolio-public" &&
                    media.is_public &&
                    media.mime_type.startsWith("image/")),
              )
              .map((media) => ({
                label: `${media.original_name} — ${media.is_public ? "public" : "private"}`,
                value: media.id,
              }));
            const defaultValue =
              field.type === "mediaMulti"
                ? Array.isArray(value)
                  ? value
                  : []
                : typeof value === "string"
                  ? value
                  : "";

            return (
              <div key={field.name} className="sm:col-span-2">
                <label htmlFor={id} className={labelClass}>
                  {field.label}
                </label>
                {field.type === "mediaMulti" ? (
                  <select
                    id={id}
                    name={field.name}
                    multiple
                    defaultValue={defaultValue}
                    className={`${inputClass} min-h-32`}
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    id={id}
                    name={field.name}
                    defaultValue={defaultValue}
                    className={inputClass}
                  >
                    <option value="">No file selected</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {field.help && (
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {field.help}
                  </p>
                )}
                {options.length === 0 && (
                  <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">
                    Upload media in the Media section before selecting it here.
                  </p>
                )}
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.name}>
                <label htmlFor={id} className={labelClass}>
                  {field.label}
                </label>
                <select
                  id={id}
                  name={field.name}
                  required={field.required}
                  defaultValue={fieldValue(record, field.name)}
                  className={inputClass}
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "textarea" || field.type === "list") {
            return (
              <div key={field.name} className="sm:col-span-2">
                <label htmlFor={id} className={labelClass}>
                  {field.label}
                </label>
                <textarea
                  id={id}
                  name={field.name}
                  required={field.required}
                  rows={field.type === "list" ? 4 : 3}
                  defaultValue={fieldValue(record, field.name)}
                  className={inputClass}
                />
                {field.help && (
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {field.help}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div key={field.name}>
              <label htmlFor={id} className={labelClass}>
                {field.label}
              </label>
              <input
                id={id}
                name={field.name}
                type={field.type === "number" ? "number" : field.type}
                min={field.type === "number" ? 0 : undefined}
                maxLength={field.type === "text" ? 300 : undefined}
                required={field.required}
                defaultValue={fieldValue(record, field.name)}
                className={inputClass}
              />
            </div>
          );
        })}
      </div>

      {state.error && (
        <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">
          {state.message}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-black/5 pt-5 dark:border-white/5">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-wait disabled:opacity-60 dark:bg-emerald-600"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
        {!isNew && recordId && section !== "profile" && section !== "contact" && (
          <DeleteRecordButton section={section} id={recordId} />
        )}
      </div>
    </form>
  );
}

function DeleteRecordButton({
  section,
  id,
}: {
  section: CmsSection;
  id: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!window.confirm("Delete this record? This cannot be undone.")) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteContentAction(section, id);
            if (result.error) {
              setError(result.error);
              return;
            }
            router.refresh();
          });
        }}
        className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-500/5 disabled:cursor-wait disabled:opacity-60 dark:text-red-300"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && (
        <span role="alert" className="text-sm text-red-700 dark:text-red-300">
          {error}
        </span>
      )}
    </>
  );
}
