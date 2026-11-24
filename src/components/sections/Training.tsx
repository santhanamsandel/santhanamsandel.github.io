"use client";

import { ArrowRight, Building2, ClipboardCheck, Database, FolderKanban, Hammer, Handshake, Users } from "lucide-react";
import { useState } from "react";
import { teaching } from "@/data/profile";
import { Reveal, SectionHeading, TiltCard } from "../ui";

const areas = ["All", "Core", "Data", "AI"] as const;
const approachIcons = [Hammer, Database, FolderKanban, Handshake, ClipboardCheck, Building2];

export default function Training() {
  const [area, setArea] = useState<(typeof areas)[number]>("All");

  return (
    <section id="training" className="relative py-24 md:py-32" aria-labelledby="training-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="training-title"
          eyebrow="I don't just use AI — I teach it"
          title="Training"
          lead="Instructor-led, project-based programmes for students, career-switchers and corporate teams — built around real datasets, real assessments and real outcomes."
        />

        {/* Programmes delivered */}
        <div className="grid gap-4 md:grid-cols-3">
          {teaching.programmes.map((p, i) => (
            <Reveal key={p.org} delay={i * 0.08}>
              <TiltCard max={4}>
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                      <Users className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight text-soft">{p.org}</h3>
                      <p className="text-xs text-muted">{p.audience}</p>
                    </div>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Topics">
                    {p.topics.map((t) => (
                      <li key={t} className="rounded-full border border-white/10 bg-ink/60 px-2.5 py-1 font-mono text-[11px] text-soft/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto flex items-start gap-2 border-t border-white/10 pt-4 text-sm font-medium text-soft/90">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden /> {p.outcome}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Subjects + approach + portrait */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal className="mx-auto w-full max-w-md lg:mx-0">
            <figure className="relative overflow-hidden rounded-[24px] border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
              <div className="relative w-full" style={{ aspectRatio: "1000 / 1094" }}>
                <img
                  src="/images/about-sm.webp"
                  srcSet="/images/about-sm.webp 720w, /images/about.webp 1000w"
                  sizes="(max-width: 1024px) 90vw, 30vw"
                  alt="Santhanam in a white shirt and lanyard, seated in a training lab"
                  width={1000}
                  height={1094}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020611] via-[#020611]/70 to-transparent p-5 pt-16">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">Trainer · Mentor</p>
                <p className="mt-1 text-sm text-soft/90">Python · SQL · Power BI · Machine Learning · AI</p>
              </figcaption>
            </figure>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="font-display text-2xl font-semibold text-soft">Subjects I teach</h3>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter subjects">
                {areas.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    aria-pressed={area === a}
                    className={`min-h-9 rounded-full border px-4 py-1.5 text-xs transition ${
                      area === a ? "border-cyan bg-cyan/15 text-cyan" : "border-white/15 text-soft/70 hover:text-soft"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {teaching.subjects.map((s) => {
                  const on = area === "All" || s.area === area;
                  return (
                    <li
                      key={s.name}
                      className={`rounded-xl border px-3.5 py-2.5 text-sm transition duration-300 ${on ? "border-cyan/30 bg-cyan/5 text-soft opacity-100" : "border-white/10 text-soft/70 opacity-40"}`}
                    >
                      {s.name}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal>
              <h3 className="mt-10 font-display text-2xl font-semibold text-soft">How I teach</h3>
            </Reveal>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {teaching.approach.map((a, i) => {
                const Icon = approachIcons[i];
                return (
                  <Reveal key={a.title} delay={i * 0.04}>
                    <div className="group flex h-full gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan/40 hover:bg-white/[0.04]">
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
            <Reveal>
              <a href="#moments" className="mt-6 inline-flex min-h-11 items-center gap-2 py-2 text-sm text-cyan hover:underline">
                See classroom moments <ArrowRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
