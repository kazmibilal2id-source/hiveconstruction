"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface DistributionRow {
  investorId: string;
  amount: number;
  profit: number;
  payout: number;
}

export function AdminProfitPanel() {
  const { data } = useSession();
  const [propertyId, setPropertyId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{
    hiveShare: number;
    investorsPool: number;
    totalProfit: number;
    investorBreakdown: DistributionRow[];
  } | null>(null);
  const [message, setMessage] = useState("");

  const calculate = async () => {
    if (!data?.accessToken || !propertyId || !salePrice) return;
    setLoading(true);
    setMessage("");

    try {
      const payload = await apiRequest<{
        hiveShare: number;
        investorsPool: number;
        totalProfit: number;
        investorBreakdown: DistributionRow[];
      }>(
        "/profit-sharing/calculate",
        {
          method: "POST",
          body: JSON.stringify({ propertyId, salePrice: Number(salePrice) })
        },
        data.accessToken
      );

      setPreview(payload);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    if (!data?.accessToken || !propertyId || !salePrice) return;
    setLoading(true);
    setMessage("");

    try {
      await apiRequest(
        "/profit-sharing/publish",
        {
          method: "POST",
          body: JSON.stringify({ propertyId, salePrice: Number(salePrice) })
        },
        data.accessToken
      );
      setMessage("Profit distribution published successfully.");
      setPreview(null);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Property ID" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} />
        <Input placeholder="Sale Price" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={calculate} disabled={loading} className="w-full">
            Preview
          </Button>
          <Button onClick={publish} disabled={loading} variant="outline" className="w-full">
            Publish
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-3 text-sm text-amber-100">
          {message}
        </div>
      )}

      {preview && (
        <Card>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Total Profit</p>
              <p className="text-lg font-semibold text-white">PKR {preview.totalProfit.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Hive Share (25%)</p>
              <p className="text-lg font-semibold text-white">PKR {preview.hiveShare.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Investors Pool (75%)</p>
              <p className="text-lg font-semibold text-white">PKR {preview.investorsPool.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-300">
                <tr>
                  <th className="pb-2">Investor</th>
                  <th className="pb-2">Invested</th>
                  <th className="pb-2">Profit</th>
                  <th className="pb-2">Payout</th>
                </tr>
              </thead>
              <tbody>
                {preview.investorBreakdown.map((row) => (
                  <tr key={row.investorId} className="border-t border-white/10 text-slate-100">
                    <td className="py-2">{row.investorId}</td>
                    <td className="py-2">{row.amount.toFixed(2)}</td>
                    <td className="py-2">{row.profit.toFixed(2)}</td>
                    <td className="py-2">{row.payout.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
