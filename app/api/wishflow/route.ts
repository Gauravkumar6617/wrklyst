// app/utils/wishflow.ts

export interface WishData {
  email: string;
  event_title: string;
  message: string;
  send_datetime: string;
}

export const dispatchWish = async (data: WishData) => {
  // 1. Fallback to localhost:8000 if the env variable is missing
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 2. Ensure we use /api/v1 (with a slash) as defined in your FastAPI prefix
  const url = `${BASE_URL}/api/v1/wish-flow/reminder`;

  console.log("Wrklyst Dispatching to:", url); // Debugging line

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      event_datetime: data.send_datetime,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "WishFlow Protocol Failed");
  }

  return response.json();
};
