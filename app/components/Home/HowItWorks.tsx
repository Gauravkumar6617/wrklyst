// components/Home/HowItWorks.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, HardDrive, Cpu } from "lucide-react";

const steps = [
  { 
    title: "Client-Side Import", 
    desc: "Your file is loaded into the browser's temporary memory (RAM), not our disks.", 
    icon: <HardDrive className="text-blue-500" /> 
  },
  { 
    title: "WASM Execution", 
    desc: "Binary code executes at near-native speeds directly in your browser tab.", 
    icon: <Cpu className="text-purple-500" /> 
  },
  { 
    title: "Instant Export", 
    desc: "The processed file is saved to your Downloads folder immediately.", 
    icon: <Zap className="text-amber-500" /> 
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#0F172A] rounded-[3rem] p-12 lg:p-24 relative overflow-hidden shadow-2xl">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-white/5" 
               style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                <ShieldCheck size={16} className="text-blue-400" />
                <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest">Architecture: Local-First</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Privacy isn't a feature. <br />
                <span className="text-slate-500 text-3xl md:text-5xl">It's our foundation.</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">
                Wrklyst uses WebAssembly to bring the server to your computer. No uploads. No leaks. No latency.
              </p>
            </div>

            <div className="grid gap-6">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 10 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-start gap-6 backdrop-blur-sm"
                >
                  <div className="bg-white/10 p-4 rounded-2xl shadow-inner">
                    {step.icon}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-white font-bold text-sm uppercase tracking-wider">{step.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}