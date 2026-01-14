import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const redis = Redis.fromEnv();

export async function GET() {
  const cookieStore = await cookies();
  const hasVisited = cookieStore.get("wrklyst_visited");

  try {
    // 1. If they have the cookie, JUST GET the number (don't increment)
    if (hasVisited) {
      const currentCount = await redis.get("total_visitors");
      return NextResponse.json({ count: currentCount });
    }

    // 2. If NO cookie, increment the count
    const newCount = await redis.incr("total_visitors");

    // 3. Set a cookie that lasts for 24 hours so they aren't counted again
    const response = NextResponse.json({ count: newCount });
    response.cookies.set("wrklyst_visited", "true", {
      maxAge: 60 * 60 * 24, // 24 hours in seconds
      path: "/",
      httpOnly: true, // Security: prevents JS from touching the cookie
    });

    return response;
  } catch (error) {
    console.error("Redis Error:", error);
    return NextResponse.json({ count: 142580 });
  }
}