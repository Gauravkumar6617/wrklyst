"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is Wrklyst really free to use?",
    a: "Yes! Most of our tools are free with generous daily limits. We offer a Pro plan for users who need unlimited processing and larger file sizes."
  },
  {
    q: "What happens to my files after I upload them?",
    a: "Privacy is our priority. Your files are processed in-memory and are automatically deleted from our servers within 1 hour of processing."
  },
  {
    q: "Do I need to create an account to merge PDFs?",
    a: "No account is required for basic tasks. You can simply upload, process, and download your files instantly."
  },
  {
    q: "Can I use Wrklyst on my mobile phone?",
    a: "Absolutely! Our website is fully responsive and works perfectly on iOS and Android browsers without needing to download an app."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    /* Increased the vertical gap to 6 (24px) or 8 (32px) for that 'leaving space' feel */
    <div className="flex flex-col gap-6 py-10">
      {faqs.map((faq, i) => (
        <div 
          key={i} 
          className={`group rounded-[32px] border transition-all duration-500 overflow-hidden ${
            openIndex === i 
            ? 'border-[#5D5FEF] bg-white shadow-[0_20px_50px_rgba(93,95,239,0.1)] scale-[1.02]' 
            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
          }`}
        >
          <button 
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
          >
            <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${
              openIndex === i ? 'text-[#5D5FEF]' : 'text-[#2D2E5F]'
            }`}>
              {faq.q}
            </span>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              openIndex === i ? 'bg-[#5D5FEF] text-white rotate-180' : 'bg-slate-50 text-slate-400'
            }`}>
              <ChevronDown size={20} strokeWidth={2.5} />
            </div>
          </button>
          
          <div 
            className={`transition-all duration-500 ease-in-out ${
              openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-8 pb-10">
               {/* Added an extra inner container for smoother text appearance */}
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}