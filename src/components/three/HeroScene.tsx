"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Deterministic pseudo-random in [0, 1) — pure with respect to `seed`,
 * unlike Math.random(), so it's safe to call from useMemo factories. */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function Shard({
  position,
  rotation,
  scale,
  speed,
  color,
  seed,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  color: string;
  seed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => seededRandom(seed) * Math.PI * 2, [seed]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.y = position[1] + Math.sin(t) * 0.35;
    ref.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.15;
    ref.current.rotation.y = rotation[1] + t * 0.05;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1.6, 2.1]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.14}
        roughness={0.15}
        metalness={0.1}
        transmission={0.6}
        thickness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Particles({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (seededRandom(i * 3.1 + 1) - 0.5) * 14;
      arr[i * 3 + 1] = (seededRandom(i * 7.7 + 2) - 0.5) * 8;
      arr[i * 3 + 2] = (seededRandom(i * 5.3 + 3) - 0.5) * 8 - 2;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.35} />
    </points>
  );
}

function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  useFrame(({ camera, pointer }) => {
    if (reducedMotion) return;
    camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#ff3b4a" />
      <pointLight position={[-4, -2, 3]} intensity={20} color="#ffffff" />

      <Shard position={[-2.6, 0.6, -1]} rotation={[0.1, 0.4, 0]} scale={1.15} speed={0.5} color="#e30613" seed={1} />
      <Shard position={[2.8, -0.4, -1.6]} rotation={[-0.15, -0.5, 0.1]} scale={1.4} speed={0.4} color="#111111" seed={2} />
      <Shard position={[0.4, 1.4, -2.4]} rotation={[0.2, 0.1, -0.1]} scale={1.05} speed={0.6} color="#ffffff" seed={3} />
      <Shard position={[-1.2, -1.3, -1.8]} rotation={[-0.1, 0.2, 0.05]} scale={0.9} speed={0.55} color="#e30613" seed={4} />

      <Particles />
      <Rig reducedMotion={reducedMotion} />
    </Canvas>
  );
}
