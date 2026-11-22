"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Page-wide field of glowing embers drifting upward, with pointer + scroll parallax. */
const vert = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // upward drift with wrap-around, plus gentle sideways sway
    p.y = mod(p.y + uTime * (0.12 + aSeed * 0.25) + 10.0, 20.0) - 10.0;
    p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (38.0 / -mv.z);
    vColor = aColor;
    float twinkle = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 40.0);
    vAlpha = twinkle * smoothstep(-10.0, -6.0, p.y) * (1.0 - smoothstep(6.0, 10.0, p.y));
  }
`;
const frag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 2.2);
    gl_FragColor = vec4(vColor * (0.6 + glow), glow * vAlpha);
  }
`;

function Field({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { pointer, gl } = useThree();

  const { positions, sizes, seeds, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#22d3ee"), new THREE.Color("#3b82f6"), new THREE.Color("#7dd3fc"), new THREE.Color("#a855f7")];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = -Math.random() * 14 - 1;
      const big = Math.random() < 0.06;
      sizes[i] = big ? 6 + Math.random() * 10 : 1 + Math.random() * 3.2;
      seeds[i] = Math.random();
      const c = palette[Math.random() < 0.08 ? 3 : Math.floor(Math.random() * 3)];
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, sizes, seeds, colors };
  }, [count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) } }), [gl]);

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current) {
      const scroll = typeof window !== "undefined" ? window.scrollY / window.innerHeight : 0;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, -pointer.x * 0.6, 0.03);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -pointer.y * 0.4 + scroll * 0.8, 0.06);
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function Embers({ low, animate }: { low: boolean; animate: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={low ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
      aria-hidden
    >
      <Field count={low ? 260 : 700} />
    </Canvas>
  );
}
