"use client";

import { Toaster } from "react-hot-toast";

export function HotToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{ top: 20, right: 20 }}
      toastOptions={{
        duration: 4500,
        style: {
          background: "rgba(15, 23, 42, 0.95)",
          color: "#f8fafc",
          border: "1px solid rgba(212, 168, 67, 0.35)",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)"
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#0f172a"
          }
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0f172a"
          }
        }
      }}
    />
  );
}