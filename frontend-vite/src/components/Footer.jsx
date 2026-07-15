import React from "react";
import { useLang } from "@/context/LangContext";
import { Instagram, MessageCircle, Youtube } from "lucide-react";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_neon-ink-lab-1/artifacts/9zwdzt75_logo.png";

export const Footer = () => {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/5 pt-14 pb-10 mt-16"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 grid md:grid-cols-3 gap-10">
        <div className="flex items-start gap-3">
          <img
            src={LOGO_URL}
            alt="GemButcher"
            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0, 255, 179,0.5)]"
          />
          <div>
            <div className="font-head text-lg text-white tracking-[0.22em]">
              GEM<span className="text-cyan-neon">BUTCHER</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 mt-1">
              {t.footer.studio}
            </div>
            <div className="text-white/50 text-sm mt-1">{t.footer.addr}</div>
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-3">
            Navigation
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-sm text-white/70">
            <a href="#hero" className="hover:text-cyan-neon transition-colors duration-200">
              {t.nav.experience}
            </a>
            <a href="#gallery" className="hover:text-cyan-neon transition-colors duration-200">
              {t.nav.gallery}
            </a>
            <a href="#craft" className="hover:text-cyan-neon transition-colors duration-200">
              {t.nav.craft}
            </a>
            <a href="#inkanimus" className="hover:text-cyan-neon transition-colors duration-200">
              {t.nav.inkanimus}
            </a>
            <a href="#booking" className="hover:text-cyan-neon transition-colors duration-200">
              {t.nav.booking}
            </a>
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-3">
            {t.footer.join}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              data-testid="footer-instagram"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-magenta-neon hover:border-orange-500/40 transition-colors duration-200"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
              aria-label="instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/393498290606"
              target="_blank"
              rel="noreferrer"
              data-testid="footer-whatsapp"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-cyan-neon hover:border-cyan-500/40 transition-colors duration-200"
              aria-label="whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="#"
              data-testid="footer-youtube"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-magenta-neon transition-colors duration-200"
              aria-label="youtube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-white/35 uppercase tracking-[0.25em]">
        <span>© {year} GemButcher · Podere 173</span>
        <span>{t.footer.rights}</span>
      </div>
    </footer>
  );
};
