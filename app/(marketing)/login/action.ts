"use server";

export async function loginAction(formData: FormData) {
    console.log("--- Server Action Started ---");
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    
    console.log("Attempting to fetch from:", `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/login`);
  
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

        console.log("Server fetch status:", res.status);
        const data = await res.json();
        console.log("Server received data:", data);
  
        if (!res.ok) {
            console.error("Server Action logic failed validation");
            throw new Error(data.error || data.detail || data.message || "Login failed");
        }
  
        console.log("--- Server Action Finished Successfully ---");
        return data.user;
    } catch (error: any) {
        console.error("CRITICAL ERROR in Server Action:", error.message);
        throw error;
    }
}