"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Box, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore'; // Ensure this path is correct

export default function Navbar() {
  // Pull state and actions from your Zustand store
  const { username, isLoggedIn, checkAuth, logout } = useAuthStore();

  // On mount, check if cookies exist to auto-login the user
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="fixed top-0 left-0 w-full px-4 md:px-10 py-4 z-50 pointer-events-none">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[24px] pointer-events-auto">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 font-bold text-xl text-[#5D5FEF] transition-opacity hover:opacity-90">
          <div className="bg-[#5D5FEF]/10 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
            <Box size={22} strokeWidth={2.5} />
          </div>
          <span className="tracking-tighter text-[#2D2E5F]">Wrklyst</span>
        </Link>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-[#64748b] font-semibold text-[14px]">
          <Link href="/about" className="hover:text-[#5D5FEF] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#5D5FEF] transition-colors">Contact</Link>
          <Link href="/pricing" className="hover:text-[#5D5FEF] transition-colors">Pricing</Link>
          
          {/* Tools Dropdown (Existing) */}
          <div className="group relative cursor-pointer py-2">
            <span className="flex items-center gap-1 group-hover:text-[#5D5FEF] transition-colors">
              Tools <ChevronDown size={14} strokeWidth={3} className="mt-0.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
            </span>
            <div className="absolute top-[80%] -left-20 hidden group-hover:block w-[450px] pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-white shadow-[0_20px_70px_rgba(0,0,0,0.15)] rounded-[28px] border border-slate-100 p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="space-y-1">
                    <Link href="/tools/pdf/merge" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">Merge PDF</Link>
                    <Link href="/tools/pdf/compress" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">Compress PDF</Link>
                  </div>
                  <div className="space-y-1">
                    <Link href="/tools/image/resize" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">Resize Image</Link>
                    <Link href="/tools/image/remove-bg" className="block px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">Remove BG</Link>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <Link href="/tools" className="block w-full py-3 text-center text-sm font-black text-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white rounded-xl transition-all">Explore All Tools</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Conditioned on Auth State */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            /* --- LOGGED IN: User Profile Pill --- */
            <div className="group relative py-2">
              <div className="flex items-center gap-3 bg-[#5D5FEF]/5 border border-[#5D5FEF]/20 px-4 py-2 rounded-full cursor-pointer hover:bg-[#5D5FEF]/10 transition-all duration-200">
                <div className="w-7 h-7 bg-[#5D5FEF] rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="text-[#2D2E5F] font-bold text-sm hidden sm:block">
                  {username}
                </span>
                <ChevronDown size={14} strokeWidth={3} className="text-[#5D5FEF]/50 group-hover:rotate-180 transition-transform duration-300" />
              </div>

              {/* User Dropdown */}
              <div className="absolute top-[90%] right-0 hidden group-hover:block w-48 pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white shadow-[0_20px_70px_rgba(0,0,0,0.15)] rounded-2xl border border-slate-100 p-2">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
                    <Box size={16} /> My Files
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#2D2E5F] hover:bg-[#5D5FEF]/5 hover:text-[#5D5FEF] rounded-xl transition-all">
                    <Settings size={16} /> Settings
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
            /* --- LOGGED OUT: Original Buttons --- */
            <>
              <Link href="/login">
                <button className="px-5 py-2 text-[#2D2E5F] font-bold text-sm hover:bg-slate-50 rounded-full transition-all">
                  Log in
                </button>
              </Link>
              
              <Link href="/signup">
                <button className="px-6 py-2 bg-[#1E1F4B] text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}