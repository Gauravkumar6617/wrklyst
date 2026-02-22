// Handles the communication with the FastAPI PyMuPDF backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const processPdfEdits = async (file: File, layers: any[]) => {
  const formData = new FormData();
  formData.append("file", file);

  // Format layers for the backend (PyMuPDF expects page, text, x, y, size)
  const edits = layers.map((layer) => ({
    page: 0, // Defaulting to page 1
    text: layer.text,
    x: layer.x,
    y: layer.y,
    size: layer.size,
  }));

  formData.append("edits", JSON.stringify(edits));

  const response = await fetch(`${API_BASE}/api/v1/pdf/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Architect Engine failed to process PDF");

  return await response.blob();
};
