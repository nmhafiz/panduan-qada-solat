import React, { Suspense } from "react";
import HeroSection from "@/components/hero/HeroSection";
import ProblemSection from "@/components/problem/ProblemSection";
import AgitateSection from "@/components/agitate/AgitateSection";
import SolutionSection from "@/components/solution/SolutionSection";
import TargetPersonaSection from "@/components/target-persona/TargetPersonaSection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import AuthorBioSection from "@/components/authority/AuthorBioSection";
import InsideLookSection from "@/components/sneak-peek/InsideLookSection";
import ComparisonSection from "@/components/comparison/ComparisonSection";
import ValueStackSection from "@/components/pricing/ValueStackSection";
import PricingSection from "@/components/pricing/PricingSection";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import TrustProcessSection from "@/components/checkout/TrustProcessSection";
import FAQSection from "@/components/faq/FAQSection";

import FloatingCTA from "@/components/layout/FloatingCTA";
import Header from "@/components/layout/Header";
import FooterSection from "@/components/footer/FooterSection";
import FinalCTASection from "@/components/cta/FinalCTASection";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollProgress from "@/components/layout/ScrollProgress";
import SpiritualExit from "@/components/layout/SpiritualExit";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      <Header />

      {/* GLOBAL MOBILE WRAPPER: Enforces no side-scroll on iPhone */}
      <div className="w-full max-w-[100vw] overflow-x-hidden relative">
        <HeroSection />

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1000px' }}>
          <ProblemSection />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
          <AgitateSection />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
          <SolutionSection />
        </div>

        <div>
          <TargetPersonaSection />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
          <TestimonialsSection />
        </div>

        <AuthorBioSection />
        <InsideLookSection />
        <ComparisonSection />
        <ValueStackSection />
        <PricingSection />

        <section id="checkout" className="py-20 bg-gray-50 flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 text-center mb-10 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-4 leading-tight text-balance">
              Dapatkan <span className="text-green-700">Panduan Qadha Solat</span> Hari Ini
            </h2>
            <p className="text-gray-600 text-lg">
              Jangan tangguh lagi. Ambil langkah pertama untuk selesaikan hutang solat anda dengan ilmu yang betul.
            </p>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-left">
            <Suspense fallback={<div className="text-center py-10">Memuatkan borang...</div>}>
              <CheckoutForm />
            </Suspense>
          </div>
        </section>

        <TrustProcessSection />

        <FinalCTASection />
        <FAQSection />
        <SpiritualExit />
        <FooterSection />
      </div>

      {/* Floating Elements */}
      <FloatingCTA />
      <WhatsAppButton />
    </main>
  );
}

