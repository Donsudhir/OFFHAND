"use client";

import { ComponentType, useEffect, useRef, useState } from "react";
import { useOS } from "@/state/useOS";
import { journeyState, MODULE_COUNT } from "@/config/timeline";
import { MODULES } from "@/config/modules";
import ScreenFrame from "./ScreenFrame";
import WebsitesScreen from "./content/WebsitesScreen";
import CrmScreen from "./content/CrmScreen";
import MarketingScreen from "./content/MarketingScreen";
import SocialScreen from "./content/SocialScreen";
import AdsScreen from "./content/AdsScreen";
import AutomationScreen from "./content/AutomationScreen";
import SaasScreen from "./content/SaasScreen";
import PresenceScreen from "./content/PresenceScreen";
import { sound } from "@/audio/sound";
import styles from "./screens.module.css";

const CONTENT: ComponentType<{ p: number }>[] = [
  WebsitesScreen,
  CrmScreen,
  MarketingScreen,
  SocialScreen,
  AdsScreen,
  AutomationScreen,
  SaasScreen,
  PresenceScreen,
];

/**
 * ModuleScreens — the docked inner-scroll overlay layer.
 *
 * Runs one rAF loop reading global scroll progress, derives the journey state,
 * mounts only the active module's screen, drives its dwell (quantized to avoid
 * excess re-renders), fades the scrim, sets the cursor mode, and fires sounds.
 */
export default function ModuleScreens() {
  const phase = useOS((s) => s.phase);
  const [idx, setIdx] = useState(-1);
  const [p, setP] = useState(0);
  const idxRef = useRef(-1);
  const pRef = useRef(0);
  const deepRef = useRef(false);

  useEffect(() => {
    if (phase !== "live") return;
    let raf = 0;

    const loop = () => {
      const js = journeyState(useOS.getState().progress);

      if (js.moduleIndex !== idxRef.current) {
        // Entered a new module station.
        if (js.moduleIndex >= 0 && js.moduleIndex < MODULE_COUNT) sound.tick();
        idxRef.current = js.moduleIndex;
        setIdx(js.moduleIndex);
      }

      const q = Math.round(js.dwell * 100) / 100;
      if (q !== pRef.current) {
        // Dock "thunk" as the screen takes over.
        if (pRef.current < 0.05 && q >= 0.05) sound.thunk();
        pRef.current = q;
        setP(q);
      }

      if (js.deep !== deepRef.current) {
        if (js.deep) sound.dive();
        deepRef.current = js.deep;
      }

      const docked =
        js.moduleIndex >= 0 && js.moduleIndex < MODULE_COUNT && js.dwell > 0.03;
      const mode = docked ? (js.deep ? "dive" : "scroll") : "fly";
      const os = useOS.getState();
      if (os.cursor !== mode) os.setCursor(mode);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (phase !== "live") return null;

  const active = idx >= 0 && idx < MODULE_COUNT;
  const Content = active ? CONTENT[idx] : null;
  const scrim = active ? Math.min(1, p * 9) * 0.94 : 0;

  return (
    <>
      <div className={styles.scrim} style={{ opacity: scrim }} />
      {active && Content && (
        <ScreenFrame module={MODULES[idx]} p={p}>
          <Content p={p} />
        </ScreenFrame>
      )}
    </>
  );
}
