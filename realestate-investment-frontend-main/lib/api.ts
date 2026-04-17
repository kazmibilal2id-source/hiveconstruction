export const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://realestate-investment-backend.vercel.app/api";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: {
    code: string;
    message: string;
  } | null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    credentials: "include",
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || "Request failed");
  }

  return payload.data;
}
