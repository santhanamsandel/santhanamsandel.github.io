"use client";

import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Lock, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects, profile, type Project } from "@/data/profile";
import { useReducedMotion } from "@/lib/hooks";
import ProjectVisual from "../ProjectVisual";
import { GitHubIcon, SectionHeading } from "../ui";

function usePinnedMode() {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)");
    const u = () => setPinned(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return pinned;
}

function CardFace({ p, i, onOpen, compact }: { p: Project; i: number; onOpen: () => void; compact?: boolean }) {
  return (
    <button
      onClick={onOpen}
      className="glass-strong group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] text-left transition duration-500 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-[0_30px_80px_-30px_rgba(34,211,238,0.5)]"
      aria-label={`Open details: ${p.title}`}
    >
      <div className={`relative w-full overflow-hidden border-b ${compact ? "min-h-0 flex-1" : "aspect-[16/9]"} border-white/10 bg-gradient-to-br from-navy/70 to-ink`}>
        <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
        <div className="absolute inset-0 p-3 transition duration-700 group-hover:scale-105">
          <ProjectVisual kind={p.visual} />
        </div>
        <span className="absolute left-3 top-3 font-wide text-3xl font-extrabold text-white/10">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-3.5" : "p-4"}`}>
        <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-cyan">{p.category}</p>
        <h3 className="mt-1.5 font-display text-[15px] font-semibold leading-snug text-soft xl:text-base">{p.title}</h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.tech.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full border border-white/10 bg-ink/60 px-2 py-0.5 font-mono text-[9.5px] text-soft/75">
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-auto flex items-center gap-1.5 pt-4 font-wide text-[9.5px] font-bold uppercase tracking-[0.16em] text-soft/60 transition group-hover:text-cyan">
          <Plus className="h-3.5 w-3.5" /> Details
        </span>
      </div>
    </button>
  );
}

/** Each card flies from deep space to its grid slot as the pinned section scrolls. */
function FlyCard({ p, i, progress, onOpen }: { p: Project; i: number; progress: MotionValue<number>; onOpen: () => void }) {
  const seed = Math.sin(i * 91.7) * 0.5 + 0.5;
  const start = 0.04 + i * 0.055;
  const end = start + 0.38;
  const t = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const col = i % 4;
  const dirX = (col - 1.5) * 2 + (seed - 0.5) * 2;
  const x = useTransform(t, (v) => `${(1 - v) * dirX * 28}vw`);
  const y = useTransform(t, (v) => `${(1 - v) * (i < 4 ? -30 : 30) * (0.6 + seed)}vh`);
  const z = useTransform(t, (v) => (1 - v) * -1800);
  const rotateY = useTransform(t, (v) => (1 - v) * (col < 2 ? 55 : -55));
  const rotateX = useTransform(t, (v) => (1 - v) * (seed - 0.5) * 50);
  const opacity = useTransform(t, [0, 0.25, 1], [0, 1, 1]);
  return (
    <motion.div style={{ x, y, z, rotateY, rotateX, opacity, transformStyle: "preserve-3d" }} className="h-full will-change-transform">
      <CardFace p={p} i={i} onOpen={onOpen} compact />
    </motion.div>
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

function PinnedProjects({ onOpen }: { onOpen: (p: Project) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const headingScale = useTransform(scrollYProgress, [0, 0.55], [1.15, 0.62]);
  const headingY = useTransform(scrollYProgress, [0, 0.55], ["22vh", "0vh"]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const headingBlur = useTransform(scrollYProgress, [0, 0.06], ["blur(12px)", "blur(0px)"]);
  return (
    <div ref={track} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-6 pt-[5.5rem] lg:px-8" style={{ perspective: 1400 }}>
        <motion.div style={{ scale: headingScale, y: headingY, opacity: headingOpacity, filter: headingBlur }} className="origin-top [&>div]:!mb-3">
          <SectionHeading id="projects-title" eyebrow="Featured works" title="Projects" plain />
        </motion.div>
        <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-4 grid-rows-2 gap-4 pb-8 [transform-style:preserve-3d]">
          {projects.map((p, i) => (
            <FlyCard key={p.title} p={p} i={i} progress={scrollYProgress} onOpen={() => onOpen(p)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const pinned = usePinnedMode();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<Project | null>(null);

  const footer = (
    <div className="mt-10 text-center">
      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center gap-2 px-6 py-3 font-wide text-[11px] font-bold uppercase tracking-[0.14em] text-soft">
        <GitHubIcon className="h-4 w-4" /> More on GitHub <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );

  return (
    <section id="projects" className="relative" aria-labelledby="projects-title">
      {pinned ? (
        <PinnedProjects onOpen={setOpen} />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ perspective: 1200 }}>
          <SectionHeading id="projects-title" eyebrow="Featured works" title="Projects" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={reduced ? false : { opacity: 0, z: -400, rotateX: 25, y: 60 }}
                whileInView={{ opacity: 1, z: 0, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardFace p={p} i={i} onOpen={() => setOpen(p)} />
              </motion.div>
            ))}
          </div>
          {footer}
        </div>
      )}
      {pinned && <div className="-mt-8 pb-16">{footer}</div>}
      <AnimatePresence>{open && <Detail p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
