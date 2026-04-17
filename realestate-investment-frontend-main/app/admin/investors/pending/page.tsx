"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PendingInvestorsPage() {
  const { data } = useSession();
  const [investors, setInvestors] = useState<User[]>([]);

  const load = async () => {
    if (!data?.accessToken) return;
    const rows = await apiRequest<User[]>("/investors?status=pending", {}, data.accessToken);
    setInvestors(rows);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken]);

  const updateStatus = async (id: string, status: "active" | "blocked") => {
    if (!data?.accessToken) return;

    await apiRequest(
      `/investors/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status })
      },
      data.accessToken
    );

    await load();
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Pending Verification Requests</h1>
      <div className="space-y-3">
        {investors.map((investor) => (
          <Card key={investor._id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-white">{investor.fullName}</p>
                <p className="text-sm text-slate-300">{investor.email}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateStatus(investor._id, "active")}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(investor._id, "blocked")}>
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {!investors.length && <p className="text-sm text-slate-400">No pending requests.</p>}
      </div>
    </div>
  );
}
