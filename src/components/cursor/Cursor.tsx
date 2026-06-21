"use client";

import { useEffect, useRef, useState } from "react";
import { useOS } from "@/state/useOS";
import styles from "./cursor.module.css";

const LABEL: Record<string, string> = {
  fly: "[ FLY ]",
  scroll: "[ SCROLL ]",
  dive: "[ DIVE ]",
  idle: "",
};

/**
 * Cursor — brutalist crosshair reticle with live coordinates that morphs its
 * label with the OS cursor mode. Hidden on touch (coarse-pointer) devices.
 */
export default function Cursor() {
  const cursor = useOS((s) => s.cursor);
  const wrapRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const [coarse, setCoarse] = useState(true);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (coarse) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = 0;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (coordRef.current) {
        coordRef.current.textContent = `${Math.round(tx)},${Math.round(ty)}`;
      }
    };
    const loop = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [coarse]);

  if (coarse) return null;

  return (
    <div ref={wrapRef} className={styles.cursor} data-mode={cursor} aria-hidden="true">
      <span ref={coordRef} className={styles.coord}>
        0,0
      </span>
      <div className={styles.cross} />
      <div className={styles.dot} />
      <span className={styles.label}>{LABEL[cursor]}</span>
    </div>
  );
}
