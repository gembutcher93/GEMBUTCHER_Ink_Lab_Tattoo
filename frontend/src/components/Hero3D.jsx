import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useLang } from "@/context/LangContext";
import { ArrowRight } from "lucide-react";

/* -------- Tattoo textures (clean, cinematic, no glitch) -------- */
const drawPolynesian = (ctx, w, h) => {
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 3;
  ctx.fillStyle = "#22d3ee";
  // Bold Marquesan zigzag columns
  for (let x = 0; x < w; x += 84) {
    ctx.beginPath();
    for (let y = 0; y < h; y += 22) {
      ctx.moveTo(x + 8, y);
      ctx.lineTo(x + 40, y + 11);
      ctx.lineTo(x + 8, y + 22);
    }
    ctx.stroke();
  }
  // Solid vertical spine
  ctx.fillRect(w / 2 - 2, 0, 4, h);
  // Circular sun motifs
  for (let y = 90; y < h; y += 260) {
    ctx.beginPath();
    ctx.arc(w / 2, y, 22, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawCyberpunk = (ctx, w, h) => {
  ctx.strokeStyle = "#f97316";
  ctx.lineCap = "square";
  ctx.lineWidth = 2;
  // Orthogonal circuit paths — precise, no shadow blur
  const grid = 32;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    let x = Math.round((Math.random() * w) / grid) * grid;
    let y = Math.round((Math.random() * h) / grid) * grid;
    ctx.moveTo(x, y);
    for (let j = 0; j < 5; j++) {
      const dir = Math.floor(Math.random() * 4);
      if (dir === 0) x += grid * 2;
      if (dir === 1) x -= grid * 2;
      if (dir === 2) y += grid * 2;
      if (dir === 3) y -= grid * 2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Node
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(x - 3, y - 3, 6, 6);
  }
  // Long central spine
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();
};

const drawAnime = (ctx, w, h) => {
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  // Clean radiating speed lines
  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    const y = (i * h) / 24;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 3;
  // Sakura five-petal flowers
  for (let i = 0; i < 8; i++) {
    const cx = 60 + Math.random() * (w - 120);
    const cy = 60 + Math.random() * (h - 120);
    const s = 22;
    for (let a = 0; a < 5; a++) {
      const ang = (Math.PI * 2 * a) / 5;
      ctx.beginPath();
      ctx.ellipse(
        cx + Math.cos(ang) * s * 0.6,
        cy + Math.sin(ang) * s * 0.6,
        s * 0.55,
        s * 0.28,
        ang,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  }
};

const drawPatutikon = (ctx, w, h) => {
  drawPolynesian(ctx, w, h);
  // Central portrait medallion
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.5, 90, 0, Math.PI * 2);
  ctx.stroke();
  // Inner outlined face
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.5, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w / 2 - 18, h * 0.48);
  ctx.lineTo(w / 2 - 18, h * 0.52);
  ctx.moveTo(w / 2 + 18, h * 0.48);
  ctx.lineTo(w / 2 + 18, h * 0.52);
  ctx.stroke();
  // Emanating radii
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 2;
  for (let a = 0; a < 24; a++) {
    const ang = (Math.PI * 2 * a) / 24;
    ctx.beginPath();
    ctx.moveTo(w / 2 + Math.cos(ang) * 100, h * 0.5 + Math.sin(ang) * 100);
    ctx.lineTo(w / 2 + Math.cos(ang) * 130, h * 0.5 + Math.sin(ang) * 130);
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
    // Deep skin (matte, cinematic)
    ctx.fillStyle = "#0a0a0d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    (styleDrawers[style] || drawPolynesian)(ctx, canvas.width, canvas.height);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [style]);

/* -------- Anatomical arm via LatheGeometry -------- */
const armProfilePoints = () => {
  // Points define silhouette from top (shoulder) down to wrist.
  // (radius, y)
  const raw = [
    [0.02, 2.15], // top cap
    [0.55, 1.95], // shoulder / deltoid
    [0.45, 1.55], // upper arm top
    [0.48, 1.10], // bicep peak
    [0.42, 0.70], // bicep taper
    [0.34, 0.20], // elbow
    [0.34, -0.05], // elbow bottom
    [0.40, -0.30], // brachioradialis / forearm top
    [0.32, -0.80], // forearm middle
    [0.26, -1.30], // forearm lower
    [0.22, -1.70], // wrist
    [0.20, -1.85], // wrist cap
    [0.02, -1.95],
  ];
  return raw.map(([r, y]) => new THREE.Vector2(r, y));
};

const Arm = ({ style }) => {
  const group = useRef();
  const tex = useTattooTexture(style);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  const emissive = style === "cyberpunk" || style === "anime" ? "#f97316" : "#22d3ee";
  const armGeom = useMemo(() => new THREE.LatheGeometry(armProfilePoints(), 64), []);

  return (
    <group ref={group} rotation={[0.08, 0, 0.14]}>
      {/* Arm body */}
      <mesh geometry={armGeom} castShadow>
        <meshStandardMaterial
          map={tex}
          emissive={emissive}
          emissiveMap={tex}
          emissiveIntensity={0.7}
          roughness={0.55}
          metalness={0.25}
        />
      </mesh>

      {/* Chrome wrist band */}
      <mesh position={[0, -1.72, 0]}>
        <torusGeometry args={[0.24, 0.02, 12, 48]} />
        <meshStandardMaterial color="#f5f5f5" metalness={1} roughness={0.15} />
      </mesh>

      {/* Palm */}
      <group position={[0, -2.15, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.36, 0.2]} />
          <meshStandardMaterial color="#0d0d11" roughness={0.6} metalness={0.35} />
        </mesh>
        {/* Fingers */}
        {[-0.14, -0.05, 0.05, 0.14].map((x, i) => (
          <group key={i} position={[x, -0.28, 0]}>
            <mesh>
              <cylinderGeometry args={[0.038, 0.03, 0.42, 14]} />
              <meshStandardMaterial color="#0f0f13" roughness={0.65} metalness={0.35} />
            </mesh>
            <mesh position={[0, -0.24, 0]}>
              <sphereGeometry args={[0.038, 10, 10]} />
              <meshStandardMaterial color="#0f0f13" roughness={0.65} metalness={0.35} />
            </mesh>
          </group>
        ))}
        {/* Thumb */}
        <group position={[0.22, -0.02, 0]} rotation={[0, 0, -0.7]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.032, 0.32, 12]} />
            <meshStandardMaterial color="#0f0f13" roughness={0.65} metalness={0.35} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#0f0f13" roughness={0.65} metalness={0.35} />
          </mesh>
        </group>
      </group>

      {/* Thin cyan tracer rings */}
      {[1.5, 0.5, -0.4, -1.2].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48 - Math.abs(y) * 0.06, 0.004, 8, 64]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = ({ style }) => (
  <>
    <ambientLight intensity={0.18} />
    <spotLight position={[5, 4, 5]} intensity={28} angle={0.6} penumbra={0.7} color="#22d3ee" castShadow />
    <spotLight position={[-5, -2, 3]} intensity={22} angle={0.6} penumbra={0.8} color="#f97316" />
    <pointLight position={[0, 6, -3]} intensity={14} color="#ffffff" distance={16} />
    <Suspense fallback={null}>
      <Float speed={1.15} rotationIntensity={0.18} floatIntensity={0.55}>
        <Arm style={style} />
      </Float>
    </Suspense>
  </>
);

export const Hero3D = () => {
  const { t } = useLang();
  const [style, setStyle] = useState("patutikon");
  const styleKeys = ["polynesian", "cyberpunk", "anime", "patutikon"];

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen w-full pt-28 pb-24 overflow-hidden"
    >
      <div className="absolute inset-0 cyber-grid opacity-70 pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT — Text */}
        <div className="lg:col-span-5 space-y-7 relative z-10">
          <div className="flex items-center gap-3 font-mono text-[11px] text-white/60 uppercase tracking-[0.35em]">
            <span className="dot dot-cyan" />
            <span data-testid="hero-tag">{t.hero.tag}</span>
          </div>

          <h1 className="font-head font-bold leading-[0.95] text-[3.2rem] md:text-6xl lg:text-7xl tracking-tight">
            <span className="block text-white">{t.hero.title1}</span>
            <span className="block text-white/85 mt-1">{t.hero.title2}</span>
            <span className="block mt-1">
              <span className="text-cyan-neon">in ink </span>
              <span className="text-white/40">&amp;</span>
              <span className="text-magenta-neon"> chrome.</span>
            </span>
          </h1>

          <p className="text-white/55 max-w-md text-[15px] md:text-base leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              data-testid="cta-enter-experience"
              onClick={() =>
                document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })
              }
              className="neon-btn neon-btn--solid"
            >
              {t.hero.cta_enter} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              data-testid="cta-book-session"
              onClick={() =>
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
              }
              className="neon-btn neon-btn--magenta"
            >
              {t.hero.cta_book}
            </button>
          </div>

          {/* Micro spec bar */}
          <div className="pt-6 flex items-center gap-6 text-[11px] font-mono uppercase tracking-[0.28em] text-white/40">
            <span>Est. 2013</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Ozieri · IT</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Podere 173</span>
          </div>
        </div>

        {/* RIGHT — 3D viewport */}
        <div className="lg:col-span-7 relative">
          <div
            data-testid="hero-3d-viewport"
            className="relative aspect-[4/5] md:aspect-[5/5] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden glass-card corner-brackets"
          >
            {/* Precise HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20 pointer-events-none">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                <span className="text-cyan-neon">MDL/</span>NEO-SAPIEN
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                STYLE :: <span className="text-magenta-neon">{style}</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                {t.hero.hint}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                60 fps
              </div>
            </div>

            <Canvas
              camera={{ position: [0, 0.2, 6.2], fov: 42 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
            >
              <Scene style={style} />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 3.2}
                maxPolarAngle={Math.PI / 1.6}
              />
            </Canvas>
          </div>

          {/* Style selector — clean pills, docked below */}
          <div
            data-testid="style-selector"
            className="mt-5 flex flex-wrap gap-2"
          >
            {styleKeys.map((k) => {
              const active = style === k;
              return (
                <button
                  key={k}
                  data-testid={`style-selector-${k}`}
                  onClick={() => setStyle(k)}
                  className={`group relative font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2.5 rounded-full border transition-colors duration-200 ${
                    active
                      ? "text-black border-transparent"
                      : "text-white/60 border-white/10 bg-white/[0.02] hover:text-cyan-neon hover:border-cyan-500/40"
                  }`}
                  style={
                    active
                      ? {
                          background: "var(--gb-cyan)",
                          boxShadow: "0 8px 26px -8px rgba(34,211,238,0.6)",
                        }
                      : {}
                  }
                >
                  <span
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors duration-200 ${
                      active ? "bg-black/60" : "bg-white/25 group-hover:bg-cyan-neon"
                    }`}
                    style={active ? { backgroundColor: "rgba(0,0,0,0.55)" } : {}}
                  />
                  <span className="pl-3">{t.hero.styles[k]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
