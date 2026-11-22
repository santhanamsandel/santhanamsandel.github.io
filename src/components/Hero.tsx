"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import { useRef } from "react";
import { profile, stats } from "@/data/profile";
import { useInView, useIsMobile, useReducedMotion, useWebGL } from "@/lib/hooks";
import { CountUp, LinkedInIcon, GitHubIcon } from "./ui";

const NeuralCore = dynamic(() => import("./three/NeuralCore"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

const chips = [
  { label: "LLM Agents", className: "left-[0%] top-[16%]", delay: 0 },
  { label: "Machine Learning", className: "right-[-4%] top-[36%]", delay: 0.8 },
  { label: "Power BI · SQL", className: "left-[2%] bottom-[26%]", delay: 1.6 },
  { label: "IBM Watsonx", className: "right-[-2%] bottom-[12%]", delay: 2.4 },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, "0px");
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const webgl = useWebGL();

  return (
    <section
      id="top"
      ref={ref}
      className="noise relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16"
      aria-label="Introduction"
    >
      {/* Backdrop */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,#0a1a3d_0%,#05070d_60%)]" />
      <div aria-hidden className="grid-bg absolute inset-0 -z-20" />
      {webgl && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <NeuralCore quality={isMobile ? "low" : "high"} animate={!reduced} active={inView} />
        </div>
      )}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-ink" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 px-4 pb-10 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-4 lg:px-8">
        {/* Portrait — first on mobile */}
        <motion.div
          className="relative order-1 mx-auto mt-4 w-[72%] max-w-[300px] sm:max-w-[340px] md:order-2 md:mt-0 md:w-full md:max-w-[480px]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease }}
        >
          {/* Rim-light halo */}
          <div aria-hidden className="absolute inset-x-[6%] bottom-[2%] top-[12%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.35),rgba(59,130,246,0.18)_40%,transparent_70%)] blur-2xl" />
          <div aria-hidden className="absolute inset-x-[10%] bottom-0 top-[18%] rounded-t-full border border-cyan/20 bg-gradient-to-b from-navy/80 via-charcoal/60 to-transparent" />
          <motion.div
            initial={{ clipPath: "inset(100% -30% 0% -30%)" }}
            animate={{ clipPath: "inset(-30% -30% 0% -30%)" }}
            transition={{ duration: 1.4, delay: 0.25, ease }}
            className="portrait-glow relative"
          >
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/hero-portrait-sm.webp" />
              <img
                src="/images/hero-portrait.webp"
                alt="Portrait of Santhanam L"
                width={1100}
                height={1315}
                fetchPriority="high"
                className="relative h-auto w-full select-none [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
                draggable={false}
              />
            </picture>
          </motion.div>
          {/* Floating technology chips (desktop) */}
          {chips.map((c) => (
            <motion.span
              key={c.label}
              className={`absolute hidden rounded-full border border-cyan/25 bg-ink/85 px-3.5 py-1.5 backdrop-blur font-mono text-[11px] tracking-wide text-soft lg:block ${c.className}`}
              initial={{ opacity: 0, y: 10 }}
              animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
              transition={
                reduced
                  ? { delay: 1.2 }
                  : { opacity: { delay: 1.2 + c.delay * 0.2 }, y: { duration: 5, repeat: Infinity, delay: c.delay, ease: "easeInOut" } }
              }
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan align-middle" />
              {c.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Copy */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <motion.p
            className="eyebrow flex items-center justify-center gap-2 !text-[10px] !tracking-[0.18em] sm:!text-xs md:justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            AI Engineering × Technical Training
          </motion.p>

          <h1 className="mt-4 font-display text-[clamp(2.6rem,6.4vw,6.25rem)] font-bold leading-[0.95] tracking-tight">
            {["Santhanam", "L."].map((w, i) => (
              <span key={w} className="inline-block overflow-hidden pb-2 align-bottom">
                <motion.span
                  className={`inline-block ${i === 1 ? "text-gradient" : "text-soft"}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.12, ease }}
                >
                  {w}
                  {i === 0 && " "}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display text-base font-medium text-soft/90 sm:text-lg md:justify-start lg:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {profile.headline.map((h, i) => (
              <span key={h} className="flex items-center gap-3">
                {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-cyan sm:block" aria-hidden />}
                {h}
              </span>
            ))}
          </motion.p>

          <motion.p
            className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base md:mx-0 md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease }}
          >
            {profile.intro}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease }}
          >
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-electric px-6 py-3.5 font-medium text-ink shadow-[0_0_30px_-6px_rgba(34,211,238,0.6)] transition hover:shadow-[0_0_44px_-4px_rgba(34,211,238,0.8)]"
            >
              View My Projects
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href={profile.resume}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/5 px-6 py-3.5 font-medium text-soft transition hover:border-cyan/50 hover:bg-white/10"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
            <div className="flex items-center justify-center gap-2">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="grid h-12 w-12 place-items-center rounded-full border border-line text-soft transition hover:border-cyan/50 hover:text-cyan"
              >
                <LinkedInIcon />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="grid h-12 w-12 place-items-center rounded-full border border-line text-soft transition hover:border-cyan/50 hover:text-cyan"
              >
                <GitHubIcon />
              </a>
            </div>
          </motion.div>

          <motion.p
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <MapPin className="h-4 w-4 text-cyan" /> {profile.location}
          </motion.p>
        </div>
      </div>

      {/* Impact strip */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <motion.dl
          className="glass grid grid-cols-2 divide-line overflow-hidden rounded-2xl md:grid-cols-4 md:divide-x"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4, ease }}
        >
          {stats.map((s) => (
            <div key={s.label} className="border-line p-4 text-center odd:border-r md:border-r-0 md:p-6 [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-2xl font-semibold text-soft sm:text-3xl md:text-4xl">
                <CountUp to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
              </dd>
              <dd className="mt-1 text-xs text-soft/80 sm:text-sm">{s.label}</dd>
              <dd className="mt-0.5 hidden text-xs text-muted sm:block">{s.note}</dd>
            </div>
          ))}
        </motion.dl>
        <a
          href="#about"
          className="mx-auto mt-6 hidden w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition hover:text-cyan md:flex"
        >
          <ArrowDown className="h-4 w-4 animate-bounce" /> Scroll
        </a>
      </div>
    </section>
  );
}
