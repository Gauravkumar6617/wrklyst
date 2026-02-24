"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Download,
  Share2,
  Coffee,
  Mail,
  CheckCircle,
  Twitter,
  Linkedin,
  AlertCircle,
} from "lucide-react";
import Footer from "@/app/components/layout/Footer";

export default function DownloadPage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const unwrappedParams = use(params);
  const fileId = unwrappedParams.fileId;
  const searchParams = useSearchParams();

  const fileName = searchParams.get("name") || "document.xlsx";
  const toolName = searchParams.get("tool") || "Conversion";
  const isLocal =
    searchParams.get("local") === "true" || fileId.startsWith("local-");

  // State for local blob management
  const [localDownloadUrl, setLocalDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLocal) {
      const savedData = sessionStorage.getItem("current_download");
      console.log("📥 Download Page: Checking session storage...");

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          console.log("✅ Download Page: Data parsed successfully");

          // We check for 'data' because that's what the converter sends
          if (parsed.data) {
            setLocalDownloadUrl(parsed.data);
            console.log("🔗 Download Page: URL set from Base64 data");
          } else {
            console.error(
              "❌ Download Page: No 'data' field found in parsed object",
            );
            setError(true);
          }
        } catch (e) {
          console.error("❌ Download Page: JSON Parse Error", e);
          setError(true);
        }
      } else {
        console.error(
          "❌ Download Page: No 'current_download' found in sessionStorage",
        );
        setError(true);
      }
    }
  }, [isLocal]);
  // Determine final href
  // If local: use the Blob URL from state. If server: use the API route.
  const finalDownloadHref = isLocal
    ? localDownloadUrl
    : toolName === "HTML to PDF"
      ? `/api/pdf/retrieve/${fileId}` // Or whatever your GET route is
      : `/api/files/retrieve/${fileId}`;
  return (
    <div className="max-w-6xl mx-auto pt-28 pb-10 px-4 min-h-screen">
      <div className="flex flex-col items-center mb-10">
        <div
          className={`w-16 h-16 ${error ? "bg-red-100" : "bg-green-100"} rounded-full flex items-center justify-center mb-4`}
        >
          {error ? (
            <AlertCircle size={36} className="text-red-600" />
          ) : (
            <CheckCircle size={36} className="text-green-600" />
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center leading-tight">
          {error ? "File Not Found" : `${toolName} Complete!`}
        </h1>
        <p className="text-slate-500 mt-2 text-lg text-center">
          {error ? (
            "The local session expired. Please go back and convert the file again."
          ) : (
            <>
              Your file{" "}
              <span className="text-blue-600 font-medium italic">
                "{fileName}"
              </span>{" "}
              is ready.
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center justify-center text-center">
            {error ? (
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-3 bg-slate-800 text-white w-full max-w-md py-5 rounded-2xl font-bold text-xl transition-all active:scale-95"
              >
                Go Back
              </button>
            ) : (
              <a
                href={finalDownloadHref || "#"}
                download={fileName}
                className={`group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white w-full max-w-md py-5 rounded-2xl font-bold text-xl shadow-lg shadow-blue-100 transition-all active:scale-95 ${!finalDownloadHref ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Download size={24} className="group-hover:animate-bounce" />
                Download Now
              </a>
            )}

            <button className="mt-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium transition text-sm mx-auto">
              <Share2 size={16} /> Share result link
            </button>

            <div className="mt-8 pt-8 border-t border-slate-100 w-full">
              <p className="text-xs text-slate-400">
                {isLocal
                  ? "* For your security, this file is stored in your browser's memory and is never uploaded to our servers."
                  : "* For your privacy, files are automatically wiped from our server in 60 minutes."}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-[10px] font-bold tracking-[0.3em] text-slate-300 mb-2 uppercase">
              Advertisement
            </span>
            <p className="text-slate-300 text-sm">Google AdSense Space</p>
          </div>
        </div>

        {/* SIDEBAR */}
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
