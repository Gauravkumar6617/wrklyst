import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/Home/Footer";
import ToolsDirectory from "@/app/components/Tools/ToolsDirectory";
import { Search } from "lucide-react";

export default function AllToolsPage() {
  return (
    <main className="min-h-screen bg-[#FBFCFE]">
      <Navbar />

      {/* Hero Search Section */}
      <section className="pt-44 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h1 className="text-5xl font-black text-[#1A1A1A] tracking-tighter mb-4">
                Creative <span className="text-[#5D5FEF]">Toolkit.</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Professional-grade tools for your everyday digital workflow.
              </p>
            </div>
            
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Component we just created */}
      <ToolsDirectory />

      <Footer />
    </main>
  );
}