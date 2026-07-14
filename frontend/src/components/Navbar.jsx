import React, { useEffect, useState } from "react";
import { useLang } from "@/context/LangContext";
import { Zap } from "lucide-react";

export const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "hero", label: t.nav.experience },
    { id: "gallery", label: t.nav.gallery },
    { id: "craft", label: t.nav.craft },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-cyan-500/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 md:px-10 py-4">
        <button
          data-testid="brand-logo"
          onClick={() => jump("hero")}
          className="flex items-center gap-2 font-heavy text-lg md:text-xl text-cyan-neon glow-cyan glitch"
        >
          <Zap className="w-5 h-5" strokeWidth={2.5} />
          <span>GEMBUTCHER</span>
        </button>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => jump(l.id)}
              className="font-mono text-xs uppercase tracking-widest text-gray-300 hover:text-cyan-neon transition-colors duration-200"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div
          data-testid="lang-switcher"
          className="flex items-center gap-1 font-mono text-xs uppercase border border-cyan-500/30 px-1 py-1"
          style={{
            clipPath:
              "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
          }}
        >
          <button
            data-testid="lang-btn-it"
            onClick={() => setLang("it")}
            className={`px-2 py-1 transition-colors duration-150 ${
              lang === "it"
                ? "text-black bg-cyan-neon"
                : "text-gray-400 hover:text-cyan-neon"
            }`}
            style={lang === "it" ? { backgroundColor: "var(--gb-cyan)" } : {}}
          >
            ITA
          </button>
          <span className="text-gray-600">|</span>
          <button
            data-testid="lang-btn-en"
            onClick={() => setLang("en")}
            className={`px-2 py-1 transition-colors duration-150 ${
              lang === "en"
                ? "text-black"
                : "text-gray-400 hover:text-magenta-neon"
            }`}
            style={lang === "en" ? { backgroundColor: "var(--gb-magenta)" } : {}}
          >
            ENG
          </button>
        </div>
      </div>
    </nav>
  );
};
