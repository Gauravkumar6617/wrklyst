const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!NEXT_PUBLIC_APP_URL) {
  throw new Error("Missing BACKEND_API_URL environment variable");
}

export const config = {
  backendUrl: NEXT_PUBLIC_APP_URL,
};