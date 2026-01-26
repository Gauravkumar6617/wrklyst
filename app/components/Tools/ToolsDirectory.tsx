"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ImageIcon,
  Type,
  Shield,
  Terminal,
  Zap,
  Search,
  LayoutGrid,
  SlidersHorizontal,
  MousePointer2,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TOOLS_CONFIG } from "@/lib/tools-data";

export default function ToolsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // 1. DYNAMIC DATA PROCESSING
  const allTools = useMemo(() => {
    return Object.entries(TOOLS_CONFIG).map(([slug, tool]) => ({
      slug,
      ...tool,
    }));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(allTools.map((t) => t.category || "General")),
    );
    return ["All", ...cats];
  }, [allTools]);

  // 2. FILTERING LOGIC
  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, allTools]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Writing":
        return <Type size={18} />;
      case "Developer":
        return <Terminal size={18} />;
      case "Security":
        return <Shield size={18} />;
      case "Image":
        return <ImageIcon size={18} />;
      case "PDF":
        return <FileText size={18} />;
      default:
        return <Zap size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER & SEARCH SECTION */}
      <section className="bg-white border-b border-slate-100 pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <span className="px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 inline-block">
                Utility Library
              </span>
              <h1 className="text-5xl md:text-6xl font-[1000] text-[#1E1F4B] tracking-tighter mb-4">
                Explore the <span className="text-indigo-600">Toolset.</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                Over 50+ professional-grade utilities processed entirely in your
                browser.
              </p>
            </div>

            {/* SEARCH BAR */}
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search 50+ tools..."
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-[#1E1F4B]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2
                  ${
                    activeCategory === cat
                      ? "bg-[#1E1F4B] border-[#1E1F4B] text-white shadow-xl shadow-indigo-100"
                      : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"
                  }
                `}
              >
                {cat !== "All" && getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <LayoutGrid size={16} />
            Showing {filteredTools.length} Result
            {filteredTools.length !== 1 ? "s" : ""}
          </h3>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredTools.map((tool) => (
                <motion.div
                  layout
                  key={tool.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group h-full bg-white border border-slate-100 p-8 rounded-[32px] hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(93,95,239,0.08)] transition-all flex flex-col relative overflow-hidden"
                  >
                    {/* Hover Decoration */}
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 -z-0 scale-0 group-hover:scale-150" />

                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600`}
                      >
                        {getCategoryIcon(tool.category)}
                      </div>
                      <h4 className="text-lg font-black text-[#1E1F4B] mb-2 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-indigo-600 transition-colors mt-auto">
                        Launch{" "}
                        <ArrowRight
                          size={12}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-300" />
            </div>
            <h4 className="text-2xl font-black text-[#1E1F4B] mb-2">
              No tools found
            </h4>
            <p className="text-slate-500 font-medium">
              Try adjusting your search or category filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
