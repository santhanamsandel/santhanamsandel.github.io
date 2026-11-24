"use client";

import { useEffect, useRef } from "react";

/**
 * One shared IntersectionObserver for every scroll reveal on the page.
 * Elements get the `is-in` class once they enter the viewport; the animation itself is pure CSS
 * (see `[data-reveal]` in globals.css), so there is no per-element JS animation work.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer || typeof window === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          observer!.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -60px 0px" },
  );
  return observer;
}

export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el) return;
    if (!io) {
      el.classList.add("is-in");
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}
