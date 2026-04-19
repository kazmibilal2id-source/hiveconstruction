"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

interface SimulatorProps {
  investmentAmount: number;
  investmentDate: string;
  propertyTotalCost: number;
  hypotheticalSalePrice: number;
  currentMarketValue: number;
  sold: boolean;
  soldDate?: string;
}

function addOneYear(date: Date) {
  const copy = new Date(date);
  copy.setFullYear(copy.getFullYear() + 1);
  return copy;
}

export function ExitPlanSimulator(props: SimulatorProps) {
  const [withdrawDate, setWithdrawDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    const investmentDate = new Date(props.investmentDate);
    const oneYear = addOneYear(investmentDate);
    const selected = new Date(withdrawDate);

    const soldAtLoss = props.sold && props.hypotheticalSalePrice < props.propertyTotalCost;

    const baseProfitFromSale =
      (props.hypotheticalSalePrice - props.propertyTotalCost) * 0.75 * (props.investmentAmount / props.propertyTotalCost);

    const baseProfitFromMarket =
      (props.currentMarketValue - props.propertyTotalCost) * 0.75 * (props.investmentAmount / props.propertyTotalCost);

    const hold = soldAtLoss
      ? props.investmentAmount
      : props.sold && props.soldDate && new Date(props.soldDate) <= oneYear
        ? props.investmentAmount + baseProfitFromSale
        : !props.sold && selected > oneYear
          ? props.investmentAmount + baseProfitFromMarket
          : props.investmentAmount;

    const earlyWithdrawal = props.investmentAmount;

    return {
      hold: Math.max(hold, props.investmentAmount),
      earlyWithdrawal
    };
  }, [withdrawDate, props]);

  return (
    <div className="space-y-4">
      <label className="block text-sm text-slate-300">
        Hypothetical Withdrawal Date
        <input
          type="date"
          value={withdrawDate}
          onChange={(event) => setWithdrawDate(event.target.value)}
          className="mt-1 w-full rounded-xl border border-white/20 bg-brand-navy/70 px-3 py-2 text-white"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-400">Hold / Rule-based return</p>
          <p className="mt-2 text-xl font-bold text-white">PKR {(result.hold || 0).toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Early Withdraw</p>
          <p className="mt-2 text-xl font-bold text-white">PKR {(result.earlyWithdrawal || 0).toLocaleString()}</p>
        </Card>
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold text-white">Comparison Table: Hold vs Withdraw</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="pb-2">Scenario</th>
                <th className="pb-2">Estimated Return</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10 text-slate-100">
                <td className="py-2">Hold to rule-based payout</td>
                <td className="py-2">PKR {(result.hold || 0).toLocaleString()}</td>
              </tr>
              <tr className="border-t border-white/10 text-slate-100">
                <td className="py-2">Withdraw now (early)</td>
                <td className="py-2">PKR {(result.earlyWithdrawal || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
