"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { useMemo, useRef, type PointerEvent } from "react";
import { profile } from "@/data/profile";
import { useInView, useIsMobile, useReducedMotion, useWebGL } from "@/lib/hooks";
import { GitHubIcon, LinkedInIcon } from "./ui";

const Smoke = dynamic(() => import("./three/Smoke"), { ssr: false });
const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------- Shattered glass geometry ---------------- */
type Shard = { points: [number, number][]; cx: number; cy: number; depth: number; delay: number };

/** Deterministic pseudo-random so server + client render identical shards. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function buildShards(rays: number, rings: number[], impact: [number, number]) {
  const rand = rng(42);
  const angles = Array.from({ length: rays }, (_, i) => (i / rays) * Math.PI * 2 + (rand() - 0.5) * 0.45);
  const grid: [number, number][][] = [];
  for (let ri = 0; ri <= rings.length; ri++) {
    grid.push(
      Array.from({ length: rays }, (_, ai): [number, number] => {
        if (ri === 0) return impact;
        const r = rings[ri - 1] * (0.82 + rand() * 0.36);
        return [impact[0] + Math.cos(angles[ai]) * r * 0.75, impact[1] + Math.sin(angles[ai]) * r];
      }),
    );
  }
  const shards: Shard[] = [];
  const cracks: string[] = [];
  for (let ri = 0; ri < rings.length; ri++) {
    for (let ai = 0; ai < rays; ai++) {
      const a = grid[ri][ai];
      const b = grid[ri][(ai + 1) % rays];
      const c = grid[ri + 1][(ai + 1) % rays];
      const d = grid[ri + 1][ai];
      const pts: [number, number][] = ri === 0 ? [a, c, d] : [a, b, c, d];
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      shards.push({ points: pts, cx, cy, depth: 0.4 + rand() * 1.2, delay: ri * 0.12 + rand() * 0.25 });
      cracks.push(`M${a[0]} ${a[1]} L${d[0]} ${d[1]}`);
      if (ri > 0) cracks.push(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`);
    }
  }
  return { shards, cracks };
}

function ShardPiece({ s, impact, mx, my, burst, animate }: {
  s: Shard;
  impact: [number, number];
  mx: MotionValue<number>;
  my: MotionValue<number>;
  burst: MotionValue<number>;
  animate: boolean;
}) {
  const dx = s.cx - impact[0];
  const dy = s.cy - impact[1];
  const len = Math.hypot(dx, dy) || 1;
  // pointer parallax + scroll "burst" outward from the impact point
  const x = useTransform(() => mx.get() * 14 * s.depth + (dx / len) * burst.get() * 200 * s.depth);
  const y = useTransform(() => my.get() * 10 * s.depth + (dy / len) * burst.get() * 200 * s.depth);
  const rotate = useTransform(burst, (b) => b * (dx > 0 ? 16 : -16) * s.depth);
  const poly = `polygon(${s.points.map(([px, py]) => `${px}% ${py}%`).join(",")})`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath: poly, WebkitClipPath: poly, x, y, rotate, transformOrigin: `${s.cx}% ${s.cy}%` }}
      initial={animate ? { opacity: 0, scale: 1.3 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.7 + s.delay, ease }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${110 + s.depth * 70}deg, rgba(255,255,255,${0.025 + s.depth * 0.035}) 0%, rgba(125,211,252,${0.02 + s.depth * 0.025}) 40%, rgba(255,255,255,0) 75%)`,
        }}
      />
    </motion.div>
  );
}

function Glass({ mx, my, burst, mobile, animate }: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  burst: MotionValue<number>;
  mobile: boolean;
  animate: boolean;
}) {
  const impact = useMemo<[number, number]>(() => (mobile ? [60, 26] : [71, 30]), [mobile]);
  const { shards, cracks } = useMemo(
    () => buildShards(mobile ? 7 : 10, mobile ? [16, 42, 150] : [11, 28, 60, 160], impact),
    [mobile, impact],
  );
  const crackOpacity = useTransform(burst, [0, 0.5], [1, 0]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {shards.map((s, i) => (
        <ShardPiece key={`${mobile}-${i}`} s={s} impact={impact} mx={mx} my={my} burst={burst} animate={animate} />
      ))}
      <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ opacity: crackOpacity }}>
        <defs>
          <linearGradient id="crack" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {cracks.map((d, i) => (
          <motion.path
            key={`${mobile}-${i}`}
            d={d}
            stroke="url(#crack)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            fill="none"
            initial={animate ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 + (i % 14) * 0.04, ease }}
          />
        ))}
        <motion.circle
          cx={impact[0]}
          cy={impact[1]}
          r="0.5"
          fill="#e0f2fe"
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: [0, 1, 0.7] }}
          transition={{ duration: 1, delay: 0.45 }}
        />
      </motion.svg>
      <div className="absolute inset-0 overflow-hidden">
        <div className="glass-sweep absolute -inset-y-10 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </div>
  );
}

/* ---------------- Hero ---------------- */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, "0px");
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const animate = !reduced;

  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const burstRaw = useTransform(scrollYProgress, [0, 0.8], [0, reduced ? 0 : 1]);
  const burst = useSpring(burstRaw, { stiffness: 90, damping: 22 });
  const panelScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const panelOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0.15]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const photoX = useTransform(mx, (v) => v * -14);

  function onMove(e: PointerEvent) {
    if (e.pointerType !== "mouse" || reduced) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mxRaw.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    myRaw.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      className="relative h-[100svh] min-h-[620px] w-full px-2.5 pb-2.5 pt-[4.6rem] sm:px-4 sm:pb-4 md:pt-[5.5rem]"
      aria-label="Introduction"
    >
      <motion.div
        style={{ scale: panelScale, opacity: panelOpacity }}
        className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#020611] shadow-[0_40px_120px_-30px_rgba(34,211,238,0.3)] md:rounded-[32px]"
      >
        {/* Smoke backdrop (CSS fallback underneath) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_68%_55%,#0d2a6b_0%,#041026_45%,#020611_80%)]" />
        {webgl && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <Smoke low={isMobile} animate={animate} active={inView} />
          </motion.div>
        )}

        {/* Cinematic portrait */}
        <motion.div
          style={{ y: photoY, x: photoX }}
          className="absolute inset-x-0 bottom-0 top-[-3%] z-10 flex justify-center md:left-auto md:right-[2%] md:top-[-5%] lg:right-[6%]"
        >
          <motion.div
            className="relative h-full"
            initial={animate ? { opacity: 0, scale: 1.1, filter: "brightness(0) blur(14px)" } : false}
            animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)", transitionEnd: { filter: "none" } }}
            transition={{ duration: 2.2, delay: 0.15, ease }}
          >
            <div className="absolute inset-x-[8%] top-[4%] h-[55%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.45),rgba(59,130,246,0.16)_45%,transparent_70%)] blur-3xl" />
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/hero-cinematic-sm.webp" />
              <img
                src="/images/hero-cinematic.webp"
                alt="Santhanam L, smiling, in a white shirt with a training lanyard"
                width={1300}
                height={1966}
                fetchPriority="high"
                draggable={false}
                className="relative h-full w-auto max-w-none select-none object-contain object-bottom [mask-image:linear-gradient(to_right,transparent_0%,black_24%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_24%)]"
              />
            </picture>
          </motion.div>
        </motion.div>

        {/* Shattered glass */}
        <Glass mx={mx} my={my} burst={burst} mobile={isMobile} animate={animate} />

        {/* Readability gradients */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-[65%] bg-gradient-to-r from-[#020611]/95 via-[#020611]/55 to-transparent md:block" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[58%] bg-gradient-to-t from-[#020611] via-[#020611]/80 to-transparent md:h-1/3" />

        {/* Copy */}
        <motion.div
          style={{ y: textY }}
          className="absolute inset-x-0 bottom-0 z-30 px-5 pb-7 text-center sm:px-8 md:inset-y-0 md:right-auto md:flex md:w-[72%] md:flex-col md:justify-center md:pb-0 md:pl-12 md:text-left lg:pl-16"
        >
          <motion.p
            className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-cyan sm:text-xs"
            initial={animate ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
          >
            AI/ML Engineer <span className="text-soft/40">•</span> Technical Trainer
          </motion.p>

          <h1 className="mt-3 font-wide text-[clamp(1.9rem,8.6vw,3.4rem)] md:text-[clamp(2.4rem,5.4vw,6.2rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-soft">
            <span className="sr-only">Santhanam L</span>
            <span aria-hidden className="block whitespace-nowrap py-1 [overflow-y:clip]">
              {"SANTHANAM".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={animate ? { y: "110%", opacity: 0 } : false}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.9, delay: 1.2 + i * 0.045, ease }}
                >
                  {ch}
                </motion.span>
              ))}
              <motion.span
                className="text-glow inline-block text-cyan"
                initial={animate ? { y: "110%", opacity: 0 } : false}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.65, ease }}
              >
                &nbsp;L.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-4 font-wide text-[10.5px] font-medium uppercase tracking-[0.12em] text-soft/90 sm:text-sm lg:text-base"
            initial={animate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.8, ease }}
          >
            Generative AI Specialist <span className="mx-1.5 text-cyan">/</span> Data &amp; AI Educator
          </motion.p>

          <motion.p
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-soft/70 sm:text-base md:mx-0"
            initial={animate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.95, ease }}
          >
            Building practical AI — and training the people who use it. 380+ learners and professionals upskilled.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:justify-start"
            initial={animate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.1, ease }}
          >
            <a href="#projects" className="btn-primary group inline-flex items-center gap-2 px-5 py-3.5 font-wide text-[10.5px] font-bold uppercase tracking-[0.12em] sm:px-6 sm:text-xs">
              Explore my work <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href={profile.resume} download className="btn-ghost inline-flex items-center gap-2 px-5 py-3.5 font-wide text-[10.5px] font-bold uppercase tracking-[0.12em] text-soft transition sm:px-6 sm:text-xs">
              <Download className="h-4 w-4" /> Resume
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="btn-ghost grid h-12 w-12 place-items-center text-soft transition">
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="btn-ghost hidden h-12 w-12 place-items-center text-soft transition sm:grid">
              <GitHubIcon className="h-[18px] w-[18px]" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 right-6 z-30 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-soft/60 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          <span className="h-px w-10 bg-soft/30" /> {profile.location}
        </motion.div>
        <motion.a
          href="#stats"
          aria-label="Scroll to content"
          className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 text-soft/60 hover:text-cyan md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
        >
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </motion.a>
      </motion.div>
    </section>
  );
}
