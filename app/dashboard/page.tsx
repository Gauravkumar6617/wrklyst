"use client";
import React from 'react';
import Link from 'next/link';
import { 
  FileStack, 
  FileImage, 
  Settings2, 
  FileType, 
  ArrowRight,
  Plus
} from 'lucide-react';

const DashboardHome = () => {
  // This would ideally come from a 'recent_activity' API or LocalStorage
  const recentTools = [
    { 
      name: "Merge PDF", 
      desc: "Combine multiple PDFs into one document", 
      icon: FileStack, 
      href: "/tools/merge-pdf",
      color: "bg-indigo-50 text-[#5D5FEF]" 
    },
    { 
      name: "Image to PDF", 
      desc: "Convert JPG, PNG to high-quality PDF", 
      icon: FileImage, 
      href: "/tools/image-to-pdf",
      color: "bg-emerald-50 text-emerald-600" 
    },
    { 
      name: "PDF Compressor", 
      desc: "Reduce file size without losing quality", 
      icon: Settings2, 
      href: "/tools/compress-pdf",
      color: "bg-rose-50 text-rose-600" 
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-[1000] text-[#1E1F4B] tracking-tighter">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium mt-2">Access your most used tools and recent files.</p>
      </div>

      {/* RECENT TOOLS SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-[#1E1F4B]">Recent Tools</h2>
          <Link href="/tools" className="group text-sm font-bold text-[#5D5FEF] flex items-center gap-1 hover:gap-2 transition-all">
            Browse All Tools <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTools.map((tool, index) => (
            <Link key={index} href={tool.href} className="group">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#5D5FEF]/5 hover:border-[#5D5FEF]/30 transition-all duration-300 h-full flex flex-col items-start">
                <div className={`${tool.color} p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={28} />
                </div>
                <h3 className="text-lg font-[900] text-[#1E1F4B] mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  {tool.desc}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[11px] font-black text-[#5D5FEF] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Launch Tool <Plus size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* You can still keep a smaller Recent Activity table below this */}
    </div>
  );
};

export default DashboardHome;