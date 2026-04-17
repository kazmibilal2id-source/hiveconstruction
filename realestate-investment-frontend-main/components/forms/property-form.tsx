"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Property } from "@/lib/types";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  area: z.coerce.number().positive(),
  totalCost: z.coerce.number().nonnegative(),
  companyContribution: z.coerce.number().nonnegative(),
  constructionStage: z.string().min(2),
  status: z.enum(["available", "under_construction", "sold", "purchased"])
});

type FormValues = z.infer<typeof schema>;

export function PropertyForm({
  initial,
  onSubmit,
  submitLabel = "Save Property"
}: {
  initial?: Partial<Property>;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}) {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title || "",
      description: initial?.description || "",
      location: initial?.location || "",
      area: initial?.area || 0,
      totalCost: initial?.totalCost || 0,
      companyContribution: initial?.companyContribution || 0,
      constructionStage: initial?.constructionStage || "Land Purchased",
      status: initial?.status || "available"
    }
  });

  const submit = async (values: FormValues) => {
    setMessage("");
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value)));

    const fileInput = document.getElementById("images") as HTMLInputElement | null;
    const files = fileInput?.files;
    if (files?.length) {
      Array.from(files).forEach((file) => formData.append("images", file));
    }

    try {
      await onSubmit(formData);
      setMessage("Property saved successfully.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div>
        <Label>Title</Label>
        <Input {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-red-300">{errors.title.message}</p>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} />
        {errors.description && <p className="mt-1 text-xs text-red-300">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Location</Label>
          <Input {...register("location")} />
        </div>
        <div>
          <Label>Area (sqft)</Label>
          <Input type="number" {...register("area")} />
        </div>
        <div>
          <Label>Total Cost</Label>
          <Input type="number" {...register("totalCost")} />
        </div>
        <div>
          <Label>Company Contribution</Label>
          <Input type="number" {...register("companyContribution")} />
        </div>
        <div>
          <Label>Construction Stage</Label>
          <Input {...register("constructionStage")} />
        </div>
        <div>
          <Label>Status</Label>
          <select
            {...register("status")}
            className="h-10 w-full rounded-xl border border-white/15 bg-brand-navy/80 px-3 text-sm text-white"
          >
            <option value="available">Available</option>
            <option value="under_construction">Under Construction</option>
            <option value="sold">Sold</option>
            <option value="purchased">Purchased</option>
          </select>
        </div>
      </div>

      <div>
        <Label>Images</Label>
        <input id="images" type="file" multiple className="w-full rounded-xl border border-white/15 bg-brand-navy/80 p-2 text-sm text-slate-200" />
      </div>

      {message && <p className="rounded-xl bg-brand-gold/10 p-3 text-sm text-amber-100">{message}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
