"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Lock, Plus, X } from "lucide-react";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { projects, profile, type Project } from "@/data/profile";
import { useReducedMotion } from "@/lib/hooks";
import ProjectVisual from "../ProjectVisual";
import { GitHubIcon, LazyMount, SectionHeading } from "../ui";

const filters = ["All", "Generative AI", "Machine Learning", "Data Analytics", "Python Development"] as const;

/** Restrained pointer tilt (mouse only). */
function TiltWrap({ children }: { children: ReactNode }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  }
  return (
    <motion.div
      className="h-full"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function CardFace({ p, i, onOpen }: { p: Project; i: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="glass-strong group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] text-left transition duration-500 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-[0_30px_80px_-30px_rgba(34,211,238,0.5)]"
      aria-label={`Open details: ${p.title}`}
    >
      <div className={`relative w-full overflow-hidden border-b aspect-[16/9] border-white/10 bg-gradient-to-br from-navy/70 to-ink`}>
        <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
        <LazyMount className="absolute inset-0 p-3 transition duration-700 group-hover:scale-105">
          <ProjectVisual kind={p.visual} />
        </LazyMount>
        <span aria-hidden className="absolute left-3 top-3 font-wide text-3xl font-extrabold text-white/10">{String(i + 1).padStart(2, "0")}</span>
        <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-ink/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-soft/70">Illustration</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">{p.category}</p>
        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-soft">{p.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.solution}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.tech.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full border border-white/10 bg-ink/60 px-2 py-0.5 font-mono text-[10.5px] text-soft/80">
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-auto flex items-center justify-between gap-2 pt-5">
          <span className="flex items-center gap-1.5 font-wide text-[10px] font-bold uppercase tracking-[0.16em] text-soft/70 transition group-hover:text-cyan">
            <Plus className="h-3.5 w-3.5" aria-hidden /> Details
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-soft/70">
            {p.github ? (
              <>
                <GitHubIcon className="h-3.5 w-3.5" /> Code on GitHub
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" aria-hidden /> Code private
              </>
            )}
          </span>
        </span>
      </div>
    </button>
  );
}

function Detail({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#020611]/85 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      data-lenis-prevent
    >
      <motion.article
        className="glass-strong relative w-full max-w-3xl overflow-hidden rounded-[26px] bg-[#050b1a]/90"
        initial={{ y: 60, rotateX: 12, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
        style={{ transformPerspective: 1200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button autoFocus onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink/80 text-soft hover:border-cyan">
          <X className="h-5 w-5" />
        </button>
        <div className="relative aspect-[16/7] border-b border-white/10 bg-gradient-to-br from-navy/80 to-ink">
          <div aria-hidden className="grid-bg absolute inset-0" />
          <div className="absolute inset-0 p-6">
            <ProjectVisual kind={p.visual} />
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">
            {p.category}
            {p.period && <span className="text-muted"> · {p.period}</span>}
          </p>
          <h3 className="mt-2 font-wide text-xl font-bold uppercase leading-tight text-soft sm:text-2xl">{p.title}</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet">Problem</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.problem}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">Solution</p>
              <p className="mt-1.5 text-sm leading-relaxed text-soft/85">{p.solution}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-soft/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_8px_#22d3ee]" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <li key={t} className="rounded-full border border-white/10 bg-ink/60 px-3 py-1 font-mono text-[11px] text-soft/80">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            {p.github ? (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 px-5 py-3 font-wide text-[11px] font-bold uppercase tracking-[0.14em]">
                <GitHubIcon className="h-4 w-4" /> View code <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Lock className="h-4 w-4" /> Professional project · code not public
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Projects() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<Project | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const list = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 md:py-32" aria-labelledby="projects-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ perspective: 1400 }}>
        <SectionHeading
          id="projects-title"
          eyebrow="Featured works"
          title="Projects"
          lead="Generative AI, machine learning, analytics and Python projects. Card visuals are illustrations of each system, not screenshots."
        />

        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`min-h-10 shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                filter === f ? "border-cyan bg-cyan/15 text-cyan" : "border-white/15 text-soft/70 hover:text-soft"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                initial={reduced ? false : { opacity: 0, y: 50, rotateX: 18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <TiltWrap>
                  <CardFace p={p} i={projects.indexOf(p)} onOpen={() => setOpen(p)} />
                </TiltWrap>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 text-center">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center gap-2 px-6 py-3 font-wide text-[11px] font-bold uppercase tracking-[0.14em] text-soft">
            <GitHubIcon className="h-4 w-4" /> More on GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <AnimatePresence>{open && <Detail p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
