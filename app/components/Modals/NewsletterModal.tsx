"use client";
import { useState, useEffect } from "react";
import { X, Send, Mail, Gift, CheckCircle2 } from "lucide-react"; // Added CheckCircle2
import { useSubscriber } from "@/hooks/subscriberHook";

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  
  // 1. Pull isSubscribed from your hook
  const { subscribe, loading, isSubscribed } = useSubscriber();

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("newsletter_shown");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("newsletter_shown", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 2. Automatically close the modal after success
  useEffect(() => {
    if (isSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000); // Wait 3 seconds so they can see the success message
      return () => clearTimeout(timer);
    }
  }, [isSubscribed]);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    await subscribe(email);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-[#1E1F4B]/60 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors z-20"
        >
          <X size={20} className="text-slate-400" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-[#5D5FEF] p-8 flex flex-col items-center justify-center text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-4">
              {isSubscribed ? <CheckCircle2 size={32} /> : <Gift size={32} />}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">
              {isSubscribed ? "Success" : "Free Tool"}
            </p>
          </div>

          <div className="md:w-2/3 p-10">
            {/* 3. Conditional UI: Show Success Message instead of Form */}
            {isSubscribed ? (
              <div className="py-6 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">You're in!</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Thank you for joining. Check your inbox for your exclusive access. 
                  Closing this window shortly...
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-[#1A1A1A] mb-2 tracking-tight">
                  Get 20% faster <br /> <span className="text-[#5D5FEF]">Workflows.</span>
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                  Join 4,000+ pros getting weekly tips and exclusive free tool access.
                </p>

                <form className="space-y-3" onSubmit={handleJoin}>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 font-medium text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E1F4B] text-white py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Joining..." : "Join Now"} <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}