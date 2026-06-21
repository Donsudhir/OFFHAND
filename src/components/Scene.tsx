"use client";

import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Noise,
  Scanline,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useOS } from "@/state/useOS";
import MachineRoom from "@/components/three/MachineRoom";
import CameraRig from "@/components/three/CameraRig";
import { cameraWaypoints } from "@/config/layout";

/**
 * Scene — the OFFHAND OS 3D world (Act 1+: THE MACHINE ROOM).
 * Composites the room, the scroll-driven camera rig, and the global post stack.
 */
export default function Scene() {
  const start = cameraWaypoints[0];
  return (
    <div className="canvas-layer">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [start.x, start.y, start.z], fov: 46, near: 0.1, far: 400 }}
      >
        <BackgroundRig />
        <PointerBridge />
        <MachineRoom />
        <CameraRig />
        <Post />
      </Canvas>
    </div>
  );
}

/** Writes the live pointer (NDC) into the OS store for the HUD + parallax. */
function PointerBridge() {
  const setPointer = useOS((s) => s.setPointer);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setPointer(x, y);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [setPointer]);
  return null;
}

/**
 * Resolves the world background from phosphor void (boot) to newsprint paper
 * (live) by lerping the scene background + fog every frame.
 */
function BackgroundRig() {
  const { scene } = useThree();
  const current = useMemo(() => new THREE.Color("#0a0a0a"), []);
  const target = useMemo(() => new THREE.Color("#0a0a0a"), []);
  useEffect(() => {
    scene.background = current;
    scene.fog = new THREE.Fog("#0a0a0a", 12, 120);
  }, [scene, current]);
  useFrame(() => {
    const { phase } = useOS.getState();
    target.set(phase === "boot" ? "#0a0a0a" : "#ede8df");
    current.lerp(target, 0.045);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(current);
  });
  return null;
}

/** Global postprocessing stack (tuned for the light newsprint world). */
function Post() {
  const offset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), []);
  return (
    <EffectComposer>
      <Bloom
        intensity={0.35}
        luminanceThreshold={0.95}
        luminanceSmoothing={0.15}
        mipmapBlur
      />
      <ChromaticAberration
        offset={offset}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.1} opacity={0.08} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.32} />
      <Vignette eskil={false} offset={0.25} darkness={0.5} />
    </EffectComposer>
  );
}
