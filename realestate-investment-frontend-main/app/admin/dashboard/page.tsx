"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Property, Investment } from "@/lib/types";
import { StatCounter } from "@/components/features/stat-counter";
import { Card } from "@/components/ui/card";

interface Withdrawal {
  _id: string;
  status: string;
}

export default function AdminDashboardPage() {
  const { data } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    if (!data?.accessToken) return;

    Promise.all([
      apiRequest<Property[]>("/properties", {}, data.accessToken),
      apiRequest<Investment[]>("/investments", {}, data.accessToken),
      apiRequest<Withdrawal[]>("/withdrawal", {}, data.accessToken)
    ])
      .then(([propertyData, investmentData, withdrawalData]) => {
        setProperties(propertyData);
        setInvestments(investmentData);
        setWithdrawals(withdrawalData);
      })
      .catch(() => {
        setProperties([]);
      });
  }, [data?.accessToken]);

  const totalInvested = useMemo(
    () => investments.reduce((sum, item) => sum + item.amount, 0),
    [investments]
  );

  const pendingApprovals = useMemo(
    () => withdrawals.filter((item) => item.status === "pending").length,
    [withdrawals]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-300">Monitor properties, capital flow, approvals, and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCounter label="Total Properties" value={properties.length} />
        <StatCounter label="Total Investments" value={investments.length} />
        <StatCounter label="Capital Deployed" value={totalInvested} prefix="PKR " />
        <StatCounter label="Pending Approvals" value={pendingApprovals} />
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Recent Activity</h2>
        <div className="space-y-2">
          {investments.slice(0, 10).map((item) => (
            <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
              Investment {item._id} — PKR {item.amount.toLocaleString()} — {item.status}
            </div>
          ))}
          {!investments.length && <p className="text-sm text-slate-400">No activity available.</p>}
        </div>
      </Card>
    </div>
  );
}
