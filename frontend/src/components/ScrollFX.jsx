import React, { useEffect, useRef } from "react";

/**
 * ScrollFX — global immersive effects layer.
 *
 * Sets three CSS custom properties on document.documentElement:
 *   --scroll-y   : window.scrollY (px)
 *   --mx         : mouse X normalised, -1..+1 from viewport center
 *   --my         : mouse Y normalised, -1..+1 from viewport center
 *
 * Also:
 *   - Attaches IntersectionObserver on every [data-reveal] element → adds `.is-visible`
 *   - Renders a low-density neon particle canvas (fixed, behind everything)
 */
export const ScrollFX = () => {
  const canvasRef = useRef(null);

  // Global scroll + mouse listeners
  useEffect(() => {
    const root = document.documentElement;
    let ticking = false;

    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        root.style.setProperty("--scroll-y", `${window.scrollY}`);
        ticking = false;
      });
    };
    onScroll();

    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const mx = (e.clientX - cx) / cx;
      const my = (e.clientY - cy) / cy;
      root.style.setProperty("--mx", mx.toFixed(3));
      root.style.setProperty("--my", my.toFixed(3));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Mouse tilt only on real pointer devices — on mobile it would fight the gyro
    if (hasFinePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    // --- MOBILE: device gyroscope drives --mx / --my ---
    let gyroRAF = null;
    let targetMX = 0;
    let targetMY = 0;
    let currMX = 0;
    let currMY = 0;
    let lastGyroTime = 0;

    const onOrientation = (e) => {
      const g = e.gamma;
      const b = e.beta;
      if (g == null || b == null) return;
      // Compensate for screen orientation (landscape vs portrait)
      const angle = (window.screen && window.screen.orientation && window.screen.orientation.angle) || 0;
      let gx = g;
      let by = b - 45; // natural resting angle ~ 45°
      if (angle === 90)  { gx = by;   by = -g; }
      if (angle === -90 || angle === 270) { gx = -by; by =  g; }
      if (angle === 180) { gx = -g;   by = -by; }
      targetMX = Math.max(-1, Math.min(1, gx / 25));
      targetMY = Math.max(-1, Math.min(1, by / 25));
      lastGyroTime = performance.now();
    };
    const gyroTick = () => {
      currMX += (targetMX - currMX) * 0.10;
      currMY += (targetMY - currMY) * 0.10;
      root.style.setProperty("--mx", currMX.toFixed(3));
      root.style.setProperty("--my", currMY.toFixed(3));
      gyroRAF = requestAnimationFrame(gyroTick);
    };

    const startGyro = () => {
      // Both events for maximum device coverage
      window.addEventListener("deviceorientation", onOrientation, true);
      window.addEventListener("deviceorientationabsolute", onOrientation, true);
      if (!gyroRAF) gyroRAF = requestAnimationFrame(gyroTick);
    };

    const enableGyro = () => {
      const iosPerm =
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function";
      if (iosPerm) {
        DeviceOrientationEvent.requestPermission()
          .then((r) => { if (r === "granted") startGyro(); })
          .catch(() => {});
      } else {
        startGyro();
      }
    };

    if (!hasFinePointer && !prefersReduce) {
      // Android + non-iOS: start immediately
      if (typeof DeviceOrientationEvent === "undefined" ||
          typeof DeviceOrientationEvent.requestPermission !== "function") {
        startGyro();
      }
      // iOS: needs a user tap to request permission
      const kick = () => {
        enableGyro();
        window.removeEventListener("touchend", kick);
        window.removeEventListener("click", kick);
      };
      window.addEventListener("touchend", kick, { passive: true, once: true });
      window.addEventListener("click", kick, { once: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hasFinePointer) window.removeEventListener("mousemove", onMove);
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("deviceorientationabsolute", onOrientation, true);
      if (gyroRAF) cancelAnimationFrame(gyroRAF);
    };
  }, []);

  // Reveal-on-scroll via IntersectionObserver
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => {
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  // Neon particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let particles = [];
    const density = 28;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.15,
        color: Math.random() > 0.5 ? "#00ffb3" : "#ff2d95",
        a: 0.15 + Math.random() * 0.4,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) {
          p.y = window.innerHeight + 8;
          p.x = Math.random() * window.innerWidth;
        }
        if (p.x < -8) p.x = window.innerWidth + 8;
        if (p.x > window.innerWidth + 8) p.x = -8;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };

    resize();
    seed();
    tick();
    window.addEventListener("resize", () => {
      resize();
      seed();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[1] opacity-70 mix-blend-screen"
    />
  );
};

/** Debug overlay — enable with ?debug=gyro in URL. */
function GyroDebug() {
  const [state, setState] = React.useState(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "gyro") return;

    const info = {
      support: "DeviceOrientationEvent" in window,
      iosPermFn:
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function",
      isSecure: window.isSecureContext,
      inIframe: window.self !== window.top,
      pointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches ? "fine" : "coarse",
      angle: (window.screen && window.screen.orientation && window.screen.orientation.angle) || 0,
      gamma: null,
      beta: null,
      mx: 0,
      my: 0,
      fires: 0,
    };
    setState({ ...info });

    const onOr = (e) => {
      info.gamma = e.gamma;
      info.beta = e.beta;
      info.fires += 1;
      setState({ ...info });
    };
    const readCSS = () => {
      const root = document.documentElement;
      info.mx = parseFloat(getComputedStyle(root).getPropertyValue("--mx")) || 0;
      info.my = parseFloat(getComputedStyle(root).getPropertyValue("--my")) || 0;
      setState({ ...info });
    };

    window.addEventListener("deviceorientation", onOr, true);
    window.addEventListener("deviceorientationabsolute", onOr, true);
    const t = setInterval(readCSS, 300);
    return () => {
      window.removeEventListener("deviceorientation", onOr, true);
      window.removeEventListener("deviceorientationabsolute", onOr, true);
      clearInterval(t);
    };
  }, []);

  if (!state) return null;

  const row = (k, v) => (
    <div style={{ display: "flex", gap: 8 }}>
      <span style={{ color: "#00ffb3", minWidth: 76 }}>{k}</span>
      <span>{String(v)}</span>
    </div>
  );

  return (
    <div
      data-testid="gyro-debug"
      style={{
        position: "fixed",
        top: 80,
        left: 12,
        zIndex: 9999,
        padding: "10px 12px",
        background: "rgba(0,0,0,0.85)",
        color: "#f0f0f2",
        border: "1px solid #00ffb3",
        borderRadius: 8,
        fontFamily: "monospace",
        fontSize: 11,
        lineHeight: 1.55,
        pointerEvents: "none",
        boxShadow: "0 0 20px rgba(0,255,179,0.4)",
        maxWidth: 260,
      }}
    >
      <div style={{ color: "#ff2d95", fontWeight: 700, marginBottom: 4 }}>GYRO DEBUG</div>
      {row("support", state.support)}
      {row("iOSperm", state.iosPermFn)}
      {row("secure", state.isSecure)}
      {row("iframe", state.inIframe)}
      {row("pointer", state.pointer)}
      {row("angle", state.angle)}
      {row("gamma", state.gamma == null ? "—" : state.gamma.toFixed(1))}
      {row("beta", state.beta == null ? "—" : state.beta.toFixed(1))}
      {row("events", state.fires)}
      {row("--mx", state.mx.toFixed(3))}
      {row("--my", state.my.toFixed(3))}
    </div>
  );
}
