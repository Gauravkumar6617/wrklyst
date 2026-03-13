import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Middleware temporarily disabled - site is now live
  // Basic auth protection has been removed
  return NextResponse.next();
}

export const config = {
  // Minimal matcher - only applies to future protected routes
  matcher: [],
};
