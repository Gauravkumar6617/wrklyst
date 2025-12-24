import Footer from '@/app/components/Home/Footer';
import Navbar from '@/app/components/layout/Navbar';
import { Mail, MessageSquare, Send, Sparkles, Bug } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* --- HERO & FORM SECTION --- */}
      <section className="hero-bg-custom pt-40 pb-20 relative overflow-hidden">
        {/* Animated Background Glows */}
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[#5D5FEF]/10 rounded-full blur-[120px] animate-pulse-slow z-0" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-blue-400/10 rounded-full blur-[120px] animate-pulse-slow z-0" />
        
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Left Side: Contact Content */}
            <div className="flex-1 space-y-8">
              <span className="text-[#5D5FEF] font-bold text-sm uppercase tracking-[4px]">Get in Touch</span>
              <h1 className="text-6xl font-[900] text-[#1A1A1A] leading-tight tracking-tighter">
                Let’s start a <br />
                <span className="text-[#5D5FEF]">Conversation.</span>
              </h1>
              <p className="text-xl text-slate-600 font-medium max-w-md leading-relaxed">
                Have a question about our tools or need help with your account? Our team is here to support you.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5D5FEF] group-hover:scale-110 group-hover:shadow-md transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                    <p className="font-bold text-[#2D2E5F]">support@wrklyst.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5D5FEF] group-hover:scale-110 group-hover:shadow-md transition-all">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Chat</p>
                    <p className="font-bold text-[#2D2E5F]">Available Mon-Fri, 9am - 5pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: The Glass Contact Form */}
            <div className="w-full lg:w-[500px] bg-white/80 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_40px_100px_-15px_rgba(93,95,239,0.15)] border border-white">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input type="text" placeholder="John" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium placeholder:text-slate-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium placeholder:text-slate-300" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea rows={4} placeholder="How can we help?" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-[#5D5FEF]/20 transition-all font-medium resize-none placeholder:text-slate-300"></textarea>
                </div>

                <button className="w-full py-5 bg-[#5D5FEF] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-[#5D5FEF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Send Message
                  <Send size={18} />
                </button>

                {/* Personal Note */}
                <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                  ✨ We love to hear from you!
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* --- COMMUNITY FEEDBACK SECTION --- */}
      <section className="py-24 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5D5FEF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5D5FEF]"></span>
            </span>
            <span className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-[2px]">We're Listening</span>
          </div>

          <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight mb-6">
            Missing a tool? <span className="text-[#5D5FEF]">Let us build it.</span>
          </h2>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            Whether you're facing a technical issue or just wish we had a specific tool to make your life easier—our roadmap is shaped by our users.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Tool Request Box */}
            <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#2D2E5F] mb-2">Request a Tool</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Tell us about a workflow that’s taking too long. We love building new features based on your ideas!
              </p>
            </div>

            {/* Bug Report Box */}
            <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Bug size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#2D2E5F] mb-2">Report an Issue</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Facing a glitch or a bug? Send us the details and our engineering team will squash it instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}