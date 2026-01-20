import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. ADVANCED IP DETECTION (TS SAFE)
    const forwarded = req.headers.get("x-forwarded-for");
    // Use a fallback for local development
    const ip = (forwarded ? forwarded.split(",")[0] : "127.0.0.1").trim();

    // 2. DETECT VERSION (v4 vs v6)
    const isIPv6 = ip.includes(":");
    const version = isIPv6 ? "IPv6" : "IPv4";

    // 3. FETCH DATA
    const geoRes = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`,
    );
    const geoData = await geoRes.json();

    // 4. CALCULATE IP DECIMAL (Strict Typing)
    let ipDecimal: number | null = null;
    if (!isIPv6 && ip !== "127.0.0.1") {
      ipDecimal =
        ip.split(".").reduce((acc: number, octet: string) => {
          return (acc << 8) + parseInt(octet, 10);
        }, 0) >>> 0;
    }

    return NextResponse.json({
      status: "success",
      data: {
        ip,
        version,
        decimal: ipDecimal,
        location: {
          city: geoData.city || "Unknown",
          country: geoData.country || "Unknown",
          country_code: geoData.countryCode || "XX",
          timezone: geoData.timezone || "UTC",
        },
        security: {
          is_vpn: geoData.proxy || false,
          is_hosting: geoData.hosting || false,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Trace failed" },
      { status: 500 },
    );
  }
}
