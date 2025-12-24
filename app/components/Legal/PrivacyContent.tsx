// components/Legal/PrivacyContent.tsx
import { Lock, EyeOff, Trash2, ShieldCheck } from "lucide-react";

export default function PrivacyContent() {
  return (
    <>
      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4 text-center lg:text-left">Our Commitment to Privacy</h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          At Wrklyst, we believe your data belongs to you. Our business model is built on providing high-quality tools, not on harvesting user data. We do not track your individual file contents or sell your information to third parties.
        </p>
      </div>

      {/* --- KEY DATA PILLARS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Lock className="text-purple-500" />, title: "Fully Encrypted", desc: "All transfers use 256-bit SSL encryption." },
          { icon: <EyeOff className="text-blue-500" />, title: "No Human Eyes", desc: "Processes are automated; no one views your files." },
          { icon: <Trash2 className="text-emerald-500" />, title: "Auto-Deletion", desc: "Files vanish from our servers after 60 minutes." }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-[#F8FAFC] rounded-[32px] border border-slate-100 text-center flex flex-col items-center group hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h4 className="font-bold text-[#2D2E5F] text-sm mb-1">{item.title}</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">Information We Collect</h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          We collect minimal information required to provide our services:
        </p>
        <ul className="mt-4 space-y-4">
          <li className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#5D5FEF]/10 flex items-center justify-center shrink-0 text-[#5D5FEF] font-bold text-xs">01</div>
            <span><strong className="text-[#2D2E5F]">Account Information:</strong> If you create an account, we store your email and name to manage your subscription.</span>
          </li>
          <li className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#5D5FEF]/10 flex items-center justify-center shrink-0 text-[#5D5FEF] font-bold text-xs">02</div>
            <span><strong className="text-[#2D2E5F]">Usage Metadata:</strong> We track success rates to improve performance. We do NOT track file content.</span>
          </li>
        </ul>
      </div>

      <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 mb-12">
        <h2 className="text-xl font-black text-[#1E1F4B] mb-3 flex items-center gap-2">
          <ShieldCheck size={20} className="text-[#5D5FEF]" /> Third-Party Services
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          We use Stripe for payment processing and AWS for secure cloud hosting. These providers have their own strict privacy policies and are compliant with global security standards.
        </p>
      </div>
    </>
  );
}