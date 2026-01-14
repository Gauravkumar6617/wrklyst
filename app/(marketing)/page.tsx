import Hero from "../components/Home/Hero";
import FeaturePills from "../components/Home/FeaturePills";
import TrustBar from "../components/Home/TrustBar";
import FeaturedTools from "../components/Home/FeaturedTools";
import Testimonials from "../components/Home/Testimonials";
import CTA from "../components/Home/CTA";
import VisitorStats from "../components/Home/VisitorStats";


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      
      <div className="relative z-30">
         <FeaturePills />
      </div>
      
      <section className="pt-20">
        <TrustBar />
      </section>

      {/* --- ADDED HERE --- */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-[1000] text-[#0F172A] tracking-tighter leading-tight">
              JOIN A GLOBAL <span className="text-[#5D5FEF]">COMMUNITY</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Our tools are powering workflows across the globe. See the live engagement.
            </p>
          </div>
          
          {/* The Component fits perfectly as a floating card here */}
          <div className="w-full md:w-80 shrink-0">
            <VisitorStats />
          </div>
        </div>
      </section>

      <section className="pt-12 pb-0 bg-white">
        <FeaturedTools />
      </section>

      <Testimonials />
      <CTA />
    </main>
  );
}