// app/not-found.tsx
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/Home/Footer';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* --- 404 CONTENT --- */}
      <section className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 relative overflow-hidden text-center px-6">
        
        {/* Background Decorative Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5D5FEF]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        {/* The 404 Icon Container */}
        <div className="w-24 h-24 bg-[#5D5FEF]/5 rounded-[32px] flex items-center justify-center text-[#5D5FEF] mb-8 animate-bounce-slow">
          <FileQuestion size={48} strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <h1 className="text-8xl md:text-[150px] font-black text-[#1A1A1A] tracking-tighter leading-none opacity-10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20">
          404
        </h1>
        
        <h2 className="text-4xl md:text-5xl font-black text-[#2D2E5F] mb-6 tracking-tight">
          Oops! You’re <span className="text-[#5D5FEF]">lost.</span>
        </h2>
        
        <p className="text-lg text-slate-500 font-medium max-w-md mx-auto mb-12 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 px-8 py-4 bg-[#1E1F4B] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-indigo-100">
              <Home size={18} /> Back to Home
            </button>
          </Link>
          
          <Link href="/contact">
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-[#2D2E5F] border border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              Report Issue
            </button>
          </Link>
        </div>

        {/* Useful Quick Links */}
        <div className="mt-20 pt-10 border-t border-slate-50 w-full max-w-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-6">Try these instead</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-[#5D5FEF]">
            <Link href="/tools/pdf/merge" className="hover:underline">Merge PDF</Link>
            <Link href="/tools/image/resize" className="hover:underline">Resize Image</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}