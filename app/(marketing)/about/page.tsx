import AboutHero from "@/app/components/About/AboutHero";
import Values from "@/app/components/About/Values";
import CTA from "@/app/components/Home/CTA";
import Footer from "@/app/components/Home/Footer";
import Navbar from "@/app/components/layout/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* 1. Impactful Story Hero */}
      <AboutHero />
      
      {/* 2. Our Values (Glass Cards) */}
      <Values />
      
      {/* 3. Reusing your Final CTA for consistency */}
      <div className="py-20">
        <CTA />
      </div>
      

    </main>
  );
}