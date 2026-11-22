"use client";

import dynamic from "next/dynamic";
import { useIsMobile, useReducedMotion, useWebGL } from "@/lib/hooks";

const Embers = dynamic(() => import("./three/Embers"), { ssr: false });

/** Fixed, page-wide cinematic backdrop: glowing embers + soft colour pools. */
export default function Backdrop() {
  const webgl = useWebGL();
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_15%_20%,rgba(30,64,175,0.22),transparent),radial-gradient(ellipse_55%_45%_at_85%_75%,rgba(8,145,178,0.16),transparent)]" />
      <div className="grid-bg absolute inset-0 opacity-60" />
      {webgl && <Embers low={mobile} animate={!reduced} />}
    </div>
  );
}
