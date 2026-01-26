"use client";
import React, { useState } from "react";
import { Lock, User, Copy, RefreshCw, Terminal, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export default function HtpasswdGenerator() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");

  // Simplified SHA-1 htpasswd format
  const generateSHA1 = async (pass: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pass);
    const hash = await crypto.subtle.digest("SHA-1", data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
    return `{SHA}${base64}`;
  };

  const generateHtpasswd = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      // For a professional tool, SHA-1 is standard for Nginx/Apache online gens
      const hashedPass = await generateSHA1(password);
      setOutput(`${username}:${hashedPass}`);
      toast.success("Htpasswd generated!");
    } catch (err) {
      toast.error("Encryption failed");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      {/* 1. Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Username</label>
          <div className="relative">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full p-6 pl-14 bg-slate-50 border-2 border-slate-100 rounded-[32px] font-mono text-sm focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-6 pl-14 bg-slate-50 border-2 border-slate-100 rounded-[32px] font-mono text-sm focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <button
        onClick={generateHtpasswd}
        className="w-full py-4 bg-[#5D5FEF] hover:bg-[#4d4fdf] text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
      >
        <RefreshCw size={16} /> Generate Htpasswd Entry
      </button>

      {/* 2. Result Section */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center px-4">
          <label className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">Entry for .htpasswd file</label>
          {output && (
            <button onClick={copyToClipboard} className="text-[10px] font-bold text-slate-500 hover:text-[#5D5FEF] flex items-center gap-1 uppercase">
              <Copy size={12} /> Copy
            </button>
          )}
        </div>
        <div className="w-full p-6 bg-slate-900 border border-slate-800 rounded-[32px] font-mono text-sm text-emerald-400 overflow-auto whitespace-pre min-h-[80px] flex items-center shadow-xl">
          {output || <span className="text-slate-600 italic">// user:hashed_password will appear here</span>}
        </div>
      </div>

      {/* 3. Pro Technical Guide */}
      <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-700">
          <Terminal size={16} className="text-[#5D5FEF]" /> How to use this
        </h4>
        <ol className="text-xs text-slate-500 space-y-3 leading-relaxed list-decimal ml-4">
          <li>Copy the generated line above.</li>
          <li>Create a file named <strong>.htpasswd</strong> in your server's configuration directory.</li>
          <li>Paste the line into the file and save it.</li>
          <li>Update your <strong>.htaccess</strong> or Nginx config to point to this file for <em>Basic Authentication</em>.</li>
        </ol>
      </div>
    </div>
  );
}