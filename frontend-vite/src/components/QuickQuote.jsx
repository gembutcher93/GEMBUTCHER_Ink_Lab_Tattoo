import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Ruler,
  Scan,
  Zap,
  AlertTriangle,
  Send,
  Check,
} from "lucide-react";
import { useLang } from "@/context/LangContext";
import { PRICING, computeQuote } from "@/config/pricing";

const STORAGE_KEY = "gb_pending_quote";

/** Public API — trigger from anywhere via window event. */
export const openQuickQuote = () =>
  window.dispatchEvent(new CustomEvent("gb:quote-open"));

export function QuickQuote() {
  const { t, lang } = useLang();
  const s = t.quickQuote;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 style, 1 size, 2 placement, 3 result
  const [sel, setSel] = useState({ styleId: null, sizeId: null, placementId: null });

  // Listen for external trigger
  useEffect(() => {
    const onOpen = () => {
      setStep(0);
      setSel({ styleId: null, sizeId: null, placementId: null });
      setOpen(true);
    };
    window.addEventListener("gb:quote-open", onOpen);
    return () => window.removeEventListener("gb:quote-open", onOpen);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const canNext =
    (step === 0 && sel.styleId) ||
    (step === 1 && sel.sizeId) ||
    (step === 2 && sel.placementId) ||
    step === 3;

  const next = useCallback(() => {
    if (!canNext) return;
    setStep((s) => Math.min(3, s + 1));
  }, [canNext]);

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const applyAndBook = () => {
    const quote = computeQuote(sel);
    if (!quote) return;
    const payload = {
      style_id: sel.styleId,
      size_id: sel.sizeId,
      placement_id: sel.placementId,
      style_label: s.styles[sel.styleId].label,
      size_label: `${s.sizes[sel.sizeId].label} (${s.sizes[sel.sizeId].desc})`,
      placement_label: s.placements[sel.placementId].label,
      range: `${quote.min}${quote.currency} – ${quote.max}${quote.currency}`,
      lang,
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {}
    setOpen(false);
    // scroll to booking + notify BookingPortal
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.dispatchEvent(new CustomEvent("gb:quote-applied"));
    }, 200);
  };

  if (!open) return null;

  const totalSteps = 3;
  const stepLabels = [s.step_style, s.step_size, s.step_placement, s.step_result];
  const quote = step === 3 ? computeQuote(sel) : null;

  return (
    <div
      data-testid="quick-quote-modal"
      className="qq-modal"
      role="dialog"
      aria-modal="true"
      aria-label={s.aria_label}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="qq-modal__shell">
        {/* Ambient glows */}
        <div className="qq-modal__glow qq-modal__glow--cyan" aria-hidden />
        <div className="qq-modal__glow qq-modal__glow--magenta" aria-hidden />

        {/* Header */}
        <header className="qq-modal__head">
          <div className="qq-modal__crumb">
            <span className="dot dot-cyan" />
            <span className="qq-modal__crumb-title">
              <Sparkles size={13} strokeWidth={1.7} />
              {s.title}
            </span>
            <span className="qq-modal__crumb-time">{s.time_badge}</span>
          </div>

          <button
            data-testid="quick-quote-close"
            onClick={() => setOpen(false)}
            className="qq-modal__close"
            aria-label={s.aria_close}
          >
            <X size={16} strokeWidth={1.7} />
          </button>
        </header>

        {/* Progress dots */}
        <div className="qq-modal__progress" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`qq-progress-dot ${i <= step ? "qq-progress-dot--done" : ""} ${
                i === step ? "qq-progress-dot--active" : ""
              }`}
            >
              <span className="qq-progress-dot__i">
                {i < step ? <Check size={10} strokeWidth={2.4} /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="qq-progress-dot__label">{stepLabels[i]}</span>
              {i < 2 && <span className="qq-progress-dot__line" />}
            </span>
          ))}
        </div>

        {/* Body */}
        <div className="qq-modal__body">
          {step === 0 && (
            <div className="qq-step" data-testid="qq-step-style">
              <StepHeader
                icon={<Zap size={14} strokeWidth={1.7} />}
                num="01"
                total={totalSteps}
                title={s.q_style}
                sub={s.q_style_sub}
              />
              <div className="qq-grid qq-grid--2">
                {PRICING.styles.map((st) => {
                  const meta = s.styles[st.id];
                  const active = sel.styleId === st.id;
                  return (
                    <button
                      key={st.id}
                      data-testid={`qq-style-${st.id}`}
                      onClick={() => setSel((v) => ({ ...v, styleId: st.id }))}
                      className={`qq-opt ${active ? "qq-opt--active" : ""}`}
                    >
                      <span className="qq-opt__label">{meta.label}</span>
                      <span className="qq-opt__desc">{meta.desc}</span>
                      {st.boost > 0 && (
                        <span className="qq-opt__tag">
                          +{Math.round(st.boost * 100)}% {s.complexity_tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="qq-step" data-testid="qq-step-size">
              <StepHeader
                icon={<Ruler size={14} strokeWidth={1.7} />}
                num="02"
                total={totalSteps}
                title={s.q_size}
                sub={s.q_size_sub}
              />
              <div className="qq-grid qq-grid--2">
                {PRICING.sizes.map((sz) => {
                  const meta = s.sizes[sz.id];
                  const active = sel.sizeId === sz.id;
                  return (
                    <button
                      key={sz.id}
                      data-testid={`qq-size-${sz.id}`}
                      onClick={() => setSel((v) => ({ ...v, sizeId: sz.id }))}
                      className={`qq-opt ${active ? "qq-opt--active" : ""}`}
                    >
                      <span className="qq-opt__label">{meta.label}</span>
                      <span className="qq-opt__desc">{meta.desc}</span>
                      <span className="qq-opt__range">
                        {sz.min}€ – {sz.max}€
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="qq-step" data-testid="qq-step-placement">
              <StepHeader
                icon={<Scan size={14} strokeWidth={1.7} />}
                num="03"
                total={totalSteps}
                title={s.q_placement}
                sub={s.q_placement_sub}
              />
              <div className="qq-grid qq-grid--3">
                {PRICING.placements.map((pl) => {
                  const meta = s.placements[pl.id];
                  const active = sel.placementId === pl.id;
                  const isHard = pl.multiplier > 1;
                  return (
                    <button
                      key={pl.id}
                      data-testid={`qq-placement-${pl.id}`}
                      onClick={() => setSel((v) => ({ ...v, placementId: pl.id }))}
                      className={`qq-opt qq-opt--compact ${active ? "qq-opt--active" : ""}`}
                    >
                      <span className="qq-opt__label">{meta.label}</span>
                      {isHard && (
                        <span className="qq-opt__tag qq-opt__tag--warn">
                          +{Math.round((pl.multiplier - 1) * 100)}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && quote && (
            <div className="qq-step qq-result" data-testid="qq-step-result">
              <StepHeader
                icon={<Sparkles size={14} strokeWidth={1.7} />}
                num="✓"
                total={totalSteps}
                title={s.result_title}
                sub={s.result_sub}
              />

              <div className="qq-result__card">
                <div className="qq-result__label">{s.result_range_label}</div>
                <div className="qq-result__value" data-testid="qq-result-value">
                  <span className="qq-result__num">{quote.min}</span>
                  <span className="qq-result__sep">–</span>
                  <span className="qq-result__num qq-result__num--alt">{quote.max}</span>
                  <span className="qq-result__cur">{quote.currency}</span>
                </div>
                <div className="qq-result__chips">
                  <span className="qq-chip">
                    <Zap size={11} strokeWidth={1.8} />
                    {s.styles[sel.styleId].label}
                  </span>
                  <span className="qq-chip">
                    <Ruler size={11} strokeWidth={1.8} />
                    {s.sizes[sel.sizeId].label} · {s.sizes[sel.sizeId].desc}
                  </span>
                  <span className="qq-chip">
                    <Scan size={11} strokeWidth={1.8} />
                    {s.placements[sel.placementId].label}
                  </span>
                </div>
              </div>

              {/* PROMINENT disclaimer */}
              <div className="qq-disclaimer" data-testid="qq-disclaimer">
                <div className="qq-disclaimer__head">
                  <AlertTriangle size={17} strokeWidth={1.9} />
                  <span>{s.disclaimer_title}</span>
                </div>
                <p className="qq-disclaimer__body">{s.disclaimer_body}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Nav */}
        <footer className="qq-modal__foot">
          {step > 0 ? (
            <button onClick={prev} className="qq-btn qq-btn--ghost" data-testid="qq-back">
              <ChevronLeft size={15} strokeWidth={1.8} />
              {s.back}
            </button>
          ) : (
            <span className="qq-foot-hint">{s.foot_hint}</span>
          )}

          {step < 3 && (
            <button
              onClick={next}
              disabled={!canNext}
              className="qq-btn qq-btn--primary"
              data-testid="qq-next"
            >
              {s.next}
              <ChevronRight size={15} strokeWidth={1.8} />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={applyAndBook}
              className="qq-btn qq-btn--magenta"
              data-testid="qq-continue-booking"
            >
              <Send size={14} strokeWidth={1.8} />
              {s.continue_booking}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

function StepHeader({ icon, num, total, title, sub }) {
  return (
    <div className="qq-step__head">
      <div className="qq-step__num">
        <span className="qq-step__icon">{icon}</span>
        <span>
          {num}
          {typeof num === "number" || (typeof num === "string" && num !== "✓") ? ` / ${String(total).padStart(2, "0")}` : ""}
        </span>
      </div>
      <h3 className="qq-step__title">{title}</h3>
      {sub && <p className="qq-step__sub">{sub}</p>}
    </div>
  );
}

export default QuickQuote;
