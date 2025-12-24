// components/Home/FinalCTA.tsx
export default function CTA() {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-[#1E1F4B] rounded-[48px] p-16 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
          {/* Background Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5D5FEF]/20 blur-[100px]" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to optimize your <br /> files for free?
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of users who manage their documents faster every single day.
          </p>
          
          <button className="bg-white text-[#1E1F4B] px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
            Get Started for Free
          </button>
        </div>
      </section>
    );
  }