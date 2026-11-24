"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, type TouchEvent } from "react";

export type LightboxItem = { src: string; alt: string; caption?: string; note?: string; w: number; h: number };

/**
 * Full-screen, accessible image viewer.
 * Keyboard: ← → to navigate, Esc to close. Touch: swipe left/right, swipe down to close.
 * Locks background scroll and returns focus to the element that opened it.
 */
export default function Lightbox({
  items,
  index,
  onChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const dir = useRef(1);

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      dir.current = d;
      onChange((index + d + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      html.style.overflow = prev;
      document.body.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        // keep focus inside the dialog
        const nodes = document.querySelectorAll<HTMLElement>("[data-lightbox] button");
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  // Preload neighbours for instant navigation
  useEffect(() => {
    if (index === null) return;
    [1, -1].forEach((d) => {
      const img = new Image();
      img.src = items[(index + d + items.length) % items.length].src;
    });
  }, [index, items]);

  function onTouchStart(e: TouchEvent) {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: TouchEvent) {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > 90) onClose();
  }

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          data-lightbox
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index! + 1} of ${items.length}: ${item.alt}`}
          className="fixed inset-0 z-[80] flex flex-col bg-[#01030a]/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-4 pt-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-mono text-xs tracking-[0.2em] text-soft/70" aria-live="polite">
              {String(index! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <button
              ref={closeBtn}
              onClick={onClose}
              aria-label="Close photo viewer"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-soft transition hover:border-cyan/60 hover:text-cyan"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-20">
            <AnimatePresence mode="wait" custom={dir.current}>
              <motion.img
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={item.w}
                height={item.h}
                custom={dir.current}
                initial={{ opacity: 0, x: dir.current * 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir.current * -40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-[0_30px_100px_-20px_rgba(34,211,238,0.25)]"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />
            </AnimatePresence>
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink/70 text-soft transition hover:border-cyan/60 hover:text-cyan sm:left-5 sm:grid"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink/70 text-soft transition hover:border-cyan/60 hover:text-cyan sm:right-5 sm:grid"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 pb-5 text-center sm:pb-7" onClick={(e) => e.stopPropagation()}>
            {item.caption && <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">{item.caption}</p>}
            {item.note && <p className="mt-1.5 text-sm text-soft/85">{item.note}</p>}
            <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
              <button onClick={() => go(-1)} aria-label="Previous photo" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-soft">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="text-xs text-muted">Swipe to browse</span>
              <button onClick={() => go(1)} aria-label="Next photo" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-soft">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
