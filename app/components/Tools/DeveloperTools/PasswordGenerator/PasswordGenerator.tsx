"use client";
import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, ShieldCheck, Hash, Type, Star } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const charset: Record<string, string> = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let characters = "";
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (characters === "") {
      toast.error("Please select at least one character type");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += characters[array[i] % characters.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-0 md:p-6 lg:p-12 space-y-4 md:space-y-8">
      {/* 1. Result Display - Full width on mobile, rounded on desktop */}
      <div className="relative group overflow-hidden">
        <div className="w-full p-6 md:p-10 bg-slate-900 rounded-none md:rounded-[40px] text-emerald-400 font-mono text-lg sm:text-2xl md:text-3xl break-all flex items-center justify-center min-h-[120px] md:min-h-[160px] text-center shadow-2xl border-b-4 md:border-b-8 border-indigo-600">
          {password}
        </div>

        {/* Actions - Floating slightly tighter on mobile */}
        <div className="absolute top-3 right-3 md:top-6 md:right-6 flex gap-2">
          <button
            onClick={generatePassword}
            className="p-2.5 md:p-3 bg-white/10 hover:bg-white/20 rounded-xl md:rounded-2xl text-white transition-all active:scale-90"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(password);
              toast.success("Copied!");
            }}
            className="p-2.5 md:p-3 bg-[#5D5FEF] hover:bg-[#4d4fdf] rounded-xl md:rounded-2xl text-white transition-all shadow-lg active:scale-90"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>

      {/* 2. Controls Grid - Padding added to the grid wrapper for mobile mobile alignment */}
      <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Length Slider */}
        <div className="lg:col-span-1 p-5 md:p-8 bg-slate-50 rounded-2xl md:rounded-[40px] border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Length
            </label>
            <span className="text-lg md:text-xl font-black text-[#5D5FEF]">
              {length}
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-1.5 md:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5D5FEF]"
          />
        </div>

        {/* Character Toggles - 2x2 grid on mobile, 4x1 on desktop */}
        <div className="lg:col-span-2 p-5 md:p-8 bg-slate-50 rounded-2xl md:rounded-[40px] border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {[
            { id: "uppercase", label: "ABC", icon: <Type size={14} /> },
            { id: "lowercase", label: "abc", icon: <Type size={14} /> },
            { id: "numbers", label: "123", icon: <Hash size={14} /> },
            { id: "symbols", label: "#$&", icon: <Star size={14} /> },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() =>
                setOptions({
                  ...options,
                  [type.id]: !options[type.id as keyof typeof options],
                })
              }
              className={`flex flex-col items-center justify-center py-3 md:py-4 rounded-xl md:rounded-[24px] border-2 transition-all active:scale-95 ${
                options[type.id as keyof typeof options]
                  ? "border-[#5D5FEF] bg-white text-[#5D5FEF] shadow-sm"
                  : "border-transparent bg-slate-200/50 text-slate-400"
              }`}
            >
              {type.icon}
              <span className="text-[8px] md:text-[10px] font-black uppercase mt-1">
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Security Badge - Edge-to-edge on mobile with horizontal margin */}
      <div className="mx-4 md:mx-0 p-4 md:p-6 bg-emerald-50 border border-emerald-100 rounded-2xl md:rounded-[32px] flex items-center gap-3 md:gap-4">
        <div className="p-2 md:p-3 bg-white rounded-xl text-emerald-500 shadow-sm shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[9px] md:text-xs font-black text-emerald-800 uppercase tracking-widest leading-tight">
            Secure Generation
          </h4>
          <p className="text-[9px] md:text-[11px] text-emerald-600 opacity-80 leading-tight">
            Generated locally via <code>window.crypto</code>.
            <span className="hidden sm:inline">
              {" "}
              Passwords stay on your device.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
