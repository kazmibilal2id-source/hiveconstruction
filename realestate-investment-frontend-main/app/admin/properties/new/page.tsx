"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PropertyForm } from "@/components/forms/property-form";
import { API_BASE } from "@/lib/api";

export default function NewPropertyPage() {
  const router = useRouter();
  const { data } = useSession();

  const submit = async (formData: FormData) => {
    if (!data?.accessToken) throw new Error("Unauthorized");

    const response = await fetch(`${API_BASE}/properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      },
      body: formData
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.error?.message || "Failed to create property");
    }

    router.push("/admin/properties");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Add New Property</h1>
      <div className="glass-card p-6">
        <PropertyForm onSubmit={submit} submitLabel="Create Property" />
      </div>
    </div>
  );
}
