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
import { motion, AnimatePresence } from "framer-motion";

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

      if (result.status === "success") {
        setData(result.data);
      }
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
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-[#020617] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
            Status: System Online
          </span>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Network <span className="text-emerald-400">Core</span>
          </h1>
        </div>

        <button
          onClick={fetchIpData}
          disabled={loading}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-white rounded-3xl font-bold transition-all shadow-xl active:scale-95"
        >
          <RefreshCcw
            size={18}
            className={`${loading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`}
          />
          {loading ? "Rerouting..." : "Execute New Trace"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: PRIMARY IP DATA (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main IP Card */}
          {/* Main IP Card */}
          <div className="bg-[#0B0F1A] border border-slate-800 rounded-[48px] p-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe size={240} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Radio className="text-emerald-500 animate-pulse" size={16} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">
                  Global Dual-Stack Trace
                </span>
              </div>

              {/* Primary Huge Display */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">
                  Primary Uplink ({data?.current_version})
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter break-all">
                    {loading ? "---.---.---.---" : data?.primary_ip}
                  </h2>
                  <button
                    onClick={() => copyToClipboard(data?.primary_ip)}
                    className="w-fit p-4 bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all"
                  >
                    <Copy size={24} />
                  </button>
                </div>
              </div>

              {/* Secondary IP (The other version) */}
              <div className="mt-8 p-6 bg-slate-900/50 border-l-2 border-emerald-500 rounded-r-2xl max-w-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                      Secondary Protocol (
                      {data?.current_version === "IPv4" ? "IPv6" : "IPv4"})
                    </p>
                    <p className="text-md font-mono font-bold text-slate-300 break-all">
                      {loading
                        ? "Detecting..."
                        : data?.current_version === "IPv4"
                          ? data?.ipv6 || "No IPv6 detected"
                          : data?.ipv4 || "No IPv4 detected"}
                    </p>
                  </div>
                  {(data?.ipv6 || data?.ipv4) && (
                    <button
                      onClick={() =>
                        copyToClipboard(
                          data?.current_version === "IPv4"
                            ? data?.ipv6
                            : data?.ipv4,
                        )
                      }
                      className="p-2 text-slate-600 hover:text-emerald-400 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Protocol
                  </p>
                  <p className="text-sm font-bold text-emerald-400">
                    {data?.version || "IPv4"}
                  </p>
                </div>
                <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Decimal
                  </p>
                  <p className="text-sm font-bold text-white">
                    {data?.decimal || "---"}
                  </p>
                </div>
                <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Network Latency
                  </p>
                  <p className="text-sm font-bold text-blue-400">
                    {latency ? `${latency}ms` : "---"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Proxy Analytics */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityCard
              label="VPN / Proxy Shield"
              active={data?.security?.is_vpn}
              icon={
                data?.security?.is_vpn ? (
                  <Lock className="text-red-400" />
                ) : (
                  <Unlock className="text-emerald-400" />
                )
              }
              statusText={
                data?.security?.is_vpn
                  ? "Active Protection / Tunnel"
                  : "Direct Connection"
              }
            />
            <SecurityCard
              label="Datacenter / Hosting"
              active={data?.security?.is_hosting}
              icon={<Server className="text-blue-400" />}
              statusText={
                data?.security?.is_hosting
                  ? "Commercial Node"
                  : "Residential User"
              }
            />
          </div>
        </div>

        {/* RIGHT COLUMN: GEO & ISP (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Geo Card */}
          <div className="bg-emerald-500 p-10 rounded-[48px] text-[#0B0F1A] shadow-xl shadow-emerald-500/10 relative overflow-hidden group">
            <MapPin
              className="mb-6 group-hover:scale-110 transition-transform duration-500"
              size={40}
            />
            <p className="text-[11px] font-black uppercase tracking-widest opacity-60">
              Physical Uplink
            </p>
            <h3 className="text-3xl font-black mt-2 leading-tight tracking-tight">
              {data?.location?.city || "Detecting..."}, <br />{" "}
              {data?.location?.country || "Earth"}
            </h3>

            <div className="mt-8 pt-8 border-t border-[#0B0F1A]/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase">
                  Coordinates
                </span>
                <span className="text-sm font-mono font-bold tracking-tighter">
                  {data?.location?.latitude?.toFixed(4) || "0.000"},{" "}
                  {data?.location?.longitude?.toFixed(4) || "0.000"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase">
                  Timezone
                </span>
                <span className="text-sm font-bold">
                  {data?.location?.timezone || "UTC"}
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Card */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Cpu className="text-blue-400" size={20} />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-widest">
                AS Information
              </span>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Organization / ISP
              </p>
              <p className="text-md font-bold text-slate-200 truncate">
                {data?.network?.isp || "Identifying ISP..."}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase">
                AS Number
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-mono text-blue-400">
                AS{data?.network?.asn || "0000"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* EDUCATIONAL GLOSSARY SECTION */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-800">
        <InfoItem
          icon={<Zap size={18} className="text-yellow-400" />}
          title="What is Latency?"
          desc="The time it takes for data to travel from your device to our server and back. Lower is better."
        />
        <InfoItem
          icon={<Compass size={18} className="text-indigo-400" />}
          title="Geo-IP Precision"
          desc="Location data is estimated based on database records provided by your ISP. It's rarely pinpoint accurate."
        />
        <InfoItem
          icon={<Activity size={18} className="text-rose-400" />}
          title="ASN Intelligence"
          desc="Autonomous System Numbers identify the massive networks that make up the backbone of the internet."
        />
      </div>
    </div>
  );
}

function SecurityCard({ label, active, icon, statusText }: any) {
  return (
    <div className="p-8 bg-[#0B0F1A] border border-slate-800 rounded-[32px] hover:border-slate-700 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-slate-900 rounded-2xl shadow-inner">{icon}</div>
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-bold ${active ? "text-red-400" : "text-emerald-400"}`}
      >
        {statusText}
      </p>
    </div>
  );
}

function InfoItem({ icon, title, desc }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-white font-black uppercase text-[10px] tracking-[2px]">
          {title}
        </h4>
      </div>
      <p className="text-slate-500 text-xs font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
