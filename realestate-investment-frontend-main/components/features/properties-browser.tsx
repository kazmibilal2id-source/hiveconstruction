"use client";

import { useMemo, useState } from "react";
import { Property } from "@/lib/types";
import { PropertyCard } from "@/components/features/property-card";
import { Input } from "@/components/ui/input";

export function PropertiesBrowser({ properties, hrefPrefix }: { properties: Property[]; hrefPrefix?: string }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" ? true : item.status === status;
      const min = minPrice ? item.totalCost >= Number(minPrice) : true;
      const max = maxPrice ? item.totalCost <= Number(maxPrice) : true;
      return matchesQuery && matchesStatus && min && max;
    });
  }, [properties, query, status, minPrice, maxPrice]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Input placeholder="Search title or location" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-xl border border-white/15 bg-brand-navy/80 px-3 text-sm text-white"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="under_construction">Under Construction</option>
          <option value="sold">Sold</option>
          <option value="purchased">Purchased</option>
        </select>
        <Input placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((property) => (
          <PropertyCard key={property._id} property={property} hrefPrefix={hrefPrefix} />
        ))}
      </div>

      {!filtered.length && (
        <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-400">
          No properties matched your filters.
        </div>
      )}
    </section>
  );
}
