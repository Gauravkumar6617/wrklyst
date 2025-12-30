import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}
