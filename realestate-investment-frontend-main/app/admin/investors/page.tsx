"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminInvestorsPage() {
  const { data } = useSession();
  const [investors, setInvestors] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingInvestorId, setUpdatingInvestorId] = useState<string | null>(null);

  const load = async () => {
    if (!data?.accessToken) return;

    const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
    const rows = await apiRequest<User[]>(`/investors${query}`, {}, data.accessToken);
    setInvestors(rows);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken, statusFilter]);

  const approveInvestor = async (id: string) => {
    if (!data?.accessToken || updatingInvestorId) return;

    setUpdatingInvestorId(id);
    try {
      await apiRequest(
        `/investors/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: "active" })
        },
        data.accessToken
      );

      await load();
    } finally {
      setUpdatingInvestorId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Investors</h1>
          <p className="text-slate-300">Manage all investor profiles and statuses.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-white/15 bg-brand-navy/80 px-3 text-sm text-white"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="space-y-3">
        {investors.map((investor) => (
          <Card key={investor._id}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-white">{investor.fullName}</p>
                <p className="text-sm text-slate-300">{investor.email}</p>
                <p className="text-xs text-slate-400">Status: {investor.status}</p>
              </div>
              <div className="flex items-center gap-2">
                {investor.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      void approveInvestor(investor._id);
                    }}
                    disabled={updatingInvestorId === investor._id}
                  >
                    {updatingInvestorId === investor._id ? "Approving..." : "Approve"}
                  </Button>
                )}
                <Link href={`/admin/investors/${investor._id}`} className="text-sm text-brand-gold">
                  Open profile →
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
