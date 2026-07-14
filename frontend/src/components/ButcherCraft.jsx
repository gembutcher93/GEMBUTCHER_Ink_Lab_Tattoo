import React from "react";
import { useLang } from "@/context/LangContext";
import { MapPin } from "lucide-react";

const PORTRAIT_URL =
  "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/ty3eomcf_Copertina_classica.webp";

export const ButcherCraft = () => {
  const { t } = useLang();

  return (
    <section
      id="craft"
      data-testid="craft-section"
      className="relative py-28 md:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.10] pointer-events-none"
        style={{ backgroundColor: "var(--gb-orange)" }}
      />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-10">
        {/* Portrait */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card corner-brackets aspect-[3/4] overflow-hidden relative rounded-2xl">
            <img
              src={PORTRAIT_URL}
              alt="GemButcher"
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(0.35) contrast(1.08) brightness(0.9)" }}
            />
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
                  "radial-gradient(circle at 78% 12%, rgba(249,115,22,0.20), transparent 55%)",
              }}
            />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                <span className="text-cyan-neon">SUBJECT/</span>GEMBUTCHER
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                DOSSIER · 01
              </span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                Ozieri · Sardinia
              </div>
              <div className="text-white/80 font-head text-lg">
                12<span className="text-white/40">y</span>
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
            03 / the butcher's craft
          </div>
          <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-tight">
            <span className="text-white/95">L'arte del </span>
            <span className="text-magenta-neon italic">Macellaio</span>
          </h2>

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
                    "linear-gradient(rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.18) 1px, transparent 1px)",
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
                  stroke="rgba(34,211,238,0.45)"
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
    </section>
  );
};
