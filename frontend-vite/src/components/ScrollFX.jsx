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

  // Global scroll + mouse + gyro listeners
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
      root.style.setProperty("--mx", ((e.clientX - cx) / cx).toFixed(3));
      root.style.setProperty("--my", ((e.clientY - cy) / cy).toFixed(3));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (hasFinePointer) window.addEventListener("mousemove", onMove, { passive: true });

    // Mobile gyroscope → --mx / --my
    let gyroRAF = null;
    let tMX = 0, tMY = 0, cMX = 0, cMY = 0;
    const onOr = (e) => {
      if (e.gamma == null || e.beta == null) return;
      const angle = (window.screen?.orientation?.angle) || 0;
      let gx = e.gamma;
      let by = e.beta - 45;
      if (angle === 90) { gx = by; by = -e.gamma; }
      if (angle === 270 || angle === -90) { gx = -by; by = e.gamma; }
      if (angle === 180) { gx = -e.gamma; by = -(e.beta - 45); }
      tMX = Math.max(-1, Math.min(1, gx / 20));
      tMY = Math.max(-1, Math.min(1, by / 20));
    };
    const gyroTick = () => {
      cMX += (tMX - cMX) * 0.12;
      cMY += (tMY - cMY) * 0.12;
      root.style.setProperty("--mx", cMX.toFixed(3));
      root.style.setProperty("--my", cMY.toFixed(3));
      gyroRAF = requestAnimationFrame(gyroTick);
    };
    const startGyro = () => {
      window.addEventListener("deviceorientation", onOr, true);
      window.addEventListener("deviceorientationabsolute", onOr, true);
      if (!gyroRAF) gyroRAF = requestAnimationFrame(gyroTick);
    };
    if (!hasFinePointer && !prefersReduce) {
      const iosPerm = typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function";
      if (!iosPerm) {
        startGyro();
      } else {
        const kick = () => {
          DeviceOrientationEvent.requestPermission()
            .then((r) => { if (r === "granted") startGyro(); })
            .catch(() => {});
          window.removeEventListener("touchend", kick);
          window.removeEventListener("click", kick);
        };
        window.addEventListener("touchend", kick, { passive: true, once: true });
        window.addEventListener("click", kick, { once: true });
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hasFinePointer) window.removeEventListener("mousemove", onMove);
      window.removeEventListener("deviceorientation", onOr, true);
      window.removeEventListener("deviceorientationabsolute", onOr, true);
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
