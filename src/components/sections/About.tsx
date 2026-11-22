"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Brain, GraduationCap, LineChart, Sparkles } from "lucide-react";
import { about, profile } from "@/data/profile";
import { useReducedMotion } from "@/lib/hooks";
import { Reveal, SectionHeading } from "../ui";

const icons = [Brain, Sparkles, LineChart, GraduationCap];
const focus = ["AI & ML Engineering", "Generative AI", "Data Analytics", "Technical Training"];
const tech = ["Python", "Scikit-Learn", "LLMs", "IBM Watsonx", "Power BI", "SQL"];

/** ID badge hanging from a lanyard — drag it and it swings back. */
function HangingBadge() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-200, 200], [20, -20]), { stiffness: 140, damping: 7 });
  // strap from the pivot to the card clip, following the card
  const strapL = useTransform(() => `M 128 0 L ${150 + x.get() - 14} ${150 + y.get()}`);
  const strapR = useTransform(() => `M 172 0 L ${150 + x.get() + 14} ${150 + y.get()}`);

  return (
    <div className="relative mx-auto h-[600px] w-[300px] select-none sm:h-[640px]">
      <svg className="pointer-events-none absolute left-0 top-0 h-[260px] w-[300px] overflow-visible" viewBox="0 0 300 260" aria-hidden>
        <defs>
          <linearGradient id="strap" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0e7490" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <motion.path d={strapL} stroke="url(#strap)" strokeWidth="9" strokeLinecap="round" fill="none" />
        <motion.path d={strapR} stroke="url(#strap)" strokeWidth="9" strokeLinecap="round" fill="none" />
      </svg>

      <motion.div
        className="absolute left-1/2 top-[150px] -ml-[130px] w-[260px] cursor-grab touch-none active:cursor-grabbing"
        style={{ x, y, rotate, transformOrigin: "50% 0%" }}
        drag={!reduced}
        dragElastic={0.5}
        dragConstraints={{ left: -160, right: 160, top: -60, bottom: 160 }}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 180, bounceDamping: 7 }}
        initial={reduced ? false : { y: -420 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 70, damping: 7, mass: 1.1 }}
      >
        <motion.div
          animate={reduced ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50% -20px" }}
        >
          {/* metal clip */}
          <div className="mx-auto h-7 w-12 rounded-md border border-white/20 bg-gradient-to-b from-slate-300 to-slate-500 shadow-lg" />
          <div className="glass-strong -mt-2 overflow-hidden rounded-[22px] p-3 shadow-[0_40px_80px_-20px_rgba(34,211,238,0.35)]">
            <div className="mx-auto mb-3 h-2 w-16 rounded-full bg-ink/80" />
            <div className="relative overflow-hidden rounded-2xl border border-cyan/20">
              <img src="/images/badge.webp" alt="Santhanam L speaking to learners with a microphone" width={620} height={784} loading="lazy" draggable={false} className="h-auto w-full" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020611] via-[#020611]/70 to-transparent p-4 pt-14 text-center">
                <p className="font-wide text-lg font-extrabold uppercase tracking-wide text-soft">{profile.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">Technical Trainer</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between px-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
              <span>AI · ML · Data</span>
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="h-3 bg-soft/60" style={{ width: i % 3 ? 1 : 2 }} />
                ))}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <p className="absolute bottom-2 w-full text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">Drag the badge</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32" aria-labelledby="about-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="about-title" eyebrow="Engineer · Educator · Mentor" title="About me" />

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="glass-strong rounded-[28px] p-6 sm:p-9">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className={i === 0 ? "text-lg leading-relaxed text-soft md:text-xl" : "mt-5 leading-relaxed text-muted md:text-lg"}>{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.15}>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Technologies</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tech.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 bg-ink/60 px-4 py-2 text-sm font-medium text-soft">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Areas of focus</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {focus.map((f, i) => {
                  const Icon = icons[i];
                  return (
                    <li key={f} className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 transition hover:border-cyan/40">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan" aria-hidden />
                      <span>
                        <span className="block text-sm font-semibold text-soft">{f}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{about.pillars[i].text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          <HangingBadge />
        </div>
      </div>
    </section>
  );
}
