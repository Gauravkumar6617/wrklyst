/**
 * Centralized API Configuration
 * This ensures all API calls use the same base URL across the application
 * Environment variables should be set in .env.local or deployment platform
 */

// Determine if we're in production or development
const isProduction = process.env.NODE_ENV === "production";

/**
 * Get the API base URL based on environment
 * Priority order:
 * 1. NEXT_PUBLIC_API_BASE_URL (explicit backend URL)
 * 2. NEXT_PUBLIC_API_URL (fallback for backward compatibility)
 * 3. Development default
 */
export const getApiBaseUrl = (): string => {
  // For frontend-to-backend API calls
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (isProduction
      ? "https://api.wrklyst.com" // Change to your actual production API domain
      : "http://localhost:8000");

  // Remove trailing slash for consistency
  return apiUrl.replace(/\/$/, "");
};

/**
 * Get the app base URL (frontend URL)
 * Used for redirects, email links, and CORS configuration
 */
export const getAppBaseUrl = (): string => {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (isProduction
      ? "https://wrklyst.com" // Change to your actual production domain
      : "http://localhost:3000");

  // Remove trailing slash for consistency
  return appUrl.replace(/\/$/, "");
};

/**
 * Build complete API endpoint URL
 * @param endpoint - The API endpoint (e.g., '/api/v1/users/subscriber')
 * @returns Complete URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Centralized fetch wrapper for API calls
 * Handles error responses and provides consistent headers
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = buildApiUrl(endpoint);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "API request failed");
  }

  return data as T;
}

/**
 * Authenticated API call with token
 */
export async function authenticatedApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        require("js-cookie").default.get("token") ||
        ""
      : "";

  return apiCall<T>(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

// Export configuration for debugging
export const config = {
  apiBaseUrl: getApiBaseUrl(),
  appBaseUrl: getAppBaseUrl(),
  isProduction,
  nodeEnv: process.env.NODE_ENV,
};

// Log configuration in development
if (!isProduction && typeof window !== "undefined") {
  console.log("🔧 API Configuration:", config);
}
