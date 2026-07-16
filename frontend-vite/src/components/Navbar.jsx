import React, { useEffect, useState } from "react";
import { useLang } from "@/context/LangContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/9zwdzt75_logo.png";

export const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "craft", label: t.nav.craft },
    { id: "gallery", label: t.nav.gallery },
    { id: "hero", label: t.nav.experience },
    { id: "inkanimus", label: t.nav.inkanimus },
    { id: "booking", label: t.nav.booking },
  ];

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-2xl border-b border-cyan-500/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-10 py-4">
        <button
          data-testid="brand-logo"
          onClick={() => jump("hero")}
          className="flex items-center gap-3 group"
        >
          <span className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0">
            <span
              className="absolute inset-0 rounded-full opacity-70 group-hover:opacity-100 blur-md transition-opacity duration-300"
              style={{ backgroundColor: "var(--gb-cyan)", filter: "blur(14px)" }}
            />
            <img
              src={LOGO_URL}
              alt="GemButcher"
              className="relative w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]"
            />
          </span>
          <span className="font-head font-bold text-lg md:text-xl text-white tracking-[0.25em]">
            GEM<span className="text-cyan-neon glow-cyan">BUTCHER</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => jump(l.id)}
              className="relative font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300 hover:text-cyan-neon transition-colors duration-200"
            >
              {l.label}
              <span
                className="absolute -bottom-1.5 left-0 h-px w-0 group-hover:w-full transition-[width] duration-300"
                style={{ backgroundColor: "var(--gb-cyan)" }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
        <ThemeToggle />
        <div
          data-testid="lang-switcher"
          className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md p-0.5 font-mono text-[10px] uppercase"
        >
          <button
            data-testid="lang-btn-it"
            onClick={() => setLang("it")}
            className={`relative z-10 px-3 py-1.5 rounded-full transition-colors duration-200 ${
              lang === "it" ? "text-black" : "text-gray-400 hover:text-cyan-neon"
            }`}
            style={
              lang === "it"
                ? {
                    background:
                      "linear-gradient(135deg, var(--gb-cyan), rgba(0,240,255,0.7))",
                    boxShadow: "0 0 18px rgba(0,240,255,0.5)",
                  }
                : {}
            }
          >
            ITA
          </button>
          <button
            data-testid="lang-btn-en"
            onClick={() => setLang("en")}
            className={`relative z-10 px-3 py-1.5 rounded-full transition-colors duration-200 ${
              lang === "en" ? "text-black" : "text-gray-400 hover:text-magenta-neon"
            }`}
            style={
              lang === "en"
                ? {
                    background:
                      "linear-gradient(135deg, var(--gb-magenta), rgba(255,0,127,0.7))",
                    boxShadow: "0 0 18px rgba(255,0,127,0.45)",
                  }
                : {}
            }
          >
            ENG
          </button>
        </div>
        </div>
      </div>
    </nav>
  );
};
