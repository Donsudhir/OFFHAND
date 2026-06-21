"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useSiteScroll } from "./useSiteScroll";

/* ================================================================
   THE ATELIER AT DAYBREAK — a crafted little world of "your
   business", filmed at golden hour. It wakes and fills with life
   as you scroll. Premium miniature, not a cold machine.
   ================================================================ */

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smoother = (x: number) => {
  x = clamp01(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

export default function Atelier() {
  return (
    <div className="canvas-layer" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 1.85]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0.5, 4.6, 12], fov: 36, near: 0.1, far: 80 }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}

function SceneContents() {
  return (
    <>
      <DaybreakSky />
      <CameraRig />
      <Diorama />
      <SunDust />
      <Post />
    </>
  );
}

/* ---------- Sky + sunrise lighting (warms as you scroll) ---------- */
function DaybreakSky() {
  const key = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const bg = useMemo(() => new THREE.Color("#e7dcc5"), []);
  const dawn = useMemo(() => new THREE.Color("#e7dcc5"), []);
  const day = useMemo(() => new THREE.Color("#f1e8d6"), []);

  useFrame(({ scene }) => {
    const p = smoother(useSiteScroll.getState().progress);
    // Sun climbs and warms from soft dawn → full golden hour.
    const angle = THREE.MathUtils.lerp(0.18, 0.62, p);
    const r = 14;
    if (key.current) {
      key.current.position.set(Math.cos(angle) * -6, Math.sin(angle) * r + 1.5, 4);
      key.current.intensity = THREE.MathUtils.lerp(1.15, 2.5, p);
      key.current.color.setRGB(
        1,
        THREE.MathUtils.lerp(0.8, 0.86, p),
        THREE.MathUtils.lerp(0.62, 0.7, p)
      );
    }
    if (amb.current) amb.current.intensity = THREE.MathUtils.lerp(0.5, 0.72, p);
    if (rim.current) rim.current.intensity = THREE.MathUtils.lerp(0.35, 0.6, p);

    bg.copy(dawn).lerp(day, p);
    scene.background = bg;
    if (!scene.fog) scene.fog = new THREE.Fog(bg, 13, 30);
    else (scene.fog as THREE.Fog).color.copy(bg);
  });

  return (
    <>
      <ambientLight ref={amb} intensity={0.5} color="#fff2dd" />
      <hemisphereLight args={["#fff1da", "#cdbf9f", 0.5]} />
      <directionalLight
        ref={key}
        position={[-6, 8, 4]}
        intensity={1.4}
        color="#ffd2a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />
      <directionalLight ref={rim} position={[7, 3, -5]} intensity={0.45} color="#e6a861" />
    </>
  );
}

/* ---------- Scroll-driven cinematic camera ---------- */
const CAM_POINTS = [
  new THREE.Vector3(0.6, 4.7, 12),
  new THREE.Vector3(-2.3, 2.7, 8.2),
  new THREE.Vector3(-4.4, 1.45, 5.3),
  new THREE.Vector3(3.8, 1.7, 5.0),
  new THREE.Vector3(1.6, 3.1, 8.2),
  new THREE.Vector3(0, 5.8, 13.8),
];
const LOOK_POINTS = [
  new THREE.Vector3(0, 1.0, 0),
  new THREE.Vector3(0, 0.95, 0),
  new THREE.Vector3(0, 1.25, 0),
  new THREE.Vector3(0, 1.05, 0),
  new THREE.Vector3(0, 1.0, 0),
  new THREE.Vector3(0, 1.2, 0),
];

function CameraRig() {
  const camCurve = useMemo(
    () => new THREE.CatmullRomCurve3(CAM_POINTS, false, "catmullrom", 0.25),
    []
  );
  const lookCurve = useMemo(
    () => new THREE.CatmullRomCurve3(LOOK_POINTS, false, "catmullrom", 0.25),
    []
  );
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer, clock }, delta) => {
    const p = smoother(useSiteScroll.getState().progress);
    camCurve.getPointAt(clamp01(p), pos);
    lookCurve.getPointAt(clamp01(p), look);

    // Gentle pointer parallax + breathing handheld float (premium, slow).
    const t = clock.elapsedTime;
    pos.x += pointer.x * 0.5 + Math.sin(t * 0.35) * 0.08;
    pos.y += pointer.y * 0.28 + Math.cos(t * 0.28) * 0.05;

    camera.position.lerp(pos, 1 - Math.pow(0.0015, delta));
    camera.lookAt(look);
  });
  return null;
}

/* ---------- The crafted little town ---------- */
interface B {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  roof: string;
  hero?: boolean;
  win: number;
  threshold: number;
}

function Diorama() {
  const group = useRef<THREE.Group>(null);

  const buildings = useMemo<B[]>(
    () => [
      { pos: [0, 0.95, 0.2], size: [1.8, 1.9, 1.8], color: "#d99a4e", roof: "#c4863c", hero: true, win: 12, threshold: 0.05 },
      { pos: [-2.3, 0.62, -0.3], size: [1.3, 1.24, 1.3], color: "#3a2e20", roof: "#241a10", win: 6, threshold: 0.18 },
      { pos: [2.25, 0.78, -0.5], size: [1.3, 1.56, 1.45], color: "#2a2118", roof: "#1a130b", win: 8, threshold: 0.12 },
      { pos: [-4.0, 0.48, -1.3], size: [1.2, 0.96, 1.25], color: "#b06a43", roof: "#8a4f30", win: 4, threshold: 0.3 },
      { pos: [3.9, 0.54, -1.4], size: [1.25, 1.08, 1.25], color: "#4a3f31", roof: "#2e2619", win: 5, threshold: 0.26 },
      { pos: [-1.2, 0.42, 2.2], size: [1.05, 0.84, 1.05], color: "#8a7c63", roof: "#5f5444", win: 4, threshold: 0.42 },
      { pos: [1.5, 0.38, 2.4], size: [1.0, 0.76, 1.0], color: "#c9b998", roof: "#9a8a6a", win: 3, threshold: 0.5 },
      { pos: [-5.6, 0.4, 0.6], size: [1.0, 0.8, 1.0], color: "#5a4a36", roof: "#382c1e", win: 3, threshold: 0.62 },
      { pos: [5.5, 0.44, 0.4], size: [1.05, 0.88, 1.05], color: "#a98f63", roof: "#766140", win: 4, threshold: 0.58 },
    ],
    []
  );

  const lamps = useMemo(
    () =>
      [
        [-1.5, 1.4],
        [1.7, 1.5],
        [-3.0, -0.4],
        [3.1, -0.5],
      ] as [number, number][],
    []
  );

  const trees = useMemo(
    () =>
      [
        [-2.6, 1.9],
        [2.7, 2.0],
        [-4.9, -1.6],
        [4.7, -1.7],
        [0.2, 3.0],
      ] as [number, number][],
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.4) * 0.05;
    group.current.rotation.y += (pointer.x * 0.18 - group.current.rotation.y) * 0.02;
  });

  return (
    <group ref={group}>
      {/* Worktable plinth the world sits on */}
      <mesh receiveShadow position={[0, -0.22, 0]}>
        <cylinderGeometry args={[7.4, 7.7, 0.4, 72]} />
        <meshStandardMaterial color="#e3d7bd" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.2, 0.03, 72]} />
        <meshStandardMaterial color="#d6c4a0" roughness={1} />
      </mesh>
      {/* ground street ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[2.4, 6.6, 64]} />
        <meshStandardMaterial color="#cbb892" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {buildings.map((b, i) => (
        <Building key={i} b={b} />
      ))}
      {lamps.map((l, i) => (
        <Lamp key={i} x={l[0]} z={l[1]} />
      ))}
      {trees.map((tr, i) => (
        <Tree key={i} x={tr[0]} z={tr[1]} />
      ))}

      <Car />
      <Smoke />
      <Birds />
    </group>
  );
}

function Building({ b }: { b: B }) {
  const winRef = useRef<THREE.MeshStandardMaterial>(null);
  const sign = useRef<THREE.MeshStandardMaterial>(null);
  const [w, h, d] = b.size;

  const wins = useMemo(() => {
    const arr: [number, number, number][] = [];
    const cols = b.hero ? 3 : 2;
    const rows = Math.ceil(b.win / cols);
    const faces: number[] = [1, -1];
    for (const f of faces) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          arr.push([
            (c / (cols - 1 || 1) - 0.5) * (w * 0.5),
            (r / (rows - 1 || 1) - 0.5) * (h * 0.48) + h * 0.05,
            f * (d / 2 + 0.012),
          ]);
        }
      }
    }
    return arr;
  }, [b, w, h, d]);

  useFrame(({ clock }) => {
    const p = smoother(useSiteScroll.getState().progress);
    const on = clamp01((p - b.threshold) * 3);
    const flick = 0.82 + Math.sin(clock.elapsedTime * 1.7 + b.pos[0]) * 0.18;
    if (winRef.current) winRef.current.emissiveIntensity = on * 1.8 * flick;
    if (sign.current) sign.current.emissiveIntensity = on * 2.4;
  });

  return (
    <group position={b.pos}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={b.color} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0, h / 2 + 0.04, 0]} castShadow>
        <boxGeometry args={[w * 1.06, 0.09, d * 1.06]} />
        <meshStandardMaterial color={b.roof} roughness={0.7} />
      </mesh>

      {b.hero && (
        <>
          <mesh position={[0, h * 0.16, d / 2 + 0.02]}>
            <planeGeometry args={[w * 0.74, 0.34]} />
            <meshStandardMaterial
              ref={sign}
              color="#fff4dd"
              emissive="#ffcf8a"
              emissiveIntensity={0.4}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[w * 0.3, h / 2 + 0.28, 0]} castShadow>
            <boxGeometry args={[0.16, 0.4, 0.16]} />
            <meshStandardMaterial color={b.roof} roughness={0.8} />
          </mesh>
        </>
      )}

      {wins.map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <planeGeometry args={[0.15, 0.2]} />
          <meshStandardMaterial
            ref={i === 0 ? winRef : undefined}
            color="#fff4dd"
            emissive="#ffcf8a"
            emissiveIntensity={0.18}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Lamp({ x, z }: { x: number; z: number }) {
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const p = smoother(useSiteScroll.getState().progress);
    if (bulb.current) bulb.current.emissiveIntensity = clamp01((p - 0.2) * 2) * 2.2;
  });
  return (
    <group position={[x, 0.02, z]}>
      <mesh castShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.64, 8]} />
        <meshStandardMaterial color="#2a2118" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          ref={bulb}
          color="#fff1cf"
          emissive="#ffcf86"
          emissiveIntensity={0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.02, z]}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.36, 6]} />
        <meshStandardMaterial color="#5a4129" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.5, 0]}>
        <coneGeometry args={[0.3, 0.6, 9]} />
        <meshStandardMaterial color="#7d8a5a" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 0.74, 0]}>
        <coneGeometry args={[0.22, 0.44, 9]} />
        <meshStandardMaterial color="#8a9a68" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* a tiny car doing a calm loop on the street ring */
function Car() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const a = clock.elapsedTime * 0.32;
    const r = 4.4;
    ref.current.position.set(Math.cos(a) * r, 0.12, Math.sin(a) * r);
    ref.current.rotation.y = -a + Math.PI / 2;
  });
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.14, 0.18]} />
        <meshStandardMaterial color="#b06a43" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0.18, 0.02, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.16]} />
        <meshStandardMaterial color="#fff1cf" emissive="#ffd98a" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* soft chimney smoke that rises and fades */
function Smoke() {
  const puffs = useRef<THREE.Mesh[]>([]);
  return (
    <group position={[0.54, 1.9, 0.2]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <SmokeMat i={i} meshRef={() => puffs.current[i]} />
        </mesh>
      ))}
    </group>
  );
}
function SmokeMat({ i, meshRef }: { i: number; meshRef: () => THREE.Mesh | undefined }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const m = meshRef();
    if (!m) return;
    const t = (clock.elapsedTime * 0.4 + i / 5) % 1;
    m.position.set(Math.sin(t * 6 + i) * 0.12, t * 1.0, 0);
    m.scale.setScalar(0.5 + t * 1.6);
    if (mat.current) mat.current.opacity = (1 - t) * 0.28;
  });
  return (
    <meshStandardMaterial
      ref={mat}
      color="#efe7d6"
      transparent
      opacity={0.2}
      depthWrite={false}
      roughness={1}
    />
  );
}

/* a few birds drifting across the warm sky */
function Birds() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = ((clock.elapsedTime * 0.4) % 20) - 10;
  });
  return (
    <group ref={ref} position={[0, 6.5, -3]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[i * 0.7, Math.sin(i) * 0.4, i * 0.3]}>
          <boxGeometry args={[0.16, 0.015, 0.015]} />
          <meshStandardMaterial color="#3a2e20" />
        </mesh>
      ))}
    </group>
  );
}

/* floating dust motes catching the light */
function SunDust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 160;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 9 + 0.4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.012;
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.2;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.045}
        color="#e7b878"
        transparent
        opacity={0.55}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

/* cinematic post: tilt-shift DOF + warm bloom + grain + vignette */
function Post() {
  return (
    <EffectComposer>
      <DepthOfField target={[0, 0.9, 0]} focalLength={0.018} bokehScale={2.6} height={480} />
      <Bloom intensity={0.6} luminanceThreshold={0.6} luminanceSmoothing={0.34} mipmapBlur />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.14} />
      <Vignette eskil={false} offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}
