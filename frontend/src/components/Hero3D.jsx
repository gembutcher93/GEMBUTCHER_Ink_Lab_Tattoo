import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useLang } from "@/context/LangContext";
import { ChevronRight, MousePointer2 } from "lucide-react";

// ---- Procedural tattoo canvas textures per style ----
const drawPolynesian = (ctx, w, h) => {
  ctx.fillStyle = "#00f0ff";
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 4;
  // Repeating tribal triangles / spearheads
  for (let y = 0; y < h; y += 60) {
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 50);
      ctx.lineTo(x + 30, y + 10);
      ctx.lineTo(x + 50, y + 50);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 30, y + 30, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Central pillar
  ctx.fillStyle = "rgba(0,240,255,0.15)";
  ctx.fillRect(w / 2 - 40, 0, 80, h);
};

const drawCyberpunk = (ctx, w, h) => {
  ctx.strokeStyle = "#ff007f";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#ff007f";
  ctx.shadowBlur = 12;
  // Circuit paths
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    let x = Math.random() * w;
    let y = Math.random() * h;
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      const dir = Math.floor(Math.random() * 4);
      if (dir === 0) x += 40;
      if (dir === 1) x -= 40;
      if (dir === 2) y += 40;
      if (dir === 3) y -= 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#00f0ff";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
};

const drawAnime = (ctx, w, h) => {
  ctx.strokeStyle = "#ff007f";
  ctx.lineWidth = 2.5;
  // Sakura petals
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const s = 12 + Math.random() * 16;
    ctx.beginPath();
    for (let a = 0; a < 5; a++) {
      const ang = (Math.PI * 2 * a) / 5;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + Math.cos(ang) * s,
        y + Math.sin(ang) * s,
        x + Math.cos(ang + 0.3) * s * 0.6,
        y + Math.sin(ang + 0.3) * s * 0.6
      );
    }
    ctx.stroke();
  }
  // Speed lines
  ctx.strokeStyle = "rgba(0,240,255,0.5)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    const y = Math.random() * h;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y + (Math.random() - 0.5) * 80);
    ctx.stroke();
  }
};

const drawPatutikon = (ctx, w, h) => {
  // Layer 1: polynesian frame
  drawPolynesian(ctx, w, h);
  // Layer 2: cartoon face silhouette inside
  ctx.fillStyle = "rgba(255,0,127,0.9)";
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.35, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#050512";
  ctx.beginPath();
  ctx.arc(w / 2 - 22, h * 0.33, 8, 0, Math.PI * 2);
  ctx.arc(w / 2 + 22, h * 0.33, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#050512";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.4, 22, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  // Radiating spikes
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const ang = (Math.PI * 2 * i) / 12;
    ctx.beginPath();
    ctx.moveTo(w / 2 + Math.cos(ang) * 80, h * 0.35 + Math.sin(ang) * 80);
    ctx.lineTo(w / 2 + Math.cos(ang) * 130, h * 0.35 + Math.sin(ang) * 130);
    ctx.stroke();
  }
};

const styleDrawers = {
  polynesian: drawPolynesian,
  cyberpunk: drawCyberpunk,
  anime: drawAnime,
  patutikon: drawPatutikon,
};

const useTattooTexture = (style) =>
  useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    // Base skin (dark synthetic)
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    (styleDrawers[style] || drawPolynesian)(ctx, canvas.width, canvas.height);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    return tex;
  }, [style]);

// ---- 3D Arm assembly ----
const Arm = ({ style }) => {
  const group = useRef();
  const tex = useTattooTexture(style);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
    }
  });

  const emissiveColor = style === "cyberpunk" || style === "anime" ? "#ff007f" : "#00f0ff";

  return (
    <group ref={group} rotation={[0.15, 0, 0.2]} position={[0, 0.4, 0]}>
      {/* Shoulder cap */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a12"
          emissive={emissiveColor}
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>

      {/* Upper arm (bicep) */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.32, 1.4, 32]} />
        <meshStandardMaterial
          map={tex}
          emissive={emissiveColor}
          emissiveMap={tex}
          emissiveIntensity={0.9}
          roughness={0.5}
          metalness={0.35}
        />
      </mesh>

      {/* Elbow joint */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.33, 24, 24]} />
        <meshStandardMaterial
          color="#111122"
          emissive={emissiveColor}
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Forearm */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.26, 1.6, 32]} />
        <meshStandardMaterial
          map={tex}
          emissive={emissiveColor}
          emissiveMap={tex}
          emissiveIntensity={0.95}
          roughness={0.55}
          metalness={0.3}
        />
      </mesh>

      {/* Wrist ring (chrome) */}
      <mesh position={[0, -1.7, 0]}>
        <torusGeometry args={[0.27, 0.045, 12, 32]} />
        <meshStandardMaterial color="#e0e0e8" metalness={1} roughness={0.15} />
      </mesh>

      {/* Palm */}
      <mesh position={[0, -1.95, 0]}>
        <boxGeometry args={[0.5, 0.42, 0.22]} />
        <meshStandardMaterial color="#101018" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Fingers */}
      {[-0.17, -0.06, 0.06, 0.17].map((x, i) => (
        <mesh key={i} position={[x, -2.4, 0]}>
          <cylinderGeometry args={[0.045, 0.035, 0.5, 12]} />
          <meshStandardMaterial color="#0e0e16" roughness={0.65} metalness={0.4} />
        </mesh>
      ))}

      {/* Thumb */}
      <mesh position={[0.27, -2.05, 0]} rotation={[0, 0, -0.65]}>
        <cylinderGeometry args={[0.045, 0.035, 0.38, 12]} />
        <meshStandardMaterial color="#0e0e16" roughness={0.65} metalness={0.4} />
      </mesh>

      {/* Floating polynesian rings around arm */}
      {[-0.5, 0.4, 1.2].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42 + i * 0.01, 0.008, 12, 64]} />
          <meshBasicMaterial color={emissiveColor} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = ({ style }) => {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#00f0ff" distance={14} />
      <pointLight position={[-4, -2, 3]} intensity={35} color="#ff007f" distance={14} />
      <pointLight position={[0, 6, -3]} intensity={22} color="#ffffff" distance={16} />
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
          <Arm style={style} />
        </Float>
        <Environment preset="night" />
      </Suspense>
    </>
  );
};

export const Hero3D = () => {
  const { t } = useLang();
  const [style, setStyle] = useState("patutikon");

  const styleKeys = ["polynesian", "cyberpunk", "anime", "patutikon"];

  return (
    <section id="hero" data-testid="hero-section" className="relative min-h-screen w-full pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />

      {/* Kinetic background text */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden">
        <div className="marquee-track">
          <span className="font-heavy text-[9rem] md:text-[14rem] text-white/[0.025] whitespace-nowrap pr-16">
            PATUTIKON • NEO TRIBAL • INK & CHROME • PATUTIKON • NEO TRIBAL • INK & CHROME •
          </span>
          <span className="font-heavy text-[9rem] md:text-[14rem] text-white/[0.025] whitespace-nowrap pr-16">
            PATUTIKON • NEO TRIBAL • INK & CHROME • PATUTIKON • NEO TRIBAL • INK & CHROME •
          </span>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left: Text */}
        <div className="lg:col-span-5 space-y-6 relative z-10">
          <div className="font-mono text-xs text-cyan-neon uppercase tracking-widest caret" data-testid="hero-tag">
            {t.hero.tag}
          </div>
          <h1 className="font-head font-bold leading-[0.95] text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-cyan-neon glow-cyan glitch">{t.hero.title1}</span>
            <span className="block text-white/95 mt-2">{t.hero.title2}</span>
            <span className="block text-magenta-neon glow-magenta mt-1">{t.hero.title3}</span>
          </h1>
          <p className="text-gray-400 max-w-md text-base leading-relaxed">{t.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              data-testid="cta-enter-experience"
              onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
              className="neon-btn"
            >
              {t.hero.cta_enter} <ChevronRight className="w-4 h-4" />
            </button>
            <button
              data-testid="cta-book-session"
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              className="neon-btn neon-btn--magenta"
            >
              {t.hero.cta_book}
            </button>
          </div>
        </div>

        {/* Right: 3D viewport */}
        <div className="lg:col-span-7 relative">
          <div
            data-testid="hero-3d-viewport"
            className="holo-frame corner-brackets scanlines relative aspect-[4/5] md:aspect-[5/5] lg:aspect-[4/5] w-full"
          >
            {/* HUD corners */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-cyan-neon tracking-widest z-20">
              // NEO-SAPIEN.MDL <span className="text-gray-500">v1.7</span>
            </div>
            <div className="absolute top-3 right-3 font-mono text-[10px] text-magenta-neon tracking-widest z-20">
              STYLE :: {style.toUpperCase()}
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[10px] text-gray-400 tracking-widest z-20 flex items-center gap-1">
              <MousePointer2 className="w-3 h-3" /> {t.hero.hint}
            </div>

            <Canvas
              camera={{ position: [0, 0, 6.5], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
            >
              <Scene style={style} />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.5}
              />
            </Canvas>
          </div>

          {/* Style selector overlay */}
          <div
            data-testid="style-selector"
            className="mt-5 lg:mt-0 lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:w-52 z-20"
          >
            <div className="holo-frame holo-frame-magenta p-4 space-y-2 relative">
              <div className="font-mono text-[10px] text-magenta-neon uppercase tracking-widest mb-2">
                {t.hero.selector_title}
              </div>
              {styleKeys.map((k) => (
                <button
                  key={k}
                  data-testid={`style-selector-${k}`}
                  onClick={() => setStyle(k)}
                  className={`w-full text-left font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors duration-200 ${
                    style === k
                      ? "border-cyan-500 text-black bg-cyan-neon"
                      : "border-cyan-500/20 text-gray-300 hover:border-cyan-500/60 hover:text-cyan-neon"
                  }`}
                  style={
                    style === k
                      ? {
                          backgroundColor: "var(--gb-cyan)",
                          clipPath:
                            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                        }
                      : {
                          clipPath:
                            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                        }
                  }
                >
                  {t.hero.styles[k]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
