"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginValues) => {
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password
    });

    if (result?.ok) {
      const session = await getSession();
      router.refresh();
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/investor/dashboard");
      }
      return;
    }

    setError("Invalid credentials or account not active.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
      </div>

      <div>
        <Label>Password</Label>
        <Input type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>}
      </div>

      {error && <p className="rounded-lg bg-red-500/10 p-2 text-sm text-red-300">{error}</p>}

      <Button disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
