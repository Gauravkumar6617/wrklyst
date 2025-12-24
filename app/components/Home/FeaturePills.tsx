// components/Home/FeaturePills.tsx
import { ShieldCheck, Zap, User, Heart } from 'lucide-react';

export default function FeaturePills() {
  const features = [
    { icon: <ShieldCheck size={18} />, text: "Secure & Private" },
    { icon: <Zap size={18} />, text: "Secure & Private" }, // Matches image text
    { icon: <User size={18} />, text: "Fast & Reliable" },
    { icon: <Heart size={18} />, text: "User-Friendly" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((item, i) => (
          <div 
            key={i} 
            /* bg-[#eff6ff] is that very light "ice blue" from your image */
            className="flex items-center justify-center gap-4 py-6 px-4 bg-[#eff6ff] border border-white shadow-sm rounded-2xl hover:bg-white transition-all duration-300"
          >
            <div className="text-[#5D5FEF] opacity-70">
              {item.icon}
            </div>
            <span className="font-bold text-[#2D2E5F] text-[15px] tracking-tight whitespace-nowrap opacity-80">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}