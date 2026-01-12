"use client";
import React, { useState, useEffect } from "react";
import {
  Copy,
  RefreshCw,
  ShieldCheck,
  Check,
  Hash,
  Type,
  Star,
} from "lucide-react";
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

  // Generate on load
  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Result Display */}
      <div className="relative group">
        <div className="w-full p-8 bg-slate-900 rounded-[40px] text-emerald-400 font-mono text-2xl md:text-3xl break-all flex items-center justify-center min-h-[140px] text-center shadow-2xl border-b-8 border-indigo-600">
          {password}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={generatePassword}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all"
            title="Regenerate"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(password);
              toast.success("Copied!");
            }}
            className="p-3 bg-[#5D5FEF] hover:bg-[#4d4fdf] rounded-2xl text-white transition-all shadow-lg"
            title="Copy"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      {/* 2. Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Length Slider */}
        <div className="lg:col-span-1 p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Length
            </label>
            <span className="text-xl font-black text-[#5D5FEF]">{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5D5FEF]"
          />
        </div>

        {/* Character Toggles */}
        <div className="lg:col-span-2 p-8 bg-slate-50 rounded-[40px] border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
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
              className={`flex flex-col items-center justify-center p-4 rounded-[24px] border-2 transition-all ${
                options[type.id as keyof typeof options]
                  ? "border-[#5D5FEF] bg-white text-[#5D5FEF] shadow-md"
                  : "border-transparent bg-slate-200/50 text-slate-400"
              }`}
            >
              {type.icon}
              <span className="text-[10px] font-black uppercase mt-1">
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Security Badge */}
      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[32px] flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl text-emerald-500 shadow-sm">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest">
            Cryptographically Secure
          </h4>
          <p className="text-[11px] text-emerald-600 opacity-80">
            This tool uses <code>window.crypto</code> to ensure true randomness.
            Passwords are never sent to our server.
          </p>
        </div>
      </div>
    </div>
  );
}
