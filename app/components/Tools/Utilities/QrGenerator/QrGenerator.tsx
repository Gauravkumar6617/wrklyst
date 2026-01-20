"use client";
import React, { useState, useEffect } from "react";
import {
  QrCode,
  Download,
  Link as LinkIcon,
  Wifi,
  AlignLeft,
  Palette,
  ShieldCheck,
  Maximize,
} from "lucide-react";
import { toast } from "react-hot-toast";

type Mode = "url" | "wifi" | "text";

export default function QrGenerator() {
  const [mode, setMode] = useState<Mode>("url");
  const [content, setContent] = useState("https://wrklyst.com");
  const [wifi, setWifi] = useState({ ssid: "", pass: "", security: "WPA" });
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkColor, setDarkColor] = useState("#1E1F4B");

  const generateQR = async () => {
    let finalContent = content;

    if (mode === "wifi") {
      if (!wifi.ssid) return;
      finalContent = `WIFI:T:${wifi.security};S:${wifi.ssid};P:${wifi.pass};;`;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/utilities/qr-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: finalContent,
          options: { darkColor, scale: 12 },
        }),
      });
      const result = await res.json();
      if (result.status === "success") {
        setQrImage(result.data.qr_code);
      }
    } catch (err) {
      toast.error("Failed to sync with QR engine");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(generateQR, 400);
    return () => clearTimeout(timer);
  }, [content, wifi, darkColor, mode]);

  const handleDownload = () => {
    if (!qrImage) return;
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = `wrklyst_qr_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Configuration Panel */}
        <div className="p-10 lg:w-3/5 space-y-8 border-r border-slate-50">
          <div>
            <h2 className="text-3xl font-black text-[#1E1F4B]">
              QR Studio{" "}
              <span className="text-indigo-600 text-sm align-top">PRO</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              High-Resolution Static QR Generation
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-3xl gap-1">
            <TabBtn
              active={mode === "url"}
              onClick={() => setMode("url")}
              icon={<LinkIcon size={16} />}
              label="URL"
            />
            <TabBtn
              active={mode === "wifi"}
              onClick={() => setMode("wifi")}
              icon={<Wifi size={16} />}
              label="WiFi"
            />
            <TabBtn
              active={mode === "text"}
              onClick={() => setMode("text")}
              icon={<AlignLeft size={16} />}
              label="Text"
            />
          </div>

          <div className="space-y-6">
            {mode === "wifi" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
                <Input
                  label="Network Name (SSID)"
                  placeholder="e.g. Home_Wifi"
                  onChange={(val: string) => setWifi({ ...wifi, ssid: val })}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(val: string) => setWifi({ ...wifi, pass: val })}
                />
              </div>
            ) : (
              <textarea
                className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] outline-none focus:border-indigo-500 font-bold h-32 transition-all"
                placeholder={
                  mode === "url"
                    ? "https://your-website.com"
                    : "Enter your custom message..."
                }
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setContent(e.target.value)
                }
              />
            )}

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="text-indigo-600" size={18} />
                  <span className="text-xs font-black uppercase text-slate-500">
                    Brand Color
                  </span>
                </div>
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDarkColor(e.target.value)
                  }
                  className="w-10 h-10 rounded-full cursor-pointer border-4 border-white shadow-sm"
                />
              </div>
              <div className="flex-1 min-w-[200px] p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-3">
                <Maximize className="text-indigo-600" size={18} />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Print Quality
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    300 DPI / High-Res
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="p-10 lg:w-2/5 bg-slate-50/50 flex flex-col items-center justify-center">
          <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-indigo-100/50 mb-10 relative group border border-slate-100">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[48px] flex items-center justify-center z-10">
                <QrCode className="animate-spin text-indigo-600" />
              </div>
            )}
            {qrImage ? (
              <img
                src={qrImage}
                alt="QR Code"
                className="w-64 h-64 lg:w-72 lg:h-72"
              />
            ) : (
              <div className="w-64 h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold">
                Waiting for input...
              </div>
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={!qrImage || loading}
            className="w-full py-6 bg-[#1E1F4B] hover:bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-20"
          >
            <Download size={20} /> Export PNG
          </button>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" /> Static Code •
            High Reliability
          </p>
        </div>
      </div>
    </div>
  );
}

// Typed Sub-components
interface TabBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabBtn({ active, onClick, icon, label }: TabBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black uppercase transition-all ${
        active
          ? "bg-white text-indigo-600 shadow-sm"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {icon} {label}
    </button>
  );
}

interface InputProps {
  label: string;
  type?: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function Input({ label, type = "text", placeholder, onChange }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-500 font-bold transition-all"
      />
    </div>
  );
}
