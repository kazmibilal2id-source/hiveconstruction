"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment, Property, User } from "@/lib/types";
import { Card } from "@/components/ui/card";

export default function AdminInvestmentsPage() {
  const { data } = useSession();
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    if (!data?.accessToken) return;

    apiRequest<Investment[]>("/investments", {}, data.accessToken)
      .then(setInvestments)
      .catch(() => setInvestments([]));
  }, [data?.accessToken]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Investment Records</h1>
        <p className="text-slate-300">All investment records across investors and properties.</p>
      </div>

      <div className="space-y-3">
        {investments.map((investment) => {
          const investor = investment.investorId as User;
          const property = investment.propertyId as Property;

          return (
            <Card key={investment._id}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{property?.title || "Property"}</p>
                  <p className="text-sm text-slate-300">Investor: {investor?.fullName || investor?._id}</p>
                  <p className="text-sm text-slate-300">Amount: PKR {(investment.amount || 0).toLocaleString()}</p>
                </div>
                <Link href={`/admin/investments/${investment._id}`} className="text-sm text-brand-gold">
                  Manage detail →
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
