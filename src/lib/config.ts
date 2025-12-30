const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("Missing BACKEND_API_URL environment variable");
}

export const config = {
  backendUrl: BACKEND_API_URL,
};