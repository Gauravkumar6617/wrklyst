// lib/subscriberApi.ts
import { buildApiUrl } from "./config";

export async function subscriberRequest(
  endpoint: string,
  options: RequestInit,
) {
  const url = buildApiUrl(endpoint);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Subscription failed");
  }

  return data;
}
