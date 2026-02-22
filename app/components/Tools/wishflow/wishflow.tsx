"use client";
import React, { useState } from "react";
import {
  Send,
  Mail,
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Clock,
  Zap,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Replace this with your actual API dispatch logic
import { dispatchWish } from "@/app/api/wishflow/route";

export default function WishFlowPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return;

    setStatus("loading");
    const formData = new FormData(e.currentTarget);

    try {
      //   Logic for your backend relay
      await dispatchWish({
        email: formData.get("email") as string,
        event_title: formData.get("title") as string,
        message: formData.get("message") as string,
        send_datetime: formData.get("datetime") as string,
      });

      // Simulating network latency for UX feel
      setTimeout(() => {
        setStatus("success");
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-6 bg-[#020617] overflow-hidden selection:bg-indigo-500/30">
      <div className="relative w-full max-w-2xl h-screen sm:h-auto">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative h-full sm:h-auto bg-slate-900/40 sm:border border-white/5 backdrop-blur-3xl sm:rounded-[40px] shadow-2xl flex flex-col transition-all duration-500">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center"
              >
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mb-8 rotate-12">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 -rotate-12" />
                </div>
                <h2 className="text-3xl font-[1000] text-white uppercase tracking-tighter mb-4">
                  Relay <span className="text-emerald-400">Locked</span>
                </h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-10 leading-relaxed font-medium">
                  Your automated milestone has been successfully encrypted and
                  queued for dispatch.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setAgreed(false);
                  }}
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black text-indigo-400 uppercase tracking-widest transition-all active:scale-95"
                >
                  Schedule New Protocol <ChevronRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col p-6 sm:p-12 md:p-14"
              >
                {/* Branding Header */}
                <header className="flex items-center justify-between mb-10 md:mb-14">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase">
                        Wish<span className="text-indigo-500">Flow</span>
                      </h1>
                      <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                      Precision Relay v1.0
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                      Secure Dispatch
                    </span>
                  </div>
                  <div className="sm:hidden p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                    <Zap size={18} />
                  </div>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="space-y-6 mb-10">
                    {/* Destination Node */}
                    <div className="space-y-3">
                      <FormLabel
                        icon={<Mail size={12} />}
                        label="Destination Node"
                      />
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="recipient@secure-relay.io"
                        className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4.5 px-6 text-sm text-white focus:border-indigo-500 focus:ring-4 ring-indigo-500/5 outline-none transition-all placeholder:text-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Event Identifier */}
                      <div className="space-y-3">
                        <FormLabel
                          icon={<Sparkles size={12} />}
                          label="Event ID"
                        />
                        <input
                          required
                          name="title"
                          placeholder="e.g. Work Anniversary"
                          className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4.5 px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                      {/* Execution Time */}
                      <div className="space-y-3">
                        <FormLabel
                          icon={<Clock size={12} />}
                          label="Dispatch Time"
                        />
                        <input
                          required
                          name="datetime"
                          type="datetime-local"
                          className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4.5 px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Encoded Message */}
                    <div className="space-y-3">
                      <FormLabel
                        icon={<Send size={12} />}
                        label="Transmission Content"
                      />
                      <textarea
                        required
                        name="message"
                        rows={5}
                        placeholder="Encode your heartfelt message here..."
                        className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Compliance Section */}
                  <div className="mb-8 p-5 bg-white/5 rounded-[24px] border border-white/5 group transition-colors hover:border-indigo-500/20">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <div className="relative mt-1 shrink-0">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={() => setAgreed(!agreed)}
                          className="peer appearance-none w-6 h-6 bg-slate-800 border border-white/10 rounded-lg checked:bg-indigo-600 checked:border-indigo-500 transition-all cursor-pointer"
                        />
                        <CheckCircle2
                          size={14}
                          className="absolute top-1.5 left-1.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                        />
                      </div>
                      <p className="text-[10px] leading-relaxed text-slate-400 font-medium select-none">
                        I acknowledge that this transmission is intended for the
                        recipient node and complies with the
                        <span className="text-indigo-400 font-black mx-1">
                          Privacy Protocol
                        </span>{" "}
                        and
                        <span className="text-indigo-400 font-black mx-1">
                          Spam Directives
                        </span>
                        . Data is AES-256 encrypted until execution.
                      </p>
                    </label>
                  </div>

                  {/* Submit Action */}
                  <div className="mt-auto sm:mt-0">
                    <button
                      disabled={status === "loading" || !agreed}
                      className="w-full group bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/50 disabled:text-slate-600 text-white font-[1000] py-6 rounded-2xl md:rounded-[32px] transition-all shadow-2xl shadow-indigo-600/10 active:scale-95 flex items-center justify-center gap-4"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <span className="tracking-[0.3em] uppercase text-[10px]">
                            Execute Dispatch Protocol
                          </span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-4 mt-8 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="h-px flex-1 bg-white/20" />
                      <Lock size={12} className="text-white" />
                      <div className="h-px flex-1 bg-white/20" />
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function FormLabel({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 ml-1 opacity-60">
      <span className="text-indigo-400">{icon}</span>
      <label className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
        {label}
      </label>
    </div>
  );
}
