"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Box, User, LogOut, ArrowRight, Menu, X, Sparkles } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { TOOLS_CONFIG } from "@/lib/tools-data";

export default function Navbar() {
  const { username, isLoggedIn, checkAuth, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const groupedTools = useMemo(() => {
    return Object.entries(TOOLS_CONFIG).reduce((acc, [slug, tool]) => {
      const category = tool.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push({ slug, ...tool });
      return acc;
    }, {} as Record<string, any[]>);
  }, []);

  const categories = Object.keys(groupedTools);
  
  useEffect(() => {
    if (!activeCategory && categories.length > 0) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full px-4 md:px-10 py-4 z-[100]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[24px] relative">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 font-bold text-xl text-[#5D5FEF] shrink-0">
          <div className="bg-[#5D5FEF]/10 p-2 rounded-xl">
            <Box size={22} strokeWidth={2.5} />
          </div>
          <span className="tracking-tighter text-[#2D2E5F]">Wrklyst</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-[#64748b] font-semibold text-[14px]">
          <Link href="/about" className="hover:text-[#5D5FEF] transition-colors">About</Link>
          
          
          {/* We add pb-10 and -mb-10 to create an invisible bridge between the nav and the dropdown */}
          <div className="group static cursor-pointer py-2 pb-12 -mb-10">
            <div className="flex items-center gap-1 group-hover:text-[#5D5FEF] transition-colors">
              Tools <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </div>

            {/* FULL WIDTH DROPDOWN */}
            {/* Using pt-[20px] and -mt-[10px] to ensure the mouse stays 'inside' the hover zone */}
            <div className="absolute top-full left-0 w-full hidden group-hover:block pt-[20px] -mt-[10px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-white shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-[32px] border border-slate-100 overflow-hidden flex min-h-[500px]">
                
                {/* Left Side: Categories */}
                <div className="w-1/4 bg-slate-50/50 p-8 border-r border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 px-4">Categories</p>
                  <div className="space-y-2">
                  {categories.map((cat) => (
  <button
    key={cat}
    onMouseEnter={() => setActiveCategory(cat)}
    // Added 'outline-none' and 'ring-0' to remove the black border
    // Added 'duration-200' for a smoother color transition
    className={`w-full text-left px-4 py-4 rounded-2xl font-black text-sm transition-all duration-200 flex items-center justify-between group/cat outline-none ring-0 focus:outline-none focus:ring-0 ${
      activeCategory === cat 
      ? "bg-white text-[#5D5FEF] shadow-sm border border-slate-100" 
      : "text-slate-500 hover:bg-white/50 border border-transparent"
    }`}
  >
    {cat}
    <ArrowRight size={16} className={`transition-all duration-300 ${activeCategory === cat ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
  </button>
))}
                  </div>
                </div>

                {/* Right Side: Tools Grid */}
                <div className="w-3/4 p-10 bg-white">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-[#2D2E5F] flex items-center gap-2">
                        {activeCategory} Tools <Sparkles size={20} className="text-amber-400" />
                      </h3>
                      <Link href="/tools" className="text-xs font-black text-[#5D5FEF] hover:underline">View All Tools</Link>
                   </div>

                   <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                      {activeCategory && groupedTools[activeCategory]?.map((tool) => (
                        <Link 
                          key={tool.slug} 
                          href={`/tools/${tool.slug}`}
                          className="p-5 border border-slate-50 rounded-2xl hover:border-[#5D5FEF]/30 hover:bg-[#5D5FEF]/5 transition-all group/tool"
                        >
                          <p className="font-black text-[#2D2E5F] group-hover:text-[#5D5FEF] transition-colors">{tool.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-1">{tool.description}</p>
                        </Link>
                      ))}
                   </div>
                   
                   {/* Bottom Banner */}
                   <div className="mt-8 p-6 bg-indigo-600 rounded-[24px] text-white flex items-center justify-between">
                      <div>
                        <p className="font-black text-lg">Can't find what you need?</p>
                        <p className="text-indigo-100 text-sm">Browse our full directory of {Object.keys(TOOLS_CONFIG).length} specialized tools.</p>
                      </div>
                      <Link href="/tools" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                        Open Directory
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <Link href="/pricing" className="hover:text-[#5D5FEF] transition-colors">Pricing</Link>
          <Link href="/contact" className="hover:text-[#5D5FEF] transition-colors">Contact</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
           {!isLoggedIn ? (
             <>
               <Link href="/login" className="text-sm font-bold text-[#2D2E5F] hidden sm:block hover:text-[#5D5FEF] transition-colors">Log in</Link>
               <Link href="/signup" className="px-6 py-3 bg-[#1E1F4B] text-white rounded-full font-bold text-sm hover:bg-[#5D5FEF] transition-all shadow-lg shadow-indigo-100">Sign Up</Link>
             </>
           ) : (
             <div className="flex items-center gap-3 bg-[#5D5FEF]/5 px-4 py-2 rounded-full border border-[#5D5FEF]/10">
                <span className="text-sm font-black text-[#2D2E5F]">{username}</span>
                <button onClick={logout} className="text-red-500 hover:text-red-700 transition-colors"><LogOut size={18}/></button>
             </div>
           )}
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-[#2D2E5F]"><Menu /></button>
        </div>
      </nav>
    </div>
  );
}