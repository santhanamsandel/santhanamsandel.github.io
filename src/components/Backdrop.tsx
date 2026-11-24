"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useFinePointer, useIdle, useIsMobile, useReducedMotion, useWebGL } from "@/lib/hooks";

const Embers = dynamic(() => import("./three/Embers"), { ssr: false });

/** Fixed, page-wide cinematic backdrop: soft colour pools, glowing embers and a cursor spotlight. */
export default function Backdrop() {
  const webgl = useWebGL();
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const idle = useIdle(1500);
  const spot = useRef<HTMLDivElement>(null);

  // Cursor spotlight: written straight to CSS variables (no React re-renders)
  useEffect(() => {
    if (!fine || reduced) return;
    let raf = 0;
    let x = -1000;
    let y = -1000;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          spot.current?.style.setProperty("--x", `${x}px`);
          spot.current?.style.setProperty("--y", `${y}px`);
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_15%_20%,rgba(30,64,175,0.22),transparent),radial-gradient(ellipse_55%_45%_at_85%_75%,rgba(8,145,178,0.16),transparent)]" />
        <div className="grid-bg absolute inset-0 opacity-60" />
        {webgl && idle && !mobile && <Embers low={false} animate={!reduced} />}
      </div>
      {fine && !reduced && (
        <div
          ref={spot}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: "radial-gradient(520px circle at var(--x, -1000px) var(--y, -1000px), rgba(56,189,248,0.07), transparent 60%)" }}
        />
      )}
    </>
  );
}
