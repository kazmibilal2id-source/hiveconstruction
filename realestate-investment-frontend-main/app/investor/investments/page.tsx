"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment, Property } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function InvestorInvestmentsPage() {
  const { data } = useSession();
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    if (!data?.accessToken) return;

    apiRequest<Investment[]>("/investments", {}, data.accessToken)
      .then(setInvestments)
      .catch(() => setInvestments([]));
  }, [data?.accessToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Investments</h1>
        <p className="text-slate-300">Track all active and completed records.</p>
      </div>

      <div className="grid gap-4">
        {investments.map((investment) => {
          const property = investment.propertyId as Property;

          return (
            <Card key={investment._id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{property?.title || "Property"}</p>
                  <p className="text-sm text-slate-300">Amount: PKR {(investment.amount || 0).toLocaleString()}</p>
                  <p className="text-sm text-slate-300">Profit: PKR {(investment.profitReceived || 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{investment.status}</Badge>
                  <Link href={`/investor/investments/${investment._id}`} className="text-sm text-brand-gold">
                    View detail →
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
        {!investments.length && <p className="text-sm text-slate-400">No investments found.</p>}
      </div>
    </div>
  );
}
