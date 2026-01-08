
import CTA from "@/app/components/Home/CTA";
import Footer from "@/app/components/Home/Footer";
import HowItWorksSteps from "@/app/components/HowItWorks/HowItWorksSteps";
import Navbar from "@/app/components/layout/Navbar";
import { PlayCircle } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="hero-bg-custom pt-40 pb-20 relative overflow-hidden text-center">
        <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-[#5D5FEF]/10 rounded-full blur-[120px] animate-pulse-slow z-0" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/5 rounded-full mb-6 text-[#5D5FEF] font-black text-[10px] uppercase tracking-[2px]">
            <PlayCircle size={14} /> Simplified Workflow
          </div>
          <h1 className="text-6xl font-[900] text-[#1A1A1A] tracking-tighter mb-6">
            Magic behind the <br /> <span className="text-[#5D5FEF]">Processing.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            We’ve engineered a 3-step system that handles your complex file tasks in seconds, right in your browser.
          </p>
        </div>
      </section>

      {/* --- STEPS SECTION --- */}
      <HowItWorksSteps />

      {/* --- REUSE FINAL CTA --- */}
      <div className="py-20">
        <CTA />
      </div>


    </main>
  );
}