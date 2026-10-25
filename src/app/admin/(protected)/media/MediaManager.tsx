"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createMediaUrlAction,
  deleteMediaAction,
  updateMediaDetailsAction,
  uploadMediaAction,
  type ContentActionState,
} from "../content-actions";
import type { MediaOption } from "@/lib/cms/admin-data";

const initialState: ContentActionState = { error: null, message: null };

export default function MediaManager({ media }: { media: MediaOption[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    uploadMediaAction,
    initialState,
  );
  const [search, setSearch] = useState("");
  const visibleMedia = media.filter((item) =>
    item.original_name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  useEffect(() => {
    if (state.message) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state.message]);

  return (
    <section>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
        Persistent file storage
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Media library</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
        Upload images or PDFs to Supabase Storage. Public files are viewable by
        anyone with the URL; private files require an administrator session.
        Uploads are limited to 6 MB each.
      </p>

      <form
        ref={formRef}
        action={formAction}
        className="mt-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111916] sm:p-6"
      >
        <h2 className="text-lg font-semibold">Upload or replace a file</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="media-file"
              className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200"
            >
              File
            </label>
            <input
              id="media-file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              required
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0e1511]"
            />
          </div>
          <div>
            <label
              htmlFor="replace-media"
              className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200"
            >
              Replace existing media (optional)
            </label>
            <select
              id="replace-media"
              name="replace_media_id"
              defaultValue=""
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0e1511]"
            >
              <option value="">Upload as a new file</option>
              {media.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.original_name} ({item.is_public ? "public" : "private"})
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Replacement keeps the current file&apos;s public or private setting.
            </p>
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="media-alt"
              className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200"
            >
              Alternative text or document description
            </label>
            <input
              id="media-alt"
              name="alt_text"
              type="text"
              maxLength={300}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0e1511]"
            />
          </div>
          <label className="flex items-start gap-3 rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
            <input
              name="is_public"
              type="checkbox"
              className="mt-0.5 size-4 accent-emerald-600"
            />
            <span>
              <span className="block font-medium">Make publicly accessible</span>
              <span className="mt-1 block text-xs text-[#536159] dark:text-[#b2c0b7]">
                Anyone with the file URL can view this file. Leave unchecked for
                private documents.
              </span>
            </span>
          </label>
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
        <button
          type="submit"
          disabled={isPending}
          className="mt-5 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-wait disabled:opacity-60 dark:bg-emerald-600"
        >
          {isPending ? "Uploading…" : "Upload file"}
        </button>
      </form>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Stored files</h2>
          <p className="mt-1 text-sm text-[#536159] dark:text-[#b2c0b7]">
            {media.length} {media.length === 1 ? "file" : "files"}
          </p>
        </div>
        {media.length > 0 && (
          <label className="sr-only" htmlFor="media-search">
            Search files
          </label>
        )}
        {media.length > 0 && (
          <input
            id="media-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search files…"
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#111916]"
          />
        )}
      </div>

      {visibleMedia.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-black/15 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/5">
          <p className="font-semibold">
            {media.length === 0 ? "No files uploaded yet" : "No matching files"}
          </p>
          <p className="mt-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
            {media.length === 0
              ? "Upload a portfolio image or document when you are ready."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {visibleMedia.map((item) => (
            <MediaAssetCard key={item.id} media={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function MediaAssetCard({ media }: { media: MediaOption }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [state, formAction, isSaving] = useActionState(
    updateMediaDetailsAction.bind(null, media.id),
    initialState,
  );

  useEffect(() => {
    if (state.message) router.refresh();
  }, [router, state.message]);

  return (
    <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111916]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-all font-semibold">{media.original_name}</h3>
          <p className="mt-1 text-xs text-[#536159] dark:text-[#b2c0b7]">
            {media.mime_type} · {(media.size_bytes / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs ${media.is_public ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "bg-amber-500/10 text-amber-800 dark:text-amber-300"}`}
        >
          {media.is_public ? "Public" : "Private"}
        </span>
      </div>

      <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`media-name-${media.id}`}
            className="mb-1 block text-xs font-medium"
          >
            Display name
          </label>
          <input
            id={`media-name-${media.id}`}
            name="original_name"
            defaultValue={media.original_name}
            required
            maxLength={255}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#0e1511]"
          />
        </div>
        <div>
          <label
            htmlFor={`media-alt-${media.id}`}
            className="mb-1 block text-xs font-medium"
          >
            Alternative text
          </label>
          <input
            id={`media-alt-${media.id}`}
            name="alt_text"
            defaultValue={media.alt_text ?? ""}
            maxLength={300}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#0e1511]"
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:border-emerald-600 dark:border-white/10 dark:hover:border-emerald-400"
          >
            {isSaving ? "Saving…" : "Save details"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await createMediaUrlAction(media.id);
                if (result.error || !result.url) {
                  setError(result.error ?? "Unable to create a preview link.");
                  return;
                }
                setPreviewUrl(result.url);
              });
            }}
            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:border-emerald-600 disabled:opacity-60 dark:border-white/10 dark:hover:border-emerald-400"
          >
            {isPending ? "Preparing…" : "Get preview link"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("Delete this file from storage?")) return;
              setError(null);
              startTransition(async () => {
                const result = await deleteMediaAction(media.id);
                if (result.error) {
                  setError(result.error);
                  return;
                }
                router.refresh();
              });
            }}
            disabled={isPending}
            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-500/5 disabled:opacity-60 dark:text-red-300"
          >
            Delete file
          </button>
        </div>
      </form>

      {state.error && (
        <p role="alert" className="mt-3 text-xs text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">
          {state.message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-xs text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      {previewUrl && (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-xs font-medium text-emerald-700 underline dark:text-emerald-400"
        >
          Open file preview
        </a>
      )}
    </article>
  );
}
