"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits")
});

type FormValues = z.infer<typeof schema>;

export function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    if (!email) {
      toast.error("Email not found in URL. Please register again.");
      return;
    }

    try {
      await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp: values.otp
        })
      });

      toast.success("Verification successful! You can now login.");
      router.push("/login");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          placeholder="123456"
          {...register("otp")}
          className={errors.otp ? "border-red-500" : ""}
        />
        {errors.otp && <p className="text-xs text-red-500">{errors.otp.message}</p>}
        <p className="text-xs text-slate-400">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
}
