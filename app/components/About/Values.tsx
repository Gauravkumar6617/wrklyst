const values = [
    { title: "Privacy First", desc: "Your files never touch our permanent storage. Everything happens in-browser or is deleted instantly.", icon: "🔒" },
    { title: "Speed Matters", desc: "No loading screens, no waiting. Our cloud infrastructure is optimized for instant processing.", icon: "⚡" },
    { title: "Design Driven", desc: "We believe utility tools should be beautiful. We obsess over every pixel and interaction.", icon: "🎨" }
  ];
  
  export default function Values() {
    return (
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((val, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-[#5D5FEF]/10 group-hover:scale-110 transition-all duration-300">
                {val.icon}
              </div>
              <h3 className="text-2xl font-extrabold text-[#1A1A1A] mb-4">{val.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }