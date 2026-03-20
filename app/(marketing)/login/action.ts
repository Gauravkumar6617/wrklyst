"use server";

import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/config";

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  try {
    const res = await fetch(buildApiUrl("/api/v1/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    // Read response body once
    const responseText = await res.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse JSON response:", responseText);
      return {
        success: false,
        error: "Backend error: Invalid response format",
      };
    }

    if (!res.ok) {
      return { success: false, error: data.detail || "Login failed" };
    }

    const cookieStore = await cookies();
    const token = data.access_token;
    const user = data.user;

    // 1. Set Token Cookie
    if (token) {
      cookieStore.set("token", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false, // Must be false for Zustand/js-cookie to read it
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // 2. Set User Detail Cookies
    if (user) {
      // Set Username
      cookieStore.set("username", user.username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
      });

      // Set Email Cookie
      if (user.email) {
        cookieStore.set("email", user.email, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
        });
      }

      // Set Admin Flag
      cookieStore.set("is_admin", String(user.is_admin), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
      });
    }

    return {
      success: true,
      user: {
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
      },
      access_token: token,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
