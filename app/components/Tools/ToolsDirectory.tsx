"use client";
import Link from "next/link";
import { ArrowRight, FileText, ImageIcon, Type, Shield, Terminal } from "lucide-react";
import { TOOLS_CONFIG } from "@/lib/tools-data"; // Import your source of truth

const categories = [
  {
    title: "Writing Tools",
    id: "writing-tools",
    icon: <Type className="text-emerald-500" size={20} />,
    slugs: [
      "word-counter", 
      "text-compare", 
      "text-formatter", 
      "dummy-text-generator", 
      "grammar-checker", 
      "line-sorter",
      "remove-special-characters", // Added
  "remove-emojis"
    ]
  },
  {
    title: "Developer Tools",
    id: "developer-tools",
    icon: <Terminal className="text-[#5D5FEF]" size={20} />,
    slugs: [
      "json-formatter", 
      "code-beautifier", 
      "base64-encoder-decoder", 
      "url-encoder-decoder", 
      "text-to-slug",
      "remove-special-characters", // Added
  "remove-emojis"
    ]
  },
  {
    title: "PDF Tools",
    id: "pdf-tools",
    icon: <FileText className="text-red-500" size={20} />,
    slugs: ["merge-pdf", "compress-pdf", "pdf-to-jpg"] 
  },
  {
    title: "Image Tools",
    id: "image-tools",
    icon: <ImageIcon className="text-blue-500" size={20} />,
    slugs: ["remove-bg", "resize-image"]
  }
];

export default function ToolsDirectory() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-20 flex flex-col lg:flex-row gap-16">
      
      {/* Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-6 px-4">Categories</h3>
        <nav className="space-y-2">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => document.getElementById(cat.id)?.scrollIntoView({behavior: 'smooth'})}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-[#5D5FEF] hover:shadow-sm transition-all text-sm group"
            >
              {cat.icon}
              {cat.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Tools Grid */}
      <div className="flex-1 space-y-24">
        {categories.map((cat) => (
          <div key={cat.id} id={cat.id}>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">{cat.icon}</div>
              <h2 className="text-3xl font-black text-[#2D2E5F] tracking-tight">{cat.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cat.slugs.map((slug) => {
                const tool = TOOLS_CONFIG[slug];
                if (!tool) return null; // Safety check

                return (
                  <Link 
                    href={`/tools/${slug}`} 
                    key={slug}
                    className="group bg-white border border-slate-100 rounded-[40px] overflow-hidden hover:border-[#5D5FEF]/30 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500"
                  >
                    {/* Placeholder for tool icon/preview */}
                    <div className="h-48 w-full relative overflow-hidden bg-slate-50 flex items-center justify-center">
                       <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                         {/* Optional: Add a subtle grid pattern background here */}
                       </div>
                       <span className="text-[#5D5FEF] font-black text-4xl opacity-20 group-hover:scale-110 transition-transform">
                         {tool.name.split(' ')[0]}
                       </span>
                    </div>

                    <div className="p-8">
                      <h4 className="text-xl font-bold text-[#2D2E5F] group-hover:text-[#5D5FEF] transition-colors mb-2">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-[#5D5FEF] font-black text-[10px] uppercase tracking-widest">
                        Launch Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}