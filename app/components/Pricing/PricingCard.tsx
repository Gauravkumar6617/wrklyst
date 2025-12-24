// components/Pricing/PricingCard.tsx
import { Check, Star } from 'lucide-react';

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    desc: string;
    features: string[];
    button: string;
    pro: boolean;
  }
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div className={`relative p-10 rounded-[48px] border transition-all duration-500 hover:-translate-y-3 flex flex-col ${
      plan.pro 
      ? 'bg-[#1E1F4B] text-white shadow-[0_40px_80px_-15px_rgba(93,95,239,0.25)] border-indigo-500/50' 
      : 'bg-white text-[#1A1A1A] border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]'
    }`}>
      
      {/* 1. "Most Popular" Badge */}
      {plan.pro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#5D5FEF] to-[#4338CA] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2 shadow-xl shadow-indigo-500/20">
          <Star size={12} fill="currentColor" /> Most Popular
        </div>
      )}

      {/* 2. Header */}
      <div className="mb-8">
        <h3 className={`text-2xl font-black mb-2 ${plan.pro ? 'text-white' : 'text-[#2D2E5F]'}`}>
          {plan.name}
        </h3>
        <p className={`text-sm font-medium leading-relaxed ${plan.pro ? 'text-indigo-200/80' : 'text-slate-400'}`}>
          {plan.desc}
        </p>
      </div>

      {/* 3. Pricing Area */}
      <div className="mb-10 flex items-baseline gap-1">
        <span className="text-6xl font-black tracking-tighter">${plan.price}</span>
        <span className={`text-lg font-bold ${plan.pro ? 'text-indigo-300' : 'text-slate-400'}`}>/mo</span>
      </div>

      {/* 4. Feature List */}
      <ul className="space-y-5 mb-12 flex-1">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-4 font-semibold text-[15px]">
            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
              plan.pro ? 'bg-indigo-500/30 text-indigo-300' : 'bg-[#5D5FEF]/10 text-[#5D5FEF]'
            }`}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span className={plan.pro ? 'text-indigo-50' : 'text-slate-600'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* 5. CTA Button */}
      <button className={`w-full py-5 rounded-[24px] font-bold text-lg transition-all active:scale-[0.97] shadow-lg ${
        plan.pro 
        ? 'bg-[#5D5FEF] text-white shadow-indigo-500/40 hover:bg-[#4d4fd6] hover:shadow-indigo-500/60' 
        : 'bg-[#F1F5F9] text-[#2D2E5F] hover:bg-slate-200'
      }`}>
        {plan.button}
      </button>
      
      {/* Subtle Bottom Glow for Pro Card */}
      {plan.pro && (
        <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-30" />
      )}
    </div>
  );
}