import React, { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import { Copy, Check, RefreshCcw, Share2, Trophy, Flame, Droplet, Sun, Waves, Sparkles } from "lucide-react";

const STORAGE_KEY = "gb.inkanimus.v1";

const initialState = {
  aftercare: {},
  referral: {
    code: "",
    inkPoints: 240,
    pending: 60,
    referrals: 4,
  },
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

const genCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `GB-${out}`;
};

// ---- Aftercare Panel ----
const AftercarePanel = ({ state, setState }) => {
  const { t } = useLang();
  const [day, setDay] = useState(1);

  const dayKey = `d${day}`;
  const checked = state.aftercare[dayKey] || {};
  const toggle = (idx) => {
    setState((s) => ({
      ...s,
      aftercare: {
        ...s.aftercare,
        [dayKey]: { ...(s.aftercare[dayKey] || {}), [idx]: !(s.aftercare[dayKey] || {})[idx] },
      },
    }));
  };

  const tasks = t.inkanimus.aftercare.tasks;
  const completedCount = tasks.filter((_, i) => checked[i]).length;
  const progress = Math.round((completedCount / tasks.length) * 100);
  const streak = Object.keys(state.aftercare).filter((k) => {
    const v = state.aftercare[k];
    return v && Object.values(v).filter(Boolean).length === tasks.length;
  }).length;

  const icons = [Droplet, Waves, Sparkles, Sun, Waves, Flame];

  return (
    <div className="grid md:grid-cols-5 gap-6" data-testid="aftercare-panel">
      <div className="md:col-span-2 space-y-4">
        <h3 className="font-head text-2xl text-cyan-neon">{t.inkanimus.aftercare.title}</h3>
        <p className="text-gray-400 text-sm">{t.inkanimus.aftercare.desc}</p>

        <div className="holo-frame p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">
            {t.inkanimus.aftercare.day}
          </div>
          <div className="flex gap-1 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                data-testid={`aftercare-day-${d}`}
                onClick={() => setDay(d)}
                className={`w-9 h-9 font-mono text-xs border transition-colors duration-150 ${
                  d === day
                    ? "text-black border-cyan-500"
                    : "text-gray-400 border-cyan-500/25 hover:border-cyan-500/60 hover:text-cyan-neon"
                }`}
                style={{
                  backgroundColor: d === day ? "var(--gb-cyan)" : "transparent",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="holo-frame p-4 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              {t.inkanimus.aftercare.streak_label}
            </div>
            <div className="font-head text-3xl text-magenta-neon glow-magenta">{streak} <span className="text-lg text-gray-500">/ 7</span></div>
          </div>
          <Flame className="w-8 h-8 text-magenta-neon" />
        </div>
      </div>

      <div className="md:col-span-3 holo-frame p-5 relative" data-testid="aftercare-checklist">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-neon">
            ritual :: day.{day}
          </div>
          <div className="font-mono text-xs text-gray-400">
            {completedCount}/{tasks.length} • {progress}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-white/5 mb-5 overflow-hidden">
          <div
            className="h-full transition-[width] duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--gb-cyan), var(--gb-magenta))",
              boxShadow: "0 0 12px rgba(0,240,255,0.5)",
            }}
          />
        </div>

        <ul className="space-y-2">
          {tasks.map((task, i) => {
            const Icon = icons[i % icons.length];
            const isOn = !!checked[i];
            return (
              <li key={i}>
                <button
                  data-testid={`aftercare-task-${i}`}
                  onClick={() => toggle(i)}
                  className={`w-full flex items-center gap-3 text-left px-3 py-3 border transition-colors duration-150 ${
                    isOn
                      ? "border-cyan-500/60 bg-cyan-500/5"
                      : "border-white/5 hover:border-cyan-500/30"
                  }`}
                >
                  <span
                    className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${
                      isOn ? "border-cyan-500" : "border-gray-600"
                    }`}
                    style={isOn ? { backgroundColor: "var(--gb-toxic)" } : {}}
                  >
                    {isOn && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                  </span>
                  <Icon className={`w-4 h-4 ${isOn ? "text-cyan-neon" : "text-gray-500"}`} />
                  <span className={`text-sm ${isOn ? "text-white line-through decoration-cyan-neon/60" : "text-gray-300"}`}>
                    {task}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {progress === 100 && (
          <div className="mt-4 font-mono text-xs text-toxic uppercase tracking-widest text-center">
            ✔ {t.inkanimus.aftercare.completed} — +20 ink
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Recruitment Panel ----
const RecruitPanel = ({ state, setState }) => {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const code = state.referral.code;

  const regen = () => {
    setState((s) => ({ ...s, referral: { ...s.referral, code: genCode() } }));
    setCopied(false);
  };

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="grid md:grid-cols-5 gap-6" data-testid="recruit-panel">
      <div className="md:col-span-2 space-y-4">
        <h3 className="font-head text-2xl text-cyan-neon">{t.inkanimus.recruit.title}</h3>
        <p className="text-gray-400 text-sm">{t.inkanimus.recruit.desc}</p>

        <div className="holo-frame p-5 relative">
          <div className="font-mono text-[10px] uppercase tracking-widest text-magenta-neon mb-3">
            {t.inkanimus.recruit.code_label}
          </div>
          <div
            data-testid="referral-code-display"
            className="font-mono text-2xl md:text-3xl text-white tracking-widest mb-4 min-h-[2.2rem]"
          >
            {code || "— — — — — —"}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              data-testid="referral-generate"
              onClick={regen}
              className="neon-btn text-[10px] px-3 py-2"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> {t.inkanimus.recruit.generate}
            </button>
            <button
              data-testid="referral-copy"
              onClick={copy}
              disabled={!code}
              className={`neon-btn neon-btn--magenta text-[10px] px-3 py-2 ${
                !code ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? t.inkanimus.recruit.copied : t.inkanimus.recruit.copy}
            </button>
            <button
              data-testid="referral-share"
              onClick={() => {
                if (navigator.share && code) {
                  navigator.share({ title: "GemButcher", text: `Join the tribe. Code: ${code}` }).catch(() => {});
                } else {
                  copy();
                }
              }}
              disabled={!code}
              className={`neon-btn text-[10px] px-3 py-2 ${!code ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <Share2 className="w-3.5 h-3.5" /> {t.inkanimus.recruit.share}
            </button>
          </div>
        </div>
      </div>

      <div className="md:col-span-3 space-y-4">
        <div className="holo-frame holo-frame-magenta p-6 relative scanlines">
          <div className="font-mono text-[10px] uppercase tracking-widest text-magenta-neon mb-2">
            {t.inkanimus.recruit.balance}
          </div>
          <div className="flex items-baseline gap-3">
            <span
              data-testid="ink-points-balance"
              className="font-heavy text-6xl md:text-7xl text-white glow-magenta"
            >
              {state.referral.inkPoints}
            </span>
            <span className="font-mono text-sm text-gray-400">INK</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="border-l border-cyan-500/40 pl-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                {t.inkanimus.recruit.earned}
              </div>
              <div className="font-head text-xl text-cyan-neon">300</div>
            </div>
            <div className="border-l border-magenta-500/40 pl-3" style={{ borderColor: "var(--gb-magenta)" }}>
              <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                {t.inkanimus.recruit.pending}
              </div>
              <div className="font-head text-xl text-magenta-neon">{state.referral.pending}</div>
            </div>
            <div className="border-l border-cyan-500/40 pl-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                {t.inkanimus.recruit.referrals}
              </div>
              <div className="font-head text-xl text-cyan-neon">{state.referral.referrals}</div>
            </div>
          </div>
        </div>

        <div className="holo-frame p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-neon mb-3">
            // recent transmissions
          </div>
          <ul className="space-y-2 font-mono text-xs text-gray-300">
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span>+60 INK · Initiate MARA joined</span><span className="text-gray-500">2d</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span>+80 INK · Session booked — LORIS</span><span className="text-gray-500">5d</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span>+100 INK · Aftercare 7-streak</span><span className="text-gray-500">12d</span>
            </li>
            <li className="flex justify-between">
              <span className="text-magenta-neon">-100 INK · Redeemed: Custom stencil</span><span className="text-gray-500">18d</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ---- Arcade Panel ----
const ArcadePanel = () => {
  const { t } = useLang();
  const board = useMemo(
    () => [
      { name: "KURO.SAN", pts: 4820, badge: "★★★" },
      { name: "IVANA.13", pts: 4310, badge: "★★" },
      { name: "NEO.SAPIEN", pts: 3990, badge: "★★" },
      { name: "MARA.INK", pts: 3600, badge: "★" },
      { name: "YOU", pts: 2410, badge: "◈" },
      { name: "LORIS.T", pts: 2100, badge: "◈" },
      { name: "ZERO.OZ", pts: 1650, badge: "◈" },
    ],
    []
  );

  return (
    <div className="grid md:grid-cols-5 gap-6" data-testid="arcade-panel">
      <div className="md:col-span-2 space-y-4">
        <h3 className="font-head text-2xl text-cyan-neon">{t.inkanimus.arcade.title}</h3>
        <p className="text-gray-400 text-sm">{t.inkanimus.arcade.desc}</p>

        <div className="holo-frame holo-frame-magenta p-5 relative scanlines">
          <div className="font-mono text-[10px] uppercase tracking-widest text-magenta-neon mb-2">
            {t.inkanimus.arcade.active_challenge}
          </div>
          <div className="font-head text-xl text-white mb-2">{t.inkanimus.arcade.challenge_name}</div>
          <p className="text-sm text-gray-400 mb-4">{t.inkanimus.arcade.challenge_desc}</p>
          <button data-testid="arcade-join" className="neon-btn neon-btn--magenta text-xs w-full">
            <Trophy className="w-4 h-4" /> {t.inkanimus.arcade.join}
          </button>
        </div>
      </div>

      <div className="md:col-span-3 holo-frame p-5" data-testid="arcade-leaderboard">
        <div className="grid grid-cols-12 font-mono text-[10px] uppercase tracking-widest text-gray-500 pb-3 border-b border-cyan-500/20">
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
                className={`grid grid-cols-12 items-center py-3 border-b border-white/5 font-mono text-sm ${
                  isYou ? "bg-magenta-500/5" : ""
                }`}
                style={isYou ? { backgroundColor: "rgba(255,0,127,0.06)" } : {}}
              >
                <div className={`col-span-2 font-head text-lg ${podium ? "text-magenta-neon" : "text-gray-500"}`}>
                  #{String(rank).padStart(2, "0")}
                </div>
                <div className="col-span-7 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 ${
                      isYou ? "" : podium ? "" : ""
                    }`}
                    style={{
                      backgroundColor: isYou ? "var(--gb-magenta)" : podium ? "var(--gb-cyan)" : "#333",
                    }}
                  />
                  <span className={`${isYou ? "text-magenta-neon" : "text-white"}`}>{row.name}</span>
                  <span className="text-gray-500 text-xs ml-2">{row.badge}</span>
                </div>
                <div className={`col-span-3 text-right font-head text-lg ${isYou ? "text-magenta-neon" : "text-cyan-neon"}`}>
                  {row.pts.toLocaleString()}
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
  const [tab, setTab] = useState("aftercare");
  const [hubState, setHubState] = useState(readState);
  useEffect(() => writeState(hubState), [hubState]);

  const tabs = [
    { id: "aftercare", label: t.inkanimus.tabs.aftercare },
    { id: "recruit", label: t.inkanimus.tabs.recruit },
    { id: "arcade", label: t.inkanimus.tabs.arcade },
  ];

  return (
    <section id="inkanimus" data-testid="inkanimus-section" className="relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <div className="font-mono text-xs text-cyan-neon uppercase tracking-widest mb-3">
            // 04 — loyalty hub
          </div>
          <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
            <span className="text-white/95">Inkanimus </span>
            <span className="text-cyan-neon glow-cyan">Loyalty Hub</span>
          </h2>
          <p className="mt-4 text-gray-400">{t.inkanimus.subtitle}</p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8" data-testid="inkanimus-tabs">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              data-testid={`inkanimus-tab-${tb.id}`}
              onClick={() => setTab(tb.id)}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2.5 border transition-colors duration-150 ${
                tab === tb.id
                  ? "text-black border-cyan-500"
                  : "text-gray-400 border-cyan-500/20 hover:border-cyan-500/60 hover:text-cyan-neon"
              }`}
              style={{
                backgroundColor: tab === tb.id ? "var(--gb-cyan)" : "transparent",
                clipPath:
                  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="min-h-[500px]">
          {tab === "aftercare" && <AftercarePanel state={hubState} setState={setHubState} />}
          {tab === "recruit" && <RecruitPanel state={hubState} setState={setHubState} />}
          {tab === "arcade" && <ArcadePanel />}
        </div>
      </div>
    </section>
  );
};
