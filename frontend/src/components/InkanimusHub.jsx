import React, { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import { INKANIMUS_APP_URL } from "@/lib/i18n";
import {
  Check,
  Trophy,
  Flame,
  Droplet,
  Sun,
  Waves,
  Sparkles,
  ExternalLink,
  Lock,
  MapPin,
  Shield,
  Gift,
  Users,
  Timer,
} from "lucide-react";

const STORAGE_KEY = "gb.inkanimus.v2";

const initialState = {
  aftercare: {},
};

const readState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
};

const writeState = (s) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
};

// ---- Aftercare Panel — compact teaser only, full experience lives in the app ----
const AftercarePanel = ({ state, setState }) => {
  const { t } = useLang();
  const tasks = t.inkanimus.aftercare.tasks;
  const preview = tasks.slice(0, 3);

  // Local ephemeral state — persists across tabs via hubState
  const previewChecked = state.aftercare.__teaser || {};
  const toggle = (idx) => {
    setState((s) => ({
      ...s,
      aftercare: {
        ...s.aftercare,
        __teaser: { ...(s.aftercare.__teaser || {}), [idx]: !(s.aftercare.__teaser || {})[idx] },
      },
    }));
  };

  const done = preview.filter((_, i) => previewChecked[i]).length;

  return (
    <div className="grid md:grid-cols-5 gap-6" data-testid="aftercare-panel">
      <div className="md:col-span-2 space-y-5">
        <h3 className="font-head text-2xl md:text-3xl text-white">
          {t.inkanimus.aftercare.title}
        </h3>
        <p className="text-white/55 text-[15px] leading-relaxed">
          {t.inkanimus.aftercare.teaser_desc}
        </p>

        <div className="glass-card p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)",
              border: "1px solid var(--gb-cyan-line)",
            }}
          >
            <Flame className="w-5 h-5 text-cyan-neon" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              {t.inkanimus.aftercare.streak_label}
            </div>
            <div className="font-head text-2xl text-white mt-0.5">
              {done}<span className="text-white/40 text-base"> / {preview.length}</span>
            </div>
          </div>
        </div>

        <a
          data-testid="aftercare-open-app"
          href={INKANIMUS_APP_URL}
          target="_blank"
          rel="noreferrer"
          className="neon-btn neon-btn--solid"
        >
          {t.inkanimus.aftercare.cta_full} <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="md:col-span-3 glass-card p-6 relative" data-testid="aftercare-checklist">
        <div className="flex items-center justify-between mb-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-neon">
            {t.inkanimus.aftercare.teaser_label}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            preview · 3 / {tasks.length}
          </div>
        </div>

        <ul className="space-y-2.5">
          {preview.map((task, i) => {
            const isOn = !!previewChecked[i];
            return (
              <li key={i}>
                <button
                  data-testid={`aftercare-task-${i}`}
                  onClick={() => toggle(i)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition-colors duration-150 ${
                    isOn
                      ? "border-cyan-500/50 bg-cyan-500/[0.05]"
                      : "border-white/5 hover:border-cyan-500/25 bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                      isOn ? "border-transparent" : "border-white/20"
                    }`}
                    style={isOn ? { backgroundColor: "var(--gb-cyan)" } : {}}
                  >
                    {isOn && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                  </span>
                  <span className={`text-sm ${isOn ? "text-white line-through decoration-cyan-neon/60" : "text-white/75"}`}>
                    {task}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
          <p className="text-white/45 text-xs font-mono uppercase tracking-[0.22em]">
            + {tasks.length - preview.length} {t.inkanimus.aftercare.more_in_app}
          </p>
          <a
            href={INKANIMUS_APP_URL}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-neon text-xs font-mono uppercase tracking-[0.22em] hover:underline"
          >
            {t.inkanimus.aftercare.open_short} →
          </a>
        </div>
      </div>
    </div>
  );
};

// ---- Inkanimus App Panel (explanation) ----
const AppPanel = () => {
  const { t } = useLang();
  const a = t.inkanimus.app;
  const stepIcons = [MapPin, Shield, Users, Gift];

  return (
    <div className="grid md:grid-cols-5 gap-6" data-testid="app-panel">
      <div className="md:col-span-3 space-y-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-magenta-neon mb-3">
            {a.badge}
          </div>
          <h3 className="font-head text-2xl md:text-3xl text-white">{a.title}</h3>
          <p className="text-gray-400 text-[15px] leading-relaxed mt-3 max-w-xl">
            {a.lead}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-neon mb-4">
            {a.how_title}
          </div>
          <ol className="space-y-4">
            {a.steps.map((step, i) => {
              const Icon = stepIcons[i] || Shield;
              return (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-9 h-9 rounded-full border border-cyan-500/40 flex items-center justify-center font-mono text-xs text-cyan-neon"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(0,240,255,0.18), transparent 70%)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-white text-sm md:text-base leading-relaxed">
                      <Icon className="w-4 h-4 text-magenta-neon flex-shrink-0" />
                      <span>{step}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="glass-card p-5 border-l-2" style={{ borderColor: "var(--gb-magenta)" }}>
          <p className="text-gray-300 text-sm italic leading-relaxed">{a.note}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            data-testid="inkanimus-app-open"
            onClick={() =>
              document.getElementById("inkanimus-launch")?.scrollIntoView({ behavior: "smooth" })
            }
            className="neon-btn neon-btn--solid"
          >
            <Lock className="w-4 h-4" />
            {a.cta_open}
          </button>
          <button
            data-testid="inkanimus-app-book"
            onClick={() =>
              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
            }
            className="neon-btn neon-btn--magenta"
          >
            {a.cta_book}
          </button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-magenta-neon mb-1">
          {a.perks_title}
        </div>
        {a.perks.map((p, i) => (
          <div
            key={i}
            className="glass-card p-4 flex items-start gap-4"
            data-testid={`inkanimus-perk-${i}`}
          >
            <div
              className="flex-shrink-0 font-head text-2xl min-w-[70px]"
              style={{
                color: i % 2 === 0 ? "var(--gb-cyan)" : "var(--gb-magenta)",
                textShadow:
                  i % 2 === 0
                    ? "0 0 12px rgba(0,240,255,0.5)"
                    : "0 0 12px rgba(255,0,127,0.5)",
              }}
            >
              {p.k}
            </div>
            <div className="text-gray-300 text-sm leading-snug pt-1">{p.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Arcade Panel ----
const ArcadePanel = () => {
  const { t } = useLang();
  const board = useMemo(
    () => [
      { name: "KURO.SAN", pts: 482, badge: "★★★" },
      { name: "IVANA.13", pts: 431, badge: "★★" },
      { name: "NEO.SAPIEN", pts: 399, badge: "★★" },
      { name: "MARA.INK", pts: 360, badge: "★" },
      { name: "YOU", pts: 241, badge: "◈" },
      { name: "LORIS.T", pts: 210, badge: "◈" },
      { name: "ZERO.OZ", pts: 165, badge: "◈" },
    ],
    []
  );

  return (
    <div className="grid md:grid-cols-5 gap-6" data-testid="arcade-panel">
      <div className="md:col-span-2 space-y-5">
        <h3 className="font-head text-2xl md:text-3xl text-white">
          {t.inkanimus.arcade.title}
        </h3>
        <p className="text-gray-400 text-[15px] leading-relaxed">
          {t.inkanimus.arcade.desc}
        </p>

        <div className="glass-card p-6 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ backgroundColor: "var(--gb-magenta)" }}
          />
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-magenta-neon mb-2">
            {t.inkanimus.arcade.active_challenge}
          </div>
          <div className="font-head text-2xl text-white mb-2">
            {t.inkanimus.arcade.challenge_name}
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            {t.inkanimus.arcade.challenge_desc}
          </p>
          <div className="flex items-center gap-4 mb-5 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-neon">
              <Timer className="w-3.5 h-3.5" /> 12d
            </div>
            <div className="flex items-center gap-1.5 text-magenta-neon">
              <Gift className="w-3.5 h-3.5" /> {t.inkanimus.arcade.prize_v}
            </div>
          </div>
          <button data-testid="arcade-join" className="neon-btn neon-btn--magenta w-full">
            <Trophy className="w-4 h-4" /> {t.inkanimus.arcade.join}
          </button>
        </div>
      </div>

      <div className="md:col-span-3 glass-card p-6" data-testid="arcade-leaderboard">
        <div className="grid grid-cols-12 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 pb-3 border-b border-white/5">
          <div className="col-span-2">{t.inkanimus.arcade.rank}</div>
          <div className="col-span-7">{t.inkanimus.arcade.player}</div>
          <div className="col-span-3 text-right">{t.inkanimus.arcade.score}</div>
        </div>
        <ul>
          {board.map((row, i) => {
            const rank = i + 1;
            const isYou = row.name === "YOU";
            const podium = rank <= 3;
            return (
              <li
                key={row.name}
                className={`grid grid-cols-12 items-center py-3.5 border-b border-white/5 font-mono text-sm rounded-lg px-2 ${
                  isYou ? "" : ""
                }`}
                style={
                  isYou
                    ? { background: "linear-gradient(90deg, rgba(255,0,127,0.10), transparent 70%)" }
                    : {}
                }
              >
                <div
                  className={`col-span-2 font-head text-lg ${
                    podium ? "text-magenta-neon" : "text-gray-500"
                  }`}
                >
                  #{String(rank).padStart(2, "0")}
                </div>
                <div className="col-span-7 flex items-center gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: isYou
                        ? "var(--gb-magenta)"
                        : podium
                        ? "var(--gb-cyan)"
                        : "#333",
                      boxShadow: podium || isYou
                        ? `0 0 8px ${isYou ? "rgba(255,0,127,0.7)" : "rgba(0,240,255,0.7)"}`
                        : "none",
                    }}
                  />
                  <span className={`${isYou ? "text-magenta-neon" : "text-white"}`}>
                    {row.name}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">{row.badge}</span>
                </div>
                <div
                  className={`col-span-3 text-right font-head text-lg ${
                    isYou ? "text-magenta-neon" : "text-cyan-neon"
                  }`}
                >
                  {row.pts}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const InkanimusHub = () => {
  const { t } = useLang();
  const [tab, setTab] = useState("app");
  const [hubState, setHubState] = useState(readState);

  useEffect(() => writeState(hubState), [hubState]);

  const tabs = [
    { id: "app", label: t.inkanimus.tabs.app },
    { id: "arcade", label: t.inkanimus.tabs.arcade },
  ];

  return (
    <section
      id="inkanimus"
      data-testid="inkanimus-section"
      className="relative py-28 md:py-36"
    >
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-15 pointer-events-none"
        style={{ backgroundColor: "var(--gb-cyan)" }}
      />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 relative">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="font-mono text-[11px] text-cyan-neon uppercase tracking-[0.35em] mb-4">
            04 / loyalty hub
          </div>
          <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-tight">
            <span className="text-white/95">Inkanimus </span>
            <span className="text-cyan-neon glow-cyan italic">Loyalty Hub</span>
          </h2>
          <p className="mt-5 text-gray-400 text-[15px] leading-relaxed">
            {t.inkanimus.subtitle}
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-10" data-testid="inkanimus-tabs">
          {tabs.map((tb) => {
            const active = tab === tb.id;
            return (
              <button
                key={tb.id}
                data-testid={`inkanimus-tab-${tb.id}`}
                onClick={() => setTab(tb.id)}
                className={`font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 rounded-full border transition-colors duration-200 ${
                  active
                    ? "text-black border-transparent"
                    : "text-gray-400 border-white/10 bg-white/[0.02] hover:border-cyan-500/60 hover:text-cyan-neon"
                }`}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, var(--gb-cyan), rgba(0,240,255,0.7))",
                        boxShadow: "0 8px 32px rgba(0,240,255,0.3)",
                      }
                    : {}
                }
              >
                {tb.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-[540px]">
          {tab === "app" && <AppPanel />}
          {tab === "arcade" && <ArcadePanel />}
        </div>
      </div>
    </section>
  );
};
