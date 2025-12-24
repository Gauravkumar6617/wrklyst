// app/terms/page.tsx

import Footer from "@/app/components/Home/Footer";
import Navbar from "@/app/components/layout/Navbar";
import LegalLayout from "@/app/components/Legal/LegalLayout";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <LegalLayout 
        title="Terms of Service" 
        subtitle="Legal Documentation" 
        lastUpdated="December 2025" 
        version="2.1"
      >
        <div className="mb-12">
          <h2 className="text-2xl font-black text-[#2D2E5F] mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-500 leading-relaxed font-medium">
            By accessing or using Wrklyst, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
          </p>
        </div>

        <div className="mb-12 p-8 bg-[#F8FAFC] rounded-3xl border border-slate-100">
          <h2 className="text-xl font-black text-[#2D2E5F] mb-4 flex items-center gap-2">
            <ShieldCheck className="text-[#5D5FEF]" /> 2. User Data & Privacy
          </h2>
          <ul className="space-y-3">
            {[
              "Processed in-memory whenever possible",
              "Encrypted during transmission via SSL",
              "Automatically deleted from our servers within 1 hour",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5D5FEF]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Add more sections as needed */}
      </LegalLayout>
      <Footer />
    </>
  );
}