"use server";

export async function signupAction(formData: FormData) {
    // Extract data from the form
    const username = formData.get("username")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    // Pull your FastAPI URL from .env.local
    const backendUrl = process.env.NEXT_PUBLIC_APP_URL;

    try {
        const res = await fetch(`${backendUrl}/api/v1/auth/register`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json" 
            },
            body: JSON.stringify({ username, email, password }),
            cache: "no-store",
        });

        // 1. Check if response is actually JSON (Prevents the "<" error)
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { success: false, error: "Backend server error (Non-JSON response)" };
        }

        const data = await res.json();

        // 2. Handle Backend Errors (like Email already exists)
        if (!res.ok) {
            return { 
                success: false, 
                error: data.detail || "Registration failed" 
            };
        }

        // 3. Success (Backends sends: { "message": "An Otp has been send" })
        return { 
            success: true, 
            message: data.message 
        };

    } catch (error: any) {
        console.error("SIGNUP_ACTION_ERROR:", error);
        return { success: false, error: "Connection to backend failed" };
    }
}