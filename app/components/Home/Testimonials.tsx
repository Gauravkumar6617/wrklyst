// components/Home/Testimonials.tsx
"use client";

import { useState } from 'react';
import { MessageSquarePlus, Star, Quote, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

const REVIEWS = [
  {
    initials: "SJ",
    name: "Sarah Jenkins",
    role: "Creative Director",
    text: "Wrklyst transformed my workflow! Simple yet powerful. I can merge and compress my client reports in seconds without losing quality.",
    color: "bg-indigo-500"
  },
  {
    initials: "AM",
    name: "Alex Miller",
    role: "Freelance Analyst",
    text: "The data extraction tools are a lifesaver. Being able to request new features and actually seeing them added is incredible.",
    color: "bg-emerald-500"
  },
  {
    initials: "HK",
    name: "Hanna Kim",
    role: "Legal Assistant",
    text: "Finally, a tool that processes everything locally in my browser. Secure, fast, and getting better every single week.",
    color: "bg-amber-500"
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const nextReview = () => setCurrent((prev) => (prev + 1) % REVIEWS.length);
  const prevReview = () => setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);

  return (
    <section className="py-24 bg-[#F8FAFC]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 text-[#5D5FEF] font-bold text-[10px] uppercase tracking-[0.3em] bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Star size={12} fill="#5D5FEF" /> User Feedback
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#2D2E5F] tracking-tighter">
            Help us build <span className="text-[#5D5FEF]">Wrklyst.</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium italic">
            "No stock photos. Just real words from early adopters helping us improve."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* 1. The Dynamic Review Slider */}
          <div className="bg-white p-10 md:p-14 rounded-[48px] shadow-xl shadow-slate-200/50 border border-white relative flex flex-col justify-between overflow-hidden group">
            <Quote className="absolute -top-4 -left-4 w-32 h-32 text-slate-50 group-hover:text-blue-50 transition-colors duration-500" />
            
            <div className="relative z-10 min-h-[220px]">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="#FACC15" className="text-yellow-400" />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p 
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed"
                >
                  "{REVIEWS[current].text}"
                </motion.p>
              </AnimatePresence>
            </div>
            
            <div className="relative z-10 flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-4">
                {/* Letter Avatar instead of Image */}
                <div className={`w-14 h-14 rounded-2xl ${REVIEWS[current].color} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200`}>
                  {REVIEWS[current].initials}
                </div>
                <div>
                  <p className="font-black text-[#2D2E5F]">{REVIEWS[current].name}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{REVIEWS[current].role}</p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex gap-2">
                <button onClick={prevReview}  aria-label="Previous review"className="p-3 bg-slate-50 rounded-xl hover:bg-[#5D5FEF] hover:text-white transition-all">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextReview} aria-label="Next review"className="p-3 bg-slate-50 rounded-xl hover:bg-[#5D5FEF] hover:text-white transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. THE FEEDBACK CTA */}
          <div className="bg-[#1E1F4B] p-10 md:p-14 rounded-[48px] shadow-2xl shadow-[#1E1F4B]/20 relative flex flex-col justify-center text-center lg:text-left overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5D5FEF] opacity-10 blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-[#5D5FEF]/20 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 text-blue-400 border border-blue-500/20">
                <MessageSquarePlus size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Be our next reviewer.
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  We are building Wrklyst for you. If a tool is missing or something isn't working right, 
                  tell us. We actually listen.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/contact?subject=Review" 
                  className="flex-1 bg-[#5D5FEF] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-[#1E1F4B] transition-all active:scale-95 shadow-lg shadow-black/20"
                >
                  Post a Review <Send size={16} />
                </Link>
                <Link 
                  href="/contact?subject=Request" 
                  className="flex-1 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                >
                  Request a Tool
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}