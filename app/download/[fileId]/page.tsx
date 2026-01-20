"use client";
import React, { use } from "react"; //
import { useSearchParams } from "next/navigation";
import {
  Download,
  Share2,
  Coffee,
  Mail,
  CheckCircle,
  Twitter,
  Linkedin,
} from "lucide-react";
import Footer from "@/app/components/layout/Footer";

// 1. Change params to a Promise type
export default function DownloadPage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  // 2. Unwrap the params using React.use()
  const unwrappedParams = use(params);
  const fileId = unwrappedParams.fileId;

  const searchParams = useSearchParams();
  const fileName = searchParams.get("name") || "document.docx";
  const toolName = searchParams.get("tool") || "Conversion";

  // 3. The URL now correctly includes the real fileId instead of 'undefined'
  const downloadUrl = `/api/files/retrieve/${fileId}`;

  return (
    <div className="max-w-6xl mx-auto pt-28 pb-10 px-4 min-h-screen">
      {/* 1. Success Hero Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={36} className="text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center leading-tight">
          {toolName} Complete!
        </h1>
        <p className="text-slate-500 mt-2 text-lg text-center">
          Your file{" "}
          <span className="text-blue-600 font-medium italic">"{fileName}"</span>{" "}
          is ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Download & Ads */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center justify-center text-center">
            {/* 4. This link will now call your Retrieval API with the correct ID */}
            <a
              href={downloadUrl}
              download
              className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white w-full max-w-md py-5 rounded-2xl font-bold text-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <Download size={24} className="group-hover:animate-bounce" />
              Download Now
            </a>

            <button className="mt-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium transition text-sm mx-auto">
              <Share2 size={16} /> Share result link
            </button>

            <div className="mt-8 pt-8 border-t border-slate-100 w-full">
              <p className="text-xs text-slate-400">
                * For your privacy, files are automatically wiped from our
                server in 60 minutes.
              </p>
            </div>
          </div>

          {/* Ad Space */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-[10px] font-bold tracking-[0.3em] text-slate-300 mb-2 uppercase">
              Advertisement
            </span>
            <p className="text-slate-300 text-sm">Google AdSense Space</p>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111827] rounded-3xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
              <Mail size={18} className="text-blue-400" /> Send to Email
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Can't download now? Save the link to your inbox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold text-sm transition">
                Send Link
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-sm">
              <Coffee size={16} className="text-orange-500" /> Support Wrklyst
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button className="flex items-center justify-center bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 p-3 rounded-xl transition">
                <Twitter size={18} />
              </button>
              <button className="flex items-center justify-center bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 p-3 rounded-xl transition">
                <Linkedin size={18} />
              </button>
            </div>
            <button className="w-full bg-[#FFDD00] hover:bg-[#FFD700] text-black font-extrabold py-3.5 rounded-xl text-sm shadow-sm transition">
              BUY ME A COFFEE
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
