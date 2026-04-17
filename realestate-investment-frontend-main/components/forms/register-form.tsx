"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(7),
  CNIC: z.string().min(5),
  address: z.string().min(5)
});

type RegisterValues = z.infer<typeof schema>;

const backendApi =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://realestate-investment-backend.vercel.app/api";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      const response = await fetch(`${backendApi}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        const errorMessage = payload?.error?.message;

        if (response.status === 409) {
          toast.error(errorMessage || "An account with this email or CNIC already exists.");
        } else {
          toast.error(errorMessage || "Registration failed. Please try again.");
        }

        return;
      }

      reset();
      const successMessage = payload?.meta?.message || "Registration successful. Await admin approval.";
      toast.success(successMessage);
    } catch {
      toast.error("Unable to connect to server. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Label>Full Name</Label>
        <Input {...register("fullName")} />
        {errors.fullName && <p className="mt-1 text-xs text-red-300">{errors.fullName.message}</p>}
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
      </div>

      <div>
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>}
      </div>

      <div>
        <Label>Phone</Label>
        <Input {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p>}
      </div>

      <div>
        <Label>CNIC</Label>
        <Input {...register("CNIC")} />
        {errors.CNIC && <p className="mt-1 text-xs text-red-300">{errors.CNIC.message}</p>}
      </div>

      <div className="md:col-span-2">
        <Label>Address</Label>
        <Input {...register("address")} />
        {errors.address && <p className="mt-1 text-xs text-red-300">{errors.address.message}</p>}
      </div>

      <div className="md:col-span-2">
        <Button className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Investor Account"}
        </Button>
      </div>
    </form>
  );
}
