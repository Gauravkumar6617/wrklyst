import Hero from "../components/Home/Hero";
import FeaturePills from "../components/Home/FeaturePills";
import TrustBar from "../components/Home/TrustBar";
import FeaturedTools from "../components/Home/FeaturedTools";
import Testimonials from "../components/Home/Testimonials";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Floating Features */}
      <div className="relative z-30">
         <FeaturePills />
      </div>
      
      {/* 3. Trust Bar Strip */}
      <section className="pt-20">
        <TrustBar />
      </section>

      {/* 4. Featured Tools Grid */}
      <section className="pt-12 pb-0 bg-white">
        <FeaturedTools />
      </section>

      {/* 5. NEW: Testimonials (Building Trust) */}
      <Testimonials />

      {/* 6. NEW: Final Conversion Section */}
      <CTA />

      {/* 7. NEW: Footer (Navigation & SEO) */}
      <Footer />
    </main>
  );
}