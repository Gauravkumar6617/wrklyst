"use client";

import Link from 'next/link';
import { Box, Twitter, Github, Linkedin, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useSubscriber } from "@/hooks/subscriberHook";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  
  // 1. Destructure hook values
  const { subscribe, loading, isSubscribed } = useSubscriber();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await subscribe(email);
    if (success) setEmail(""); // Clear input on success
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* 1. Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#2D2E5F]">
              <div className="bg-[#5D5FEF] p-1.5 rounded-lg text-white">
                <Box size={20} />
              </div>
              <span className="tracking-tighter">Wrklyst</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
              The all-in-one toolkit for file management. Process PDFs, images, and videos securely in your browser.
            </p>
            <div className="flex gap-4 text-slate-300">
              <Twitter size={20} className="hover:text-[#5D5FEF] transition-colors cursor-pointer" />
              <Github size={20} className="hover:text-[#5D5FEF] transition-colors cursor-pointer" />
              <Linkedin size={20} className="hover:text-[#5D5FEF] transition-colors cursor-pointer" />
            </div>
          </div>

          {/* 2. Product Column */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-6 uppercase text-[11px] tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><Link href="/tools" className="hover:text-[#5D5FEF] transition-colors">All Tools</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#5D5FEF] transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-[#5D5FEF] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* 3. Company & Support */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-6 uppercase text-[11px] tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><Link href="/about" className="hover:text-[#5D5FEF] transition-colors">About Story</Link></li>
              <li><Link href="/contact" className="hover:text-[#5D5FEF] transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-[#5D5FEF] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter Column (Updated) */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-[#1A1A1A] mb-6 uppercase text-[11px] tracking-widest">Stay Updated</h4>
            
            {/* 2. Toggle UI based on isSubscribed */}
            {isSubscribed ? (
              <div className="bg-[#5D5FEF]/5 border border-[#5D5FEF]/10 rounded-2xl p-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <CheckCircle2 size={24} className="text-[#5D5FEF] mb-3" />
                <h5 className="text-sm font-bold text-[#1E1F4B]">You're subscribed!</h5>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Check your inbox for a welcome gift.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">
                  Join 4,000+ others getting weekly productivity tips.
                </p>
                <form className="space-y-3" onSubmit={handleJoin}>
                  <input 
                    type="email" 
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 text-xs font-medium"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E1F4B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#2D2E5F] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? "Adding..." : "Subscribe"} <Send size={12} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[2px]">
          <p>© {currentYear} Wrklyst Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p>System Status: Operational</p>
          </div>
        </div>
      </div>
    </footer>
  );
}