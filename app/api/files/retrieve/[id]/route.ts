// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs/promises";
// import fsSync from "fs";
// import os from "os";
// import path from "path";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   // 1. MUST await params in Next.js 15+
//   const resolvedParams = await params;
//   const fileId = resolvedParams.id;
//   const tempDir = os.tmpdir();

//   console.log(`--- 🔍 RETRIEVING: ${fileId} ---`);

//   // 2. Define all possible extensions we support
//   const extensions = [".pptx", ".docx", ".xlsx", ".pdf", ".html"];
//   let finalPath = "";
//   let foundExt = "";

//   // 3. Look for the file
//   for (const ext of extensions) {
//     const checkPath = path.join(tempDir, `${fileId}${ext}`);
//     if (fsSync.existsSync(checkPath)) {
//       finalPath = checkPath;
//       foundExt = ext;
//       break;
//     }
//   }

//   if (!finalPath) {
//     console.error(`❌ 404: File ${fileId} not found in ${tempDir}`);
//     return NextResponse.json({ error: "File not found" }, { status: 404 });
//   }

//   try {
//     const fileBuffer = await fs.readFile(finalPath);

//     // 4. Map the correct Content-Type
//     const mimes: Record<string, string> = {
//       ".docx":
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ".pptx":
//         "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//       ".xlsx":
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       ".pdf": "application/pdf",
//       ".html": "text/html",
//     };

//     console.log(`✅ SENDING: ${foundExt} file`);

//     return new NextResponse(fileBuffer, {
//       headers: {
//         "Content-Type": mimes[foundExt] || "application/octet-stream",
//         "Content-Disposition": `attachment; filename="Wrklyst_Download${foundExt}"`,
//       },
//     });
//   } catch (err: any) {
//     return NextResponse.json({ error: "Read Error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import os from "os";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const fileId = resolvedParams.id;
  const tempDir = os.tmpdir();

  // Extensions to check in order
  const extensions = [".pdf", ".docx", ".pptx", ".xlsx", ".html", ""];
  let foundPath = "";
  let foundExt = "";

  for (const ext of extensions) {
    const checkPath = path.join(tempDir, `${fileId}${ext}`);
    if (fsSync.existsSync(checkPath)) {
      foundPath = checkPath;
      foundExt = ext || ".pdf"; // Default to .pdf if no ext found
      break;
    }
  }

  if (!foundPath) {
    return NextResponse.json(
      { error: "File expired or not found" },
      { status: 404 },
    );
  }

  try {
    const fileBuffer = await fs.readFile(foundPath);

    const mimes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".html": "text/html",
      "Content-Disposition": `attachment; filename="Compressed_By_Wrklyst.pdf"`,
    };

    // Extract original name from URL params if you want to keep it
    const searchParams = req.nextUrl.searchParams;
    const downloadName = searchParams.get("name") || `Wrklyst_File${foundExt}`;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimes[foundExt] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        // SECURITY: Prevent browsers from trying to "guess" the file type
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Read Error" }, { status: 500 });
  }
}
