"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiRequest, API_BASE } from "@/lib/api";
import { Property } from "@/lib/types";
import { PropertyForm } from "@/components/forms/property-form";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";

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

  const copyId = () => {
    if (!params?.id) return;
    void navigator.clipboard.writeText(params.id);
    toast.success("Property ID copied to clipboard!");
  };

  if (!property) {
    return <p className="text-slate-300">Loading property...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Property</h1>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-slate-800">
            ID: {params.id}
          </span>
          <button
            onClick={copyId}
            className="text-slate-500 hover:text-blue-400 transition-colors p-1"
            title="Copy ID"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
      <div className="glass-card p-6">
        <PropertyForm initial={property} onSubmit={submit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
