"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Timer,
  Cake,
  Sparkles,
  Hourglass,
  ChevronRight,
  Star,
  Clock,
  Trophy,
  Heart,
  X,
  Activity,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [now, setNow] = useState(new Date());

  // Real-time tick
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateMetrics = () => {
    // If no date, return "Empty" state instead of null
    if (!birthDate) {
      return {
        y: 0,
        m: 0,
        d: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        daysUntil: 0,
      };
    }

    const birth = new Date(birthDate);
    const diff = now.getTime() - birth.getTime();

    // Handle future dates
    if (diff < 0)
      return {
        y: 0,
        m: 0,
        d: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        daysUntil: 0,
      };

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();

    if (d < 0) {
      m--;
      d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    let nextBday = new Date(
      now.getFullYear(),
      birth.getMonth(),
      birth.getDate(),
    );
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysUntil = Math.ceil(
      (nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return { y, m, d, weeks, days, hours, minutes, seconds, daysUntil };
  };

  const metrics = calculateMetrics();

  const handleDateChange = (val: string) => {
    setBirthDate(val);
    if (val) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.7, y: 0.5 },
        colors: ["#6366f1", "#F43F5E", "#10B981"],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black tracking-widest uppercase italic">
            Wrklyst Real-Time Engine
          </span>
          <h1 className="text-5xl font-black text-[#1E1F4B] mt-4 tracking-tighter">
            Life <span className="text-indigo-600">Statistics</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: PERMANENT INPUT PANEL */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            <div className="bg-[#1E1F4B] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap size={100} />
              </div>

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-indigo-500 rounded-xl">
                  <Edit3 size={18} />
                </div>
                Control Panel
              </h2>

              <div className="space-y-8 relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <label className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.2em] mb-4 block">
                    Birth Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-white/10 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-400 transition-all"
                    value={birthDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                </div>

                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4">
                  <Cake
                    className={birthDate ? "text-emerald-400" : "text-white/20"}
                    size={28}
                  />
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      Next Birthday
                    </p>
                    <p className="text-xl font-black">
                      {metrics.daysUntil}{" "}
                      <span className="text-xs opacity-40">Days</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-6 bg-white rounded-[32px] border border-slate-100 flex items-center gap-4 shadow-sm">
              <ShieldCheck className="text-indigo-500" size={24} />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                Your data Never Leaves your System
              </p>
            </div>
          </div>

          {/* RIGHT: ALWAYS OPEN DASHBOARD */}
          <div className="lg:col-span-8 space-y-6">
            {/* CORE TRIO */}
            <div className="bg-white p-10 rounded-[56px] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
              <MetricUnit
                value={metrics.y}
                label="Years"
                color="text-indigo-600"
                active={!!birthDate}
              />
              <MetricUnit
                value={metrics.m}
                label="Months"
                color="text-purple-600"
                active={!!birthDate}
              />
              <MetricUnit
                value={metrics.d}
                label="Days"
                color="text-pink-600"
                active={!!birthDate}
              />
            </div>

            {/* SMALL STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SmallCard
                label="Total Weeks"
                value={metrics.weeks.toLocaleString()}
                icon={<Trophy size={16} />}
                active={!!birthDate}
              />
              <SmallCard
                label="Total Days"
                value={metrics.days.toLocaleString()}
                icon={<Zap size={16} />}
                active={!!birthDate}
              />
              <SmallCard
                label="Total Hours"
                value={metrics.hours.toLocaleString()}
                icon={<Activity size={16} />}
                active={!!birthDate}
              />
              <SmallCard
                label="Total Minutes"
                value={metrics.minutes.toLocaleString()}
                icon={<Timer size={16} />}
                active={!!birthDate}
              />
            </div>

            {/* LIVE SECOND TICKER */}
            <div className="bg-[#1E1F4B] p-10 rounded-[56px] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                <Clock size={150} />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">
                  Total Seconds Elapsed
                </p>
                <h4
                  className={`text-5xl md:text-6xl font-mono font-black tabular-nums ${!birthDate && "opacity-20 animate-pulse"}`}
                >
                  {metrics.seconds.toLocaleString()}
                </h4>
              </div>
              <div className="hidden md:flex flex-col items-center gap-2 p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md">
                <Star
                  className={
                    birthDate
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-white/10"
                  }
                />
                <p className="text-[10px] font-black uppercase tracking-tighter">
                  Life Clock
                </p>
              </div>
            </div>

            {/* VITAL CONTRIBUTIONS */}
            <div
              className={`p-10 rounded-[56px] border transition-all duration-500 flex flex-col md:flex-row items-center gap-8 ${birthDate ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100 grayscale opacity-50"}`}
            >
              <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center shadow-sm shrink-0">
                <Heart
                  className={`text-rose-500 ${birthDate && "animate-pulse"}`}
                  fill={birthDate ? "currentColor" : "none"}
                  size={32}
                />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#1E1F4B]">
                  Vital Contributions
                </h3>
                <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed">
                  Since your birth, you have breathed approximately{" "}
                  <span className="font-black text-indigo-600">
                    {(metrics.minutes * 16).toLocaleString()}
                  </span>{" "}
                  times and your heart has beaten roughly{" "}
                  <span className="font-black text-indigo-600">
                    {(metrics.minutes * 72).toLocaleString()}
                  </span>{" "}
                  times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* UI COMPONENTS */

function MetricUnit({ value, label, color, active }: any) {
  return (
    <div className="text-center md:border-r last:border-none border-slate-100 py-4">
      <p
        className={`text-7xl font-black tracking-tighter transition-all ${color} ${!active && "opacity-10 scale-90"}`}
      >
        {value}
      </p>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">
        {label}
      </p>
    </div>
  );
}

function SmallCard({ label, value, icon, active }: any) {
  return (
    <div
      className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-36 transition-all ${!active && "opacity-40"}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-300"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-black text-[#1E1F4B]">{value}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}

function Edit3({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
