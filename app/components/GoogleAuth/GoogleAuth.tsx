"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
export default function GoogleAuth() {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save the JWT from your FastAPI backend
  
        Cookies.set("token",data.access_token,{expires:7})
        Cookies.set("username",data.username,{expires:7})
        // USE 'data.username' because that is what the API returns
        toast.success(`Welcome back, ${data.username}!`);
        
        // Optional: wait a second so the user can read the toast before redirecting
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }else {
        toast.error("Backend authentication failed");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("Could not connect to authentication server");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Login Failed")}
    />
  );
}

// "http://localhost:8000/api/v1/auth/google-login"