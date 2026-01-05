"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LayoutDashboard, LogOut, Box, ChevronRight,CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { username, isLoggedIn, checkAuth, logout } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/dashboard/account', icon: User },
    { name: 'My Plan', href: '/dashboard/plan', icon: CreditCard },
  ];
  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFF]">
      <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-100 flex flex-col z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-[#5D5FEF] p-2 rounded-xl text-white shadow-lg shadow-[#5D5FEF]/20">
              <Box size={24} />
            </div>
            <span className="font-[1000] text-2xl text-[#1E1F4B] tracking-tighter uppercase">Wrklyst</span>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? 'bg-[#1E1F4B] text-white shadow-xl shadow-[#1E1F4B]/20' 
                      : 'text-slate-400 hover:bg-slate-50 hover:text-[#5D5FEF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-72">
        <header className="h-24 flex items-center justify-end px-12 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-50">
          <div className="flex items-center gap-4 bg-white border border-slate-100 py-2 pl-2 pr-5 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-[#5D5FEF] text-white rounded-xl flex items-center justify-center font-black">G</div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-black text-[#1E1F4B]">{username}
                
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Member</span>
            </div>
          </div>
        </header>

        <main className="p-12 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}