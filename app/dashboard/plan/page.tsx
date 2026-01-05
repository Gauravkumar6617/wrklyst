"use client";
import React from 'react';
import { Check, Zap, Star, ShieldCheck, ArrowRight } from 'lucide-react';

const PlanPage = () => {
  const features = [
    "Unlimited PDF Merging",
    "Up to 50MB per file",
    "High-speed processing",
    "Secure SSL encryption",
    "24/7 basic support"
  ];

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-[1000] text-[#1E1F4B] tracking-tighter">My Plan</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your subscription and view feature limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Current Plan Card */}
        <div className="md:col-span-3 bg-white rounded-[40px] p-10 border-2 border-[#5D5FEF] shadow-xl shadow-[#5D5FEF]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#5D5FEF] text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">
            Active Now
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#5D5FEF]/10 p-3 rounded-2xl text-[#5D5FEF]">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1E1F4B]">Starter Plan</h2>
              <p className="text-slate-400 font-bold text-sm">$0.00 / month</p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-600 font-semibold">
                <div className="bg-emerald-50 text-emerald-500 p-1 rounded-full">
                  <Check size={14} strokeWidth={4} />
                </div>
                {feature}
              </div>
            ))}
          </div>

          <button className="w-full py-4 bg-slate-50 text-slate-400 font-black rounded-2xl cursor-not-allowed border border-slate-100">
            Current Active Plan
          </button>
        </div>

        {/* Upgrade Teaser Card */}
        <div className="md:col-span-2 bg-[#1E1F4B] rounded-[40px] p-8 text-white flex flex-col justify-between h-full min-h-[400px]">
          <div>
            <div className="bg-white/10 w-fit p-3 rounded-2xl mb-6">
              <Star className="text-[#5D5FEF]" fill="#5D5FEF" size={24} />
            </div>
            <h3 className="text-2xl font-black mb-4 leading-tight">Wrklyst <br/><span className="text-[#5D5FEF]">Pro Plus</span></h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Unlock advanced OCR, larger file limits, and team collaboration features. 
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-[#5D5FEF]" />
                    <span className="text-xs font-black uppercase">Coming Soon</span>
                </div>
                <p className="text-[10px] text-slate-500">We are currently perfecting the Pro experience.</p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#5D5FEF] hover:bg-[#4a4ce0] text-white rounded-2xl font-black transition-all">
                Join Waitlist <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;