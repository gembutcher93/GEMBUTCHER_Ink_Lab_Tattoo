import React, { useState } from "react";
import { useLang } from "@/context/LangContext";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const PORTRAITS = [
  {
    src: "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/273zn4so_Copertina_Cyber.png",
    label: "NEO-SAPIEN",
    caption: { it: "Persona cyberpunk", en: "Cyberpunk persona" },
  },
  {
    src: "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/ty3eomcf_Copertina_classica.webp",
    label: "GEMBUTCHER",
    caption: { it: "Il tatuatore, senza maschera", en: "The tattooist, unmasked" },
  },
];

export const ButcherCraft = () => {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(0);
  const current = PORTRAITS[idx];
  const next = () => setIdx((i) => (i + 1) % PORTRAITS.length);
  const prev = () => setIdx((i) => (i - 1 + PORTRAITS.length) % PORTRAITS.length);

  return (
    <section
      id="craft"
      data-testid="craft-section"
      className="relative pt-28 pb-24 md:pt-32 md:pb-32 min-h-screen overflow-hidden"
    >
      {/* Cyberpunk grid backdrop */}
      <div className="hero-grid-bg" />

      {/* Ambient glows */}
      <div
        aria-hidden
        className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.12] pointer-events-none parallax-slow"
        style={{ backgroundColor: "var(--gb-orange)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -right-32 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.10] pointer-events-none parallax-med"
        style={{ backgroundColor: "var(--gb-cyan)" }}
      />

      {/* Background marquee ticker */}
      <div className="marquee-bg parallax-slow" aria-hidden>
        <span>PATUTIKON · NEO-TRIBAL · INK &amp; CHROME · PODERE 173 · </span>
        <span>PATUTIKON · NEO-TRIBAL · INK &amp; CHROME · PODERE 173 · </span>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-5 md:px-10">
        {/* --- KINETIC HERO TITLE --- */}
        <div className="pb-10 md:pb-14 flex items-end justify-between flex-wrap gap-6" data-reveal>
          <div className="space-y-5 max-w-3xl">
            <div className="flex items-center gap-3 font-mono text-[11px] text-white/50 uppercase tracking-[0.35em]">
              <span className="dot dot-cyan" />
              <span>// ozieri — sardegna — italia · podere 173</span>
            </div>
            <div className="kinetic-title" data-testid="kinetic-hero-title">
              <span
                className="kinetic-title__layer"
                style={{ fontSize: "clamp(2.4rem, 14vw, 9.5rem)" }}
              >
                GEMBUTCHER
              </span>
              <span
                className="kinetic-title__mint kinetic-title__layer"
                style={{ fontSize: "clamp(2.4rem, 14vw, 9.5rem)" }}
                aria-hidden
              >
                GEMBUTCHER
              </span>
              <span
                className="kinetic-title__magenta kinetic-title__layer"
                style={{ fontSize: "clamp(2.4rem, 14vw, 9.5rem)" }}
                aria-hidden
              >
                GEMBUTCHER
              </span>
            </div>
            <div className="pt-2 font-head text-2xl md:text-3xl lg:text-4xl tracking-[0.4em] leading-[1.05]" data-testid="hero-tagline">
              <span className="text-white/30">|</span>
              <span className="text-cyan-neon glow-cyan mx-1">TATTOOER</span>
              <span className="text-white/30">|</span>
            </div>
          </div>

          {/* Right-side spec column — cinematic dossier chips */}
          <div className="flex flex-col gap-2 min-w-[240px]">
            <div className="glass-card px-4 py-3 rounded-xl flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">SUBJECT</span>
              <span className="font-head text-sm text-cyan-neon">GEMBUTCHER</span>
            </div>
            <div className="glass-card px-4 py-3 rounded-xl flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">LOC</span>
              <span className="font-head text-sm text-white/90">40.5876° N</span>
            </div>
            <div className="glass-card px-4 py-3 rounded-xl flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">STATUS</span>
              <span className="flex items-center gap-1.5 text-magenta-neon font-head text-sm">
                <span className="dot dot-orange" />ACTIVE
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Portrait carousel */}
          <div className="lg:col-span-5 space-y-5" data-reveal="stagger-1">
            <div
              className="glass-card corner-brackets aspect-[3/4] overflow-hidden relative rounded-2xl tilt-card"
              data-testid="portrait-carousel"
            >
            {PORTRAITS.map((p, i) => (
              <img
                key={p.src}
                src={p.src}
                alt={p.label}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === idx ? "opacity-100" : "opacity-0"
                }`}
                style={{ filter: "grayscale(0.15) contrast(1.08) brightness(0.92)" }}
              />
            ))}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,5,6,0.15) 0%, rgba(5,5,6,0.05) 40%, rgba(5,5,6,0.85) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 78% 12%, rgba(255, 45, 149,0.20), transparent 55%)",
              }}
            />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                <span className="text-cyan-neon">SUBJECT/</span>{current.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                DOSSIER · {String(idx + 1).padStart(2, "0")} / {String(PORTRAITS.length).padStart(2, "0")}
              </span>
            </div>

            {/* Prev / Next */}
            <button
              data-testid="portrait-prev"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-white/80 hover:text-cyan-neon hover:border-cyan-500/50 transition-colors duration-200 flex items-center justify-center z-10"
              aria-label="previous portrait"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              data-testid="portrait-next"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-white/80 hover:text-magenta-neon transition-colors duration-200 flex items-center justify-center z-10"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
              aria-label="next portrait"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
                {current.caption[lang] || current.caption.it}
              </div>
              <div className="flex items-center gap-1.5">
                {PORTRAITS.map((_, i) => (
                  <button
                    key={i}
                    data-testid={`portrait-dot-${i}`}
                    onClick={() => setIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === idx ? "w-6" : "w-1.5 bg-white/25 hover:bg-white/40"
                    }`}
                    style={i === idx ? { backgroundColor: "var(--gb-cyan)" } : {}}
                    aria-label={`portrait ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {t.craft.stats.map((s, i) => (
              <div
                key={i}
                className="glass-card px-4 py-5 rounded-xl text-left"
                data-testid={`craft-stat-${i}`}
              >
                <div className="font-head text-[1.9rem] md:text-3xl text-cyan-neon">
                  {s.v}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40 mt-1">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text */}
        <div className="lg:col-span-7 space-y-7 lg:pt-4">
          <div className="font-mono text-[11px] text-cyan-neon uppercase tracking-[0.35em]">
            01 / NATO NELL'INCHIOSTRO
          </div>

          <div className="space-y-5 text-white/70 leading-relaxed max-w-2xl text-[15px] md:text-base">
            <p>{t.craft.p1}</p>
            <p>{t.craft.p2}</p>
            <p
              className="text-white/90 italic border-l pl-4"
              style={{ borderColor: "var(--gb-orange-line)" }}
            >
              {t.craft.p3}
            </p>
          </div>

          {/* Studio card */}
          <div className="glass-card p-6 md:p-7 mt-6 max-w-xl rounded-2xl relative">
            <div className="font-mono text-[10px] text-cyan-neon uppercase tracking-[0.28em] mb-3">
              {t.craft.studio_label} · LIVE
            </div>
            <div className="font-head text-xl md:text-2xl text-white mb-1.5">
              {t.craft.studio_name}
            </div>
            <div className="flex items-start gap-2 text-white/60 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-magenta-neon flex-shrink-0" />
              <span>{t.craft.studio_addr}</span>
            </div>

            {/* Refined map */}
            <div className="mt-5 relative h-36 rounded-xl border border-white/10 bg-black/50 overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0, 255, 179,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 179,0.18) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 144"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 100 Q 100 70 200 90 T 400 40"
                  stroke="rgba(0, 255, 179,0.45)"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M 60 144 L 120 20"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M 280 144 L 320 0"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
              <div className="absolute top-1/2 left-[52%] -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-3 h-3 rounded-full pulse-ring"
                  style={{ backgroundColor: "var(--gb-orange)" }}
                />
              </div>
              <div className="absolute bottom-2 right-3 font-mono text-[9px] text-white/40 tracking-widest">
                40.5876° N · 9.0034° E
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
