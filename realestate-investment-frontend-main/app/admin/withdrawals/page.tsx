"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Withdrawal {
  _id: string;
  reason: string;
  status: string;
  calculatedReturn: number;
  requestDate: string;
}

export default function AdminWithdrawalsPage() {
  const { data } = useSession();
  const [rows, setRows] = useState<Withdrawal[]>([]);

  const load = async () => {
    if (!data?.accessToken) return;
    const list = await apiRequest<Withdrawal[]>("/withdrawal", {}, data.accessToken);
    setRows(list);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken]);

  const decide = async (id: string, status: "approved" | "rejected") => {
    if (!data?.accessToken) return;

    await apiRequest(
      `/withdrawal/${id}/status`,
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
      <h1 className="text-2xl font-bold text-white">Withdrawal Requests</h1>
      <div className="space-y-3">
        {rows.map((item) => (
          <Card key={item._id}>
            <p className="text-sm text-white">{item.reason}</p>
            <p className="text-xs text-slate-400">{new Date(item.requestDate).toLocaleString()}</p>
            <p className="text-xs text-slate-300">Return: PKR {(item.calculatedReturn || 0).toFixed(2)}</p>
            <p className="text-xs text-slate-300">Status: {item.status}</p>
            {item.status === "pending" && (
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => decide(item._id, "approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => decide(item._id, "rejected")}>
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
