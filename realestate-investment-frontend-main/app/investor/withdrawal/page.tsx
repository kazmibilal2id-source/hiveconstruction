"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WithdrawalItem {
  _id: string;
  requestDate: string;
  status: string;
  calculatedReturn: number;
  reason: string;
}

export default function InvestorWithdrawalPage() {
  const { data } = useSession();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [history, setHistory] = useState<WithdrawalItem[]>([]);
  const [investmentId, setInvestmentId] = useState("");
  const [reason, setReason] = useState("");
  const [currentMarketValue, setCurrentMarketValue] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!data?.accessToken) return;
    const [investmentData, withdrawalData] = await Promise.all([
      apiRequest<Investment[]>("/investments", {}, data.accessToken),
      apiRequest<WithdrawalItem[]>("/withdrawal", {}, data.accessToken)
    ]);

    setInvestments(investmentData);
    setHistory(withdrawalData);

    if (!investmentId && investmentData.length) {
      setInvestmentId(investmentData[0]._id);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken]);

  const submit = async () => {
    if (!data?.accessToken || !investmentId || !reason) return;

    try {
      await apiRequest(
        "/withdrawal/request",
        {
          method: "POST",
          body: JSON.stringify({
            investmentId,
            reason,
            currentMarketValue: currentMarketValue ? Number(currentMarketValue) : undefined
          })
        },
        data.accessToken
      );
      setReason("");
      setCurrentMarketValue("");
      setMessage("Withdrawal request submitted.");
      await load();
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Withdrawal Requests</h1>
        <p className="text-slate-300">Submit and track your withdrawal requests.</p>
      </div>

      <div className="glass-card space-y-4 p-6">
        <div>
          <Label>Investment</Label>
          <select
            value={investmentId}
            onChange={(e) => setInvestmentId(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/15 bg-brand-navy/80 px-3 text-sm text-white"
          >
            {investments.map((investment) => (
              <option key={investment._id} value={investment._id}>
                {investment._id} — PKR {(investment.amount || 0).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Reason</Label>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for withdrawal" />
        </div>

        <div>
          <Label>Current Market Value (optional)</Label>
          <Input
            value={currentMarketValue}
            onChange={(e) => setCurrentMarketValue(e.target.value)}
            placeholder="e.g. 15000000"
          />
        </div>

        <Button onClick={submit}>Submit Request</Button>
        {message && <p className="rounded-xl bg-brand-gold/10 p-2 text-sm text-amber-100">{message}</p>}
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item._id} className="glass-card p-4">
            <p className="text-sm text-white">{item.reason}</p>
            <p className="text-xs text-slate-400">Requested: {new Date(item.requestDate).toLocaleDateString()}</p>
            <p className="text-xs text-slate-300">Status: {item.status}</p>
            <p className="text-xs text-slate-300">Calculated Return: PKR {(item.calculatedReturn || 0).toFixed(2)}</p>
          </div>
        ))}
        {!history.length && <p className="text-sm text-slate-400">No withdrawal requests yet.</p>}
      </div>
    </div>
  );
}
