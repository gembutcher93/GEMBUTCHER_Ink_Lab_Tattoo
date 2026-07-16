import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/context/LangContext";

/**
 * Cyberpunk sound design — Web Audio API only, no external assets.
 * - Muted by default; state persisted in localStorage.
 * - Ambient drone (low-passed white noise + sub sine) loops while unmuted.
 * - SFX: subtle click/hover blips triggered by [data-sfx] and .neon-btn.
 */
export function SoundEngine() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef(null);
  const ambientRef = useRef({ nodes: [], gain: null });
  const lastHoverRef = useRef(0);
  const { lang } = useLang() || { lang: "it" };

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gb_sound_on");
      if (saved === "1") setEnabled(true);
    } catch (_) {}
  }, []);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopAmbient();

    // Master gain
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // White noise buffer → biquad low-pass = wind/hum
    const bufSize = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    lp.Q.value = 0.7;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.06;

    noise.connect(lp).connect(noiseGain).connect(master);

    // Sub sine drone
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 55;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.05;
    sub.connect(subGain).connect(master);

    // Slow LFO on lp cutoff for movement
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain).connect(lp.frequency);

    noise.start();
    sub.start();
    lfo.start();

    // Fade in
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);

    ambientRef.current = {
      nodes: [noise, sub, lfo],
      gain: master,
    };
  }, [getCtx]);

  const stopAmbient = useCallback(() => {
    const ctx = ctxRef.current;
    const amb = ambientRef.current;
    if (!ctx || !amb.gain) return;
    try {
      amb.gain.gain.cancelScheduledValues(ctx.currentTime);
      amb.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      const nodes = amb.nodes;
      setTimeout(() => {
        nodes.forEach((n) => {
          try { n.stop(); } catch (_) {}
          try { n.disconnect(); } catch (_) {}
        });
      }, 500);
    } catch (_) {}
    ambientRef.current = { nodes: [], gain: null };
  }, []);

  // Toggle logic
  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try { localStorage.setItem("gb_sound_on", next ? "1" : "0"); } catch (_) {}
      if (next) startAmbient();
      else stopAmbient();
      return next;
    });
  }, [startAmbient, stopAmbient]);

  // SFX: click & hover on interactive
  useEffect(() => {
    if (!enabled) return;

    const playBlip = (freq, dur, gain = 0.08, type = "square") => {
      const ctx = getCtx();
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur + 0.02);
    };

    const INTERACTIVE = "a, button, .neon-btn, [data-sfx]";

    const onClick = (e) => {
      const t = e.target.closest && e.target.closest(INTERACTIVE);
      if (!t) return;
      if (t.closest("#sound-toggle")) return; // don't blip the toggle itself
      playBlip(880, 0.09, 0.06, "triangle");
      setTimeout(() => playBlip(1320, 0.07, 0.04, "sine"), 40);
    };

    const onOver = (e) => {
      const t = e.target.closest && e.target.closest(INTERACTIVE);
      if (!t) return;
      const now = performance.now();
      if (now - lastHoverRef.current < 90) return;
      lastHoverRef.current = now;
      playBlip(1600, 0.045, 0.025, "sine");
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onOver, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onOver, true);
    };
  }, [enabled, getCtx]);

  // If enabled from persisted state, we need a user gesture to start.
  useEffect(() => {
    if (!enabled) return;
    if (ambientRef.current.gain) return; // already playing
    const kick = () => {
      startAmbient();
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick, { once: true });
    window.addEventListener("keydown", kick, { once: true });
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, [enabled, startAmbient]);

  useEffect(() => {
    return () => stopAmbient();
  }, [stopAmbient]);

  const label = lang === "en"
    ? enabled ? "Mute atmosphere" : "Play atmosphere"
    : enabled ? "Muta atmosfera" : "Attiva atmosfera";

  return (
    <button
      id="sound-toggle"
      data-testid="sound-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`sound-toggle ${enabled ? "sound-toggle--on" : ""}`}
    >
      <span className="sound-toggle__icon" aria-hidden>
        {enabled ? <Volume2 size={15} strokeWidth={1.6} /> : <VolumeX size={15} strokeWidth={1.6} />}
      </span>
      <span className="sound-toggle__label">
        {enabled ? "SFX · ON" : "SFX · OFF"}
      </span>
      {enabled && (
        <span className="sound-toggle__eq" aria-hidden>
          <span /><span /><span />
        </span>
      )}
    </button>
  );
}

export default SoundEngine;
