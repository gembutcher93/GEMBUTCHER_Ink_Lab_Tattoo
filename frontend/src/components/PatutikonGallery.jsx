import React, { useRef } from "react";
import { useLang } from "@/context/LangContext";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const IMAGES = [
  "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/i2j7zr51_img3%20Rick_Patutikon.webp",
  "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/45gjta57_img1%20Patutiki%20front.webp",
  "https://customer-assets.emergentagent.com/job_42dd445a-6c2b-4455-84f6-cdc8d007d62e/artifacts/273zn4so_Copertina_Cyber.png",
  "https://images.unsplash.com/photo-1704345911815-5d9aa04aeb80?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519822356-4853be4346a8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601848714157-d845bb5c11ff?q=80&w=1200&auto=format&fit=crop",
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
    <section id="gallery" data-testid="gallery-section" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-10 md:mb-14">
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <div>
            <div className="font-mono text-xs text-magenta-neon uppercase tracking-widest mb-3">
              // 02 — the patutikon
            </div>
            <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-6xl leading-tight max-w-2xl">
              {t.gallery.title.split(" ").map((w, i) => (
                <span key={i} className={i === 1 ? "text-magenta-neon glow-magenta" : "text-white/95"}>
                  {w}{" "}
                </span>
              ))}
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl">{t.gallery.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              data-testid="gallery-prev"
              onClick={() => scrollBy(-1)}
              className="w-11 h-11 border border-cyan-500/40 text-cyan-neon hover:bg-cyan-500 hover:text-black transition-colors duration-200 flex items-center justify-center"
              aria-label="prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              data-testid="gallery-next"
              onClick={() => scrollBy(1)}
              className="w-11 h-11 border border-magenta-500/40 text-magenta-neon hover:bg-magenta-500 hover:text-black transition-colors duration-200 flex items-center justify-center"
              style={{ borderColor: "rgba(255,0,127,0.4)" }}
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
        className="flex gap-6 overflow-x-auto pl-5 md:pl-10 pr-5 pb-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {t.gallery.items.map((item, idx) => (
          <article
            key={idx}
            data-testid={`gallery-card-${idx}`}
            className="group relative snap-start flex-shrink-0 w-[80vw] sm:w-[54vw] md:w-[40vw] lg:w-[28vw] xl:w-[24vw]"
          >
            <div className="holo-frame corner-brackets aspect-[3/4] overflow-hidden relative">
              <img
                src={IMAGES[idx % IMAGES.length]}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "contrast(1.05) saturate(0.95)" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,5,18,0.95) 0%, rgba(5,5,18,0.35) 55%, transparent 100%)",
                }}
              />

              {/* Tag chip */}
              <div className="absolute top-4 left-4">
                <span className="font-mono text-[10px] uppercase tracking-widest bg-black/70 border border-cyan-500/40 text-cyan-neon px-2 py-1">
                  {item.tag}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-head text-xl md:text-2xl text-white mb-1">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-snug line-clamp-3 opacity-90">
                  {item.desc}
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                <div className="text-center space-y-3">
                  <div className="font-mono text-[10px] text-magenta-neon uppercase tracking-widest">
                    Patutikon philosophy
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{item.desc}</p>
                  <div className="inline-flex items-center gap-2 text-cyan-neon font-mono text-xs uppercase tracking-widest pt-2">
                    Decrypt ritual <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-6" />
      </div>

      <div className="mt-6 px-5 md:px-10 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
        {t.gallery.scroll_hint} →
      </div>
    </section>
  );
};
