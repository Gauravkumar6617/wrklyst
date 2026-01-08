// lib/subscriberApi.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function subscriberRequest(endpoint: string, options: RequestInit) {
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Subscription failed");
  }

  return data;
}