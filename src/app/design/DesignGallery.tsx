"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { designCategories, type DesignWork } from "../data/design-works";

const imageSizes =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export default function DesignGallery({
  works,
}: {
  works: DesignWork[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All works");
  const [activeMediaType, setActiveMediaType] = useState<
    "all" | "video" | "photo"
  >("all");
  const [selectedWork, setSelectedWork] = useState<DesignWork | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visibleWorks =
    works.filter((work) => {
      const matchesCategory =
        activeCategory === "All works" || work.category === activeCategory;
      const matchesMediaType =
        activeMediaType === "all" || work.mediaType === activeMediaType;
      return matchesCategory && matchesMediaType;
    });

  const openLightbox = (work: DesignWork) => {
    setSelectedWork(work);
    dialogRef.current?.showModal();
  };

  const closeLightbox = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <div
        aria-label="Filter creative works by media type"
        className="mb-3 flex flex-wrap gap-2"
      >
        {(["all", "video", "photo"] as const).map((mediaType) => (
          <button
            key={mediaType}
            type="button"
            aria-pressed={activeMediaType === mediaType}
            onClick={() => setActiveMediaType(mediaType)}
            className={`rounded-full border px-4 py-2 font-mono text-xs capitalize transition ${
              activeMediaType === mediaType
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-black/10 bg-white text-[#536159] hover:border-emerald-500/60 dark:border-white/10 dark:bg-[#111916] dark:text-[#b2c0b7]"
            }`}
          >
            {mediaType === "all" ? "All" : mediaType}
          </button>
        ))}
      </div>

      <div
        aria-label="Filter creative works by category"
        className="mb-8 flex flex-wrap gap-2"
      >
        {["All works", ...designCategories.map((category) => category.name)].map(
          (category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 font-mono text-xs transition ${
                activeCategory === category
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-black/10 bg-white text-[#536159] hover:border-emerald-500/60 dark:border-white/10 dark:bg-[#111916] dark:text-[#b2c0b7]"
              }`}
            >
              {category}
            </button>
          ),
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleWorks.map((work, index) => {
          const creatorCredit =
            work.showCreatorCredit === false
              ? null
              : work.creatorCredit ??
                (work.mediaType === "video"
                  ? "Edited by Jhanelxzz"
                  : "Jhunnel C. Carillo");
          const artwork = (
            <div className="relative aspect-[4/3] overflow-hidden border-b border-black/10 bg-[#e7eee9] dark:border-white/10 dark:bg-[#17211b]">
              {work.mediaType === "video" && work.video ? (
                <video
                  src={work.video}
                  aria-label={work.imageAlt ?? work.title}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="h-full w-full object-contain"
                />
              ) : work.image && work.imageAlt ? (
                <Image
                  src={work.image}
                  alt={work.imageAlt}
                  fill
                  sizes={imageSizes}
                  className="object-contain transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div
                  aria-label="Placeholder image; add your own design work here"
                  className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.20),_transparent_55%),linear-gradient(135deg,_#edf3ef,_#dbe7df)] px-6 text-center dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.18),_transparent_55%),linear-gradient(135deg,_#1b2921,_#101713)]"
                >
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-700/20 bg-white/60 text-emerald-700 dark:border-emerald-400/20 dark:bg-black/10 dark:text-emerald-300">
                    <ImageIcon size={26} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-300">
                    Image placeholder
                  </span>
                  <span className="mt-2 max-w-52 text-sm text-[#536159] dark:text-[#b2c0b7]">
                    Add your own work to this category
                  </span>
                </div>
              )}
              {creatorCredit && (work.video || work.image) && (
                <span
                  className={`pointer-events-none absolute right-3 rounded-md border border-white/15 bg-black/70 px-2.5 py-1.5 font-mono text-[10px] font-medium text-white shadow-sm backdrop-blur-sm ${
                    work.mediaType === "video" ? "top-3" : "bottom-3"
                  }`}
                >
                  {creatorCredit}
                </span>
              )}
            </div>
          );

          return (
            <article
              key={work.id}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg dark:border-white/10 dark:bg-[#111916]"
            >
              {work.mediaType !== "video" && work.image && work.imageAlt ? (
                <button
                  type="button"
                  onClick={() => openLightbox(work)}
                  aria-label={`View larger image: ${work.imageAlt}`}
                  className="block w-full cursor-zoom-in text-left"
                >
                  {artwork}
                </button>
              ) : (
                artwork
              )}
              <div className="p-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  0{index + 1} / {work.category}
                </p>
                <h2 className="mt-2 text-lg font-bold tracking-tight">
                  {work.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
                  {work.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={selectedWork?.title ?? "Design image"}
        onClose={() => setSelectedWork(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeLightbox();
        }}
        className="fixed m-auto max-h-[90vh] max-w-[min(92vw,1100px)] overflow-visible border-0 bg-transparent p-0 backdrop:bg-black/85"
      >
        {selectedWork?.image && selectedWork.imageAlt && (
          <div className="relative max-h-[90vh]">
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close enlarged image"
              className="absolute -right-3 -top-3 z-10 rounded-full border border-white/20 bg-[#111916] p-2 text-white transition hover:text-emerald-300"
            >
              <X size={18} />
            </button>
            <Image
              src={selectedWork.image}
              alt={selectedWork.imageAlt}
              width={1600}
              height={1200}
              sizes="92vw"
              className="max-h-[90vh] w-auto max-w-[92vw] rounded-xl object-contain"
            />
            <p className="mt-3 text-center text-sm text-white">
              {selectedWork.title}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
