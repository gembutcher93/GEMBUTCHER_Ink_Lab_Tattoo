import React from "react";
import { useLang } from "@/context/LangContext";
import { MapPin, Skull } from "lucide-react";

const PORTRAIT_URL =
  "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/ty3eomcf_Copertina_classica.webp";

export const ButcherCraft = () => {
  const { t } = useLang();

  return (
    <section id="craft" data-testid="craft-section" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid lg:grid-cols-12 gap-10">
        {/* Portrait column */}
        <div className="lg:col-span-5">
          <div className="holo-frame holo-frame-magenta corner-brackets scanlines aspect-[3/4] overflow-hidden relative">
            <img
              src={PORTRAIT_URL}
              alt="GemButcher"
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(0.15) contrast(1.05)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,5,18,0.7) 0%, transparent 40%), radial-gradient(circle at 70% 20%, rgba(255,0,127,0.3), transparent 55%)",
              }}
            />

            <div className="absolute top-4 left-4 font-mono text-[10px] text-magenta-neon tracking-widest">
              SUBJECT :: GEMBUTCHER
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="font-mono text-[10px] text-cyan-neon tracking-widest">
                // dossier declassified
              </div>
              <Skull className="w-5 h-5 text-magenta-neon" />
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {t.craft.stats.map((s, i) => (
              <div key={i} className="holo-frame p-4 text-center" data-testid={`craft-stat-${i}`}>
                <div className="font-head text-3xl md:text-4xl text-cyan-neon glow-cyan">
                  {s.v}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-1">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text column */}
        <div className="lg:col-span-7 space-y-6 lg:pt-6">
          <div className="font-mono text-xs text-cyan-neon uppercase tracking-widest">
            // 03 — the butcher's craft
          </div>
          <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
            <span className="text-white/95">{t.craft.title.split("'")[0]}'</span>
            <span className="text-magenta-neon glow-magenta">
              {t.craft.title.split("'")[1]}
            </span>
          </h2>

          <div className="space-y-5 text-gray-300 leading-relaxed max-w-2xl">
            <p>{t.craft.p1}</p>
            <p>{t.craft.p2}</p>
            <p className="text-white/90 italic border-l-2 border-magenta-500 pl-4" style={{ borderColor: "var(--gb-magenta)" }}>
              {t.craft.p3}
            </p>
          </div>

          {/* Studio card */}
          <div className="holo-frame corner-brackets p-6 mt-8 max-w-xl relative">
            <div className="font-mono text-[10px] text-cyan-neon uppercase tracking-widest mb-2">
              // {t.craft.studio_label}
            </div>
            <div className="font-head text-xl md:text-2xl text-white mb-1">
              {t.craft.studio_name}
            </div>
            <div className="flex items-start gap-2 text-gray-400 font-mono text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-magenta-neon flex-shrink-0" />
              <span>{t.craft.studio_addr}</span>
            </div>

            {/* Mini stylized "map" */}
            <div className="mt-5 relative h-32 border border-cyan-500/20 bg-black/40 overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* fake roads */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
                <path d="M 0 90 Q 100 60 200 80 T 400 40" stroke="rgba(0,240,255,0.4)" strokeWidth="1" fill="none" />
                <path d="M 60 128 L 120 20" stroke="rgba(0,240,255,0.25)" strokeWidth="1" fill="none" />
                <path d="M 280 128 L 320 0" stroke="rgba(0,240,255,0.25)" strokeWidth="1" fill="none" />
              </svg>
              {/* marker */}
              <div className="absolute top-1/2 left-[52%] -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full bg-magenta-500 pulse-ring" style={{ backgroundColor: "var(--gb-magenta)" }} />
              </div>
              <div className="absolute bottom-2 right-3 font-mono text-[9px] text-gray-500 tracking-widest">
                40.5876° N, 9.0034° E
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
