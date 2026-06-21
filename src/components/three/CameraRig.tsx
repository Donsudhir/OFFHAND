"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useOS } from "@/state/useOS";
import { cameraCurve, modulePositions, corePosition } from "@/config/layout";
import { journeyState, MODULE_COUNT } from "@/config/timeline";

const clamp = (n: number, a: number, b: number) =>
  n < a ? a : n > b ? b : n;

/**
 * CameraRig — drives the camera along the Machine Room spline from the journey
 * timeline. Travels during a module's approach, holds + dollies in during its
 * dwell (while the screen drives the inner scroll), and settles on the core for
 * the CTA. Adds pointer parallax (damped while docked) + faint handheld noise.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const moduleCenter = useMemo(() => new THREE.Vector3(), []);
  const coreLook = useMemo(() => new THREE.Vector3(), []);
  const lastSection = useRef(-1);

  useFrame((state) => {
    const { phase, progress, pointer, reducedMotion } = useOS.getState();

    // During boot, hold the establishing shot.
    if (phase === "boot") {
      cameraCurve.getPointAt(0, camPos);
      camera.position.copy(camPos);
      cameraCurve.getPointAt(0.02, look);
      camera.lookAt(look);
      return;
    }

    const js = journeyState(progress);

    cameraCurve.getPointAt(clamp(js.curveU, 0, 0.999), camPos);
    cameraCurve.getPointAt(clamp(js.curveU + 0.02, 0, 1), look);

    // Frame the active module; sharpen framing as we dwell on it.
    if (js.moduleIndex >= 0 && js.moduleIndex < MODULE_COUNT) {
      moduleCenter.copy(modulePositions[js.moduleIndex]);
      moduleCenter.y = 1.6;
      const frame = Math.max(js.dwell, 0) * 0.6;
      look.lerp(moduleCenter, frame);

      // Subtle dolly toward the screen while docked (the "entering" feel).
      if (js.dwell > 0) {
        fwd.copy(look).sub(camPos).normalize();
        camPos.addScaledVector(fwd, js.dwell * 2.4);
      }
    }

    // CTA: settle on the core.
    if (js.moduleIndex === MODULE_COUNT) {
      coreLook.copy(corePosition);
      coreLook.y = 2.6;
      look.lerp(coreLook, 0.6 + js.cta * 0.4);
    }

    // Pointer parallax (damped while docked) + handheld life.
    if (!reducedMotion) {
      const park = 1 - clamp(js.dwell, 0, 1) * 0.85;
      camPos.x += pointer.x * 0.6 * park;
      camPos.y += pointer.y * 0.4 * park;
      const t = state.clock.elapsedTime;
      camPos.x += Math.sin(t * 0.4) * 0.05 * park;
      camPos.y += Math.cos(t * 0.33) * 0.04 * park;
    }

    camera.position.lerp(camPos, reducedMotion ? 1 : 0.12);
    camera.lookAt(look);

    // Report active section (HUD) on change only.
    const sectionIdx = clamp(
      js.moduleIndex < 0 ? 0 : js.moduleIndex,
      0,
      MODULE_COUNT - 1
    );
    if (sectionIdx !== lastSection.current) {
      lastSection.current = sectionIdx;
      useOS.getState().setSection(sectionIdx);
    }
  });

  return null;
}
