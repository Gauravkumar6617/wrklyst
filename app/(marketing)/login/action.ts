"use server";

import { cookies } from "next/headers"; // Use this for Server Actions

export async function loginAction(formData: FormData) {
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                cache: "no-store",
            }
        );

        const data = await res.json();
    
        // DEBUG: Look at your terminal (not browser) to see this!
        console.log("FULL BACKEND RESPONSE:", data); 
    
        if (!res.ok) {
            return { success: false, error: data.detail || "Login failed" };
        }
    
        const cookieStore = await cookies();
    
        // Use optional chaining (?.) and check the exact key name from your Python code
        // Is it 'access_token' or 'token'? 
        const token = data.access_token || data.token; 
        const username = data.user?.username || data.username;
    
        if (token) {
            cookieStore.set("token", token, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false,
                secure: false,
                sameSite: "lax",
            });
        }
    
        if (username) {
            cookieStore.set("username", username, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false,
                secure: false,
                sameSite: "lax",
            });
        }
    
        return { success: true, user: { username } 
    }

      
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}