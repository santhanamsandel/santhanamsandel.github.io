"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, profile } from "@/data/profile";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-line bg-ink/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Santhanam L — home">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan/30 bg-cyan/5 font-display text-sm font-bold text-cyan transition group-hover:border-cyan/70">
            SL
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-wide text-soft sm:block">
            Santhanam<span className="text-cyan">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                  active === n.id ? "text-soft" : "text-muted hover:text-soft"
                }`}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line bg-white/5"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resume}
            download
            className="hidden items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition hover:bg-cyan/20 sm:inline-flex"
          >
            <Download className="h-4 w-4" /> Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-soft lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-gradient-to-r from-cyan via-electric to-violet" />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-40 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 pt-8">
              {nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 font-display text-2xl text-soft"
                  >
                    {n.label}
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 pt-8">
              <a
                href={profile.resume}
                download
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-5 py-3.5 font-medium text-ink"
              >
                <Download className="h-4 w-4" /> Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
