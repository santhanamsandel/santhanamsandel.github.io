"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/profile";
import { CountUp } from "../ui";

export default function Stats() {
  return (
    <section id="stats" aria-label="Impact" className="relative px-3 py-20 sm:px-6 md:py-28 lg:px-8">
      <motion.div
        className="glass-strong relative mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-[28px] md:grid-cols-4"
        initial={{ opacity: 0, y: 60, rotateX: 18 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200 }}
      >
        <div aria-hidden className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-electric/15 blur-3xl" />
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className={`relative px-5 py-9 sm:px-8 md:py-12 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} ${i === 1 ? "md:border-r" : ""} border-white/10`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
          >
            <p className="font-wide text-[2rem] font-extrabold text-soft sm:text-5xl lg:text-[3.2rem] xl:text-6xl">
              <CountUp to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
            </p>
            <span className="accent-bar mt-4 !w-8" />
            <p className="mt-4 font-wide text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-soft/85 sm:text-xs">{s.label}</p>
            <p className="mt-1 text-xs text-muted">{s.note}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
