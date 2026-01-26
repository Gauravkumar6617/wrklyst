"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  MapPin,
  Globe,
  Server,
  Cpu,
  Copy,
  RefreshCcw,
  Network,
  Lock,
  Unlock,
  Radio,
  Zap,
  Activity,
  Compass,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function IpChecker() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);

  const fetchIpData = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/v1/utilities/ip-checker");
      const result = await res.json();
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      if (result.status === "success") setData(result.data);
    } catch (err) {
      toast.error("Network trace failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpData();
  }, []);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-10 space-y-8">
        {/* HEADER: Stacked on mobile, row on desktop */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                System Live
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Network<span className="text-emerald-400">Core</span>
            </h1>
          </div>

          <button
            onClick={fetchIpData}
            disabled={loading}
            className="w-full md:w-auto px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-white flex items-center justify-center gap-3 hover:border-emerald-500/50 transition-all active:scale-95 shadow-2xl"
          >
            <RefreshCcw
              size={18}
              className={`${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Tracing..." : "Execute New Trace"}
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            {/* IP DISPLAY CARD */}
            <section className="relative overflow-hidden bg-[#0B0F1A] border border-slate-800 rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-2xl">
              <div className="relative z-10 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Radio size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[3px]">
                      Uplink Identified
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-emerald-500/50 uppercase">
                        Primary {data?.current_version}
                      </p>
                      <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter break-all leading-[1.1]">
                        {loading ? "0.0.0.0" : data?.primary_ip}
                      </h2>
                    </div>

                    <button
                      onClick={() => copyToClipboard(data?.primary_ip)}
                      className="flex items-center justify-center gap-2 w-full md:w-fit px-4 py-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors text-sm font-bold"
                    >
                      <Copy size={16} /> Copy Address
                    </button>
                  </div>
                </div>

                {/* Secondary Protocol Area */}
                <div className="p-4 md:p-6 bg-slate-950/50 rounded-2xl border-l-4 border-emerald-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                      Backup Protocol
                    </p>
                    <p className="font-mono text-sm md:text-base text-slate-300 truncate">
                      {data?.ipv6 || "No secondary route detected"}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(data?.ipv6)}
                    className="p-2 text-slate-600 hover:text-emerald-400 self-end md:self-auto"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                {/* Micro Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <StatBox
                    label="Protocol"
                    value={data?.version || "IPv4"}
                    color="text-emerald-400"
                  />
                  <StatBox
                    label="Latency"
                    value={latency ? `${latency}ms` : "---"}
                    color="text-blue-400"
                  />
                  <StatBox
                    label="Status"
                    value="Encrypted"
                    color="text-slate-400"
                    className="col-span-2 sm:col-span-1"
                  />
                </div>
              </div>

              {/* Background Decoration - Hidden on small mobile to prevent overlap issues */}
              <Globe
                size={300}
                className="absolute -bottom-20 -right-20 text-white/[0.02] hidden sm:block pointer-events-none"
              />
            </section>

            {/* SECURITY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SecurityTile
                label="VPN / Proxy"
                active={data?.security?.is_vpn}
                icon={
                  data?.security?.is_vpn ? (
                    <Lock size={20} />
                  ) : (
                    <Unlock size={20} />
                  )
                }
                status={data?.security?.is_vpn ? "Protected" : "Direct"}
              />
              <SecurityTile
                label="Node Type"
                active={data?.security?.is_hosting}
                icon={<Server size={20} />}
                status={
                  data?.security?.is_hosting ? "Data Center" : "Residential"
                }
              />
            </div>
          </div>

          {/* RIGHT COLUMN: GEO & ISP */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-emerald-500 rounded-[32px] md:rounded-[40px] p-8 text-slate-950 shadow-lg shadow-emerald-500/10">
              <MapPin size={32} className="mb-6" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Physical Origin
              </p>
              <h3 className="text-3xl font-black tracking-tighter leading-tight mt-1">
                {data?.location?.city || "Unknown"},<br />
                {data?.location?.country || "Earth"}
              </h3>

              <div className="mt-8 space-y-4 border-t border-black/10 pt-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                  <span className="opacity-60">Coords</span>
                  <span>
                    {data?.location?.latitude?.toFixed(2)},{" "}
                    {data?.location?.longitude?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                  <span className="opacity-60">Timezone</span>
                  <span>{data?.location?.timezone || "UTC"}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Cpu size={18} />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  ISP Intelligence
                </span>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Organization
                </p>
                <p className="text-lg font-bold text-white truncate">
                  {data?.network?.isp || "Scanning..."}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  ASN
                </span>
                <span className="font-mono text-xs text-blue-400 bg-blue-500/5 px-2 py-1 rounded">
                  AS{data?.network?.asn || "000"}
                </span>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS FOR CLEANER CODE */

function StatBox({ label, value, color, className = "" }: any) {
  return (
    <div
      className={`p-4 bg-slate-900/50 border border-slate-800 rounded-2xl ${className}`}
    >
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-sm font-black ${color}`}>{value}</p>
    </div>
  );
}

function SecurityTile({ label, active, icon, status }: any) {
  return (
    <div className="p-5 bg-[#0B0F1A] border border-slate-800 rounded-2xl flex items-center gap-4 transition-all hover:border-slate-700">
      <div
        className={`p-3 rounded-xl ${active ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`text-sm font-bold ${active ? "text-red-400" : "text-emerald-400"}`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}
