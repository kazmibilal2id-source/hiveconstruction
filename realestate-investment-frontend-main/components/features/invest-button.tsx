"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE } from "@/lib/api";

export function InvestButton({ propertyId }: { propertyId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvest = async () => {
    if (!session?.accessToken) {
      toast("Please login to invest.", { icon: "🔒" });
      router.push("/login");
      return;
    }

    if (!amount || amount < 100000) {
      toast.error("Minimum investment is PKR 100,000");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          propertyId,
          amount: Number(amount),
          origin: window.location.origin,
        }),
      });


      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || "Payment initiation failed");
      }

      // Check for Stripe Checkout URL and redirect
      if (payload.data?.url) {
        window.location.href = payload.data.url;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Make an Investment
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-brand-navy/50 p-4">
      <label className="text-sm font-medium text-slate-200">
        Enter Investment Amount (PKR)
      </label>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
        placeholder="Min 100,000"
        min="100000"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <Button onClick={handleInvest} disabled={isLoading} className="flex-1">
          {isLoading ? "Preparing Checkout..." : "Proceed to Payment"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
