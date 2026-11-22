"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { useState } from "react";
import { projects, profile, type Project } from "@/data/profile";
import ProjectVisual from "../ProjectVisual";
import { GitHubIcon, Reveal, SectionHeading, TiltCard } from "../ui";

const filters = ["All", "Generative AI", "Machine Learning", "Data Analytics", "Python Development"] as const;

function ProjectCard({ p, large }: { p: Project; large?: boolean }) {
  return (
    <TiltCard max={5}>
      <article className="flex h-full flex-col">
        <div className={`relative overflow-hidden border-b border-line bg-gradient-to-br from-navy/80 to-ink ${large ? "aspect-[16/8]" : "aspect-[16/9]"}`}>
          <div aria-hidden className="grid-bg absolute inset-0 opacity-60" />
          <div className="absolute inset-0 p-4 transition duration-700 group-hover:scale-[1.04]">
            <ProjectVisual kind={p.visual} />
          </div>
          <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan backdrop-blur">
            {p.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-xl font-semibold leading-snug text-soft md:text-2xl">{p.title}</h3>
            {p.period && <span className="shrink-0 pt-1 font-mono text-[11px] text-muted">{p.period}</span>}
          </div>

          <dl className="mt-4 space-y-3 text-sm leading-relaxed">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-violet">Problem</dt>
              <dd className="mt-1 text-muted">{p.problem}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-cyan">Solution</dt>
              <dd className="mt-1 text-soft/85">{p.solution}</dd>
            </div>
          </dl>

          <ul className="mt-4 space-y-1.5 text-sm text-soft/80">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" aria-hidden />
                {f}
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {p.tech.map((t) => (
              <li key={t} className="rounded-md border border-line bg-ink/50 px-2.5 py-1 font-mono text-[11px] text-soft/80">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-soft transition hover:border-cyan/60 hover:text-cyan"
              >
                <GitHubIcon className="h-4 w-4" /> View code <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Lock className="h-4 w-4" /> Professional project · code not public
              </span>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const list = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 md:py-36" aria-labelledby="projects-title">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(168,85,247,0.08),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04"
          eyebrow="Featured projects"
          title={
            <span id="projects-title">
              From <span className="text-gradient">AI agents</span> to analytics.
            </span>
          }
          lead="Generative AI, machine learning and data projects — with the problem, the approach and the results."
        />

        <Reveal>
          <div className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]" role="group" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  filter === f ? "border-cyan bg-cyan/15 text-cyan" : "border-line text-muted hover:text-soft"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.05 }}
              >
                <ProjectCard p={p} large={p.featured} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-12 text-center">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-6 py-3 text-soft transition hover:border-cyan/50"
          >
            <GitHubIcon className="h-4 w-4" /> More on GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
