"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = { layers: number; active: number; animate: boolean; running: boolean; low: boolean };

const SIZES = [4, 6, 7, 7, 6, 4, 3];

function Net({ layers, active, animate, low }: Omit<Props, "running">) {
  const group = useRef<THREE.Group>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const nodeMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const { viewport } = useThree();
  const fit = Math.min(1, viewport.width / ((layers - 1) * 1.25 + 1.6));

  const { nodes, edges, edgeLayer } = useMemo(() => {
    const spacing = 1.25;
    const nodes: { pos: THREE.Vector3; layer: number }[] = [];
    for (let l = 0; l < layers; l++) {
      const n = SIZES[l % SIZES.length];
      for (let k = 0; k < n; k++) {
        const angle = (k / n) * Math.PI * 2;
        const r = 0.35 + n * 0.11;
        nodes.push({
          pos: new THREE.Vector3((l - (layers - 1) / 2) * spacing, Math.cos(angle) * r, Math.sin(angle) * r),
          layer: l,
        });
      }
    }
    const edges: [THREE.Vector3, THREE.Vector3][] = [];
    const edgeLayer: number[] = [];
    for (const a of nodes) for (const b of nodes) if (b.layer === a.layer + 1) {
      edges.push([a.pos, b.pos]);
      edgeLayer.push(a.layer);
    }
    return { nodes, edges, edgeLayer };
  }, [layers]);

  const edgeGeo = useMemo(() => {
    const pos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => pos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3));
    return g;
  }, [edges]);
  const colors = edgeGeo.getAttribute("color") as THREE.BufferAttribute;

  // Recolor edges when active stage changes
  useMemo(() => {
    const on = new THREE.Color("#22d3ee");
    const done = new THREE.Color("#3b82f6");
    const off = new THREE.Color("#1e293b");
    edgeLayer.forEach((l, i) => {
      const c = l < active ? (l === active - 1 ? on : done) : off;
      colors.setXYZ(i * 2, c.r, c.g, c.b);
      colors.setXYZ(i * 2 + 1, c.r, c.g, c.b);
    });
    colors.needsUpdate = true;
  }, [active, edgeLayer, colors]);

  const PULSES = low ? 24 : 60;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: PULSES }, () => Math.random()), [PULSES]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (group.current && animate) {
      group.current.rotation.y = Math.sin(t * 0.25) * 0.35;
      group.current.rotation.x = Math.sin(t * 0.18) * 0.12;
    }
    nodeMats.current.forEach((m, i) => {
      const l = nodes[i]?.layer ?? 0;
      const target = l === active ? 1 : l < active ? 0.75 : 0.22;
      m.opacity = THREE.MathUtils.lerp(m.opacity, target, Math.min(1, dt * 6));
      m.color.set(l === active ? "#a5f3fc" : l < active ? "#38bdf8" : "#475569");
    });
    // Signal pulses travel along edges up to the active layer
    if (pulses.current) {
      const usable = edges.map((_, i) => i).filter((i) => edgeLayer[i] < active);
      for (let p = 0; p < PULSES; p++) {
        if (!usable.length) {
          dummy.scale.setScalar(0);
        } else {
          const idx = usable[Math.floor(seeds[p] * usable.length)];
          const [a, b] = edges[idx];
          const f = animate ? (t * 0.6 + seeds[p] * 7) % 1 : 0.5;
          dummy.position.lerpVectors(a, b, f);
          dummy.scale.setScalar(1);
        }
        dummy.updateMatrix();
        pulses.current.setMatrixAt(p, dummy.matrix);
      }
      pulses.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group} scale={fit}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial
            ref={(m) => {
              if (m) nodeMats.current[i] = m;
            }}
            transparent
            opacity={0.3}
            color="#475569"
          />
        </mesh>
      ))}
      <instancedMesh ref={pulses} args={[undefined, undefined, PULSES]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#e0f2fe" />
      </instancedMesh>
    </group>
  );
}

export default function LabNetwork({ layers, active, animate, running, low }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 7.2], fov: 50 }}
      dpr={low ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !low, alpha: true }}
      frameloop={running && animate ? "always" : "demand"}
      aria-hidden
    >
      <Net layers={layers} active={active} animate={animate} low={low} />
    </Canvas>
  );
}
