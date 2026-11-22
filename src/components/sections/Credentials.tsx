"use client";

import { Award, BadgeCheck, GraduationCap } from "lucide-react";
import { certifications, education } from "@/data/profile";
import { Reveal, SectionHeading, TiltCard } from "../ui";

export default function Credentials() {
  return (
    <section id="credentials" className="relative py-24 md:py-36" aria-labelledby="cred-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="cred-title" eyebrow="Certifications & education" title="Credentials" />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {education.map((e, i) => (
              <Reveal key={e.degree} delay={i * 0.08}>
                <div className="glass-strong relative overflow-hidden rounded-2xl p-6">
                  <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan to-violet" />
                  <GraduationCap className="h-6 w-6 text-cyan" aria-hidden />
                  <h3 className="mt-4 font-display text-xl font-semibold text-soft">{e.degree}</h3>
                  <p className="mt-1 text-muted">{e.school}</p>
                  <p className="mt-3 font-mono text-xs text-cyan/80">{e.period}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.16}>
              <figure className="glass-strong flex items-center gap-4 overflow-hidden rounded-2xl p-4">
                <img src="/images/plaque.webp" alt="Appreciation plaque from a Department of Training and Placement naming Mr. Santhanam L" width={700} height={830} loading="lazy" className="h-28 w-auto rounded-lg border border-line object-cover" />
                <figcaption>
                  <p className="flex items-center gap-2 font-medium text-soft">
                    <Award className="h-4 w-4 text-violet" aria-hidden /> Recognition
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">Appreciation from a college Department of Training &amp; Placement for training delivered to students.</p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className={i === 0 ? "sm:col-span-2" : ""}>
                <TiltCard>
                  <div className="relative flex h-full flex-col p-6">
                    <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-cyan/10" />
                    <div aria-hidden className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-violet/15" />
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan">{c.issuer}</span>
                      <BadgeCheck className="h-6 w-6 text-cyan" aria-hidden />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-soft">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
                    <p className="mt-auto pt-5 font-mono text-xs text-muted">Issued {c.date}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
