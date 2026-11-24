"use client";

import { useEffect, useState, type RefObject } from "react";

function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export const useIsMobile = () => useMedia("(max-width: 767px)");
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");

/** True while the element is (nearly) on screen — used to pause WebGL when hidden. */
export function useInView(ref: RefObject<Element | null>, rootMargin = "200px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** WebGL availability check (computed once per page) so we can fall back gracefully. */
let webglCache: boolean | null = null;
export function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(webglCache);
  useEffect(() => {
    if (webglCache === null) {
      try {
        const c = document.createElement("canvas");
        const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
        webglCache = !!gl;
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        webglCache = false;
      }
    }
    setOk(webglCache);
  }, []);
  return ok;
}

/** Becomes true once the page has loaded and the browser is idle — used to defer heavy WebGL. */
export function useIdle(timeout = 1200) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const done = () => !cancelled && setIdle(true);
    const schedule = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(done, { timeout });
      else setTimeout(done, timeout);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
    };
  }, [timeout]);
  return idle;
}
