import Footer from "@/app/components/Home/Footer";
import Navbar from "@/app/components/layout/Navbar";
import FAQAccordion from "@/app/components/FAQ/FAQAccordion"; // Import the accordion, not the page
import { Search, HelpCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* --- FAQ HERO --- */}
      <section className="hero-bg-custom pt-40 pb-20 relative overflow-hidden text-center">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[#5D5FEF]/10 rounded-full blur-[120px] animate-pulse-slow z-0" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/5 rounded-full mb-6">
            <HelpCircle size={16} className="text-[#5D5FEF]" />
            <span className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-[2px]">Help Center</span>
          </div>
          
          <h1 className="text-6xl font-[900] text-[#1A1A1A] mt-2 mb-8 tracking-tighter">
            Common <span className="text-[#5D5FEF]">Questions.</span>
          </h1>
          
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#5D5FEF] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for an answer..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] shadow-xl shadow-slate-200/50 outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium"
            />
          </div>
        </div>
      </section>

      {/* --- ACCORDION SECTION --- */}
      <section className="pb-32 max-w-3xl mx-auto px-6">
        {/* FIXED: We call FAQAccordion here, not FAQPage */}
        <FAQAccordion /> 
      </section>

    </main>
  );
}