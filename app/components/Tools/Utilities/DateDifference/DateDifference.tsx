"use client";
import React, { useState } from "react";
import {
  Calendar,
  Timer,
  ArrowRightLeft,
  Sparkles,
  Hourglass,
  ChevronRight,
  Star,
  Clock,
  Trophy,
  CalendarDays,
  Edit3,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function DateDifference() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      return {
        y: 0,
        m: 0,
        d: 0,
        totalDays: 0,
        weeks: 0,
        workDays: 0,
        weekends: 0,
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Precise Y/M/D
    const early = start < end ? start : end;
    const late = start < end ? end : start;

    let y = late.getFullYear() - early.getFullYear();
    let m = late.getMonth() - early.getMonth();
    let d = late.getDate() - early.getDate();

    if (d < 0) {
      m--;
      d += new Date(late.getFullYear(), late.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    // Workdays vs Weekends
    let workDays = 0;
    let weekends = 0;
    let tempDate = new Date(early);
    while (tempDate < late) {
      const day = tempDate.getDay();
      if (day === 0 || day === 6) weekends++;
      else workDays++;
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return {
      y,
      m,
      d,
      totalDays,
      weeks: Math.floor(totalDays / 7),
      workDays,
      weekends,
    };
  };

  const diff = calculateDifference();
  const isActive = !!(startDate && endDate);

  const handleDateChange = (type: "start" | "end", val: string) => {
    if (type === "start") setStartDate(val);
    else setEndDate(val);

    if (startDate && endDate && val) {
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { x: 0.8, y: 0.5 },
        colors: ["#6366f1", "#8b5cf6", "#3b82f6"],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black tracking-widest uppercase italic">
            Wrklyst Chronos Engine
          </span>
          <h1 className="text-5xl font-black text-[#1E1F4B] mt-4 tracking-tighter">
            Date <span className="text-indigo-600">Difference</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: PERSISTENT CONTROL PANEL */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            <div className="bg-[#1E1F4B] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
              <ArrowRightLeft className="absolute -top-6 -right-6 text-white opacity-5 w-40 h-40" />

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-indigo-500 rounded-xl">
                  <CalendarDays size={18} />
                </div>
                Date Range
              </h2>

              <div className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <label className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-3 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/10 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-400 transition-all"
                      value={startDate}
                      onChange={(e) =>
                        handleDateChange("start", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex justify-center -my-3 relative z-20">
                    <div className="bg-indigo-500 p-2 rounded-full border-4 border-[#1E1F4B] shadow-lg">
                      <ArrowRight
                        className="rotate-90 lg:rotate-0 text-white"
                        size={20}
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <label className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-3 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/10 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-400 transition-all"
                      value={endDate}
                      onChange={(e) => handleDateChange("end", e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                    Calculated Gap
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-4xl font-black transition-all ${isActive ? "text-white" : "text-white/10"}`}
                    >
                      {diff.totalDays.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-indigo-400 uppercase">
                      Total Days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-6 bg-white rounded-[40px] border border-slate-100 flex items-center gap-4 shadow-sm">
              <ShieldCheck className="text-indigo-500" size={24} />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                Instant Local Computation
              </p>
            </div>
          </div>

          {/* RIGHT: ALWAYS-ON DASHBOARD */}
          <div className="lg:col-span-8 space-y-6">
            {/* THE PRECISE BREAKDOWN */}
            <div className="bg-white p-10 rounded-[56px] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
              <MetricUnit
                value={diff.y}
                label="Years"
                color="text-indigo-600"
                active={isActive}
              />
              <MetricUnit
                value={diff.m}
                label="Months"
                color="text-purple-600"
                active={isActive}
              />
              <MetricUnit
                value={diff.d}
                label="Days"
                color="text-pink-600"
                active={isActive}
              />
            </div>

            {/* TOTALS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SmallCard
                label="Total Weeks"
                value={diff.weeks.toLocaleString()}
                icon={<Trophy size={16} />}
                active={isActive}
              />
              <SmallCard
                label="Total Days"
                value={diff.totalDays.toLocaleString()}
                icon={<Zap size={16} />}
                active={isActive}
              />
              <SmallCard
                label="Hours"
                value={(diff.totalDays * 24).toLocaleString()}
                icon={<Clock size={16} />}
                active={isActive}
              />
              <SmallCard
                label="Minutes"
                value={(diff.totalDays * 1440).toLocaleString()}
                icon={<Timer size={16} />}
                active={isActive}
              />
            </div>

            {/* WORK LIFE BALANCE CARD */}
            <div
              className={`p-10 rounded-[56px] border transition-all duration-500 grid grid-cols-1 md:grid-cols-2 gap-10 ${isActive ? "bg-[#1E1F4B] border-white/10 shadow-2xl" : "bg-slate-50 border-slate-100 opacity-40 grayscale"}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <Briefcase size={18} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Business Breakdown
                  </h3>
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  Calculation includes leap years and handles inverted date
                  orders automatically.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-3xl font-black text-emerald-400">
                    {diff.workDays.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-black text-slate-400 uppercase mt-1">
                    Workdays
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-3xl font-black text-rose-400">
                    {diff.weekends.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-black text-slate-400 uppercase mt-1">
                    Weekend Days
                  </p>
                </div>
              </div>
            </div>

            {/* FUN FACT FOOTER */}
            <div
              className={`p-8 rounded-[40px] border flex items-center gap-6 ${isActive ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100 opacity-40"}`}
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-500">
                <Star fill="currentColor" />
              </div>
              <p className="text-slate-600 text-sm font-medium">
                Did you know? This gap represents exactly{" "}
                <span className="font-black text-amber-600 tracking-tighter">
                  {isActive ? (diff.totalDays / 365).toFixed(2) : "0.00"}
                </span>{" "}
                Solar Years.
              </p>
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
    <div className="text-center md:border-r last:border-none border-slate-100 py-2">
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
      className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-36 transition-all ${!active && "opacity-30"}`}
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
