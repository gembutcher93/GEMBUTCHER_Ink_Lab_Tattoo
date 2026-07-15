import React, { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const state = useRef({
    x: -100,
    y: -100,
    rx: -100,
    ry: -100,
    active: false,
    hidden: true,
  });

  useEffect(() => {
    // Only enable on fine-pointer devices with hover
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    // Respect reduced motion — still show but no lag
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf;
    const loop = () => {
      const s = state.current;
      const ease = reduce ? 1 : 0.18;
      s.rx += (s.x - s.rx) * ease;
      s.ry += (s.y - s.ry) * ease;
      dot.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      ring.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) scale(${s.active ? 1.4 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      state.current.x = e.clientX;
      state.current.y = e.clientY;
      if (state.current.hidden) {
        state.current.hidden = false;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const INTERACTIVE = "a, button, [role='button'], .neon-btn, [data-cursor='hover'], input, textarea, select, label, [tabindex]:not([tabindex='-1'])";

    const onOver = (e) => {
      if (e.target.closest && e.target.closest(INTERACTIVE)) {
        state.current.active = true;
        ring.classList.add("cursor-ring--active");
      }
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(INTERACTIVE)) {
        state.current.active = false;
        ring.classList.remove("cursor-ring--active");
      }
    };
    const onDown = () => ring.classList.add("cursor-ring--down");
    const onUp = () => ring.classList.remove("cursor-ring--down");
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      state.current.hidden = true;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, true);
    window.addEventListener("mouseout", onOut, true);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver, true);
      window.removeEventListener("mouseout", onOut, true);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}

export default CustomCursor;
