"use client";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  FileText,
  Terminal,
  Type,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  // Quick-access tools for the Hero section
  const featuredTools = [
    {
      name: "Word Counter",
      icon: <Type className="text-emerald-500" />,
      slug: "word-counter",
      color: "bg-emerald-50",
    },
    {
      name: "JSON Formatter",
      icon: <Terminal className="text-indigo-500" />,
      slug: "json-formatter",
      color: "bg-indigo-50",
    },
    {
      name: "Password Gen",
      icon: <ShieldCheck className="text-rose-500" />,
      slug: "password-generator",
      color: "bg-rose-50",
    },
    {
      name: "Emoji Conv",
      icon: <Hash className="text-amber-500" />,
      slug: "emoji-converter",
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="hero-bg-custom pt-24 pb-16 md:pt-32 md:pb-32 border-b border-white/20 relative overflow-hidden">
      {/* Background Blobs remain same */}
      <div className="absolute top-[5%] left-[5%] w-48 h-48 bg-[#5D5FEF]/20 rounded-full blur-[80px] z-0" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-12 items-center relative z-10">
        {/* --- LEFT CONTENT (Remains similar but centered better) --- */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full"
            >
              <Zap size={14} className="text-[#5D5FEF]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5D5FEF]">
                26+ Professional Tools • Zero Latency
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-[900] text-[#1A1A1A] leading-[1.05] tracking-tight">
              Powerful tools, <br />
              built for <span className="text-[#5D5FEF]">Speed.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0">
              No servers. No uploads. No waiting. Your data stays in your
              browser while you work.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link href="/tools">
              <button className="bg-[#1E1F4B] text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-[#5D5FEF] transition-all shadow-xl">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>

        {/* --- RIGHT SIDE: FEATURED TOOLS GRID (REPLACES DROPZONE) --- */}
        <div className="w-full lg:w-[500px] grid grid-cols-2 gap-4">
          {featuredTools.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/tools/${tool.slug}`}>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group h-full">
                  <div
                    className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="font-black text-[#2D2E5F] text-sm uppercase tracking-tight">
                    {tool.name}
                  </h3>
                  <div className="mt-4 flex items-center text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Try Now <ArrowRight size={12} className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* A CTA Card inside the grid */}
          <Link href="/tools" className="col-span-2">
            <div className="bg-[#5D5FEF] p-6 rounded-[32px] flex items-center justify-between text-white group shadow-xl">
              <div>
                <p className="font-black text-xs uppercase tracking-widest">
                  View All Utilities
                </p>
                <p className="text-white/60 text-[11px] font-medium">
                  Explore the full directory
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full group-hover:translate-x-2 transition-transform">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
