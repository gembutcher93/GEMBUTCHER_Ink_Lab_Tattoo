import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLang } from "@/context/LangContext";
import { Send, ShieldCheck, MessageCircle, Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// WhatsApp — placeholder Italian format. Studio can update.
const WHATSAPP_NUMBER = "393000000000";

export const BookingPortal = () => {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    style: "patutikon",
    body_placement: "",
    size: "",
    preferred_date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) {
      toast.error(t.booking.required);
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, { ...form, language: lang });
      setSent(true);
      toast.success(t.booking.success_title);
    } catch (err) {
      toast.error(t.booking.error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const waMessage = encodeURIComponent(
    lang === "it"
      ? `Ciao GemButcher! Vorrei prenotare una sessione (${form.style}). ${form.description ? "Idea: " + form.description : ""}`
      : `Hi GemButcher! I'd like to book a session (${form.style}). ${form.description ? "Idea: " + form.description : ""}`
  );
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const styleOptions = [
    { v: "polynesian", label: t.hero.styles.polynesian },
    { v: "cyberpunk", label: t.hero.styles.cyberpunk },
    { v: "anime", label: t.hero.styles.anime },
    { v: "patutikon", label: t.hero.styles.patutikon },
  ];

  return (
    <section id="booking" data-testid="booking-section" className="relative py-24 md:py-32">
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <div className="mb-10 text-center">
          <div className="font-mono text-xs text-magenta-neon uppercase tracking-widest mb-3">
            {t.booking.badge}
          </div>
          <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
            <span className="text-white/95">{t.booking.title.split(" ")[0]} </span>
            <span className="text-cyan-neon glow-cyan">{t.booking.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">{t.booking.subtitle}</p>
        </div>

        <div className="holo-frame corner-brackets scanlines relative p-6 md:p-10">
          {/* Terminal header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-neon uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              /terminal/booking.enc
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-magenta-500" style={{ backgroundColor: "var(--gb-magenta)" }} />
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" style={{ backgroundColor: "var(--gb-cyan)" }} />
              <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
            </div>
          </div>

          {sent ? (
            <div className="text-center py-14" data-testid="booking-success">
              <div className="w-16 h-16 border-2 border-cyan-neon rounded-full mx-auto flex items-center justify-center mb-5" style={{ borderColor: "var(--gb-cyan)" }}>
                <ShieldCheck className="w-8 h-8 text-cyan-neon" />
              </div>
              <h3 className="font-head text-2xl text-cyan-neon glow-cyan mb-2">{t.booking.success_title}</h3>
              <p className="text-gray-400 max-w-md mx-auto">{t.booking.success_msg}</p>
              <div className="mt-6 flex justify-center gap-3 flex-wrap">
                <a
                  data-testid="booking-whatsapp-after"
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="neon-btn neon-btn--magenta"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.booking.whatsapp}
                </a>
                <button
                  data-testid="booking-reset"
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: "", email: "", phone: "", style: "patutikon",
                      body_placement: "", size: "", preferred_date: "", description: "",
                    });
                  }}
                  className="neon-btn"
                >
                  {lang === "it" ? "Nuova richiesta" : "New request"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5" data-testid="booking-form">
              <Field label={t.booking.name} testid="booking-input-name">
                <input
                  data-testid="booking-input-name"
                  className="cyber-input"
                  value={form.name}
                  onChange={setField("name")}
                  required
                />
              </Field>

              <Field label={t.booking.email} testid="booking-input-email">
                <input
                  data-testid="booking-input-email"
                  type="email"
                  className="cyber-input"
                  value={form.email}
                  onChange={setField("email")}
                  required
                />
              </Field>

              <Field label={t.booking.phone} testid="booking-input-phone">
                <input
                  data-testid="booking-input-phone"
                  className="cyber-input"
                  value={form.phone}
                  onChange={setField("phone")}
                />
              </Field>

              <Field label={t.booking.style} testid="booking-input-style">
                <select
                  data-testid="booking-input-style"
                  className="cyber-input"
                  value={form.style}
                  onChange={setField("style")}
                >
                  {styleOptions.map((o) => (
                    <option key={o.v} value={o.v} className="bg-black">{o.label}</option>
                  ))}
                </select>
              </Field>

              <Field label={t.booking.placement} testid="booking-input-placement">
                <input
                  data-testid="booking-input-placement"
                  className="cyber-input"
                  value={form.body_placement}
                  onChange={setField("body_placement")}
                />
              </Field>

              <Field label={t.booking.size} testid="booking-input-size">
                <input
                  data-testid="booking-input-size"
                  className="cyber-input"
                  placeholder="e.g. 20 × 30 cm"
                  value={form.size}
                  onChange={setField("size")}
                />
              </Field>

              <Field label={t.booking.date} testid="booking-input-date" full>
                <input
                  data-testid="booking-input-date"
                  type="date"
                  className="cyber-input"
                  value={form.preferred_date}
                  onChange={setField("preferred_date")}
                />
              </Field>

              <Field label={t.booking.description} testid="booking-input-description" full>
                <textarea
                  data-testid="booking-input-description"
                  className="cyber-input min-h-[130px] resize-y"
                  value={form.description}
                  onChange={setField("description")}
                  required
                />
              </Field>

              <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                <button
                  data-testid="booking-submit"
                  type="submit"
                  disabled={loading}
                  className="neon-btn"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? t.booking.submitting : t.booking.submit}
                </button>

                <a
                  data-testid="booking-whatsapp"
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="neon-btn neon-btn--magenta"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.booking.whatsapp}
                </a>

                <div className="font-mono text-[10px] text-gray-500 tracking-widest ml-auto">
                  256-BIT AES · END-TO-END
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, children, full = false }) => (
  <label className={`block ${full ? "md:col-span-2" : ""}`}>
    <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-neon block mb-1.5">
      &gt; {label}
    </span>
    {children}
  </label>
);
