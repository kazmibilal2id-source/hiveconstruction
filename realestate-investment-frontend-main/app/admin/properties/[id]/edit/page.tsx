"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiRequest, API_BASE } from "@/lib/api";
import { Property } from "@/lib/types";
import { PropertyForm } from "@/components/forms/property-form";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data } = useSession();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    apiRequest<Property>(`/properties/${params.id}`)
      .then(setProperty)
      .catch(() => setProperty(null));
  }, [params?.id]);

  const submit = async (formData: FormData) => {
    if (!data?.accessToken) throw new Error("Unauthorized");

    const response = await fetch(`${API_BASE}/properties/${params.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      },
      body: formData
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.error?.message || "Failed to update property");
    }

    router.push("/admin/properties");
  };

  if (!property) {
    return <p className="text-slate-300">Loading property...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Edit Property</h1>
      <div className="glass-card p-6">
        <PropertyForm initial={property} onSubmit={submit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
