export async function loginService(email:string, password:string) {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "FastAPI Error");
    
    return data.user; // Returning the prize
  }

export async function signupService(payload:{username:string,email:string,password:string }){
const res = await fetch("/api/v1/auth/signup",{
    method:"POST",
    headers:{"Content-type":"Application/json"},
    body:JSON.stringify(payload)
})
const data = await res.json();

if(!res.ok){
    throw new Error(data.error || "signup failed")
}
return data.user
}