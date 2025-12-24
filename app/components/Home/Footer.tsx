"use client";

import Link from 'next/link';
import { Box, Twitter, Github, Linkedin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd connect this to Mailchimp/ConvertKit/database
    console.log("Subscribing:", email);
    alert("Thanks for joining the Wrklyst community!");
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* 1. Brand Column (Takes 2 cols on LG for spacing) */}
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
              <li><Link href="/use-cases" className="hover:text-[#5D5FEF] transition-colors">Use Cases</Link></li>
              <li><Link href="/pricing" className="hover:text-[#5D5FEF] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* 3. Company & Support Column */}
          <div>
            <h4 className="font-bold text-[#1A1A1A] mb-6 uppercase text-[11px] tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><Link href="/about" className="hover:text-[#5D5FEF] transition-colors">About Story</Link></li>
              <li><Link href="/faq" className="hover:text-[#5D5FEF] transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-[#5D5FEF] transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-[#5D5FEF] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/security" className="hover:text-[#5D5FEF] transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter Column */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-[#1A1A1A] mb-6 uppercase text-[11px] tracking-widest">Stay Updated</h4>
            <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">
              Join 4,000+ others getting weekly productivity tips.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
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
                className="w-full bg-[#1E1F4B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#2D2E5F] transition-all flex items-center justify-center gap-2"
              >
                Subscribe <Send size={12} />
              </button>
            </form>
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