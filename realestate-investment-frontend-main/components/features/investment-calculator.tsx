"use client";

import { useMemo, useState } from "react";
import { Property } from "@/lib/types";

export function InvestmentCalculator({ properties }: { properties: Property[] }) {
  const [amount, setAmount] = useState(500000);
  const [expectedSaleMultiplier, setExpectedSaleMultiplier] = useState(1.35);

  const qualified = useMemo(
    () => properties.filter((property) => amount <= property.totalCost),
    [amount, properties]
  );

  const estimatedProfit = useMemo(() => {
    const totalProfit = amount * (expectedSaleMultiplier - 1);
    return totalProfit * 0.75;
  }, [amount, expectedSaleMultiplier]);

  const sharePercentage = useMemo(() => {
    const totalAvailable = qualified.reduce((sum, property) => sum + property.totalCost, 0) || 1;
    return (amount / totalAvailable) * 100;
  }, [amount, qualified]);

  return (
    <div className="glass-card space-y-5 p-6">
      <div>
        <h3 className="text-xl font-semibold text-white">Interactive Investment Calculator</h3>
        <p className="text-sm text-slate-300">Slide your amount and preview projected investor share and upside.</p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Investment Amount: PKR {amount.toLocaleString()}</label>
        <input
          type="range"
          min={100000}
          max={10000000}
          step={50000}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="w-full accent-amber-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Expected Exit Multiplier: {expectedSaleMultiplier.toFixed(2)}x
        </label>
        <input
          type="range"
          min={1.05}
          max={2}
          step={0.05}
          value={expectedSaleMultiplier}
          onChange={(event) => setExpectedSaleMultiplier(Number(event.target.value))}
          className="w-full accent-amber-400"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-slate-400">Projected Investor Profit</p>
          <p className="mt-1 text-lg font-semibold text-white">PKR {estimatedProfit.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-slate-400">Estimated Share</p>
          <p className="mt-1 text-lg font-semibold text-white">{sharePercentage.toFixed(2)}%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-slate-400">Qualified Properties</p>
          <p className="mt-1 text-lg font-semibold text-white">{qualified.length}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-200">Properties this amount qualifies for</p>
        <div className="flex flex-wrap gap-2">
          {qualified.slice(0, 6).map((property) => (
            <span key={property._id} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
              {property.title}
            </span>
          ))}
          {qualified.length === 0 && <span className="text-xs text-slate-400">No matching properties yet.</span>}
        </div>
      </div>
    </div>
  );
}
