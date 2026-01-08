"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call your FastAPI forgot-password endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/forgot-password?email=${email}`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("OTP sent successfully!");
        // 2. PASS THE EMAIL to the next page so the user doesn't have to re-type it
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        const data = await res.json();
        toast.error(data.detail || "Error sending OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#1E1F4B]">Forgot Password</h1>
          <p className="text-slate-500 mt-2 font-medium">We'll send a 6-digit code to your email.</p>
        </div>

        <form onSubmit={handleRequestOtp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gaurav@singsys.com" 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/10 transition-all" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E1F4B] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#5D5FEF] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Send Reset Code <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}