"use client";
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ImageIcon,
  Type,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import { TOOLS_CONFIG } from "@/lib/tools-data";

export default function ToolsDirectory() {
  // 1. DYNAMIC CATEGORY MAPPING
  // We extract all tools from TOOLS_CONFIG and group them by their 'category' property
  const groupedTools = Object.entries(TOOLS_CONFIG).reduce(
    (acc, [slug, tool]) => {
      const cat = tool.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({ slug, ...tool });
      return acc;
    },
    {} as Record<string, any[]>
  );

  // 2. ICON MAPPER
  // Assigns a Lucide icon based on the category name
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Writing":
        return <Type className="text-emerald-500" size={20} />;
      case "Developer":
        return <Terminal className="text-[#5D5FEF]" size={20} />;
      case "Security":
        return <Shield className="text-rose-500" size={20} />;
      case "Image":
        return <ImageIcon className="text-blue-500" size={20} />;
      case "PDF":
        return <FileText className="text-red-500" size={20} />;
      default:
        return <Zap className="text-amber-500" size={20} />;
    }
  };

  const categoryNames = Object.keys(groupedTools);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 flex flex-col lg:flex-row gap-16">
      {/* Dynamic Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-6 px-4">
          Categories
        </h3>
        <nav className="space-y-2">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                document
                  .getElementById(cat)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-[#5D5FEF] hover:shadow-sm transition-all text-sm group capitalize"
            >
              {getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* Dynamic Tools Grid */}
      <div className="flex-1 space-y-24">
        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category} id={category} className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                {getCategoryIcon(category)}
              </div>
              <h2 className="text-3xl font-black text-[#2D2E5F] tracking-tight capitalize">
                {category} Tools
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tools.map((tool) => (
                <Link
                  href={`/tools/${tool.slug}`}
                  key={tool.slug}
                  className="group bg-white border border-slate-100 rounded-[40px] overflow-hidden hover:border-[#5D5FEF]/30 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col"
                >
                  {/* Tool Preview Area */}
                  <div className="h-40 w-full relative overflow-hidden bg-slate-50 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <span className="text-[#5D5FEF] font-black text-2xl opacity-20 group-hover:scale-110 transition-transform uppercase tracking-tighter">
                      {tool.name}
                    </span>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-md uppercase tracking-widest">
                        {category}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-[#2D2E5F] group-hover:text-[#5D5FEF] transition-colors mb-2">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                      {tool.description}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-[#5D5FEF] font-black text-[10px] uppercase tracking-widest">
                      Launch Tool{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
