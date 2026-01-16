"use client";
import { ContactAction } from "@/app/(marketing)/contact/action";
import { useState } from "react";


export function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendContact = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await ContactAction(formData);
      setSuccess(response.responseMessage || "Message sent successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, sendContact };
}
