"use server";

import { buildApiUrl } from "@/lib/config";

export async function signupAction(formData: FormData) {
  // Extract data from the form
  const username = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  try {
    const res = await fetch(buildApiUrl("/api/v1/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      cache: "no-store",
    });

    // Read response body once
    const responseText = await res.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      return {
        success: false,
        error: "Backend server error (Invalid response format)",
      };
    }

    // 2. Handle Backend Errors (like Email already exists)
    if (!res.ok) {
      return {
        success: false,
        error: data.detail || "Registration failed",
      };
    }

    // 3. Success (Backends sends: { "message": "An Otp has been send" })
    return {
      success: true,
      message: data.message,
    };
  } catch (error: any) {
    console.error("SIGNUP_ACTION_ERROR:", error);
    return { success: false, error: "Connection to backend failed" };
  }
}
