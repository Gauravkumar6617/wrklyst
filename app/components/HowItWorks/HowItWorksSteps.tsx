// components/HowItWorks/HowItWorksSteps.tsx
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload your Files",
    desc: "Drag and drop your PDFs, Images, or Videos into our secure dropzone. We support bulk uploads so you can process dozens of files at once.",
    icon: <Upload size={32} />,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    number: "02",
    title: "Automatic Processing",
    desc: "Our cloud-native engine takes over. Whether it's merging, compressing, or converting, we use high-speed algorithms to ensure zero quality loss.",
    icon: <Cpu size={32} />,
    color: "text-[#5D5FEF]",
    bgColor: "bg-[#5D5FEF]",
  },
  {
    number: "03",
    title: "Download & Save",
    desc: "Once finished, your files are ready. Download them individually or as a ZIP. For your privacy, we wipe the data from our cache 60 minutes later.",
    icon: <Download size={32} />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
  }
];

export default function HowItWorksSteps() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div className="space-y-32">
        {steps.map((step, i) => (
          <div key={i} className={`flex flex-col md:flex-row items-center gap-16 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Visual Side */}
            <div className="flex-1 w-full">
              <div className={`aspect-square rounded-[48px] ${step.bgColor}/5 border border-slate-100 flex items-center justify-center relative group`}>
                <div className={`w-24 h-24 rounded-3xl ${step.bgColor} text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>
                {/* Decorative Number */}
                <span className="absolute -top-10 -left-5 text-[120px] font-black text-slate-50 select-none -z-10">
                  {step.number}
                </span>
              </div>
            </div>

            {/* Text Side */}
            <div className="flex-1 space-y-6">
              {/* FIXED: Removed step.pro and used step.color */}
              <span className={`text-sm font-black uppercase tracking-widest ${step.color}`}>
                Step {step.number}
              </span>
              <h3 className="text-4xl font-black text-[#1A1A1A] tracking-tight">
                {step.title}
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}