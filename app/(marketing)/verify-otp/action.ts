"use server"

import { error } from "console";

export async function verifyOtpAction(email:string ,otp:String){
    const backendurl= process.env.NEXT_PUBLIC_APP_URL
    if(!backendurl){
        return { success:false, message:"Backend  url is missing"}
    }
    try {
        const res = await fetch(`${backendurl}/api/v1/auth/verify-otp`,{
            method:"POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body:JSON.stringify({email,otp})
        });
        const data =await res.json()
        if(!res.ok){
        return{
            success:false,
            error:data.detail ||"Invalid or Expire Otp"
        }
        }
        
        return { success: true, message: "Email verified successfully!" };

    } catch (error) {
        return { success: false, error: "Connection to backend failed" };
    }
}