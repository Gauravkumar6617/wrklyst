"use client";
import { Search, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroDropzone from './HeroDropzone'; // Ensure you've created this file

export default function Hero() {
  return (
    <div className="hero-bg-custom pt-24 pb-16 md:pt-32 md:pb-32 border-b border-white/20 relative overflow-hidden">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute top-[5%] left-[5%] w-48 h-48 md:w-72 md:h-72 bg-[#5D5FEF]/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[5%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-400/10 rounded-full blur-[100px] md:blur-[150px] animate-pulse-slow z-0" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-12 items-center relative z-10">
        
        {/* --- LEFT CONTENT --- */}
        <div className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left w-full">
          
          {/* 1. Privacy Badge & Headlines */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mx-auto lg:mx-0"
            >
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                Local Browser Processing • 100% Secure
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-[900] text-[#1A1A1A] leading-[1.1] tracking-tight">
              Manage files <br className="hidden sm:block" />
              without the <span className="text-[#5D5FEF]">Wait.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              All the tools you need to merge, convert, and compress files. 
              Processed directly in your browser for ultimate speed.
            </p>
          </div>

          {/* 2. Quick Action Buttons (Replaced Search for cleaner look) */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/tools">
              <button className="group bg-[#5D5FEF] text-white px-8 py-4 rounded-2xl font-bold text-[15px] shadow-2xl shadow-[#5D5FEF]/30 hover:scale-105 transition-all flex items-center gap-3">
                <Zap size={18} fill="currentColor" />
                Explore All Tools
              </button>
            </Link>
            <div className="flex items-center gap-4 py-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#2D2E5F]">1,400+ users online</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE INTERACTIVE DROPZONE --- */}
        <div className="w-full lg:w-[460px] relative">
          {/* Subtle Glow behind the dropzone */}
          <div className="absolute -inset-4 bg-[#5D5FEF]/15 rounded-[48px] blur-3xl opacity-50" />
          
          <div className="relative bg-white/40 backdrop-blur-3xl rounded-[48px] p-6 md:p-8 border border-white/60 shadow-2xl">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-black text-[11px] uppercase tracking-[3px] text-slate-400">Quick Start</h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
              </div>
            </div>
            
            {/* The Actual Dropzone Component */}
            <HeroDropzone />

            <p className="mt-6 text-center text-[11px] text-slate-400 font-medium">
              Files are processed locally. We never store your data.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}