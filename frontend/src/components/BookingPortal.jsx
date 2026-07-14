import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLang } from "@/context/LangContext";
import { Send, ShieldCheck, MessageCircle, Loader2, ArrowRight } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WHATSAPP_NUMBER = "393518282771"; // Studio number visible in reference photo

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
      ? `Ciao GemButcher! Vorrei prenotare una sessione (${form.style}). ${
          form.description ? "Idea: " + form.description : ""
        }`
      : `Hi GemButcher! I'd like to book a session (${form.style}). ${
          form.description ? "Idea: " + form.description : ""
        }`
  );
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const styleOptions = [
    { v: "polynesian", label: t.hero.styles.polynesian },
    { v: "cyberpunk", label: t.hero.styles.cyberpunk },
    { v: "anime", label: t.hero.styles.anime },
    { v: "patutikon", label: t.hero.styles.patutikon },
  ];

  return (
    <section
      id="booking"
      data-testid="booking-section"
      className="relative py-28 md:py-36"
    >
      <div
        aria-hidden
        className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.09] pointer-events-none"
        style={{ backgroundColor: "var(--gb-cyan)" }}
      />

      <div className="max-w-[1040px] mx-auto px-5 md:px-10 relative">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[11px] text-magenta-neon uppercase tracking-[0.35em] mb-4">
            05 / {t.booking.badge.replace(/^\/\/\s*/, "")}
          </div>
          <h2 className="font-head font-bold text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-tight">
            <span className="text-white/95">Prenotazione </span>
            <span className="text-cyan-neon italic">sicura</span>
          </h2>
          <p className="mt-5 text-white/60 text-[15px] leading-relaxed">
            {t.booking.subtitle}
          </p>
        </div>

        <div className="glass-card corner-brackets relative p-7 md:p-10 rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-7">
            <div className="flex items-center gap-2.5 font-mono text-[10px] text-white/60 uppercase tracking-[0.28em]">
              <ShieldCheck className="w-4 h-4 text-cyan-neon" />
              /booking · encrypted channel
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase tracking-widest">
              <span className="dot dot-cyan" />
              secure
            </div>
          </div>

          {sent ? (
            <div className="text-center py-12" data-testid="booking-success">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
                style={{
                  background:
                    "radial-gradient(circle, rgba(34,211,238,0.15), transparent 70%)",
                  border: "1px solid var(--gb-cyan-line)",
                }}
              >
                <ShieldCheck className="w-8 h-8 text-cyan-neon" />
              </div>
              <h3 className="font-head text-2xl md:text-3xl text-white mb-3">
                {t.booking.success_title}
              </h3>
              <p className="text-white/60 max-w-md mx-auto">{t.booking.success_msg}</p>
              <div className="mt-8 flex justify-center gap-3 flex-wrap">
                <a
                  data-testid="booking-whatsapp-after"
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="neon-btn neon-btn--solid-orange"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.booking.whatsapp}
                </a>
                <button
                  data-testid="booking-reset"
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      style: "patutikon",
                      body_placement: "",
                      size: "",
                      preferred_date: "",
                      description: "",
                    });
                  }}
                  className="neon-btn"
                >
                  {lang === "it" ? "Nuova richiesta" : "New request"}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid md:grid-cols-2 gap-5"
              data-testid="booking-form"
            >
              <Field label={t.booking.name}>
                <input
                  data-testid="booking-input-name"
                  className="cyber-input"
                  value={form.name}
                  onChange={setField("name")}
                  required
                />
              </Field>

              <Field label={t.booking.email}>
                <input
                  data-testid="booking-input-email"
                  type="email"
                  className="cyber-input"
                  value={form.email}
                  onChange={setField("email")}
                  required
                />
              </Field>

              <Field label={t.booking.phone}>
                <input
                  data-testid="booking-input-phone"
                  className="cyber-input"
                  value={form.phone}
                  onChange={setField("phone")}
                />
              </Field>

              <Field label={t.booking.style}>
                <select
                  data-testid="booking-input-style"
                  className="cyber-input"
                  value={form.style}
                  onChange={setField("style")}
                >
                  {styleOptions.map((o) => (
                    <option key={o.v} value={o.v} className="bg-black">
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t.booking.placement}>
                <input
                  data-testid="booking-input-placement"
                  className="cyber-input"
                  value={form.body_placement}
                  onChange={setField("body_placement")}
                />
              </Field>

              <Field label={t.booking.size}>
                <input
                  data-testid="booking-input-size"
                  className="cyber-input"
                  placeholder="e.g. 20 × 30 cm"
                  value={form.size}
                  onChange={setField("size")}
                />
              </Field>

              <Field label={t.booking.date} full>
                <input
                  data-testid="booking-input-date"
                  type="date"
                  className="cyber-input"
                  value={form.preferred_date}
                  onChange={setField("preferred_date")}
                />
              </Field>

              <Field label={t.booking.description} full>
                <textarea
                  data-testid="booking-input-description"
                  className="cyber-input min-h-[140px] resize-y"
                  value={form.description}
                  onChange={setField("description")}
                  required
                />
              </Field>

              <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-3">
                <button
                  data-testid="booking-submit"
                  type="submit"
                  disabled={loading}
                  className="neon-btn neon-btn--solid"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? t.booking.submitting : t.booking.submit}
                  {!loading && <ArrowRight className="w-4 h-4" />}
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

                <div className="font-mono text-[10px] text-white/35 tracking-[0.25em] ml-auto uppercase">
                  256-bit AES · end-to-end
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
    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 block mb-2">
      {label}
    </span>
    {children}
  </label>
);
