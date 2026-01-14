"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Box, User, LogOut, ArrowRight, Menu, X } from "lucide-react"; // Added Menu, X
import { useAuthStore } from "@/app/store/useAuthStore";
import { TOOLS_CONFIG } from "@/lib/tools-data";

export default function Navbar() {
  const { username, isLoggedIn, checkAuth, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile state

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const groupedTools = useMemo(() => {
    return Object.entries(TOOLS_CONFIG).reduce(
      (acc, [slug, tool]) => {
        const category = tool.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push({ slug, ...tool });
        return acc;
      },
      {} as Record<string, any[]>
    );
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full px-4 md:px-10 py-4 z-50 pointer-events-none">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[24px] pointer-events-auto">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 font-bold text-xl text-[#5D5FEF]">
          <div className="bg-[#5D5FEF]/10 p-2 rounded-xl">
            <Box size={22} strokeWidth={2.5} />
          </div>
          <span className="tracking-tighter text-[#2D2E5F]">Wrklyst</span>
        </Link>

        {/* Desktop Nav Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8 text-[#64748b] font-semibold text-[14px]">
          <Link href="/about" className="hover:text-[#5D5FEF] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#5D5FEF] transition-colors">Contact</Link>
          <Link href="/pricing" className="hover:text-[#5D5FEF] transition-colors">Pricing</Link>
          
          {/* Tools Dropdown Logic remains same */}
          <div className="group relative cursor-pointer py-2">
            <Link href="/tools" className="flex items-center gap-1 group-hover:text-[#5D5FEF]">
              Tools <ChevronDown size={14} strokeWidth={3} className="group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-[80%] -left-64 hidden group-hover:block w-[850px] pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-white shadow-[0_20px_70px_rgba(0,0,0,0.15)] rounded-[32px] border border-slate-100 p-10">
                {/* 4-Column Grid for All Tools */}
                <div className="grid grid-cols-4 gap-x-8 gap-y-10">
                  {Object.entries(groupedTools).map(([category, tools]) => (
                    <div key={category} className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[2px] text-[#5D5FEF] bg-[#5D5FEF]/5 px-3 py-1 rounded-md w-fit">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {/* REMOVED .slice(0, 4) to show all tools */}
                        {tools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className="flex items-center justify-between group/item px-3 py-2 text-[13px] font-bold text-[#2D2E5F] hover:bg-slate-50 hover:text-[#5D5FEF] rounded-xl transition-all"
                          >
                            <span className="truncate">{tool.name}</span>
                            <ArrowRight
                              size={12}
                              className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Footer */}
                <div className="mt-10 pt-6 border-t border-slate-100">
                  <Link
                    href="/tools"
                    className="flex items-center justify-center gap-3 w-full py-4 text-xs font-black text-white bg-[#1E1F4B] hover:bg-[#5D5FEF] rounded-2xl transition-all shadow-lg shadow-indigo-100 group/btn"
                  >
                    BROWSE DIRECTORY ({Object.keys(TOOLS_CONFIG).length} TOOLS)
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-2 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions + Mobile Toggle */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="group relative py-2">
               {/* User Profile logic remains same */}
               <div className="flex items-center gap-3 bg-[#5D5FEF]/5 border border-[#5D5FEF]/20 px-3 md:px-4 py-2 rounded-full cursor-pointer">
                <div className="w-7 h-7 bg-[#5D5FEF] rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="text-[#2D2E5F] font-bold text-sm hidden sm:block">{username}</span>
                <ChevronDown
                  size={14}
                  strokeWidth={3}
                  className="text-[#5D5FEF]/50 group-hover:rotate-180 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-[90%] right-0 hidden group-hover:block w-48 pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white shadow-[0_20px_70px_rgba(0,0,0,0.15)] rounded-2xl border border-slate-100 p-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all"
                  >
                    <Box size={16} /> My Account
                  </Link>
                  <div className="my-1 border-t border-slate-50" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            </div>
            
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login"><button className="px-4 py-2 text-[#2D2E5F] font-bold text-sm">Log in</button></Link>
              <Link href="/signup"><button className="px-5 py-2 bg-[#1E1F4B] text-white rounded-full font-bold text-sm">Sign Up</button></Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#2D2E5F] hover:bg-slate-100 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* --- MOBILE OVERLAY MENU --- */}
        {isMobileMenuOpen && (
          <div className="absolute top-[90px] left-4 right-4 bg-white border border-slate-100 shadow-2xl rounded-[32px] p-6 flex flex-col gap-4 md:hidden animate-in fade-in zoom-in-95 duration-200">
            <Link href="/about" className="text-lg font-bold text-[#2D2E5F] p-2 hover:bg-slate-50 rounded-xl">About</Link>
            <Link href="/contact" className="text-lg font-bold text-[#2D2E5F] p-2 hover:bg-slate-50 rounded-xl">Contact</Link>
            <Link href="/pricing" className="text-lg font-bold text-[#2D2E5F] p-2 hover:bg-slate-50 rounded-xl">Pricing</Link>
            <Link href="/tools" className="text-lg font-bold text-[#5D5FEF] p-2 bg-[#5D5FEF]/5 rounded-xl flex items-center justify-between">
              Explore Tools <ArrowRight size={18} />
            </Link>
            
            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link href="/login" className="w-full">
                    <button className="w-full py-4 text-[#2D2E5F] font-bold border border-slate-200 rounded-2xl">Log In</button>
                </Link>
                <Link href="/signup" className="w-full">
                    <button className="w-full py-4 bg-[#1E1F4B] text-white font-bold rounded-2xl">Sign Up</button>
                </Link>
              </div>
            )}
            
            {isLoggedIn && (
                 <button onClick={logout} className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl flex items-center justify-center gap-2">
                    <LogOut size={18} /> Log Out
                 </button>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}