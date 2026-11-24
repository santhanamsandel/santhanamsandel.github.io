"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Expand } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { gallery, type GalleryPhoto } from "@/data/gallery";
import Lightbox from "../Lightbox";
import { Reveal, SectionHeading } from "../ui";

function Tile({ p, i, onOpen }: { p: GalleryPhoto; i: number; onOpen: () => void }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  function onMove(e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <Reveal className="mb-4 break-inside-avoid sm:mb-5" delay={(i % 3) * 0.08} y={40}>
    <figure style={{ perspective: 900 }}>
      <motion.button
        type="button"
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry }}
        aria-label={`Open photo: ${p.note}`}
        className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-500 hover:border-cyan/40 hover:shadow-[0_30px_70px_-25px_rgba(34,211,238,0.35)]"
      >
        {/* Aspect-ratio box: reserves space (no layout shift) and never distorts the photo */}
        <span className="relative block w-full" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
          <img
            src={p.srcSm}
            srcSet={`${p.srcSm} 720w, ${p.src} ${p.w}w`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={p.alt}
            width={p.w}
            height={p.h}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: p.focus ?? "50% 50%" }}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          />
          {/* subtle cinematic grade (keeps the photo itself unobstructed) */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#020611]/35 to-transparent transition duration-500 group-hover:opacity-0" />
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.14),transparent_60%)] opacity-0 transition duration-500 group-hover:opacity-100" />
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-ink/60 text-soft opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Expand className="h-4 w-4" aria-hidden />
          </span>
        </span>
        <span className="block border-t border-white/10 px-4 py-3 text-left">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">{p.caption}</span>
          <span className="mt-1 block text-sm font-medium leading-snug text-soft">{p.note}</span>
        </span>
      </motion.button>
    </figure>
    </Reveal>
  );
}

export default function BeyondClassroom() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section id="moments" className="relative py-24 md:py-32" aria-labelledby="moments-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="moments-title"
          eyebrow="Classroom & training moments"
          title="Beyond the Classroom"
          lead="Real learning, practical experiences, and meaningful student interactions."
        />

        <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3">
          {gallery.map((p, i) => (
            <Tile key={p.src} p={p} i={i} onOpen={() => setIndex(i)} />
          ))}
        </div>
      </div>

      <Lightbox
        items={gallery.map((g) => ({ src: g.src, alt: g.alt, caption: g.caption, note: g.note, w: g.w, h: g.h }))}
        index={index}
        onChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </section>
  );
}
