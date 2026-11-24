"use client";

import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { useReveal } from "@/lib/reveal";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  id?: string;
  align?: "center" | "left";
}) {
  const ref = useReveal<HTMLDivElement>();
  const words = title.split(" ");
  const center = align === "center";
  let n = 0;
  return (
    <div ref={ref} data-heading className={`mb-14 md:mb-20 ${center ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}`}>
      <p className="heading-eyebrow font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-cyan">{eyebrow}</p>
      <h2 id={id} aria-label={title} className="mt-4 font-wide text-[clamp(2rem,7vw,5.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-soft">
        {words.map((w, wi) => (
          <span key={wi} aria-hidden className="inline-block whitespace-nowrap pb-1 align-bottom [overflow-y:clip]">
            {w.split("").map((ch, i) => (
              <span key={i} className="split-letter" style={{ "--i": n++ } as CSSProperties}>
                {ch}
              </span>
            ))}
            {wi < words.length - 1 ? "\u00a0" : <span className="split-letter text-glow text-cyan" style={{ "--i": n++ } as CSSProperties}>.</span>}
          </span>
        ))}
      </h2>
      <span className={`heading-bar accent-bar mt-5 ${center ? "mx-auto" : ""}`} />
      {lead && <p className={`heading-lead mt-6 text-base leading-relaxed text-muted md:text-lg ${center ? "mx-auto max-w-2xl" : ""}`}>{lead}</p>}
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
  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${to.toFixed(decimals)}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = `${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, to, decimals, suffix]);
  // Server HTML shows the final value (good for SEO / no-JS); the count-up starts when visible.
  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      {to.toFixed(decimals)}
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

/** Subtle magnetic pull toward the cursor (mouse only; inert on touch and reduced motion). */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <motion.div className="inline-flex" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}

/** Mounts its children only once the placeholder nears the viewport (keeps initial DOM small). */
export function LazyMount({ children, className = "", rootMargin = "300px" }: { children: ReactNode; className?: string; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setShow(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  );
}
