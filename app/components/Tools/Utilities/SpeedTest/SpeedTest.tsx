"use client";
import React, { useState } from "react";
import {
  Gauge,
  Zap,
  ArrowDown,
  ArrowUp,
  Activity,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function SpeedTest() {
  const [status, setStatus] = useState<
    "idle" | "ping" | "download" | "upload" | "finished"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    ping: 0,
    jitter: 0,
    download: 0,
    upload: 0,
  });

  const runAdvancedTest = async () => {
    setMetrics({ ping: 0, jitter: 0, download: 0, upload: 0 });
    setProgress(0);

    const API_URL = "/api/v1/utilities/speed-test/download";

    // --- 1. PING & JITTER ---
    setStatus("ping");
    const pings: number[] = [];
    for (let i = 0; i < 8; i++) {
      const start = performance.now();
      try {
        await fetch(API_URL, {
          method: "HEAD",
          cache: "no-store",
        });
        pings.push(performance.now() - start);
      } catch (e) {
        pings.push(100); // Fallback
      }
      setProgress((i + 1) * 12.5);
    }

    const avgPing = pings.reduce((a, b) => a + b) / pings.length;
    const calculatedJitter = Math.max(...pings) - Math.min(...pings);

    setMetrics((p) => ({
      ...p,
      ping: Math.round(avgPing),
      jitter: Math.round(calculatedJitter),
    }));

    // --- 2. DOWNLOAD TEST ---
    setStatus("download");
    setProgress(0);
    const dlStart = performance.now();
    try {
      const response = await fetch(`${API_URL}?t=${Date.now()}`);
      const reader = response.body?.getReader();
      const totalSize =
        Number(response.headers.get("Content-Length")) || 52428800;
      let received = 0;
      let lastUpdate = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          received += value.length;

          const now = performance.now();
          const elapsed = (now - dlStart) / 1000;

          if (elapsed > 0.5 && now - lastUpdate > 100) {
            const stableElapsed = elapsed - 0.2;
            const mbps = (received * 8) / stableElapsed / 1000000;
            const realisticMbps = mbps > 1000 ? 940 : mbps;

            setMetrics((p) => ({
              ...p,
              download: Number(realisticMbps.toFixed(2)),
            }));
            setProgress(Math.min((received / totalSize) * 100, 100));
            lastUpdate = now;
          }
        }
      }
    } catch (e) {
      console.error("Download failed", e);
    }

    // --- 3. UPLOAD TEST ---
    setStatus("upload");
    setProgress(0);

    const uploadSize = 8 * 1024 * 1024;
    const dummyData = new Uint8Array(uploadSize);
    crypto.getRandomValues(dummyData.subarray(0, 64000));

    const ulStart = performance.now();
    try {
      await fetch(API_URL, {
        method: "POST",
        body: dummyData,
        cache: "no-store",
      });

      const ulDuration = (performance.now() - ulStart) / 1000;
      const ulMbps = (uploadSize * 8) / ulDuration / 1000000;

      setMetrics((p) => ({ ...p, upload: Number(ulMbps.toFixed(2)) }));
    } catch (e) {
      console.error("Upload failed", e);
    }

    setProgress(100);
    setStatus("finished");

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#ffffff"],
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-black tracking-widest uppercase border border-indigo-500/20 shadow-sm">
            Wrklyst Velocity Engine
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-4 tracking-tighter">
            Network <span className="text-indigo-500">Speed Diagnostics</span>
          </h1>
        </header>

        <div className="bg-[#0F172A] rounded-[56px] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Gauge size={300} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* LEFT: Live Gauge */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-indigo-500 fill-none"
                    strokeWidth="12"
                    strokeDasharray="283"
                    animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="text-center">
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl md:text-8xl font-black text-white tabular-nums"
                  >
                    {status === "download"
                      ? metrics.download
                      : status === "upload"
                        ? metrics.upload
                        : metrics.ping || "0"}
                  </motion.div>
                  <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
                    {status === "ping"
                      ? "ms"
                      : status === "idle"
                        ? "READY"
                        : "Mbps"}
                  </p>
                </div>
              </div>

              <p className="mt-8 text-indigo-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                {status === "idle" ? "System Idle" : `${status}ing Phase...`}
              </p>
            </div>

            {/* RIGHT: Detailed Metrics (Download and Upload hidden) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <MetricCard
                icon={<Activity size={20} className="text-blue-400" />}
                label="Latency (Ping)"
                value={metrics.ping}
                unit="ms"
                active={status === "ping"}
              />
              <MetricCard
                icon={<Zap size={20} className="text-yellow-400" />}
                label="Jitter"
                value={metrics.jitter}
                unit="ms"
                active={status === "ping"}
              />

              <div className="col-span-2 pt-6">
                <button
                  onClick={runAdvancedTest}
                  disabled={status !== "idle" && status !== "finished"}
                  className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl
                    ${status === "finished" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"}
                    disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
                  `}
                >
                  {status === "idle" ? (
                    <>
                      <RefreshCw size={20} /> Run Global Test
                    </>
                  ) : status === "finished" ? (
                    <>
                      <CheckCircle2 size={20} /> Retest Connection
                    </>
                  ) : (
                    "Analyzing Data..."
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EDUCATIONAL FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-6">
          <InfoItem
            title="Ping"
            desc="The reaction time of your connection—how fast you get a response after sending a request."
          />
          <InfoItem
            title="Jitter"
            desc="The variance in ping over time. High jitter causes buffering and lag in gaming/calls."
          />
          <InfoItem
            title="Throughput"
            desc="Mbps represents how much data can be transferred per second. Higher is better."
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, active }: any) {
  return (
    <div
      className={`p-6 rounded-[32px] border transition-all duration-500 flex flex-col items-center justify-center ${active ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg" : "bg-slate-900/50 border-slate-800"}`}
    >
      <div className="mb-3">{icon}</div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-white tabular-nums">
        {value}
        <span className="text-xs text-slate-600 ml-1 font-bold">{unit}</span>
      </p>
    </div>
  );
}

function InfoItem({ title, desc }: any) {
  return (
    <div className="space-y-2">
      <h4 className="text-indigo-400 font-black uppercase text-xs tracking-widest">
        {title}
      </h4>
      <p className="text-slate-500 text-xs font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
