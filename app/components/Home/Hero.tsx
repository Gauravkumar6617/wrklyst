"use client";
import React from "react";
import {
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
  Command,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex items-center overflow-x-hidden">
      {/* Background Orbs - Optimized for Mobile Performance */}
      <div className="absolute top-0 left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-[-5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-rose-500/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-12 md:py-20 lg:pt-40">
        {/* The lg:pt-40 (or lg:pt-32) acts as the spacer for your fixed navbar on web */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* LEFT: Content Area */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border border-indigo-100 rounded-2xl mb-6 md:mb-8 shadow-sm"
            >
              <Sparkles size={14} className="text-[#5D5FEF] animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#5D5FEF]">
                WebAssembly v4.0 Active
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-[1000] text-[#1E1F4B] leading-[1.1] md:leading-[0.95] tracking-[-0.04em] mb-6 md:mb-8"
            >
              Process files at <br className="hidden md:block" />
              the speed of <span className="text-[#5D5FEF] italic">Light.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-base md:text-lg lg:text-xl font-medium max-w-xl mx-auto lg:mx-0 mb-8 md:mb-10 leading-relaxed"
            >
              Wrklyst is a high-performance suite of local-first utilities.
              Everything happens in your browser—no file uploads, no server
              latency, and 100% data privacy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6"
            >
              <Link href="/tools" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#1E1F4B] text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[28px] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-[#5D5FEF] transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-4">
                  Explore All Tools <ArrowRight size={18} />
                </button>
              </Link>

              <div className="flex items-center gap-4 md:gap-6 px-5 md:px-6 py-3 md:py-4 bg-white border border-slate-100 rounded-2xl md:rounded-[28px] shadow-sm">
                <FeatureItem icon={<Lock size={16} />} text="Local-Only" />
                <div className="w-px h-4 bg-slate-200" />
                <FeatureItem icon={<Globe size={16} />} text="Private" />
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Compact Engine Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex-1 w-full max-w-[320px] sm:max-w-[440px] lg:max-w-[540px] relative order-1 lg:order-2"
          >
            <div className="bg-white rounded-[40px] md:rounded-[56px] p-1.5 md:p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white">
              <div className="bg-[#1E1F4B] rounded-[36px] md:rounded-[48px] p-6 md:p-10 overflow-hidden relative group aspect-square flex flex-col justify-center">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#5D5FEF 1px, transparent 1px)",
                    backgroundSize: "20px 20px md:24px 24px",
                  }}
                />

                <div className="relative z-10 text-center">
                  <div className="flex justify-center gap-2 mb-6 md:mb-10">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  </div>

                  <div className="relative inline-block mb-6 md:mb-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-[28px] md:rounded-[32px] border border-white/10 backdrop-blur-xl flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-700">
                      <Cpu
                        size={48}
                        className="text-[#5D5FEF] animate-pulse md:w-14 md:h-14"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-16 h-16 md:w-24 md:h-24 bg-indigo-600 rounded-xl md:rounded-2xl shadow-2xl flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                      <Zap size={24} className="text-white md:w-8 md:h-8" />
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3 tracking-tight">
                    Smart-Core v4.0
                  </h2>
                  <p className="text-indigo-200/50 text-[9px] md:text-xs font-bold uppercase tracking-widest leading-none">
                    In-Browser Processing Engine
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Trust Indicator - Hidden on Small Mobile */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 hidden sm:block"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 leading-none mb-0.5">
                    End-to-End
                  </p>
                  <p className="text-[10px] md:text-xs font-bold text-[#1E1F4B] leading-none">
                    AES-256 Encrypted
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* LOGO CLOUD (Bottom Ticker) */}
        <div className="mt-16 md:mt-32 pt-8 md:pt-10 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row justify-center lg:justify-between items-center gap-8 md:gap-10 opacity-30 grayscale contrast-125">
            {["ORACLE", "STARK", "APEX", "NEXUS", "QUANTUM"].map((logo) => (
              <span
                key={logo}
                className="text-base md:text-xl font-black tracking-tighter text-[#1E1F4B] text-center"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[#5D5FEF] shrink-0">{icon}</div>
      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
