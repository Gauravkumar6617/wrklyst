// components/Home/Testimonials.tsx
export default function Testimonials() {
    return (
      <section className="py-24 bg-[#F8FAFC]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#5D5FEF] font-bold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl font-black text-[#1A1A1A] mt-4 mb-12">Trusted by 10,000+ Professionals</h2>
          
          <div className="bg-white p-12 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white relative">
            {/* Large Quote Mark Decoration */}
            <div className="absolute top-10 left-10 text-9xl text-slate-50 font-serif -z-0 select-none">“</div>
            
            <p className="relative z-10 text-2xl font-medium text-slate-700 leading-relaxed mb-10">
              "Wrklyst transformed my workflow! Simple yet powerful. I can merge and compress my client reports in seconds without losing quality."
            </p>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md">
                <img src="https://i.pravatar.cc/150?u=44" alt="User" />
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A]">Sarah Jenkins</p>
                <p className="text-sm text-slate-400 font-medium">Creative Director at Studio</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }