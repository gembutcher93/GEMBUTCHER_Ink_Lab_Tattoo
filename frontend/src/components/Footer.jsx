import React from "react";
import { useLang } from "@/context/LangContext";
import { Instagram, MessageCircle, Youtube, Zap } from "lucide-react";

export const Footer = () => {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer data-testid="site-footer" className="relative border-t border-cyan-500/15 py-10 mt-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-cyan-neon" />
          <div>
            <div className="font-heavy text-sm text-cyan-neon glow-cyan tracking-widest">GEMBUTCHER</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              {t.footer.studio} · {t.footer.addr}
            </div>
          </div>
        </div>

        <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
          {t.footer.join}
        </div>

        <div className="flex items-center gap-4">
          <a href="#" data-testid="footer-instagram" className="text-gray-400 hover:text-magenta-neon transition-colors duration-200" aria-label="instagram">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" data-testid="footer-whatsapp" className="text-gray-400 hover:text-cyan-neon transition-colors duration-200" aria-label="whatsapp">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href="#" data-testid="footer-youtube" className="text-gray-400 hover:text-magenta-neon transition-colors duration-200" aria-label="youtube">
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 mt-6 flex items-center justify-between font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        <span>© {year} GemButcher · Podere 173</span>
        <span>{t.footer.rights}</span>
      </div>
    </footer>
  );
};
