"use client";
import React from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';

const AccountPage = () => {
  const { username } = useAuthStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-[1000] text-[#1E1F4B] tracking-tighter">Profile Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your basic info and security.</p>
      </div>

      {/* Personal Info */}
      <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-black text-[#1E1F4B] mb-8">Personal Information</h2>
        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
            <div className="w-24 h-24 bg-gradient-to-br from-[#5D5FEF] to-[#1E1F4B] rounded-[32px] flex items-center justify-center text-white text-4xl font-black">
                {username?.charAt(0).toUpperCase() || "G"}
            </div>
            <div>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">Account Type</p>
                <span className="px-4 py-1.5 bg-indigo-50 text-[#5D5FEF] rounded-full text-xs font-bold uppercase">Standard User</span>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input type="text" defaultValue={username ?? ""} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-[#1E1F4B]" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input type="email" defaultValue="gaurav@example.com" disabled className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 italic cursor-not-allowed" />
            </div>
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-black text-[#1E1F4B] mb-8">Change Password</h2>
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input type="password" placeholder="••••••••" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
            <input type="password" placeholder="New password" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#1E1F4B] text-white w-full py-4 rounded-2xl font-black hover:bg-[#5D5FEF] transition-all">
            <Save size={20} /> Update Password
          </button>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;