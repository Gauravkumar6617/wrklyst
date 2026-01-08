"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { BarChart3, Users, Activity, ShieldAlert, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { username, isAdmin, isLoggedIn, checkAuth, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  
  // Single state to manage the initial verification phase
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Sync Zustand with cookies immediately on mount
    checkAuth();
    
    // Give the store 150ms to settle state before we allow redirection logic
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [checkAuth]);

  useEffect(() => {
    // Only redirect if we are finished verifying AND something is wrong
    if (!isVerifying) {
      if (!isLoggedIn) {
        router.replace('/login');
      } else if (!isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [isVerifying, isLoggedIn, isAdmin, router]);

  // Unified Loading Screen: Prevents blank pages and flickering
  if (isVerifying || !isLoggedIn || !isAdmin) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0F172A]">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="text-amber-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
          Establishing Secure Session...
        </p>
      </div>
    );
  }

  const adminMenu = [
    { name: 'Command Center', href: '/admin', icon: BarChart3 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'System Health', href: '/admin/subscribers', icon: Activity },
  ];

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#0F172A] text-white flex flex-col z-50">
        <div className="p-8 flex-1">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg shadow-amber-500/20">
              <ShieldAlert size={24} />
            </div>
            <span className="font-[1000] text-2xl tracking-tighter uppercase">
              Wrklyst <span className="text-amber-500">Admin</span>
            </span>
          </div>
          <nav className="space-y-2">
            {adminMenu.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center justify-between px-4 py-4 rounded-2xl font-bold transition-all ${
                  pathname === item.href 
                    ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  {item.name}
                </div>
                {pathname === item.href && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-8 border-t border-white/5 space-y-4 bg-[#090E1A]">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 font-bold hover:text-white text-sm">
            <LayoutDashboard size={18} /> User App
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-4 text-red-400 font-bold hover:bg-red-400/10 rounded-2xl transition-all">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 ml-72">
        <header className="h-24 flex items-center justify-end px-12 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
           <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 py-2 pl-2 pr-5 rounded-2xl">
            <div className="w-10 h-10 bg-[#0F172A] text-white rounded-xl flex items-center justify-center font-black">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-black text-[#0F172A]">{username}</span>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Administrator</span>
            </div>
          </div>
        </header>

        <main className="p-12 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}