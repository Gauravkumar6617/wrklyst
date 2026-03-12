"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Save,
  Info,
  Tag,
  User,
  Layout,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { setPDFMetadata } from "@/app/lib/pdf/enhance";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { useHistory } from "@/app/context/HistoryContext";
interface MetadataForm {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export function EditMetadataClient() {
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "editing" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [metadata, setMetadata] = useState<MetadataForm>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "Wrklyst Studio",
    producer: "Wrklyst Studio",
  });

  const handleFileInit = (selectedFile: File) => {
    setFile(selectedFile);
    setMetadata((prev) => ({
      ...prev,
      title: selectedFile.name.replace(".pdf", ""),
    }));
    setStatus("editing");
  };

  const handleSave = async () => {
    if (!file) return;
    setStatus("processing");

    try {
      const keywordArray = metadata.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);

      const newBytes = await setPDFMetadata(file, {
        ...metadata,
        keywords: keywordArray,
      });

      // --- UNIVERSAL DOWNLOAD PROTOCOL ---
      const uint8 = new Uint8Array(newBytes);
      let binary = "";
      for (let i = 0; i < uint8.byteLength; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      const base64String = window.btoa(binary);

      const payload = {
        data: base64String,
        name: `updated_${file.name}`,
        mime: "application/pdf",
      };

      // store payload in universal slot so the download page can grab it
      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      addToHistory("Edit Metadata", file.name, "Metadata updated");

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setStatus("success");

      // redirect to the shared download page; include name so the UI shows it
      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=Edit Metadata&name=${encodeURIComponent(
            payload.name,
          )}&local=true`,
        );
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to write metadata to PDF structure.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setMetadata({
      title: "",
      author: "",
      subject: "",
      keywords: "",
      creator: "Wrklyst Studio",
      producer: "Wrklyst Studio",
    });
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      <AnimatedBackground />
      <FloatingDecorations />

      <div className="relative z-10 container mx-auto px-4">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-4xl"
            >
              <ToolHeader
                title="Metadata Studio"
                description="Professional PDF property editor. Modify internal headers for SEO and document tracking."
                icon={FileText}
              />

              <div
                className="p-12 mt-10 border-2 border-dashed border-gray-200 hover:border-black transition-all group cursor-pointer rounded-2xl bg-white"
                onClick={() => document.getElementById("file-input")?.click()}
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]?.type === "application/pdf")
                    handleFileInit(e.dataTransfer.files[0]);
                }}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileInit(e.target.files[0])
                  }
                />
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter">
                    UPLOAD PDF
                  </h3>
                  <p className="text-gray-400 mt-2 font-medium">
                    Drop your document to reveal hidden properties
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {status === "editing" && (
            <motion.div
              key="editing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-5xl"
            >
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
                {/* Left: Document Info */}
                <div className="lg:col-span-4 space-y-6">
                  <ToolCard className="p-6 bg-black text-white border-none shadow-2xl rounded-[2.5rem]">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                      <FileText className="text-white" />
                    </div>
                    <h2 className="text-xl font-black italic mb-2 truncate">
                      {file?.name}
                    </h2>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                      {formatFileSize(file?.size || 0)}
                    </p>
                    <button
                      onClick={reset}
                      className="mt-8 text-xs font-black uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw size={12} /> Change File
                    </button>
                  </ToolCard>

                  <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Info className="text-indigo-600" size={18} />
                      <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-tight">
                        Pro Tip
                      </h4>
                    </div>
                    <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                      Metadata is used by search engines and document management
                      systems to index your files. Clear "Producer" fields to
                      remove software branding.
                    </p>
                  </div>
                </div>

                {/* Right: The Form */}
                <div className="lg:col-span-8">
                  <ToolCard className="p-8 md:p-12 shadow-2xl rounded-[3rem]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MetadataField
                        label="Document Title"
                        icon={FileText}
                        value={metadata.title}
                        onChange={(val: string) =>
                          setMetadata({ ...metadata, title: val })
                        }
                        placeholder="Internal Title"
                      />
                      <MetadataField
                        label="Author"
                        icon={User}
                        value={metadata.author}
                        onChange={(val: string) =>
                          setMetadata({ ...metadata, author: val })
                        }
                        placeholder="Creator Name"
                      />
                      <MetadataField
                        label="Subject"
                        icon={Layout}
                        value={metadata.subject}
                        onChange={(val: string) =>
                          setMetadata({ ...metadata, subject: val })
                        }
                        placeholder="Summary/Category"
                      />
                      <MetadataField
                        label="Keywords"
                        icon={Tag}
                        value={metadata.keywords}
                        onChange={(val: string) =>
                          setMetadata({ ...metadata, keywords: val })
                        }
                        placeholder="comma, separated, tags"
                      />

                      <div className="md:col-span-2 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <MetadataField
                            label="Creator Tool"
                            value={metadata.creator}
                            onChange={(val: string) =>
                              setMetadata({ ...metadata, creator: val })
                            }
                          />
                          <MetadataField
                            label="Producer"
                            value={metadata.producer}
                            onChange={(val: string) =>
                              setMetadata({ ...metadata, producer: val })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSave}
                      className="w-full mt-10 bg-black text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-black/20"
                    >
                      <Save /> Update & Finalize <ArrowRight />
                    </button>
                  </ToolCard>
                </div>
              </div>
            </motion.div>
          )}

          {status === "processing" && (
            <ProcessingState
              title="Refactoring Header..."
              description="Injecting metadata into the PDF cross-reference table..."
            />
          )}

          {/* Success screen left as simple because it redirects fast */}
          {status === "success" && (
            <motion.div
              key="success"
              className="mx-auto max-w-lg text-center py-20"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
                <CheckCircle2 className="h-12 w-12 animate-bounce" />
              </div>
              <h2 className="text-4xl font-black italic mb-2 tracking-tighter">
                READY!
              </h2>
              <p className="text-gray-500 font-medium">
                Redirecting to download studio...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MetadataField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: any) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
        {Icon && <Icon size={12} />} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-gray-800 placeholder:text-gray-300 outline-none focus:border-black focus:bg-white transition-all shadow-sm"
      />
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
