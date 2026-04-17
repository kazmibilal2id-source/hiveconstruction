"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment, NotificationItem, Property } from "@/lib/types";
import { StatCounter } from "@/components/features/stat-counter";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InvestorDoughnutChart, PropertyValueLineChart } from "@/components/charts/investor-charts";

const stageProgressMap: Record<string, number> = {
  "Land Purchased": 10,
  Foundation: 25,
  Structure: 50,
  Interior: 75,
  Listed: 90,
  Sold: 100
};

export default function InvestorDashboardPage() {
  const { data } = useSession();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!data?.accessToken) return;

    Promise.all([
      apiRequest<Investment[]>("/investments", {}, data.accessToken),
      apiRequest<Property[]>("/properties", {}, data.accessToken),
      apiRequest<NotificationItem[]>("/notifications", {}, data.accessToken)
    ])
      .then(([investmentData, propertyData, notificationData]) => {
        setInvestments(investmentData);
        setProperties(propertyData);
        setNotifications(notificationData);
      })
      .catch(() => {
        setInvestments([]);
      });
  }, [data?.accessToken]);

  const totalInvested = useMemo(
    () => investments.reduce((sum, investment) => sum + investment.amount, 0),
    [investments]
  );

  const totalProfit = useMemo(
    () => investments.reduce((sum, investment) => sum + investment.profitReceived, 0),
    [investments]
  );

  const primaryProperty = (investments[0]?.propertyId as Property | undefined) || properties[0];

  const chartPoints =
    primaryProperty?.valueHistory?.map((point) => ({
      date: new Date(point.date).toLocaleDateString(),
      value: point.value
    })) || [
      { date: "Q1", value: primaryProperty?.totalCost || 0 },
      { date: "Q2", value: (primaryProperty?.totalCost || 0) * 1.04 },
      { date: "Q3", value: (primaryProperty?.totalCost || 0) * 1.1 }
    ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Investor Dashboard</h1>
        <p className="text-slate-300">Track your portfolio, progress, and profit in one glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCounter label="Total Invested" value={totalInvested} prefix="PKR " />
        <StatCounter label="Current Profit" value={Math.max(totalProfit, 0)} prefix="PKR " />
        <StatCounter label="Properties" value={investments.length} />
        <StatCounter label="Notifications" value={notifications.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-white">Real-time Investment Tracker</h2>
          <InvestorDoughnutChart
            myContribution={totalInvested}
            companyContribution={Math.max((primaryProperty?.companyContribution || 0), 1)}
            otherInvestors={Math.max((primaryProperty?.totalCost || 0) - totalInvested, 1)}
          />
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-white">Property Value Trend</h2>
          <PropertyValueLineChart points={chartPoints} />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-white">Construction Stage Progress</h2>
          <p className="mb-2 text-sm text-slate-300">{primaryProperty?.constructionStage || "No active property"}</p>
          <Progress value={stageProgressMap[primaryProperty?.constructionStage || ""] || 15} />
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold text-white">Recent Notifications</h2>
          <div className="space-y-2 text-sm">
            {notifications.slice(0, 5).map((item) => (
              <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200">
                {item.message}
              </div>
            ))}
            {!notifications.length && <p className="text-slate-400">No notifications yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
