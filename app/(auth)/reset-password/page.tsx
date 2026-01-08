"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Hash, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  

  const email = searchParams.get('email') || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: otp,
          new_password: newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully!");
        // Redirect to login after a short delay
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.detail || "Invalid OTP or request expired");
      }
    } catch (error) {
      toast.error("Connection failed. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5D5FEF]">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#1E1F4B]">Set New Password</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Resetting for <span className="text-[#5D5FEF] font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleResetSubmit} className="space-y-5">
          {/* OTP Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">6-Digit Code</label>
            <div className="relative">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                required
                maxLength={6}
                placeholder="000000"
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/10 font-mono tracking-[0.5em] text-lg" 
              />
            </div>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/10" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !otp || !newPassword}
            className="w-full bg-[#1E1F4B] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#5D5FEF] transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Update Password <CheckCircle2 size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

// Next.js requires Suspense for useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#5D5FEF]" size={40} /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}