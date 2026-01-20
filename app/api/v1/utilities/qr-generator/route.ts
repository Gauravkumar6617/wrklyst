import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
    const { content, options = {} } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    // Using 'any' for options to bypass the strict Discriminated Union
    // bug in the qrcode library types while maintaining functionality
    const qrOptions: any = {
      errorCorrectionLevel: options.level || "H",
      margin: 1,
      scale: options.scale || 12,
      color: {
        dark: options.darkColor || "#000000",
        light: options.lightColor || "#FFFFFF",
      },
    };

    const qrImage = await QRCode.toDataURL(content, qrOptions);

    return NextResponse.json({
      status: "success",
      data: {
        qr_code: qrImage,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
