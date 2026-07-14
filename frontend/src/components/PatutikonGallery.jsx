import React, { useRef } from "react";
import { useLang } from "@/context/LangContext";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// Ordered to match i18n gallery.items (5 items — no duplicate portrait)
const IMAGES = [
  // Rick Patutikon
  "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/i2j7zr51_img3%20Rick_Patutikon.webp",
  // Guardian of the Seas — Patutiki leg
  "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/45gjta57_img1%20Patutiki%20front.webp",
  // Cyber Back Rig — mechanical back tattoo
  "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/m8cxc3yb_IMG20230402174952.webp",
  // Shadow Muse — dark portrait
  "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/smc2ygxl_IMG20221022181905.webp",
  // Cyber Tribal Leg — hexagonal + tribal
  "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/fvm8lxn6_IMG_20240423_174328.jpg",
];

export const PatutikonGallery = () => {
  const { t } = useLang();
  const scrollerRef = useRef(null);

  const scrollBy = (dir) => {
    if (!scrollerRef.current) return;
    const w = scrollerRef.current.clientWidth * 0.7;
    scrollerRef.current.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="relative py-28 md:py-36 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ backgroundColor: "var(--gb-magenta)" }}
      />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 mb-12 md:mb-16">
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <div className="max-w-2xl">
            <div className="font-mono text-[11px] text-magenta-neon uppercase tracking-[0.35em] mb-4">
              02 / il patutikon
            </div>
            <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-tight">
              <span className="text-white/95">La </span>
              <span className="text-magenta-neon glow-magenta italic">galleria</span>
              <span className="text-white/95"> Patutikon</span>
            </h2>
            <p className="mt-5 text-gray-400 max-w-xl text-[15px] leading-relaxed">
              {t.gallery.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              data-testid="gallery-prev"
              onClick={() => scrollBy(-1)}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md text-cyan-neon hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-colors duration-200 flex items-center justify-center"
              aria-label="prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              data-testid="gallery-next"
              onClick={() => scrollBy(1)}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md text-magenta-neon hover:bg-magenta-500/10 transition-colors duration-200 flex items-center justify-center"
              style={{ borderColor: "rgba(255,0,127,0.35)" }}
              aria-label="next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        data-testid="gallery-scroller"
        className="flex gap-6 overflow-x-auto pl-5 md:pl-10 pr-5 pb-6 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {t.gallery.items.map((item, idx) => (
          <article
            key={idx}
            data-testid={`gallery-card-${idx}`}
            className="group relative snap-start flex-shrink-0 w-[82vw] sm:w-[54vw] md:w-[40vw] lg:w-[28vw] xl:w-[24vw]"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 bg-white/[0.02] shadow-[0_20px_60px_rgba(0,240,255,0.05)] transition-transform duration-500 group-hover:-translate-y-1">
              <img
                src={IMAGES[idx % IMAGES.length]}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
                style={{ filter: "contrast(1.05) saturate(0.95)" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(5,5,18,0.15) 0%, rgba(5,5,18,0.1) 45%, rgba(5,5,18,0.92) 100%)",
                }}
              />

              {/* Border accent glow on hover */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(0,240,255,0.5), inset 0 0 40px rgba(0,240,255,0.15)",
                }}
              />

              {/* Tag chip */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md border border-white/10 text-cyan-neon px-2.5 py-1 rounded-full">
                  {item.tag}
                </span>
                <span className="font-mono text-[10px] text-white/40 tracking-widest">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-head text-2xl text-white mb-1.5">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-snug line-clamp-3 opacity-90">
                  {item.desc}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-cyan-neon font-mono text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  filosofia patutikon <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="flex-shrink-0 w-6" />
      </div>

      <div className="mt-6 px-5 md:px-10 font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">
        {t.gallery.scroll_hint} →
      </div>
    </section>
  );
};
