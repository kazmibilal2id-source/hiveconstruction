import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api";
  const origin = backendUrl.replace(/\/api\/?$/, "");

  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}
