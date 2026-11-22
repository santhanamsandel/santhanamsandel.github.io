"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bot, Code2, Cpu } from "lucide-react";
import { useState } from "react";
import { skillGroups } from "@/data/profile";
import { Reveal, SectionHeading, TiltCard } from "../ui";

const icons: Record<string, typeof Cpu> = { ai: Cpu, genai: Bot, data: BarChart3, dev: Code2 };
const accents: Record<string, string> = {
  ai: "from-cyan/25 to-electric/5",
  genai: "from-violet/25 to-cyan/5",
  data: "from-electric/25 to-cyan/5",
  dev: "from-cyan/20 to-violet/5",
};

export default function Skills() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === active)!;
  const all = skillGroups.flatMap((g) => g.items);

  return (
    <section id="skills" className="relative py-24 md:py-36" aria-labelledby="skills-title">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(59,130,246,0.08),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="02"
          eyebrow="Technical skills"
          title={
            <span id="skills-title">
              The stack I <span className="text-gradient">build & teach</span> with.
            </span>
          }
          lead="Technologies from my resume, training work and public GitHub projects — grouped by how I use them."
        />

        {/* Category cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Skill categories">
          {skillGroups.map((g, i) => {
            const Icon = icons[g.id];
            const selected = g.id === active;
            return (
              <Reveal key={g.id} delay={i * 0.06}>
                <TiltCard className={selected ? "!border-cyan/60" : ""}>
                  <button
                    role="tab"
                    aria-selected={selected}
                    aria-controls="skill-panel"
                    id={`tab-${g.id}`}
                    onClick={() => setActive(g.id)}
                    className="relative flex h-full w-full flex-col items-start p-6 text-left"
                  >
                    <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${accents[g.id]} transition-opacity ${selected ? "opacity-100" : "opacity-0"}`} />
                    <span
                      className="relative grid h-12 w-12 place-items-center rounded-xl border border-cyan/30 bg-ink/60 text-cyan"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="relative mt-5 font-display text-xl font-semibold text-soft" style={{ transform: "translateZ(20px)" }}>
                      {g.title}
                    </span>
                    <span className="relative mt-2 text-sm text-muted">{g.blurb}</span>
                    <span className="relative mt-4 font-mono text-xs text-cyan/80">{g.items.length} technologies</span>
                  </button>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Active panel */}
        <div id="skill-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="glass mt-6 rounded-2xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.ul
              key={active}
              className="flex flex-wrap gap-2.5"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.03 } }, hidden: {} }}
            >
              {group.items.map((s) => (
                <motion.li
                  key={s}
                  variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } }}
                  className="rounded-xl border border-line bg-ink/50 px-4 py-2.5 text-sm text-soft transition hover:-translate-y-0.5 hover:border-cyan/50 hover:text-cyan"
                >
                  {s}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>

      {/* Tech marquee */}
      <div className="relative mt-16 overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl text-soft/25 md:text-3xl">
          {[...all, ...all].map((s, i) => (
            <span key={i} className="flex items-center gap-10">
              {s} <span className="text-cyan/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
