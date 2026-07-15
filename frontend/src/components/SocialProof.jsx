import React, { useEffect, useRef, useState } from "react";
import { Star, Flame, Palette, GraduationCap } from "lucide-react";
import { useLang } from "@/context/LangContext";

/**
 * Animated counter that starts when the element enters the viewport.
 * `to` can be a number; formatting is customisable via `format`.
 */
function CountUp({ to, format, duration = 1600, decimals = 0 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startAnim = () => {
      if (started.current) return;
      started.current = true;
      if (reduce) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        // easeOutExpo
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setValue(to * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            startAnim();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  const display =
    typeof format === "function"
      ? format(value)
      : decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString("it-IT");

  return <span ref={ref}>{display}</span>;
}

const ICONS = {
  sessions: Flame,
  years: Palette,
  studies: GraduationCap,
  rating: Star,
};

export function SocialProof() {
  const { t } = useLang();
  const s = t.socialProof;

  const metrics = [
    {
      key: "sessions",
      value: 380,
      suffix: "+",
      label: s.sessions,
      accent: "cyan",
    },
    {
      key: "years",
      value: 5,
      suffix: "+",
      label: s.years,
      accent: "magenta",
    },
    {
      key: "studies",
      value: 15,
      suffix: "+",
      label: s.studies,
      accent: "cyan",
    },
    {
      key: "rating",
      value: 4.9,
      decimals: 1,
      suffix: "",
      label: s.rating,
      accent: "magenta",
      href: "https://www.google.com/search?q=Podere+173+Tattoo+Studio+Ozieri",
      isRating: true,
    },
  ];

  return (
    <div data-testid="social-proof" className="social-proof">
      {metrics.map((m, i) => {
        const Icon = ICONS[m.key];
        const Comp = m.href ? "a" : "div";
        const props = m.href
          ? { href: m.href, target: "_blank", rel: "noopener noreferrer" }
          : {};
        return (
          <Comp
            key={m.key}
            data-testid={`sp-metric-${m.key}`}
            className={`sp-card sp-card--${m.accent}`}
            {...props}
          >
            <span className={`sp-card__corner sp-card__corner--tl sp-card__corner--${m.accent}`} aria-hidden />
            <span className={`sp-card__corner sp-card__corner--br sp-card__corner--${m.accent === "cyan" ? "magenta" : "cyan"}`} aria-hidden />

            <div className="sp-card__head">
              <span className={`sp-card__icon sp-card__icon--${m.accent}`}>
                <Icon size={14} strokeWidth={1.7} />
              </span>
              <span className="sp-card__kicker">
                {String(i + 1).padStart(2, "0")} / 04
              </span>
            </div>

            <div className={`sp-card__value sp-card__value--${m.accent}`}>
              {m.isRating && (
                <Star size={22} className="sp-card__value-star" strokeWidth={1.6} fill="currentColor" />
              )}
              <CountUp to={m.value} decimals={m.decimals || 0} />
              <span className="sp-card__suffix">{m.suffix}</span>
              {m.isRating && (
                <span className="sp-card__value-outof">/ 5</span>
              )}
            </div>

            <div className="sp-card__label">{m.label}</div>

            {m.isRating && (
              <div className="sp-card__foot">
                <span className="dot dot-orange" />
                <span>{s.rating_source}</span>
              </div>
            )}
          </Comp>
        );
      })}
    </div>
  );
}

export default SocialProof;
