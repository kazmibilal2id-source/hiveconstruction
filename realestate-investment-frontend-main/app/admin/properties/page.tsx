"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest, API_BASE } from "@/lib/api";
import { Property } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminPropertiesPage() {
  const { data } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);

  const load = async () => {
    if (!data?.accessToken) return;
    const rows = await apiRequest<Property[]>("/properties", {}, data.accessToken);
    setProperties(rows);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken]);

  const remove = async (id: string) => {
    if (!data?.accessToken) return;

    await fetch(`${API_BASE}/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      }
    });

    await load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Property Management</h1>
          <p className="text-slate-300">Create, update, and monitor all properties.</p>
        </div>
        <Link href="/admin/properties/new">
          <Button>Add Property</Button>
        </Link>
      </div>

      <div className="grid gap-3">
        {properties.map((property) => (
          <Card key={property._id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-base font-semibold text-white">{property.title}</p>
                <p className="text-sm text-slate-300">{property.location}</p>
                <p className="text-xs text-slate-400">Status: {property.status}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/properties/${property._id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => remove(property._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
