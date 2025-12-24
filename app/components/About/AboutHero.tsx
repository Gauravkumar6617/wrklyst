export default function AboutHero() {
    return (
      <section className="hero-bg-custom pt-40 pb-24 relative overflow-hidden text-center">
        {/* Background elements to match the Home Hero */}
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[#5D5FEF]/10 rounded-full blur-[120px] animate-pulse-slow" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <span className="text-[#5D5FEF] font-bold text-sm uppercase tracking-[4px] mb-4 block">Our Mission</span>
          <h1 className="text-5xl md:text-7xl font-[900] text-[#1A1A1A] leading-tight tracking-tighter mb-8">
            We’re building the <br /> 
            <span className="text-[#5D5FEF]">Future of File Work.</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Wrklyst was born out of a simple frustration: file management shouldn't be hard. 
            We built a suite of tools that are fast, private, and actually fun to use.
          </p>
        </div>
      </section>
    );
  }