import { NextRequest, NextResponse } from "next/server";
import { BASIC_AUTH } from "@/lib/basicAuth";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected"',
      },
    });
  }

  const base64Credentials = auth.split(" ")[1];
  const [user, pass] = Buffer.from(base64Credentials, "base64")
    .toString()
    .split(":");

  if (user !== BASIC_AUTH.user || pass !== BASIC_AUTH.pass) {
    return new NextResponse("Invalid credentials", { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  // Add site.webmanifest and common image extensions to the exclusion list
  matcher: [
    "/((?!_next|favicon.ico|site.webmanifest|web-app-manifest-192x192.png|web-app-manifest-512x512.png).*)",
  ],
};
