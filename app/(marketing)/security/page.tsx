// app/security/page.tsx
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/Home/Footer";
import LegalLayout from "@/app/components/Legal/LegalLayout";
import { ShieldCheck, Lock, Server, EyeOff, Trash2, Globe } from "lucide-react";

const SecurityPage = () => {
  return (
    <main>
      <Navbar />
      <LegalLayout 
        title="Security Infrastructure" 
        subtitle="Trust & Safety" 
        lastUpdated="December 2025" 
        version="1.2"
      >
        <div className="mb-12">
          <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">Enterprise-Grade Protection</h2>
          <p className="text-slate-500 leading-relaxed font-medium">
            At Wrklyst, security isn't a feature—it's our foundation. We employ multiple layers of encryption and strict data handling protocols to ensure your files remain your own.
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { 
              icon: <Lock className="text-[#5D5FEF]" />, 
              title: "End-to-End Encryption", 
              desc: "All data is encrypted in transit using 256-bit SSL/TLS protocols, the same standard used by global banks." 
            },
            { 
              icon: <Server className="text-blue-500" />, 
              title: "Secure Hosting", 
              desc: "Our infrastructure runs on AWS (Amazon Web Services), compliant with SOC 2 Type II and ISO 27001." 
            },
            { 
              icon: <Trash2 className="text-red-500" />, 
              title: "Automatic Shredding", 
              desc: "Files are automatically and permanently deleted from our temporary storage 60 minutes after processing." 
            },
            { 
              icon: <EyeOff className="text-emerald-500" />, 
              title: "No Data Logging", 
              desc: "We do not store, view, or analyze the content of the files you process through our tools." 
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-[#F8FAFC] rounded-[32px] border border-slate-100">
              <div className="mb-4">{item.icon}</div>
              <h4 className="font-bold text-[#2D2E5F] mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">Compliance & Standards</h2>
          <p className="text-slate-500 leading-relaxed font-medium mb-6">
            Wrklyst is built to meet the most stringent global data protection regulations.
          </p>
          <div className="flex flex-wrap gap-4">
            {['GDPR Compliant', 'SSL Certified', 'AES-256 Encryption'].map((badge) => (
              <span key={badge} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8 bg-[#1E1F4B] rounded-[32px] text-white">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Globe size={20} className="text-indigo-300" /> Reporting a Vulnerability
          </h3>
          <p className="text-indigo-100/80 text-sm leading-relaxed font-medium">
            Contact our security team immediately at <span className="text-white font-bold underline">security@wrklyst.com</span>.
          </p>
        </div>
      </LegalLayout>
     
    </main>
  );
};

export default SecurityPage;