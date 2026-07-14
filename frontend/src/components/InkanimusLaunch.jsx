import React from "react";
import { useLang } from "@/context/LangContext";
import { INKANIMUS_APP_URL } from "@/lib/i18n";
import {
  ArrowUpRight,
  ExternalLink,
  Zap,
  Users,
  Trophy,
  ShieldCheck,
} from "lucide-react";

const BULLET_ICONS = [ShieldCheck, Users, Zap, Trophy];

export const InkanimusLaunch = () => {
  const { t } = useLang();
  const l = t.inkanimus.launch;

  return (
    <section
      id="inkanimus-launch"
      data-testid="inkanimus-launch-section"
      className="relative py-24 md:py-32"
    >
      {/* Ambient cold cyan wash */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] opacity-[0.12] pointer-events-none"
        style={{ backgroundColor: "var(--gb-cyan)" }}
      />
      {/* Ambient burnt orange highlight */}
      <div
        aria-hidden
        className="absolute -bottom-24 right-0 w-[520px] h-[520px] rounded-full blur-[160px] opacity-[0.10] pointer-events-none"
        style={{ backgroundColor: "var(--gb-orange)" }}
      />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 relative">
        <div className="glass-card corner-brackets rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Left column — copy */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between gap-10 border-b lg:border-b-0 lg:border-r border-white/5">
              <div className="space-y-6">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                  <span className="dot dot-cyan" />
                  <span data-testid="launch-eyebrow">{l.eyebrow}</span>
                </div>

                <div>
                  <h2 className="font-head font-bold text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                    <span className="text-cyan-neon">Ink</span>
                    <span className="text-white">Animus</span>
                    <span className="text-cyan-neon">.</span>
                  </h2>
                  <p className="mt-6 font-head text-xl md:text-2xl text-white/90 leading-tight max-w-xl">
                    {l.headline}
                  </p>
                  <p className="mt-5 text-white/55 text-[15px] md:text-base leading-relaxed max-w-xl">
                    {l.lead}
                  </p>
                </div>

                <ul className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {l.bullets.map((b, i) => {
                    const Icon = BULLET_ICONS[i] || ShieldCheck;
                    return (
                      <li
                        key={i}
                        data-testid={`launch-bullet-${i}`}
                        className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                      >
                        <span
                          className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(34,211,238,0.14), rgba(34,211,238,0.02))",
                            border: "1px solid var(--gb-cyan-line)",
                          }}
                        >
                          <Icon className="w-3.5 h-3.5 text-cyan-neon" />
                        </span>
                        <span className="text-white/75 text-sm leading-snug">{b}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  data-testid="launch-cta-open"
                  href={INKANIMUS_APP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="neon-btn neon-btn--solid"
                >
                  {l.cta_open}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  data-testid="launch-cta-secondary"
                  onClick={() =>
                    document.getElementById("inkanimus")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="neon-btn"
                >
                  {l.cta_secondary}
                </button>
                <div className="hidden sm:flex items-center gap-2 ml-auto font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                  <span className="dot dot-orange" />
                  {l.status_live}
                </div>
              </div>
            </div>

            {/* Right column — visual mock */}
            <div className="lg:col-span-5 relative p-8 md:p-12 lg:p-14 flex items-center justify-center min-h-[420px]">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 60% 40%, rgba(34,211,238,0.10), transparent 60%), radial-gradient(circle at 30% 80%, rgba(249,115,22,0.08), transparent 60%)",
                }}
              />

              {/* Phone-frame mock */}
              <div
                data-testid="launch-app-mock"
                className="relative w-[240px] md:w-[260px] aspect-[9/19] rounded-[36px] border border-white/10 bg-gradient-to-b from-white/[0.03] to-black/60 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden"
              >
                {/* notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black/80 z-20" />
                {/* status bar */}
                <div className="absolute top-2.5 left-6 right-6 flex items-center justify-between text-[9px] font-mono text-white/60 z-10 pt-1">
                  <span>21:73</span>
                  <span>◉ ▲ ▲</span>
                </div>

                {/* screen */}
                <div className="absolute inset-3 top-10 bottom-3 rounded-[26px] overflow-hidden border border-white/5" style={{ background: "linear-gradient(180deg, #0a0a10 0%, #050506 100%)" }}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-head text-[11px] tracking-[0.22em] text-cyan-neon">
                        INKANIMUS
                      </div>
                      <div className="font-mono text-[8px] uppercase tracking-widest text-white/40">
                        adept·73
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                        Ink-points
                      </div>
                      <div className="font-head text-2xl text-white mt-1">
                        340<span className="text-white/40 text-sm ml-1">INK</span>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: "62%",
                            background:
                              "linear-gradient(90deg, var(--gb-cyan), var(--gb-orange))",
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40 mb-2">
                        Aftercare · giorno 3
                      </div>
                      {["Pulizia", "Pomata", "No sole"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2 py-1">
                          <span
                            className="w-3 h-3 rounded-md border flex items-center justify-center"
                            style={{
                              borderColor: i < 2 ? "transparent" : "rgba(255,255,255,0.2)",
                              background: i < 2 ? "var(--gb-cyan)" : "transparent",
                            }}
                          >
                            {i < 2 && (
                              <span className="text-black text-[7px] font-bold">✓</span>
                            )}
                          </span>
                          <span className={`text-[10px] ${i < 2 ? "text-white/50 line-through" : "text-white/85"}`}>
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                        Codice adepto
                      </div>
                      <div className="font-mono text-sm text-magenta-neon mt-1 tracking-widest">
                        GB-K7RX92
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version tag */}
              <div className="absolute bottom-6 left-6 md:left-10 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                <span className="text-cyan-neon">{l.version_tag}</span>
              </div>

              {/* External link hint */}
              <a
                href={INKANIMUS_APP_URL}
                target="_blank"
                rel="noreferrer"
                data-testid="launch-domain-link"
                className="absolute bottom-6 right-6 md:right-10 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45 hover:text-cyan-neon transition-colors duration-200"
              >
                ink-animus-adepto…vercel.app
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
