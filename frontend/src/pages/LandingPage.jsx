import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero3D } from "@/components/Hero3D";
import { PatutikonGallery } from "@/components/PatutikonGallery";
import { ButcherCraft } from "@/components/ButcherCraft";
import { InkanimusLaunch } from "@/components/InkanimusLaunch";
import { InkanimusHub } from "@/components/InkanimusHub";
import { BookingPortal } from "@/components/BookingPortal";
import { Footer } from "@/components/Footer";
import { ScrollFX } from "@/components/ScrollFX";
import { Toaster } from "sonner";

export default function LandingPage() {
  return (
    <div data-testid="landing-page" className="bg-obsidian text-white min-h-screen relative">
      <ScrollFX />
      <Navbar />
      <main>
        <ButcherCraft />
        <PatutikonGallery />
        <Hero3D />
        <InkanimusLaunch />
        <InkanimusHub />
        <BookingPortal />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d0d12",
            border: "1px solid rgba(0,240,255,0.3)",
            color: "#e0e0e8",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}
