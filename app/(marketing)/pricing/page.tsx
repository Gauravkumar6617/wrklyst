// app/pricing/page.tsx

import Footer from "@/app/components/Home/Footer";
import Navbar from "@/app/components/layout/Navbar";
import PricingCard from "@/app/components/Pricing/PricingCard";


const plans = [
  {
    name: "Free Forever",
    price: "0",
    desc: "For hobbyists and casual users needing quick file fixes.",
    features: [
      "5 daily file exports",
      "Files up to 50MB",
      "Standard processing speed",
      "Access to all basic tools",
      "Email support (48h)"
    ],
    button: "Get Started",
    pro: false
  },
  {
    name: "Pro Suite",
    price: "19",
    desc: "Built for power users and creative professionals.",
    features: [
      "Unlimited file exports",
      "Large files up to 2GB",
      "Priority 'Lightning' processing",
      "Advanced bulk editing",
      "24/7 VIP Priority Support",
      "Early access to new tools"
    ],
    button: "Upgrade to Pro",
    pro: true
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section */}
      <div className="pt-48 pb-20 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-black text-[#1A1A1A] tracking-tighter mb-6">
          Simple, Honest <span className="text-[#5D5FEF]">Pricing.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
          Choose a plan that scales with your productivity. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Cards Section */}
      <section className="max-w-6xl mx-auto px-10 pb-40 grid grid-cols-1 md:grid-cols-2 gap-10">
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </section>

      <Footer />
    </main>
  );
}