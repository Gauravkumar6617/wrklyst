"use client";
import React from 'react';
import { User, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useRouter } from 'next/navigation';

const AccountPage = () => {
  // Assuming your store has email. If not, you might need to fetch it or decode it from token.
  const { username, email } = useAuthStore(); 
  const router = useRouter();

  // Fallback email if store doesn't have it yet to prevent undefined errors
  const userEmail = email || "user@singsys.com";

  const handleSecurityRedirect = () => {
    // Redirects to your forgot-password page with the email pre-filled
    router.push(`/forgot-password?email=${encodeURIComponent(userEmail)}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-[1000] text-[#1E1F4B] tracking-tighter">Profile Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your identity and account security.</p>
      </div>

      {/* Personal Information Section */}
      <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-lg font-black text-[#1E1F4B] mb-8 flex items-center gap-2">
          <User size={20} className="text-[#5D5FEF]" /> Personal Information
        </h2>
        
        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
            <div className="w-24 h-24 bg-gradient-to-br from-[#5D5FEF] to-[#1E1F4B] rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-indigo-100">
                {username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">Account Type</p>
                <span className="px-4 py-1.5 bg-indigo-50 text-[#5D5FEF] rounded-full text-xs font-bold uppercase tracking-tight">
                    Standard User
                </span>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                readOnly 
                value={username ?? "Loading..."} 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-[#1E1F4B]" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                readOnly 
                value={userEmail} 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-medium cursor-not-allowed" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security Section - Simplified */}
      <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm border-l-4 border-l-[#5D5FEF]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h2 className="text-lg font-black text-[#1E1F4B] mb-2 flex items-center gap-2">
              <ShieldAlert size={20} className="text-[#5D5FEF]" /> Account Security
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              To update your password, we will send a 6-digit verification code (OTP) to <span className="text-[#1E1F4B] font-bold">{userEmail}</span> to ensure your account remains secure.
            </p>
          </div>
          
          <button 
            onClick={handleSecurityRedirect}
            className="flex items-center justify-center gap-3 bg-[#1E1F4B] text-white px-8 py-5 rounded-2xl font-black hover:bg-[#5D5FEF] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 whitespace-nowrap"
          >
            <KeyRound size={20} />
            Update Password via OTP
          </button>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;