import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Float, useTexture } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import * as THREE from "three";
import { useLang } from "@/context/LangContext";
import { ArrowRight, Sparkles } from "lucide-react";

const OBJ_URL = "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/8k8t8gsc_11535_arm_V3_.obj";

const TEXTURES = {
  default: { color: "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/1c3nkxuc__11535_arm_V3_FINALdefault-color.webp" },
  polynesian: { color: "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/oym8zk3u__11535_arm_V3_FINALpolynesian-color.webp" },
  cyberpunk: { color: "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/ymbxx386__11535_arm_V3_FINALcybertattoo-color.webp" },
  patutikon: { color: "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/qt9rqmrk__11535_arm_V3_FINALpatutikon-color.webp" },
};

const ROUGHNESS_URL = "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/dffvjzoz__11535_arm_V3_FINALdefault-roughness.webp";
const METALLIC_URL = "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/ffuty8ur__11535_arm_V3_FINALdefault-metallic.webp";

const STYLE_KEYS = ["default", "polynesian", "cyberpunk", "patutikon"];

const ArmModel = ({ style }) => {
  const group = useRef();
  const obj = useLoader(OBJLoader, OBJ_URL);

  const textures = useTexture([
    TEXTURES.default.color,
    TEXTURES.polynesian.color,
    TEXTURES.cyberpunk.color,
    TEXTURES.patutikon.color,
    ROUGHNESS_URL,
    METALLIC_URL,
  ]);
  
  const [colorDefault, colorPoly, colorCyber, colorPatu, roughMap, metalMap] = textures;

  const colorMapByStyle = useMemo(() => ({
    default: colorDefault,
    polynesian: colorPoly,
    cyberpunk: colorCyber,
    patutikon: colorPatu,
  }), [colorDefault, colorPoly, colorCyber, colorPatu]);

  useEffect(() => {
    [colorDefault, colorPoly, colorCyber, colorPatu].forEach((t) => {
      if (!t) return;
      t.colorSpace = THREE.SRGBColorSpace;
      t.flipY = false;
      t.anisotropy = 8;
    });
    [roughMap, metalMap].forEach((t) => {
      if (!t) return;
      t.flipY = false;
      t.anisotropy = 8;
    });
  }, [colorDefault, colorPoly, colorCyber, colorPatu, roughMap, metalMap]);

  const processed = useMemo(() => {
    const cloned = obj.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const targetHeight = 2.1;
    const scale = targetHeight / (size.y || 1);
    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    return cloned;
  }, [obj]);

  useEffect(() => {
    const map = colorMapByStyle[style] || colorDefault;
    processed.traverse((child) => {
      if (child.isMesh) {
        const emissiveHex = style === "cyberpunk" ? "#ff2d95" : style === "patutikon" ? "#00ffb3" : style === "polynesian" ? "#00ffb3" : "#111826";
        child.material = new THREE.MeshStandardMaterial({
          map,
          roughnessMap: roughMap,
          metalnessMap: metalMap,
          roughness: 0.85,
          metalness: 0.35,
          emissive: new THREE.Color(emissiveHex),
          emissiveIntensity: style === "default" ? 0.02 : 0.28,
          emissiveMap: style === "default" ? null : map,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [processed, style, colorMapByStyle, colorDefault, roughMap, metalMap]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.05;
  });

  return (
<group ref={group} rotation={[0, 0, 0]} position={[0, 0, 0]}>
  <primitive object={processed} />
</group>
  );
};

const LoadingCube = () => {
  const ref = useRef();
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * 0.8;
      ref.current.rotation.y += d * 1.1;
    }
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshBasicMaterial color="#00ffb3" wireframe />
    </mesh>
  );
};

const Scene = ({ style }) => (
  <>
    <ambientLight intensity={0.5} />
    <spotLight position={[5, 4, 5]} intensity={32} angle={0.65} penumbra={0.7} color="#00ffb3" castShadow />
    <spotLight position={[-5, -2, 3]} intensity={24} angle={0.65} penumbra={0.8} color="#ff2d95" />
    <pointLight position={[0, 6, -3]} intensity={16} color="#ffffff" distance={18} />
    <Suspense fallback={<LoadingCube />}>
      <Float speed={1.05} rotationIntensity={0.15} floatIntensity={0.45}>
        <ArmModel style={style} />
      </Float>
    </Suspense>
  </>
);

export const Hero3D = () => {
  const { t } = useLang();
  const [style, setStyle] = useState("patutikon");

  return (
    <section id="hero" data-testid="hero-section" className="relative min-h-screen w-full pt-28 pb-24 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-70 pointer-events-none" />
      <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-7 relative z-10">
          <div className="flex items-center gap-3 font-mono text-[11px] text-white/60 uppercase tracking-[0.35em]">
            <span className="dot dot-cyan" />
            <span>{t.hero.tag}</span>
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
          <p className="text-white/55 max-w-md text-[15px] md:text-base leading-relaxed">{t.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => document.getElementById("viewport-3d")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="neon-btn neon-btn--solid">
              {t.hero.cta_enter} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="neon-btn neon-btn--magenta">
              {t.hero.cta_book}
            </button>
            <button onClick={() => window.dispatchEvent(new CustomEvent("gb:quote-open"))} className="neon-btn">
              <Sparkles className="w-3.5 h-3.5" /> {t.quickQuote.cta_open}
            </button>
          </div>
        </div>
      <div className="lg:col-span-7 relative">
  <div 
    id="viewport-3d" 
    className="relative aspect-[4/5] w-full max-h-[50vh] max-w-full rounded-2xl overflow-hidden glass-card corner-brackets"
    style={{ touchAction: 'none' }}
  >
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }} 
      style={{ background: "transparent" }}
    >
      <Scene style={style} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        target={[0, 0, 0]} 
      />
    </Canvas>
  </div>
  <div className="mt-5 flex flex-wrap gap-2">
    {STYLE_KEYS.map((k) => (
      <button 
        key={k} 
        onClick={() => setStyle(k)} 
        className={`px-4 py-2.5 rounded-full border ${style === k ? "text-black border-transparent" : "text-white/60 border-white/10"}`} 
        style={style === k ? { background: "var(--gb-cyan)" } : {}}
      >
        {t.hero.styles[k]}
      </button>
    ))}
  </div>
</div>
      </div>
    </section>
  );
};
