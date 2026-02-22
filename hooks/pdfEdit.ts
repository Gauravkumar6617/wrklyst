import { useState } from "react";

export const usePdfArchitect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<any>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseFile = async (selectedFile: File) => {
    setFile(selectedFile);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/api/v1/pdf/parse", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPdfData(data.structure[0]);
    } catch (err) {
      console.error("Parsing failed:", err);
    }
  };

  const executeExport = async () => {
    if (!file) return;
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("edits", JSON.stringify(layers));

    try {
      const res = await fetch("http://localhost:8000/api/v1/pdf/process", {
        method: "POST",
        body: formData,
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wrklyst_edited_${file.name}`;
      a.click();
    } catch (err) {
      alert("Export failed. Check FastAPI connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    file,
    setFile: parseFile,
    pdfData,
    layers,
    setLayers,
    isProcessing,
    executeExport,
  };
};
