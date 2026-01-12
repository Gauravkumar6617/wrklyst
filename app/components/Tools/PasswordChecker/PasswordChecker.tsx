"use client";
import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Clock,
} from "lucide-react";

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => {
    if (!password)
      return {
        score: 0,
        entropy: 0,
        label: "Empty",
        color: "bg-slate-200",
        time: "0s",
      };

    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

    const entropy = Math.floor(password.length * Math.log2(poolSize));

    let score = 0;
    let label = "Very Weak";
    let color = "bg-rose-500";
    let time = "Instantly";

    if (entropy > 80) {
      score = 4;
      label = "Bulletproof";
      color = "bg-emerald-500";
      time = "Centuries";
    } else if (entropy > 60) {
      score = 3;
      label = "Strong";
      color = "bg-teal-500";
      time = "Years";
    } else if (entropy > 40) {
      score = 2;
      label = "Fair";
      color = "bg-amber-500";
      time = "Days";
    } else if (entropy > 20) {
      score = 1;
      label = "Weak";
      color = "bg-orange-500";
      time = "Minutes";
    }

    return { score, entropy, label, color, time };
  }, [password]);

  return (
    <div className="space-y-8">
      {/* 1. Main Input Area */}
      <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">
            Analyze Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-white font-mono text-xl outline-none focus:border-[#5D5FEF]/50 transition-all"
              placeholder="Type a password..."
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              Strength: {analysis.label}
            </span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              {analysis.entropy} Bits of Entropy
            </span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 rounded-full transition-all duration-500 ${step <= analysis.score ? analysis.color : "bg-white/5"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] flex items-center gap-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <Clock className="text-[#5D5FEF]" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Estimated Crack Time
            </p>
            <p className="text-2xl font-black text-slate-800">
              {analysis.time}
            </p>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] flex items-center gap-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <Zap className="text-amber-500" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Character Length
            </p>
            <p className="text-2xl font-black text-slate-800">
              {password.length} Characters
            </p>
          </div>
        </div>
      </div>

      {/* 3. Security Warning */}
      <div className="flex items-center gap-3 p-6 bg-emerald-50 border border-emerald-100 rounded-[32px] text-emerald-700 text-xs font-bold">
        <ShieldCheck size={18} className="shrink-0" />
        All processing is done in your browser. We never save or transmit your
        passwords.
      </div>
    </div>
  );
}
