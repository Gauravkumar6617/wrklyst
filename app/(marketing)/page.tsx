import Hero from "../components/Home/Hero";
import FeaturePills from "../components/Home/FeaturePills";
import TrustBar from "../components/Home/TrustBar";
import HowItWorks from "../components/Home/HowItWorks"; // New

import FeaturedTools from "../components/Home/FeaturedTools";
import Testimonials from "../components/Home/Testimonials";
import CTA from "../components/Home/CTA";
import VisitorStats from "../components/Home/VisitorStats";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO: The "Hook" */}
      <Hero />
      
      <div className="relative z-30">
         <FeaturePills />
      </div>
      
      {/* 2. TRUSTBAR: The "Transparency" */}
      <section className="pt-20">
        <TrustBar />
      </section>

      {/* 3. HOW IT WORKS: The "Privacy Engine" (CRITICAL ADDITION) */}
      {/* This section explains WebAssembly and Local-First processing */}
      <HowItWorks />

      {/* 4. VISITOR STATS: The "Live Community" */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-[1000] text-[#0F172A] tracking-tighter leading-tight uppercase">
              Join a Global <span className="text-[#5D5FEF]">Community</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Our tools are powering workflows across the globe. See the live engagement.
            </p>
          </div>
          <div className="w-full md:w-80 shrink-0">
            <VisitorStats />
          </div>
        </div>
      </section>

      {/* 5. STATS TICKER: The "Speed Proof" */}
      

      {/* 6. FEATURED TOOLS: The "Catalog" */}
      <section className="pt-12 pb-0 bg-white">
        <FeaturedTools />
      </section>

      {/* 7. TESTIMONIALS: The "Active Feedback" */}
      <Testimonials />

      {/* 8. CTA: The "Final Push" */}
      <CTA />
    </main>
  );
}