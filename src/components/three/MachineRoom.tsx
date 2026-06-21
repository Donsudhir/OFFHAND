"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  modulePositions,
  corePosition,
  FLOOR_Y,
  SLAB_THICKNESS,
} from "@/config/layout";
import { MODULES } from "@/config/modules";
import { useOS } from "@/state/useOS";

/* ----------------------------------------------------------------
   THE MACHINE ROOM — bright brutalist hall of service monoliths.
   ---------------------------------------------------------------- */

export default function MachineRoom() {
  return (
    <group>
      {/* Architectural lighting for the bright newsprint void */}
      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#ffffff", "#cfc9bb", 0.5]} />
      <directionalLight position={[12, 20, 8]} intensity={0.95} />
      <directionalLight position={[-10, 12, -24]} intensity={0.25} color="#c8ff00" />

      {/* Floor + faint ceiling grids, receding into fog */}
      <gridHelper
        args={[420, 210, "#0b0b0b", "#b9b3a6"]}
        position={[0, FLOOR_Y, -70]}
      />
      <gridHelper
        args={[420, 120, "#d3cdc0", "#ddd7cb"]}
        position={[0, 9.5, -70]}
      />

      {MODULES.map((_, i) => (
        <ModuleBlock key={i} index={i} />
      ))}

      <Core />
      <Conduits />
      <Dust />
    </group>
  );
}

/* ----------------------------------------------------------------
   Module monolith + canvas-texture label plate
   ---------------------------------------------------------------- */

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const fonts = (document as unknown as { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => alive && setReady(true));
    } else {
      setReady(true);
    }
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

function makeLabelTexture(m: (typeof MODULES)[number]) {
  const w = 1024;
  const h = 288;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const famVar = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-jbmono")
    .trim();
  const mono = famVar ? `${famVar}, monospace` : "monospace";

  // Paper plate
  ctx.fillStyle = "#ede8df";
  ctx.fillRect(0, 0, w, h);

  // Acid header strip with index + name
  ctx.fillStyle = "#c8ff00";
  ctx.fillRect(0, 0, w, 74);
  ctx.fillStyle = "#0b0b0b";
  ctx.textBaseline = "middle";
  ctx.font = `700 40px ${mono}`;
  ctx.fillText(`${m.num} — ${m.name}`, 26, 40);

  // Big screen title
  ctx.fillStyle = "#0b0b0b";
  ctx.font = `800 104px ${mono}`;
  ctx.fillText(m.screen, 22, 158);

  // Tag line
  ctx.fillStyle = "#1c1c1a";
  ctx.font = `500 38px ${mono}`;
  ctx.fillText(m.tag, 26, 244);

  // Hard brutalist border
  ctx.strokeStyle = "#0b0b0b";
  ctx.lineWidth = 9;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function ModuleBlock({ index }: { index: number }) {
  const fontsReady = useFontsReady();
  const data = MODULES[index];
  const pos = modulePositions[index];
  const left = pos.x < 0;

  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return makeLabelTexture(data);
    // fontsReady forces a rebuild once the brand font is available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fontsReady]);

  useFrame((state) => {
    const { section, phase } = useOS.getState();
    const active = phase !== "boot" && section === index;
    if (matRef.current) {
      const target = active ? 0.2 : 0.035;
      matRef.current.emissiveIntensity +=
        (target - matRef.current.emissiveIntensity) * 0.08;
    }
    // Subtle autonomous breathing
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.06;
    }
  });

  const plateX = (SLAB_THICKNESS / 2 + 0.02) * (left ? 1 : -1);
  const plateRotY = left ? Math.PI / 2 : -Math.PI / 2;

  return (
    <group ref={groupRef} position={pos}>
      {/* Ink slab */}
      <mesh>
        <boxGeometry args={[SLAB_THICKNESS, 7, 5]} />
        <meshStandardMaterial
          ref={matRef}
          color="#0b0b0b"
          metalness={0.35}
          roughness={0.5}
          emissive="#c8ff00"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Acid wireframe edge */}
      <mesh scale={1.005}>
        <boxGeometry args={[SLAB_THICKNESS, 7, 5]} />
        <meshBasicMaterial color="#c8ff00" wireframe transparent opacity={0.22} />
      </mesh>
      {/* Label plate facing the aisle */}
      {tex && (
        <mesh position={[plateX, 1.7, 0]} rotation={[0, plateRotY, 0]}>
          <planeGeometry args={[4.6, 1.29]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/* ----------------------------------------------------------------
   Central OFFHAND core — pulsing finale monolith
   ---------------------------------------------------------------- */

function Core() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 0.4 + Math.sin(t * 1.5) * 0.25;
    if (matRef.current) matRef.current.emissiveIntensity = pulse;
    if (lightRef.current) lightRef.current.intensity = 28 + Math.sin(t * 1.5) * 16;
  });
  return (
    <group position={corePosition}>
      <mesh>
        <boxGeometry args={[3, 13, 3]} />
        <meshStandardMaterial
          ref={matRef}
          color="#0b0b0b"
          metalness={0.5}
          roughness={0.4}
          emissive="#c8ff00"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh scale={1.012}>
        <boxGeometry args={[3, 13, 3]} />
        <meshBasicMaterial color="#c8ff00" wireframe transparent opacity={0.4} />
      </mesh>
      <pointLight
        ref={lightRef}
        color="#c8ff00"
        intensity={28}
        distance={48}
        position={[0, 2, 5]}
      />
    </group>
  );
}

/* ----------------------------------------------------------------
   Conduits — acid beams from each module to the core, with a
   travelling pulse = AI automation running the whole room.
   ---------------------------------------------------------------- */

function Conduits() {
  const dotRefs = useRef<(THREE.Mesh | null)[]>([]);

  const beams = useMemo(() => {
    return modulePositions.map((m) => {
      const from = m.clone();
      from.y = FLOOR_Y + 0.06;
      const to = corePosition.clone();
      to.y = FLOOR_Y + 0.06;
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const dir = to.clone().sub(from);
      const len = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      return { from, to, mid, len, quat };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    beams.forEach((b, i) => {
      const dot = dotRefs.current[i];
      if (!dot) return;
      const frac = (t * 0.16 + i * 0.13) % 1;
      dot.position.lerpVectors(b.from, b.to, frac);
      dot.position.y = FLOOR_Y + 0.12 + Math.sin(frac * Math.PI) * 0.35;
    });
  });

  return (
    <group>
      {beams.map((b, i) => (
        <group key={i}>
          <mesh position={b.mid} quaternion={b.quat}>
            <cylinderGeometry args={[0.03, 0.03, b.len, 6]} />
            <meshBasicMaterial color="#c8ff00" transparent opacity={0.22} />
          </mesh>
          <mesh
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial color="#c8ff00" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ----------------------------------------------------------------
   Atmospheric dust motes
   ---------------------------------------------------------------- */

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 320;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 64;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = -Math.random() * 160;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (ref.current)
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.06;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.05}
        color="#0b0b0b"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}
