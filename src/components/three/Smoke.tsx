"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Full-bleed animated volumetric smoke (domain-warped fbm) for the hero backdrop. */
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uOctaves;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) {
      if (float(i) >= uOctaves) break;
      v += a * noise(p);
      p = mat2(1.6, 1.2, -1.2, 1.6) * p;
      a *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.4;
    p += uMouse * 0.15;
    float t = uTime * 0.06;
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
    float f = fbm(p + 2.6 * r);

    vec3 deep = vec3(0.008, 0.016, 0.045);
    vec3 navy = vec3(0.03, 0.08, 0.22);
    vec3 blue = vec3(0.12, 0.36, 0.95);
    vec3 cyan = vec3(0.25, 0.85, 1.0);
    vec3 col = mix(deep, navy, smoothstep(0.15, 0.6, f));
    col = mix(col, blue, smoothstep(0.5, 0.85, f) * length(q) * 0.9);
    col += cyan * pow(smoothstep(0.62, 0.95, f * r.x * 1.6), 2.0) * 0.9;

    // light source behind the subject (upper right) + vignette
    vec2 lp = uv - vec2(0.68, 0.62);
    col += vec3(0.1, 0.45, 0.9) * exp(-dot(lp, lp) * 6.0) * 0.55;
    float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(1.3, 1.0)));
    col *= vig;
    // bottom fade
    col *= smoothstep(0.0, 0.25, uv.y) * 0.85 + 0.15;
    gl_FragColor = vec4(col, 1.0);
  }
`;
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function Plane({ octaves, animate }: { octaves: number; animate: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, pointer } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 8 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
      uOctaves: { value: octaves },
    }),
    [octaves],
  );
  useFrame((state) => {
    const m = mat.current;
    if (!m) return;
    if (animate) m.uniforms.uTime.value = 8 + state.clock.elapsedTime;
    m.uniforms.uRes.value.set(size.width, size.height);
    m.uniforms.uMouse.value.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.03);
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export default function Smoke({ low, animate, active }: { low: boolean; animate: boolean; active: boolean }) {
  return (
    <Canvas
      dpr={low ? 0.6 : [0.75, 1]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      frameloop={active && animate ? "always" : "demand"}
      aria-hidden
    >
      <Plane octaves={low ? 4 : 6} animate={animate} />
    </Canvas>
  );
}
