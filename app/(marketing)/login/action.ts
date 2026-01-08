"use server";

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    
    console.log("DEBUG: Login attempt started for:", email);

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
        
        // This log will now show you exactly what the backend sent
        console.log("DEBUG: Backend Response Data:", JSON.stringify(data, null, 2));
    
        if (!res.ok) {
            console.error("DEBUG: Login failed with status:", res.status);
            return { success: false, error: data.detail || "Login failed" };
        }
    
        const cookieStore = await cookies();
        const token = data.access_token; 
        const user = data.user; 
    
        // 1. Set Token Cookie
        if (token) {
            console.log("DEBUG: Setting token cookie...");
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
            console.log("DEBUG: Setting user cookies for:", user.username);
            
            // Set Username
            cookieStore.set("username", user.username, { 
                path: "/", 
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false 
            });
            
            // NEW: Set Email Cookie (This was what was missing!)
            if (user.email) {
                cookieStore.set("email", user.email, { 
                    path: "/", 
                    maxAge: 60 * 60 * 24 * 7,
                    httpOnly: false 
                });
            }
            
            // Set Admin Flag
            cookieStore.set("is_admin", String(user.is_admin), {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false
            });
        }

        console.log("DEBUG: Login successful. Cookies set.");
        
        return { 
            success: true, 
            user: { 
                username: user.username, 
                email: user.email, // Passing email back to client
                is_admin: user.is_admin 
            },
            access_token: token
        };

    } catch (error: any) {
        console.error("DEBUG: Catch Error:", error.message);
        return { success: false, error: error.message };
    }
}