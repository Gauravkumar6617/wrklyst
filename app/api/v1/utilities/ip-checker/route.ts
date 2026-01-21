import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("📥 Incoming request");

  try {
    // 1. Read x-forwarded-for header
    const forwarded = req.headers.get("x-forwarded-for") || "";
    console.log("🔗 x-forwarded-for:", forwarded);

    // 2. Parse IP chain
    const ips = forwarded
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean);

    console.log("🧩 Parsed IP chain:", ips);

    // Normalize IPv4-mapped IPv6 (::ffff:127.0.0.1)
    const normalizeIp = (ip: string) =>
      ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;

    const normalizedIps = ips.map(normalizeIp);

    // 3. Detect IPv4 and IPv6
    const ipv4 =
      normalizedIps.find((ip) => !ip.includes(":") && ip !== "127.0.0.1") ||
      null;

    const ipv6 =
      normalizedIps.find((ip) => ip.includes(":") && ip !== "::1") || null;

    // 4. Primary IP (first real public IP or fallback)
    const primaryIp = ipv4 || ipv6 || "127.0.0.1";

    const currentVersion = primaryIp.includes(":") ? "IPv6" : "IPv4";

    console.log("🌐 Primary IP:", primaryIp);
    console.log("📡 IP Version:", currentVersion);

    // 5. Fetch geo data (skip localhost)
    let geoData: any = {};
    if (primaryIp !== "127.0.0.1" && primaryIp !== "::1") {
      const geoUrl = `http://ip-api.com/json/${primaryIp}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`;

      console.log("📍 Fetching geo data:", geoUrl);

      const geoRes = await fetch(geoUrl);
      geoData = await geoRes.json();

      console.log("🗺️ Geo response:", geoData);
    } else {
      console.log("⚠️ Localhost detected, skipping geo lookup");
    }

    // 6. IPv4 decimal conversion
    let ipDecimal: number | null = null;
    if (ipv4) {
      ipDecimal =
        ipv4
          .split(".")
          .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;

      console.log("🔢 IPv4 Decimal:", ipDecimal);
    }

    return NextResponse.json({
      status: "success",
      data: {
        primary_ip: primaryIp,
        current_version: currentVersion,
        ipv4,
        ipv6,
        decimal: ipDecimal,
        location: {
          city: geoData.city || "Unknown",
          country: geoData.country || "Unknown",
          country_code: geoData.countryCode || "XX",
          timezone: geoData.timezone || "UTC",
        },
        security: {
          is_vpn: geoData.proxy ?? false,
          is_hosting: geoData.hosting ?? false,
        },
      },
    });
  } catch (error) {
    console.error("❌ Trace failed:", error);

    return NextResponse.json(
      { status: "error", message: "Trace failed" },
      { status: 500 },
    );
  }
}
