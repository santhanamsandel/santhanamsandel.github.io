"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = { quality: "high" | "low"; animate: boolean; active: boolean };

/** Points evenly spread on a sphere (Fibonacci lattice). */
function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push(new THREE.Vector3(Math.cos(t) * rad * r, y * r, Math.sin(t) * rad * r));
  }
  return pts;
}

function Network({ count }: { count: number }) {
  const { nodes, edges, colors } = useMemo(() => {
    const pts = fibonacciSphere(count, 2.15);
    // jitter radius a bit so it feels organic
    pts.forEach((p, i) => p.multiplyScalar(1 + Math.sin(i * 12.9898) * 0.06));
    const nodes = new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]));
    const e: number[] = [];
    const c: number[] = [];
    const cyan = new THREE.Color("#22d3ee");
    const violet = new THREE.Color("#a855f7");
    const threshold = 2.15 * (count > 100 ? 0.42 : 0.55);
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < threshold) {
          e.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          const a = cyan.clone().lerp(violet, (pts[i].y + 2.2) / 4.4);
          const b = cyan.clone().lerp(violet, (pts[j].y + 2.2) / 4.4);
          c.push(a.r, a.g, a.b, b.r, b.g, b.b);
        }
      }
    }
    return { nodes, edges: new Float32Array(e), colors: new Float32Array(c) };
  }, [count]);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#9be7ff" transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#7dd3fc" transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

function Core({ quality, animate }: { quality: Props["quality"]; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const { viewport, pointer } = useThree();
  const isNarrow = viewport.width < 7;

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    if (animate) {
      group.current.rotation.y += dt * 0.12;
      // ease toward the pointer for a subtle parallax
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.25, 0.04);
      group.current.position.x = THREE.MathUtils.lerp(
        group.current.position.x,
        (isNarrow ? 0 : viewport.width * 0.2) + pointer.x * 0.25,
        0.05,
      );
      if (inner.current) {
        const s = 1 + Math.sin(t * 1.6) * 0.04;
        inner.current.scale.setScalar(s);
        inner.current.rotation.z -= dt * 0.3;
      }
      if (ring1.current) ring1.current.rotation.z += dt * 0.25;
      if (ring2.current) ring2.current.rotation.z -= dt * 0.18;
    }
  });

  const scale = isNarrow ? 0.85 : 1.15;
  return (
    <group ref={group} position={[isNarrow ? 0 : viewport.width * 0.2, isNarrow ? 0.9 : 0.1, 0]} scale={scale}>
      <Network count={quality === "high" ? 150 : 70} />
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.9, 0.006, 8, 160]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.7, -0.5, 0]}>
        <torusGeometry args={[3.25, 0.004, 8, 160]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function NeuralCore({ quality, animate, active }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      frameloop={active && animate ? "always" : "demand"}
      aria-hidden
    >
      <Core quality={quality} animate={animate} />
      <Dust count={quality === "high" ? 1400 : 450} />
    </Canvas>
  );
}
