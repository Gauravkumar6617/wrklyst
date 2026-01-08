"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, LayoutDashboard, LogOut, Box, ChevronRight, 
  CreditCard, ShieldAlert, Users, Activity 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { username, isAdmin, checkAuth, logout } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  // Check if the current URL is an admin page
  const isAdminPath = pathname.startsWith('/dashboard/admin');

  // Menu for regular users
  const userMenu = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/dashboard/account', icon: User },
    { name: 'My Plan', href: '/dashboard/plan', icon: CreditCard },
  ];

  // Menu for admin-specific tasks
  const adminMenu = [
    { name: 'Admin Home', href: '/dashboard/admin', icon: ShieldAlert },
    { name: 'User Details', href: '/dashboard/admin/users', icon: Users },
    { name: 'System Logs', href: '/dashboard/admin/logs', icon: Activity },
  ];

  // If user is Admin, they get the Admin Menu when on admin paths
  const menuItems = isAdminPath ? adminMenu : userMenu;

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFF]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-100 flex flex-col z-50 shadow-sm">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-[#5D5FEF] p-2 rounded-xl text-white shadow-lg shadow-[#5D5FEF]/20">
              <Box size={24} />
            </div>
            <span className="font-[1000] text-2xl text-[#1E1F4B] tracking-tighter uppercase">Wrklyst</span>
          </Link>

          <nav className="space-y-1">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[2px] mb-4 px-2">
              {isAdminPath ? 'Admin Menu' : 'User Menu'}
            </p>
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

        {/* Switcher Button for Admin */}
        {isAdmin && (
           <div className="px-8 mb-4">
             <Link 
               href={isAdminPath ? "/dashboard" : "/admin"}
               className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-200 transition-all"
             >
               {isAdminPath ? "Back to Dashboard" : "Switch to Admin"}
             </Link>
           </div>
        )}

        <div className="mt-auto p-8 border-t border-slate-50">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-72">
        <header className="h-24 flex items-center justify-end px-12 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-50">
          <div className="flex items-center gap-4 bg-white border border-slate-100 py-2 pl-2 pr-5 rounded-2xl shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${isAdminPath ? 'bg-amber-500' : 'bg-[#5D5FEF]'}`}>
              {username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-black text-[#1E1F4B]">{username}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isAdminPath ? "Administrator" : "Member"}
              </span>
            </div>
          </div>
        </header>

        <main className="p-12 max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}