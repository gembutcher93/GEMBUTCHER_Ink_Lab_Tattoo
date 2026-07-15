import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLang } from "@/context/LangContext";

function FaqItem({ q, a, index, open, onToggle }) {
  return (
    <div
      data-testid={`faq-item-${index}`}
      className={`faq-item ${open ? "faq-item--open" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        data-testid={`faq-toggle-${index}`}
        className="faq-item__trigger"
      >
        <span className="faq-item__num">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="faq-item__q">{q}</span>
        <span className="faq-item__chev" aria-hidden>
          <ChevronDown size={17} strokeWidth={1.6} />
        </span>
      </button>
      <div className="faq-item__body" role="region">
        <div className="faq-item__body-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const { t } = useLang();
  const s = t.faq;
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative py-24 md:py-28 px-5 md:px-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -right-32 top-10 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,179,0.10), transparent 70%)", filter: "blur(70px)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left rail */}
          <div className="lg:col-span-5" data-reveal>
            <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-cyan-neon mb-4 flex items-center gap-3">
              <HelpCircle size={14} strokeWidth={1.7} />
              // {s.eyebrow}
            </div>
            <h2 className="font-head text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mb-6">
              {s.title_pre}{" "}
              <span className="italic text-magenta-neon">{s.title_hl}</span>
            </h2>
            <p className="text-[15px] text-[color:var(--gb-text-2)] leading-relaxed max-w-md">
              {s.subtitle}
            </p>

            <div className="mt-8 hidden lg:flex items-center gap-3 text-[color:var(--gb-dim)] font-mono text-[0.6rem] uppercase tracking-[0.22em]">
              <span className="dot dot-cyan" />
              <span>{s.footer_note}</span>
            </div>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-7 space-y-3" data-testid="faq-list">
            {s.items.map((it, i) => (
              <FaqItem
                key={i}
                index={i}
                q={it.q}
                a={it.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
