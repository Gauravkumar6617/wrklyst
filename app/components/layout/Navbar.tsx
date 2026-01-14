"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Box, User, LogOut, ArrowRight, Menu, X } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { TOOLS_CONFIG } from "@/lib/tools-data";

export default function Navbar() {
  const { username, isLoggedIn, checkAuth, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  // Helper to close menu when clicking a link
  const closeMenu = () => setIsMobileMenuOpen(false);

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
    // Removed pointer-events-none from here to prevent interaction bugs
    <div className="fixed top-0 left-0 w-full px-4 md:px-10 py-4 z-[100]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[24px] relative">
        
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="group flex items-center gap-2 font-bold text-xl text-[#5D5FEF] shrink-0">
          <div className="bg-[#5D5FEF]/10 p-2 rounded-xl">
            <Box size={22} strokeWidth={2.5} />
          </div>
          <span className="tracking-tighter text-[#2D2E5F]">Wrklyst</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-[#64748b] font-semibold text-[14px]">
          <Link href="/about" className="hover:text-[#5D5FEF] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#5D5FEF] transition-colors">Contact</Link>
          <Link href="/pricing" className="hover:text-[#5D5FEF] transition-colors">Pricing</Link>
          
          <div className="group relative cursor-pointer py-2">
            <Link href="/tools" className="flex items-center gap-1 group-hover:text-[#5D5FEF]">
              Tools <ChevronDown size={14} strokeWidth={3} className="group-hover:rotate-180 transition-transform" />
            </Link>
            {/* Desktop Mega Menu */}
            <div className="absolute top-[100%] -left-64 hidden group-hover:block w-[850px] pt-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="bg-white shadow-2xl rounded-[32px] border border-slate-100 p-10">
                <div className="grid grid-cols-4 gap-x-8 gap-y-10 text-left">
                  {Object.entries(groupedTools).map(([category, tools]) => (
                    <div key={category} className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[2px] text-[#5D5FEF] bg-[#5D5FEF]/5 px-3 py-1 rounded-md w-fit">{category}</h4>
                      <div className="space-y-1">
                        {tools.map((tool) => (
                          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center justify-between px-3 py-2 text-[13px] font-bold text-[#2D2E5F] hover:bg-slate-50 hover:text-[#5D5FEF] rounded-xl transition-all">
                            <span className="truncate">{tool.name}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="group relative">
               <div className="flex items-center gap-3 bg-[#5D5FEF]/5 border border-[#5D5FEF]/20 px-3 md:px-4 py-2 rounded-full cursor-pointer">
                <div className="w-7 h-7 bg-[#5D5FEF] rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="text-[#2D2E5F] font-bold text-sm hidden sm:block">{username}</span>
              </div>
              {/* Desktop User Dropdown */}
              <div className="absolute top-[100%] right-0 hidden group-hover:block w-48 pt-2 z-50">
                <div className="bg-white shadow-xl rounded-2xl border border-slate-100 p-2">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-slate-50 rounded-xl">
                    <Box size={16} /> My Account
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl">
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

          {/* Mobile Toggle - High Z-Index */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#2D2E5F] hover:bg-slate-100 rounded-xl transition-colors relative z-[110]"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- IMPROVED MOBILE OVERLAY --- */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop to close menu when clicking outside */}
            <div 
                className="fixed inset-0 bg-black/5 backdrop-blur-sm md:hidden z-[90]" 
                onClick={closeMenu}
            />
            
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] p-6 flex flex-col gap-2 md:hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                <Link href="/about" onClick={closeMenu} className="text-lg font-bold text-[#2D2E5F] p-4 hover:bg-slate-50 rounded-2xl transition-colors">About</Link>
                <Link href="/contact" onClick={closeMenu} className="text-lg font-bold text-[#2D2E5F] p-4 hover:bg-slate-50 rounded-2xl transition-colors">Contact</Link>
                <Link href="/pricing" onClick={closeMenu} className="text-lg font-bold text-[#2D2E5F] p-4 hover:bg-slate-50 rounded-2xl transition-colors">Pricing</Link>
                <Link href="/tools" onClick={closeMenu} className="text-lg font-bold text-[#5D5FEF] p-4 bg-[#5D5FEF]/5 rounded-2xl flex items-center justify-between transition-colors">
                Explore Tools <ArrowRight size={18} />
                </Link>
                
                <div className="h-[1px] bg-slate-100 my-2" />

                {!isLoggedIn ? (
                <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={closeMenu} className="w-full">
                        <button className="w-full py-4 text-[#2D2E5F] font-bold border border-slate-200 rounded-2xl hover:bg-slate-50">Log In</button>
                    </Link>
                    <Link href="/signup" onClick={closeMenu} className="w-full">
                        <button className="w-full py-4 bg-[#1E1F4B] text-white font-bold rounded-2xl shadow-lg">Sign Up</button>
                    </Link>
                </div>
                ) : (
                <div className="flex flex-col gap-2">
                    <Link href="/dashboard" onClick={closeMenu} className="flex items-center gap-3 p-4 text-lg font-bold text-[#2D2E5F] hover:bg-slate-50 rounded-2xl">
                        <User size={20} /> My Dashboard
                    </Link>
                    <button onClick={() => { logout(); closeMenu(); }} className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl flex items-center justify-center gap-2 mt-2">
                        <LogOut size={20} /> Log Out
                    </button>
                </div>
                )}
            </div>
          </>
        )}
      </nav>
    </div>
  );
}