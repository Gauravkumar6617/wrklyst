import Link from 'next/link';
import { Box, User, Mail, Lock, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      
      {/* LEFT SIDE: THE VIBE */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#5D5FEF] relative overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2 font-bold text-2xl text-white">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
            <Box size={24} />
          </div>
          <span className="tracking-tighter">Wrklyst</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-black text-white leading-tight">
            Start your <br /> <span className="text-[#1E1F4B]">Productivity</span> <br /> journey today.
          </h2>
          <ul className="space-y-4">
            {['Unlimited file processing', 'Priority cloud speeds', 'Secure SSL encryption'].map(item => (
              <li key={item} className="flex items-center gap-3 text-white font-bold">
                <CheckCircle size={20} className="text-[#1E1F4B]" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-white/60 text-sm font-bold uppercase tracking-widest">
          Join 10,000+ users worldwide
        </div>
      </div>

      {/* RIGHT SIDE: THE FORM */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-[900] text-[#1A1A1A] tracking-tighter">Create Account</h1>
            <p className="text-slate-500 font-medium">Get started with your free 7-day trial.</p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 focus:bg-white transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="email" placeholder="name@company.com" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 focus:bg-white transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="password" placeholder="Min. 8 characters" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 focus:bg-white transition-all font-medium" />
              </div>
            </div>

            <button className="w-full py-5 bg-[#1E1F4B] text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
              Create My Account
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Already have an account? <Link href="/login" className="text-[#5D5FEF] font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}