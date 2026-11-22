"use client";

import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = "center",
  plain = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  id?: string;
  align?: "center" | "left";
  /** render without on-view letter animation (for scroll-driven containers) */
  plain?: boolean;
}) {
  const words = title.split(" ");
  const center = align === "center";
  return (
    <div className={`mb-14 md:mb-20 ${center ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}`}>
      <motion.p
        className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-cyan"
        initial={plain ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
      >
        {eyebrow}
      </motion.p>
      <h2 id={id} className="mt-4 font-wide text-[clamp(2.1rem,7vw,5.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-soft">
        {words.map((w, wi) => (
          <span key={wi} className="inline-block overflow-hidden whitespace-nowrap pb-1 align-bottom">
            {w.split("").map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={plain ? false : { y: "105%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: (wi * 6 + i) * 0.03, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            ))}
            {wi < words.length - 1 ? "\u00a0" : <span className="text-cyan text-glow">.</span>}
          </span>
        ))}
      </h2>
      <motion.span
        className={`accent-bar mt-5 ${center ? "mx-auto" : ""}`}
        initial={plain ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      {lead && (
        <Reveal delay={0.15}>
          <p className={`mt-6 text-base leading-relaxed text-muted md:text-lg ${center ? "mx-auto max-w-2xl" : ""}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Card that tilts in 3D toward the pointer (desktop only; inert on touch). */
export function TiltCard({
  children,
  className = "",
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    setGlow({ x: px * 100, y: py * 100 });
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`group relative h-full overflow-hidden rounded-2xl glass-strong transition-colors duration-300 hover:border-cyan/40 ${className}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, rgb(34 211 238 / 0.12), transparent 45%)`,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}

export function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export const LinkedInIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export const GitHubIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
  </svg>
);
