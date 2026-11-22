"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, profile } from "@/data/profile";

const links = nav.filter((n) => ["about", "experience", "projects", "lab", "training", "contact"].includes(n.id));

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-2.5 pt-2.5 sm:px-4 sm:pt-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        aria-label="Primary"
        className="glass-strong relative mx-auto flex h-14 max-w-7xl items-center justify-between overflow-hidden rounded-2xl px-4 sm:px-5 md:h-16"
      >
        <a href="#top" className="font-wide text-sm font-extrabold tracking-wide text-soft sm:text-base" aria-label="Santhanam L — home">
          <span className="text-cyan">S</span>ANTHANAM<span className="text-cyan">.</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`relative rounded-full px-3.5 py-2 font-wide text-[10.5px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  active === n.id ? "text-cyan" : "text-soft/65 hover:text-soft"
                }`}
              >
                {n.label}
                {active === n.id && (
                  <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_10px_#22d3ee]" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="btn-primary hidden px-4 py-2.5 font-wide text-[10px] font-bold uppercase tracking-[0.14em] sm:inline-flex"
          >
            Let&apos;s connect
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-soft lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cyan via-electric to-violet" />
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-strong fixed inset-x-2.5 top-[4.4rem] z-40 rounded-2xl p-3 lg:hidden"
          >
            <ul>
              {nav.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 font-wide text-sm font-bold uppercase tracking-[0.12em] text-soft active:bg-white/5"
                  >
                    {n.label}
                    <span className="font-mono text-[10px] text-cyan">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={profile.resume}
              download
              className="btn-primary mt-2 flex justify-center px-5 py-3.5 font-wide text-xs font-bold uppercase tracking-[0.14em]"
            >
              Download resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
