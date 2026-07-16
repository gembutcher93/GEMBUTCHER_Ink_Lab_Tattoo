import React, { useEffect, useState } from "react";

const GLYPHS = "01ΩΦΨΞΔ∇◊◈▲◆▼◇◉●○▓▒░⚡✕⨯╱╲│─┤├┴┬┼";

const rand = () =>
  GLYPHS[Math.floor(Math.random() * GLYPHS.length)] +
  GLYPHS[Math.floor(Math.random() * GLYPHS.length)] +
  GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0: visible, 1: fading, 2: gone
  const [glyphs, setGlyphs] = useState(rand());

  useEffect(() => {
    const DURATION = 1900; // total loading time
    const start = performance.now();
    let raf;
    let fadeTimeout;

    const tick = (t) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / DURATION);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase(1);
        fadeTimeout = setTimeout(() => setPhase(2), 700);
      }
    };
    raf = requestAnimationFrame(tick);

    const glyphInt = setInterval(() => setGlyphs(rand()), 55);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(glyphInt);
      clearTimeout(fadeTimeout);
    };
  }, []);

  // Lock scroll while visible
  useEffect(() => {
    if (phase < 2) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === 2) return null;

  return (
    <div
      data-testid="preloader"
      aria-hidden={phase >= 1}
      className={`preloader ${phase === 1 ? "preloader--fade" : ""}`}
    >
      {/* Grid backdrop */}
      <div className="preloader__grid" />

      {/* Ambient blobs */}
      <div className="preloader__blob preloader__blob--cyan" />
      <div className="preloader__blob preloader__blob--magenta" />

      {/* HUD frame */}
      <div className="preloader__hud">
        <div className="preloader__row preloader__row--top">
          <span className="dot dot-cyan" />
          <span className="preloader__mono">SYS · PATUTIKON.RITUAL</span>
          <span className="preloader__mono preloader__mono--dim">
            v1.0 · OZIERI/SS
          </span>
          <span className="dot dot-orange" />
        </div>

        <div className="preloader__logo-wrap">
          <div className="preloader__logo" aria-label="GemButcher">
            <span className="preloader__logo-layer preloader__logo-layer--base">GEMBUTCHER</span>
            <span className="preloader__logo-layer preloader__logo-layer--mint" aria-hidden>GEMBUTCHER</span>
            <span className="preloader__logo-layer preloader__logo-layer--magenta" aria-hidden>GEMBUTCHER</span>
          </div>
          <div className="preloader__tagline preloader__mono">
            <span className="preloader__glyphs">{glyphs}</span>
            <span className="preloader__sep">·</span>
            <span>Weaving sacred geometry</span>
            <span className="preloader__sep">·</span>
            <span className="preloader__glyphs">{glyphs}</span>
          </div>
        </div>

        <div className="preloader__bar-wrap">
          <div className="preloader__bar-frame">
            <div
              className="preloader__bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="preloader__meta preloader__mono">
            <span>LOADING RITUAL</span>
            <span className="preloader__meta-val">{String(progress).padStart(3, "0")}%</span>
          </div>
        </div>

        <div className="preloader__row preloader__row--bot preloader__mono">
          <span>◇ CORE.SYNC</span>
          <span>◇ NEURAL.LINK</span>
          <span>◇ INK.CHANNEL</span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
