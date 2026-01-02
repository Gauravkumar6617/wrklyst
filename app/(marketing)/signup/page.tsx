"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signupAction } from './action'; // Import the action
import toast from 'react-hot-toast';
import { Box, User, Mail, Lock, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFormAction = (formData: FormData) => {
    startTransition(async () => {
      const result = await signupAction(formData);
      
      if (result.success) {
        toast.success(result.message || "OTP sent to your email!");
        // Redirect to your OTP page
        const email = formData.get("email")?.toString();
        router.push(`/verify-otp?email=${encodeURIComponent(email || "")}`);
      } else {
        toast.error(result.error || "Signup failed");
      }
    });
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE (The Brand Vibe) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#5D5FEF] relative overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
        <Link href="/" className="relative z-10 flex items-center gap-2 font-bold text-2xl text-white">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl"><Box size={24} /></div>
          <span>Wrklyst</span>
        </Link>
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-black text-white leading-[1.1]">Join the <br/> Workflow <br/> Revolution.</h2>
          <ul className="space-y-4 text-white/90 font-bold">
            <li className="flex items-center gap-3"><CheckCircle size={20}/> Secure File Processing</li>
            <li className="flex items-center gap-3"><CheckCircle size={20}/> 50+ Premium Tools</li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE (The Form) */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-[900] text-[#1A1A1A] tracking-tighter">Create Account</h1>
            <p className="text-slate-500 font-medium">Join 10,000+ users optimizing their work.</p>
          </div>

          <form action={handleFormAction} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input required name="username" type="text" placeholder="johndoe" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input required name="email" type="email" placeholder="name@company.com" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input required name="password" type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium" />
              </div>
            </div>

            <button 
              disabled={isPending}
              type="submit"
              className="w-full py-5 bg-[#1E1F4B] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70"
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                <>Get Started <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Already a member? <Link href="/login" className="text-[#5D5FEF] font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}