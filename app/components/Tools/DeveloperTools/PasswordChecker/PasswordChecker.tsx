"use client";
import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Zap,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => {
    const checks = {
      length: password.length >= 12,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    if (!password)
      return {
        score: 0,
        entropy: 0,
        label: "Empty",
        color: "bg-slate-700",
        textColor: "text-slate-400",
        time: "0s",
        checks,
      };

    let poolSize = 0;
    if (checks.lower) poolSize += 26;
    if (checks.upper) poolSize += 26;
    if (checks.number) poolSize += 10;
    if (checks.special) poolSize += 32;

    const entropy = Math.floor(password.length * Math.log2(poolSize || 1));

    let score = 0;
    let label = "Very Weak";
    let color = "bg-rose-500";
    let textColor = "text-rose-500";
    let time = "Instantly";

    if (entropy > 80) {
      score = 4;
      label = "Bulletproof";
      color = "bg-emerald-500";
      textColor = "text-emerald-500";
      time = "Centuries";
    } else if (entropy > 60) {
      score = 3;
      label = "Strong";
      color = "bg-teal-500";
      textColor = "text-teal-500";
      time = "Years";
    } else if (entropy > 40) {
      score = 2;
      label = "Fair";
      color = "bg-amber-500";
      textColor = "text-amber-500";
      time = "Months";
    } else if (entropy > 20) {
      score = 1;
      label = "Weak";
      color = "bg-orange-500";
      textColor = "text-orange-500";
      time = "Minutes";
    }

    return { score, entropy, label, color, textColor, time, checks };
  }, [password]);

  return (
    /* Outer Container: p-0 for mobile, md:p-6 for desktop */
    <div className="max-w-4xl mx-auto p-0 md:p-6 lg:p-12 space-y-4 md:space-y-8">
      {/* 1. Main Input Area - Rounded-none for mobile edge-to-edge */}
      <div className="bg-slate-900 p-5 md:p-10 rounded-none md:rounded-[48px] shadow-2xl space-y-6">
        <div className="space-y-3">
          <label className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
            Security Analyzer
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 md:p-7 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl text-white font-mono text-base md:text-2xl outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-white/10"
              placeholder="Enter password..."
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 md:right-7 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between items-center px-1">
            <span
              className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${analysis.textColor}`}
            >
              {analysis.label}
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {analysis.entropy} bits
            </span>
          </div>
          <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full flex gap-1 md:gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 rounded-full transition-all duration-700 ease-out ${
                  step <= analysis.score ? analysis.color : "bg-white/5"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Real-time Checklist - Tighter grid for mobile */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 pt-4 border-t border-white/5">
          <CheckItem met={analysis.checks.length} label="12+ Characters" />
          <CheckItem met={analysis.checks.upper} label="Uppercase" />
          <CheckItem met={analysis.checks.lower} label="Lowercase" />
          <CheckItem met={analysis.checks.number} label="Number" />
          <CheckItem met={analysis.checks.special} label="Symbol" />
        </div>
      </div>

      {/* 2. Stats Grid - Reduced padding and gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 px-4 md:px-0">
        <StatCard
          icon={<Clock className="text-indigo-500" size={20} />}
          label="Time to Crack"
          value={analysis.time}
        />
        <StatCard
          icon={<Zap className="text-amber-500" size={20} />}
          label="Length"
          value={`${password.length} Chars`}
        />
      </div>

      {/* 3. Privacy Banner - Margin added for mobile since outer container is p-0 */}
      <div className="mx-4 md:mx-0 flex flex-col sm:flex-row items-center gap-3 p-4 md:p-6 bg-emerald-50 border border-emerald-100 rounded-2xl md:rounded-[32px] text-center sm:text-left">
        <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm shrink-0">
          <ShieldCheck size={18} className="text-emerald-600" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] md:text-xs font-black text-emerald-900 uppercase tracking-tight">
            Local Analysis
          </p>
          <p className="text-[10px] md:text-xs text-emerald-700/70 font-medium leading-tight">
            Analyzed locally. Your data never leaves this device.
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${met ? "text-emerald-400 bg-emerald-400/5" : "text-white/20"}`}
    >
      {met ? <CheckCircle2 size={12} /> : <Circle size={12} />}
      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider truncate">
        {label}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 md:p-6 bg-white border border-slate-100 rounded-2xl md:rounded-[32px] flex items-center gap-4 md:gap-6 shadow-sm">
      <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl shrink-0">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
