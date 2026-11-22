"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, GraduationCap, LineChart, Sparkles } from "lucide-react";
import { useRef } from "react";
import { about } from "@/data/profile";
import { Reveal, SectionHeading } from "../ui";

const icons = [Brain, Sparkles, LineChart, GraduationCap];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" className="relative py-24 md:py-36" aria-labelledby="about-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="01"
          eyebrow="About me"
          title={
            <span id="about-title">
              Hands-on AI practitioner. <span className="text-gradient">Educator at heart.</span>
            </span>
          }
        />

        <div ref={ref} className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-md lg:mx-0">
            <motion.div style={{ y }} className="relative">
              <div aria-hidden className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan/30 via-electric/10 to-violet/30 blur-xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-line">
                <img
                  src="/images/about.webp"
                  alt="Santhanam L in a training lab"
                  width={1000}
                  height={1094}
                  loading="lazy"
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5 pt-16">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">M.Sc. Computer Science</p>
                  <p className="mt-1 text-sm text-soft/90">Bharathiar University · 2022</p>
                </div>
              </div>
            </motion.div>
          </Reveal>

          <div>
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className={`leading-relaxed text-muted ${i === 0 ? "text-lg text-soft/90 md:text-xl" : "mt-5 text-base md:text-lg"}`}>
                  {p}
                </p>
              </Reveal>
            ))}

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {about.pillars.map((pl, i) => {
                const Icon = icons[i];
                return (
                  <Reveal key={pl.title} delay={0.1 + i * 0.08}>
                    <div className="glass group h-full rounded-2xl p-5 transition hover:border-cyan/40">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan transition group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="font-display text-lg font-semibold text-soft">{pl.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{pl.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
