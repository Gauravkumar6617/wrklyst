"use client";
import { useState, useEffect, useRef, useTransition } from "react";
import { ShieldCheck, ArrowRight, RefreshCcw ,Loader2} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { verifyOtpAction } from "./action";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic for resending OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle digit input
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

 
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || ""; // Get email from URL
  
  
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    const code = otp.join("");
    
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    startTransition(async () => {
      const result = await verifyOtpAction(email, code);

      if (result.success) {
        toast.success("Account verified! Please login.");
        router.push("/login");
      } else {
        toast.error(result.error || "Verification failed");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF] relative flex items-center justify-center p-6 overflow-hidden">
    {/* Decorative Background Elements */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5D5FEF]/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px]" />

    <div className="absolute top-10 left-6 md:left-10">
      <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-[#1E1F4B] group">
        <div className="bg-[#5D5FEF] p-2 rounded-xl text-white shadow-lg shadow-[#5D5FEF]/20 group-hover:scale-110 transition-transform">
          <ShieldCheck size={20} />
        </div>
        <span className="tracking-tighter text-2xl font-black">Wrklyst</span>
      </Link>
    </div>

    <div className="w-full max-w-[460px] relative">
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] border border-slate-100 text-center relative z-10">
        
        {/* Icon Header */}
        <div className="relative w-20 h-20 mx-auto mb-8">
           <div className="absolute inset-0 bg-[#5D5FEF] opacity-10 blur-2xl rounded-full animate-pulse" />
           <div className="relative w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-[#5D5FEF]">
              <ShieldCheck size={40} strokeWidth={1.5} />
           </div>
        </div>

        <h1 className="text-3xl font-[900] text-[#1A1A1A] mb-3 tracking-tight">Verify your email</h1>
        <p className="text-slate-500 font-medium text-[15px] mb-10 leading-relaxed">
          We've sent a 6-digit verification code to <br/>
          <span className="text-[#1A1A1A] font-bold">{email || "your email"}</span>
        </p>

        {/* OTP Input Grid */}
      {/* OTP Input Grid */}
<div className="flex justify-between gap-3 mb-10">
  {otp.map((digit, i) => (
    <input
      key={i}
      type="text"
      maxLength={1}
      ref={(el) => { inputRefs.current[i] = el; }}
      value={digit}
      onChange={(e) => handleChange(i, e.target.value)}
      onKeyDown={(e) => handleKeyDown(i, e)}
      // Improved visibility styles below:
      className="w-full aspect-[3/4] text-center text-3xl font-black 
                 text-[#1E1F4B] bg-slate-100/50 border-[2px] border-slate-200 
                 rounded-2xl focus:border-[#5D5FEF] focus:bg-white 
                 focus:shadow-[0_0_0_4px_rgba(93,95,239,0.1)] 
                 outline-none transition-all duration-200"
    />
  ))}
</div>

        <button 
          onClick={handleVerify}
          disabled={isPending}
          className="w-full bg-[#1E1F4B] text-white py-5 rounded-[22px] font-bold text-[16px] hover:bg-[#2D2E5F] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/10 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Verify Account
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Resend Footer */}
        <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
          {timer > 0 ? (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-[2px]">Resend available in</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[#5D5FEF] text-xs font-bold font-mono">
                 {timer}s
              </span>
            </div>
          ) : (
            <button 
              onClick={() => setTimer(60)}
              className="group flex items-center gap-2 text-[#5D5FEF] text-xs font-black uppercase tracking-widest hover:text-[#1E1F4B] transition-colors"
            >
              <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
              Resend OTP Code
            </button>
          )}
          
          <Link href="/signup" className="text-xs font-bold text-slate-400 hover:text-[#5D5FEF] transition-colors">
            Entered wrong email? <span className="underline">Change it</span>
          </Link>
        </div>
      </div>

      {/* Footer Detail */}
      <p className="text-center mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[3px]">
        Secure Verification by Wrklyst
      </p>
    </div>
  </main>
  );
}