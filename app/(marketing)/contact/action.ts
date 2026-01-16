"use server";

export async function ContactAction(formData: FormData) {
  // Convert FormData to string values safely
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  // Optional: Frontend pre-validation to avoid 422
  if (!firstName || !email || !message) {
    throw new Error("First name, email, and message are required.");
  }

  try {
    console.log("Sending contact form data:", { firstName, lastName, email, message });

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/contact/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, message }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      // If validation error, show first message nicely
      const firstError =
        Array.isArray(data.detail) && data.detail.length > 0 ? data.detail[0].msg : data.message;
      throw new Error(firstError || "Failed to send message");
    }
    
    // If everything is fine
    return data;
  } catch (error: any) {
    console.error("Contact API Error:", error.message);
    throw error;
  }
}
