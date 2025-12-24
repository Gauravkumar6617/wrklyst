import Link from 'next/link';
import { Box, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      
      {/* --- LEFT SIDE: THE VIBE --- */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#1E1F4B] relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#5D5FEF]/20 rounded-full blur-[120px] animate-pulse" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2 font-bold text-2xl text-white">
          <div className="bg-[#5D5FEF] p-2 rounded-xl">
            <Box size={24} />
          </div>
          <span className="tracking-tighter">Wrklyst</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Welcome back <br /> to the <span className="text-[#5D5FEF]">Future.</span>
          </h2>
          <p className="text-indigo-200 text-lg max-w-md font-medium">
            Log in to access your personalized dashboard and premium tools.
          </p>
        </div>

        <div className="relative z-10 text-indigo-300 text-sm font-bold uppercase tracking-widest">
          © 2025 Wrklyst Productivity Suite
        </div>
      </div>

      {/* --- RIGHT SIDE: THE FORM --- */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-[900] text-[#1A1A1A] tracking-tighter">Sign In</h1>
            <p className="text-slate-500 font-medium">Enter your details to access your account.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 focus:bg-white transition-all font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[11px] font-black text-[#5D5FEF] uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 focus:bg-white transition-all font-medium" 
                />
              </div>
            </div>

            <button className="w-full py-5 bg-[#5D5FEF] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-[#5D5FEF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Sign In to Dashboard
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Don't have an account? <Link href="/signup" className="text-[#5D5FEF] font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </main>
  );
}