"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, Database, FolderKanban, Hammer, Handshake, X, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { stats, teaching } from "@/data/profile";
import { CountUp, Reveal, SectionHeading } from "../ui";

const areas = ["All", "Core", "Data", "AI"] as const;
const approachIcons = [Hammer, Database, FolderKanban, Handshake, ClipboardCheck, Building2];

export default function Training() {
  const [area, setArea] = useState<(typeof areas)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % teaching.gallery.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + teaching.gallery.length) % teaching.gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section id="training" className="relative py-24 md:py-36" aria-labelledby="training-title">
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-navy/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="06"
          eyebrow="Training & teaching"
          title={
            <span id="training-title">
              I don&apos;t just use AI. <span className="text-gradient">I teach it.</span>
            </span>
          }
          lead="Instructor-led, project-based programmes for students, career-switchers and corporate teams — built around real datasets, real assessments and real outcomes."
        />

        {/* Impact */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="glass relative h-full overflow-hidden rounded-2xl p-5 md:p-6">
                <div aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan/10 blur-2xl" />
                <p className="font-display text-3xl font-semibold text-soft md:text-5xl">
                  <CountUp to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-soft/85">{s.label}</p>
                <p className="mt-1 text-xs text-muted">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Subjects + approach */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold text-soft">Subjects I teach</h3>
            <div className="mt-5 flex gap-2" role="group" aria-label="Filter subjects">
              {areas.map((a) => (
                <button
                  key={a}
                  onClick={() => setArea(a)}
                  aria-pressed={area === a}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                    area === a ? "border-cyan bg-cyan/15 text-cyan" : "border-line text-muted hover:text-soft"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <motion.ul layout className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {teaching.subjects.map((s) => {
                const on = area === "All" || s.area === area;
                return (
                  <motion.li
                    layout
                    key={s.name}
                    animate={{ opacity: on ? 1 : 0.25, scale: on ? 1 : 0.97 }}
                    className={`rounded-xl border px-3.5 py-3 text-sm transition ${on ? "border-cyan/30 bg-cyan/5 text-soft" : "border-line text-muted"}`}
                  >
                    {s.name}
                  </motion.li>
                );
              })}
            </motion.ul>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="font-display text-2xl font-semibold text-soft">How I teach</h3>
            </Reveal>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {teaching.approach.map((a, i) => {
                const Icon = approachIcons[i];
                return (
                  <Reveal key={a.title} delay={i * 0.05}>
                    <div className="group flex h-full gap-3 rounded-xl border border-line bg-white/[0.02] p-4 transition hover:border-cyan/40 hover:bg-white/[0.04]">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan transition group-hover:scale-110" aria-hidden />
                      <div>
                        <p className="font-medium text-soft">{a.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{a.text}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <Reveal className="mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h3 className="font-display text-2xl font-semibold text-soft">In the classroom</h3>
            <p className="hidden text-sm text-muted sm:block">Tap a photo to enlarge</p>
          </div>
        </Reveal>
        <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
          {teaching.gallery.map((g, i) => (
            <Reveal key={g.src} delay={(i % 4) * 0.05}>
              <button
                onClick={() => setLightbox(i)}
                className="group relative block w-full overflow-hidden rounded-xl border border-line"
                aria-label={`Enlarge photo: ${g.alt}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  width={g.w}
                  height={g.h}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition duration-700 group-hover:scale-105"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={teaching.gallery[lightbox].alt}
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              key={lightbox}
              src={teaching.gallery[lightbox].src}
              alt={teaching.gallery[lightbox].alt}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-h-[85vh] max-w-full rounded-xl border border-line object-contain"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % teaching.gallery.length);
              }}
            />
            <button
              autoFocus
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-line bg-ink text-soft"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="absolute bottom-5 px-6 text-center text-sm text-muted">{teaching.gallery[lightbox].alt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
