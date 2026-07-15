import React, { useEffect, useRef, useState } from "react";
import { Instagram, ArrowUpRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { SocialProof } from "@/components/SocialProof";

/**
 * Instagram feed — official Meta embed method.
 * Uses <blockquote class="instagram-media"> + embed.js so Meta processes
 * each block into a live post card. No API token needed.
 */
const POSTS = [
  { type: "reel", code: "DaFdFMVo979" },
  { type: "p",    code: "DaDTrh_DSz9" },
  { type: "p",    code: "DaATYn_DTkI" },
  { type: "reel", code: "DZ2frZrjusu" },
  { type: "p",    code: "DZ5Alt0jX95" },
  { type: "p",    code: "DZ7zCF8jADt" },
  { type: "p",    code: "DaIQnv6jWEH" },
  { type: "p",    code: "DZ2byJDCFlZ" },
];

const HANDLE = "gembutchertattoo";
const IG_SCRIPT_ID = "instagram-embed-script";

/** Load Instagram's embed.js once, resolve when instgrm.Embeds is ready. */
function loadInstagramEmbedScript() {
  return new Promise((resolve) => {
    if (window.instgrm && window.instgrm.Embeds) {
      resolve();
      return;
    }
    let existing = document.getElementById(IG_SCRIPT_ID);
    if (!existing) {
      existing = document.createElement("script");
      existing.id = IG_SCRIPT_ID;
      existing.async = true;
      existing.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(existing);
    }
    existing.addEventListener("load", () => resolve(), { once: true });
    // Safety fallback: also poll for instgrm object
    const start = Date.now();
    const poll = setInterval(() => {
      if (window.instgrm && window.instgrm.Embeds) {
        clearInterval(poll);
        resolve();
      } else if (Date.now() - start > 8000) {
        clearInterval(poll);
        resolve();
      }
    }, 200);
  });
}

function InstagramCard({ post, index }) {
  const ref = useRef(null);
  const [processed, setProcessed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    loadInstagramEmbedScript().then(() => {
      if (cancelled) return;
      if (window.instgrm && window.instgrm.Embeds) {
        try {
          window.instgrm.Embeds.process();
        } catch (_) {}
      }
      // Give Instagram a moment to inject the iframe
      setTimeout(() => !cancelled && setProcessed(true), 800);
    });
    return () => {
      cancelled = true;
    };
  }, [inView]);

  const permalink = `https://www.instagram.com/${post.type}/${post.code}/`;

  return (
    <div
      ref={ref}
      data-testid={`ig-card-${index}`}
      className="ig-card"
      data-reveal={index < 3 ? `stagger-${index + 1}` : undefined}
    >
      <span className="ig-card__corner ig-card__corner--tl" aria-hidden />
      <span className="ig-card__corner ig-card__corner--br" aria-hidden />

      <div className="ig-card__strip">
        <span className="dot dot-orange" />
        <span className="ig-card__strip-label">
          IG · {post.type === "reel" ? "REEL" : "POST"} · {String(index + 1).padStart(2, "0")}
        </span>
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-card__open"
          aria-label="Open on Instagram"
          data-testid={`ig-card-open-${index}`}
        >
          <ArrowUpRight size={13} strokeWidth={1.7} />
        </a>
      </div>

      <div className="ig-card__frame ig-card__frame--auto">
        {inView && (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={permalink}
            data-instgrm-version="14"
            style={{
              background: "#fafafa",
              border: 0,
              margin: 0,
              maxWidth: "100%",
              minWidth: 0,
              padding: 0,
              width: "100%",
            }}
          >
            <a href={permalink} target="_blank" rel="noopener noreferrer">
              View this post on Instagram
            </a>
          </blockquote>
        )}
        {!processed && (
          <div className="ig-card__skeleton" aria-hidden>
            <div className="ig-card__skeleton-glow" />
            <span className="ig-card__skeleton-label">// loading feed…</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function InstagramFeed() {
  const { t } = useLang();
  const s = t.instagram;
  const gridRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Track scroll position for mobile pagination indicator
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const cards = el.querySelectorAll(".ig-card");
        if (!cards.length) return;
        const rect = el.getBoundingClientRect();
        const gridCenter = rect.left + rect.width / 2;
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((c, i) => {
          const cr = c.getBoundingClientRect();
          const dist = Math.abs(cr.left + cr.width / 2 - gridCenter);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActiveIdx(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToCard = (i) => {
    const el = gridRef.current;
    if (!el) return;
    const card = el.querySelectorAll(".ig-card")[i];
    if (card) card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section
      id="instagram"
      data-testid="instagram-section"
      className="relative py-24 md:py-28 px-5 md:px-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -left-40 top-20 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,45,149,0.14), transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        aria-hidden
        className="absolute right-0 bottom-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,179,0.10), transparent 70%)", filter: "blur(70px)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-2xl" data-reveal>
            <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-magenta-neon mb-4">
              // {s.eyebrow}
            </div>
            <h2 className="font-head text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mb-5">
              {s.title_pre}{" "}
              <span className="italic text-cyan-neon">{s.title_hl}</span>
            </h2>
            <p className="text-[15px] text-[color:var(--gb-text-2)] leading-relaxed max-w-xl">
              {s.subtitle}
            </p>
          </div>

          <a
            href={`https://www.instagram.com/${HANDLE}/`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="instagram-follow-cta"
            className="neon-btn neon-btn--magenta group self-start md:self-end"
          >
            <Instagram size={15} strokeWidth={1.7} />
            <span>@{HANDLE}</span>
            <ArrowUpRight size={13} strokeWidth={1.8} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        <SocialProof />

        <div ref={gridRef} className="ig-grid" data-testid="instagram-grid">
          {POSTS.map((post, i) => (
            <InstagramCard key={post.code} post={post} index={i} />
          ))}
        </div>

        {/* Mobile-only pagination dots */}
        <div
          className="ig-dots"
          data-testid="instagram-dots"
          role="tablist"
          aria-label="Instagram carousel pagination"
        >
          {POSTS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`ig-dot ${i === activeIdx ? "ig-dot--active" : ""}`}
              aria-label={`Vai al post ${i + 1}`}
              aria-selected={i === activeIdx}
              role="tab"
              data-testid={`ig-dot-${i}`}
            />
          ))}
          <span className="ig-dots__counter" aria-live="polite">
            {String(activeIdx + 1).padStart(2, "0")} / {String(POSTS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-6">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--gb-dim)]">
            {s.footer_note}
          </div>
          <a
            href={`https://www.instagram.com/${HANDLE}/`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="instagram-footer-cta"
            className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-cyan-neon hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <span>{s.footer_cta}</span>
            <ArrowUpRight size={12} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default InstagramFeed;
