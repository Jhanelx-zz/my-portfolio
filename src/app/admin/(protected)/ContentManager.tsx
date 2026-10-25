"use client";

import { useMemo, useState } from "react";
import RecordEditor from "./RecordEditor";
import {
  cmsSectionConfig,
  type CmsRecord,
  type CmsSection,
} from "@/lib/cms/sections";
import type { MediaOption } from "@/lib/cms/admin-data";

const pageSize = 10;

function titleFor(section: CmsSection, record: CmsRecord) {
  const key: Record<CmsSection, string> = {
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
  const value = record[key[section]];
  return typeof value === "string" && value.trim() ? value : "Untitled record";
}

function statusFor(record: CmsRecord) {
  if (typeof record.is_published === "boolean") {
    return record.is_published ? "published" : "draft";
  }
  if (typeof record.is_enabled === "boolean") {
    return record.is_enabled ? "published" : "draft";
  }
  return "published";
}

export default function ContentManager({
  section,
  records,
  mediaOptions,
}: {
  section: CmsSection;
  records: CmsRecord[];
  mediaOptions: MediaOption[];
}) {
  const config = cmsSectionConfig[section];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("display");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(config.singleton && records.length === 0);
  const isSingleton = config.singleton === true;
  const canCreate = !isSingleton && !creating;

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = records.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        Object.values(record).some((value) =>
          Array.isArray(value)
            ? value.some((item) => item.toLowerCase().includes(normalizedSearch))
            : String(value ?? "").toLowerCase().includes(normalizedSearch),
        );
      const matchesStatus =
        statusFilter === "all" || statusFor(record) === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortOrder === "recent") {
      filtered.sort((a, b) =>
        String(b.updated_at ?? "").localeCompare(String(a.updated_at ?? "")),
      );
    } else if (sortOrder === "name") {
      filtered.sort((a, b) =>
        titleFor(section, a).localeCompare(titleFor(section, b)),
      );
    } else {
      filtered.sort(
        (a, b) =>
          Number(a.display_order ?? 0) - Number(b.display_order ?? 0),
      );
    }

    return filtered;
  }, [records, search, section, sortOrder, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const isCreating = creating && (!isSingleton || records.length === 0);

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Portfolio content
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{config.title}</h1>
          <p className="mt-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
            {records.length} {records.length === 1 ? "record" : "records"} total
          </p>
          {!isSingleton && records.length > 0 && (
            <p className="mt-2 text-xs text-[#68766e] dark:text-[#8f9d94]">
              Select a record below to open its editor. Use the button at the top to add a record.
            </p>
          )}
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 dark:bg-emerald-600"
          >
            Add {config.title.replace(/s$/, "")}
          </button>
        )}
      </div>

      {!isSingleton && records.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="sr-only" htmlFor={`${section}-search`}>
            Search {config.title.toLowerCase()}
          </label>
          <input
            id={`${section}-search`}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}…`}
            className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#111916]"
          />
          <label className="sr-only" htmlFor={`${section}-status`}>
            Filter by publication status
          </label>
          <select
            id={`${section}-status`}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#111916]"
          >
            <option value="all">All records</option>
            <option value="published">Published / enabled</option>
            <option value="draft">Draft / disabled</option>
          </select>
          <label className="sr-only" htmlFor={`${section}-sort`}>
            Sort records
          </label>
          <select
            id={`${section}-sort`}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#111916]"
          >
            <option value="display">Display order</option>
            <option value="recent">Recently updated</option>
            <option value="name">Name</option>
          </select>
        </div>
      )}

      {isCreating && (
        <div className="mt-6">
          <RecordEditor
            section={section}
            record={{}}
            mediaOptions={mediaOptions}
            isNew
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      {visibleRecords.length === 0 && !isCreating ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/5">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {records.length === 0 ? "No saved content yet" : "No matching records"}
          </p>
          <p className="mt-2 text-sm text-[#536159] dark:text-[#b2c0b7]">
            {records.length === 0
              ? "Add your first record when you are ready. New entries start as drafts unless you publish them."
              : "Try changing the search or filters."}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleRecords.map((record, index) => (
            <details
              key={String(record.id ?? `${section}-${index}`)}
              className="group rounded-2xl"
            >
              <summary className="cursor-pointer list-none rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-emerald-600/40 dark:border-white/10 dark:bg-[#111916] sm:flex sm:items-center sm:justify-between">
                <span className="font-semibold text-gray-950 dark:text-white">
                  {titleFor(section, record)}
                </span>
                <span className="mt-2 inline-flex items-center gap-2 text-xs text-[#536159] dark:text-[#b2c0b7] sm:mt-0">
                  <span
                    className={`size-2 rounded-full ${statusFor(record) === "published" ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                  {statusFor(record)}
                  <span className="ml-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    Edit
                  </span>
                  <span className="ml-2 group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </span>
              </summary>
              <div className="mt-2">
                <RecordEditor
                  section={section}
                  record={record}
                  mediaOptions={mediaOptions}
                />
              </div>
            </details>
          ))}
        </div>
      )}

      {filteredRecords.length > pageSize && (
        <nav
          aria-label={`${config.title} pages`}
          className="mt-6 flex items-center justify-between gap-4"
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm disabled:opacity-40 dark:border-white/10"
          >
            Previous
          </button>
          <span className="text-sm text-[#536159] dark:text-[#b2c0b7]">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            disabled={currentPage >= pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm disabled:opacity-40 dark:border-white/10"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
