"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import { experience } from "@/data/profile";
import { Reveal, SectionHeading } from "../ui";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="experience" className="relative py-24 md:py-36" aria-labelledby="exp-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03"
          eyebrow="Professional experience"
          title={
            <span id="exp-title">
              Training teams. <span className="text-gradient">Building skills that ship.</span>
            </span>
          }
          lead="From corporate AI training for an IBM Business Partner to leading analytics and AI cohorts for workforce-development foundations."
        />

        <div ref={ref} className="relative">
          {/* Track + progress line */}
          <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2" />
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-cyan via-electric to-violet md:left-1/2"
          />

          <ol className="space-y-12 md:space-y-20">
            {experience.map((job, i) => {
              const right = i % 2 === 1;
              return (
                <li key={job.org} className="relative grid md:grid-cols-2 md:gap-16">
                  {/* Node */}
                  <span
                    aria-hidden
                    className="absolute left-4 top-7 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border border-cyan bg-ink md:left-1/2"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full bg-cyan ${job.current ? "animate-ping" : ""}`} />
                  </span>

                  <div className={`hidden md:flex ${right ? "order-2 justify-start" : "justify-end"} pt-5`}>
                    <Reveal>
                      <p className="font-mono text-sm tracking-wider text-cyan">{job.period}</p>
                    </Reveal>
                  </div>

                  <Reveal className={`pl-10 md:pl-0 ${right ? "md:order-1" : ""}`} delay={0.1}>
                    <article className="glass rounded-2xl p-6 transition hover:border-cyan/40 md:p-8">
                      <p className="mb-3 font-mono text-xs tracking-wider text-cyan md:hidden">{job.period}</p>
                      <div className="flex items-start gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                          <Briefcase className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-display text-xl font-semibold text-soft md:text-2xl">{job.role}</h3>
                          <p className="text-muted">
                            {job.org}
                            {job.current && (
                              <span className="ml-2 rounded-full border border-cyan/40 bg-cyan/10 px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wider text-cyan">
                                Current
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <ul className="mt-5 space-y-3">
                        {job.points.map((p) => (
                          <li key={p} className="flex gap-3 text-sm leading-relaxed text-soft/80 md:text-[15px]">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Focus areas">
                        {job.tags.map((t) => (
                          <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
