import React, { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";
import { INKANIMUS_VERSIONS } from "@/lib/i18n";
import {
  ArrowUpRight,
  ExternalLink,
  Zap,
  Users,
  Trophy,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  X,
} from "lucide-react";

const BULLET_ICONS = [ShieldCheck, Users, Zap, Trophy];
const UNLOCK_KEY = "gb.inkanimus.unlocked.v1";
const VERSION_KEY = "gb.inkanimus.version.v1";
const ADEPT_PASSWORD = (process.env.REACT_APP_INKANIMUS_PASSWORD || "PODERE173").trim();

export const InkanimusLaunch = () => {
  const { t, lang } = useLang();
  const l = t.inkanimus.launch;
  const g = t.inkanimus.gate;

  const [unlocked, setUnlocked] = useState(false);
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState(false);
  const [versionId, setVersionId] = useState(INKANIMUS_VERSIONS[0].id);
  const [modalOpen, setModalOpen] = useState(false);

  const version =
    INKANIMUS_VERSIONS.find((v) => v.id === versionId) || INKANIMUS_VERSIONS[0];

  // Close modal on ESC
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
      const saved = localStorage.getItem(VERSION_KEY);
      if (saved && INKANIMUS_VERSIONS.some((v) => v.id === saved)) setVersionId(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(VERSION_KEY, versionId);
    } catch {}
  }, [versionId]);

  const tryUnlock = (e) => {
    e.preventDefault();
    const val = attempt.trim();
    if (!val) return;
    if (val === ADEPT_PASSWORD) {
      setUnlocked(true);
      setError(false);
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
      } catch {}
    } else {
      setError(true);
      setTimeout(() => setError(false), 2200);
    }
  };

  const relock = () => {
    setUnlocked(false);
    setAttempt("");
    try {
      localStorage.removeItem(UNLOCK_KEY);
    } catch {}
  };

  return (
    <section
      id="inkanimus-launch"
      data-testid="inkanimus-launch-section"
      className="relative py-24 md:py-32"
    >
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] opacity-[0.12] pointer-events-none"
        style={{ backgroundColor: "var(--gb-cyan)" }}
      />
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

              {/* Access gate */}
              <div className="space-y-4" data-testid="launch-access-block">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
                  {unlocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-cyan-neon" />
                      <span data-testid="launch-status-unlocked" className="text-cyan-neon">
                        {g.unlocked_status}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-magenta-neon" />
                      <span data-testid="launch-status-locked" className="text-magenta-neon">
                        {g.locked_status}
                      </span>
                    </>
                  )}
                  <span className="hidden sm:inline-flex items-center gap-2 ml-auto text-white/40">
                    <span className="dot dot-orange" />
                    {l.status_live}
                  </span>
                </div>

                {unlocked ? (
                  <div className="space-y-4" data-testid="launch-unlocked-cta">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        data-testid="launch-cta-open"
                        onClick={() => setModalOpen(true)}
                        className="neon-btn neon-btn--solid"
                      >
                        <Unlock className="w-4 h-4" />
                        {g.reveal_downloads}
                      </button>
                      <button
                        data-testid="launch-cta-secondary"
                        onClick={() =>
                          document
                            .getElementById("inkanimus")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="neon-btn"
                      >
                        {l.cta_secondary}
                      </button>
                      <button
                        data-testid="launch-relock"
                        onClick={relock}
                        className="ml-auto text-white/40 hover:text-white/70 text-[11px] font-mono uppercase tracking-[0.25em] transition-colors duration-200"
                      >
                        {g.relock}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-white/55 text-sm max-w-xl leading-relaxed">
                      {g.explanation}
                    </p>
                    <form
                      onSubmit={tryUnlock}
                      className="flex flex-wrap items-stretch gap-2 max-w-xl"
                      data-testid="launch-gate-form"
                    >
                      <div className="relative flex-1 min-w-[220px]">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          data-testid="launch-gate-input"
                          type="text"
                          value={attempt}
                          onChange={(e) => setAttempt(e.target.value)}
                          placeholder={g.placeholder}
                          className="cyber-input pl-10 pr-4 uppercase tracking-[0.18em] font-mono"
                          style={
                            error
                              ? {
                                  borderColor: "var(--gb-orange-line)",
                                  boxShadow: "0 0 0 4px rgba(249,115,22,0.08)",
                                }
                              : {}
                          }
                          autoComplete="off"
                          spellCheck={false}
                        />
                      </div>
                      <button
                        data-testid="launch-gate-submit"
                        type="submit"
                        className="neon-btn neon-btn--solid-orange"
                      >
                        <Unlock className="w-4 h-4" />
                        {g.unlock}
                      </button>
                    </form>
                    <div className="min-h-[18px]">
                      {error && (
                        <p
                          data-testid="launch-gate-error"
                          className="text-magenta-neon font-mono text-[11px] uppercase tracking-[0.25em]"
                        >
                          {g.wrong}
                        </p>
                      )}
                    </div>
                    <button
                      data-testid="launch-book-hint"
                      onClick={() =>
                        document
                          .getElementById("booking")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-cyan-neon hover:underline text-[11px] font-mono uppercase tracking-[0.25em] transition-colors duration-200"
                    >
                      {g.hint_cta} →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right column — visual mock */}
            <div className="lg:col-span-5 relative p-8 md:p-12 lg:p-14 flex items-center justify-center min-h-[420px]">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 60% 40%, ${version.colorSoft}, transparent 60%), radial-gradient(circle at 30% 80%, rgba(249,115,22,0.06), transparent 60%)`,
                }}
              />

              <div
                data-testid="launch-app-mock"
                className={`relative w-[240px] md:w-[260px] aspect-[9/19] rounded-[36px] border bg-gradient-to-b from-white/[0.03] to-black/60 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden transition-[filter,border-color] duration-500 ${
                  unlocked ? "" : "grayscale-[0.4]"
                }`}
                style={{ borderColor: unlocked ? version.color + "55" : "rgba(255,255,255,0.10)" }}
              >
                {/* notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black/80 z-20" />
                <div className="absolute top-2.5 left-6 right-6 flex items-center justify-between text-[9px] font-mono text-white/60 z-10 pt-1">
                  <span>21:73</span>
                  <span>◉ ▲ ▲</span>
                </div>

                <div
                  className="absolute inset-3 top-10 bottom-3 rounded-[26px] overflow-hidden border border-white/5"
                  style={{ background: "linear-gradient(180deg, #0a0a10 0%, #050506 100%)" }}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="font-head text-[11px] tracking-[0.22em]"
                        style={{ color: version.color }}
                      >
                        INKANIMUS
                      </div>
                      <div className="font-mono text-[8px] uppercase tracking-widest text-white/40">
                        {version.label.toLowerCase()}·v1
                      </div>
                    </div>

                    <div
                      className="rounded-xl border p-3"
                      style={{
                        borderColor: version.color + "33",
                        background: version.colorSoft,
                      }}
                    >
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/50">
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
                            background: `linear-gradient(90deg, ${version.color}, var(--gb-orange))`,
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
                              background: i < 2 ? version.color : "transparent",
                            }}
                          >
                            {i < 2 && <span className="text-black text-[7px] font-bold">✓</span>}
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
                      <div
                        className="font-mono text-sm mt-1 tracking-widest"
                        style={{ color: unlocked ? version.color : "var(--gb-orange)" }}
                      >
                        {unlocked ? "GB-K7RX92" : "•••-•••••"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locked overlay */}
                {!unlocked && (
                  <div
                    data-testid="launch-mock-lock-overlay"
                    className="absolute inset-3 top-10 bottom-3 rounded-[26px] flex flex-col items-center justify-center gap-3 backdrop-blur-md z-20"
                    style={{ background: "rgba(5,5,6,0.55)" }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle, rgba(249,115,22,0.2), transparent 70%)",
                        border: "1px solid var(--gb-orange-line)",
                      }}
                    >
                      <Lock className="w-6 h-6 text-magenta-neon" />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/75 text-center px-4">
                      {g.locked_status}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 text-center px-4">
                      {g.placeholder}
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute bottom-6 left-6 md:left-10 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                <span style={{ color: version.color }}>v1 · {version.label.toUpperCase()}</span>
              </div>

              {unlocked ? (
                <button
                  onClick={() => setModalOpen(true)}
                  data-testid="launch-domain-link"
                  className="absolute bottom-6 right-6 md:right-10 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45 hover:text-white/90 transition-colors duration-200"
                >
                  {g.reveal_downloads}
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              ) : (
                <div className="absolute bottom-6 right-6 md:right-10 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
                  <Lock className="w-3 h-3" />
                  {lang === "it" ? "url riservato" : "restricted url"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Download Terminal Modal */}
      {modalOpen && unlocked && (
        <DownloadModal
          onClose={() => setModalOpen(false)}
          onPick={(id) => setVersionId(id)}
          selected={versionId}
          strings={g}
          gateStrings={g}
        />
      )}
    </section>
  );
};

/* -------- Cyberpunk 2077 style download terminal modal -------- */
const DownloadModal = ({ onClose, onPick, selected, strings, gateStrings }) => {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!authed && inputRef.current) inputRef.current.focus();
  }, [authed]);

  const tryAuth = (e) => {
    e.preventDefault();
    if (pw.trim() === ADEPT_PASSWORD) {
      setAuthed(true);
      setErr(false);
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 2200);
    }
  };

  return (
    <div
      data-testid="download-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-default"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[900px] rounded-[6px] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,14,0.98) 0%, rgba(5,5,6,0.98) 100%)",
          border: "1px solid rgba(34,211,238,0.35)",
          boxShadow:
            "0 0 0 1px rgba(34,211,238,0.15), 0 40px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Corner brackets */}
        {[
          "top-2 left-2 border-t border-l",
          "top-2 right-2 border-t border-r",
          "bottom-2 left-2 border-b border-l",
          "bottom-2 right-2 border-b border-r",
        ].map((pos, i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute w-4 h-4 pointer-events-none ${pos}`}
            style={{ borderColor: "var(--gb-cyan)" }}
          />
        ))}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 md:px-8 py-4">
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--gb-cyan)", boxShadow: "0 0 10px var(--gb-cyan)" }}
            />
            <div>
              <div className="font-head text-sm md:text-base text-white tracking-[0.22em] uppercase">
                {strings.modal_title}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45 mt-0.5">
                inkanimus / distribution.node
              </div>
            </div>
          </div>
          <button
            data-testid="download-modal-close"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-cyan-neon hover:border-cyan-500/40 transition-colors duration-200"
            aria-label="close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-6 md:px-8 pt-5">
          <p className="text-white/60 text-sm md:text-[15px] max-w-2xl leading-relaxed">
            {authed ? strings.modal_subtitle : gateStrings.explanation}
          </p>
        </div>

        {/* Body */}
        {!authed ? (
          <div className="px-6 md:px-8 py-8" data-testid="modal-gate">
            <form onSubmit={tryAuth} className="max-w-md mx-auto space-y-4">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-magenta-neon justify-center">
                <Lock className="w-3.5 h-3.5" />
                {gateStrings.locked_status}
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  ref={inputRef}
                  data-testid="modal-gate-input"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder={gateStrings.placeholder}
                  className="cyber-input pl-11 pr-4 font-mono tracking-[0.18em] text-center"
                  style={
                    err
                      ? {
                          borderColor: "var(--gb-orange-line)",
                          boxShadow: "0 0 0 4px rgba(249,115,22,0.08)",
                        }
                      : {}
                  }
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <button
                data-testid="modal-gate-submit"
                type="submit"
                className="neon-btn neon-btn--solid-orange w-full"
              >
                <Unlock className="w-4 h-4" />
                {gateStrings.unlock}
              </button>

              <div className="min-h-[18px] text-center">
                {err && (
                  <p
                    data-testid="modal-gate-error"
                    className="text-magenta-neon font-mono text-[11px] uppercase tracking-[0.25em]"
                  >
                    {gateStrings.wrong}
                  </p>
                )}
              </div>

              <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.22em] text-center pt-2">
                {gateStrings.hint_cta}
              </p>
            </form>
          </div>
        ) : (
          <div className="px-6 md:px-8 py-6 grid sm:grid-cols-3 gap-4" data-testid="modal-versions">
          {INKANIMUS_VERSIONS.map((v, i) => {
            const active = v.id === selected;
            return (
              <div
                key={v.id}
                data-testid={`download-version-${v.id}`}
                className="relative rounded-[4px] border overflow-hidden transition-colors duration-200 group"
                style={{
                  borderColor: active ? v.color : "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  boxShadow: active ? `inset 0 0 0 1px ${v.color}55, 0 20px 40px -20px ${v.color}` : "none",
                }}
              >
                {/* Number strip */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                    ver.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: v.color, boxShadow: `0 0 10px ${v.color}` }}
                  />
                </div>

                {/* Color slab */}
                <div
                  className="h-24 relative overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${v.colorSoft}, transparent 70%), linear-gradient(180deg, ${v.color}22 0%, transparent 100%)`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `linear-gradient(${v.color}33 1px, transparent 1px), linear-gradient(90deg, ${v.color}33 1px, transparent 1px)`,
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div
                    className="absolute bottom-2 left-3 font-head text-3xl tracking-[-0.02em]"
                    style={{ color: v.color, textShadow: `0 0 24px ${v.color}` }}
                  >
                    {v.label}
                  </div>
                </div>

                {/* Body */}
                <div className="px-4 py-4 space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {v.subtitle}
                  </div>
                  <a
                    data-testid={`download-open-${v.id}`}
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onPick(v.id)}
                    className="flex items-center justify-between gap-2 rounded-full border px-4 py-2.5 transition-colors duration-200 group/btn"
                    style={{
                      background: v.color,
                      color: "#050506",
                      borderColor: "transparent",
                      boxShadow: `0 10px 22px -10px ${v.color}`,
                    }}
                  >
                    <span className="font-head text-[11px] uppercase tracking-[0.18em]">
                      {strings.modal_open_cta}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Footer note */}
        <div className="border-t border-white/5 px-6 md:px-8 py-4 flex items-center justify-between gap-4">
          <p className="text-white/45 text-xs leading-relaxed max-w-md">
            {authed ? strings.modal_note : ""}
          </p>
          <button
            data-testid="download-modal-close-2"
            onClick={onClose}
            className="text-white/40 hover:text-white/80 text-[11px] font-mono uppercase tracking-[0.25em] transition-colors duration-200"
          >
            {strings.modal_close}
          </button>
        </div>
      </div>
    </div>
  );
};

