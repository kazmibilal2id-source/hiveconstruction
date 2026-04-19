"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment, Property, User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ExitPlanSimulator } from "@/components/features/exit-plan-simulator";
import { DocumentVault } from "@/components/features/document-vault";

export default function InvestorInvestmentDetailPage() {
  const params = useParams<{ id: string }>();
  const { data } = useSession();
  const [investment, setInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    if (!data?.accessToken || !params?.id) return;

    apiRequest<Investment>(`/investments/${params.id}`, {}, data.accessToken)
      .then(setInvestment)
      .catch(() => setInvestment(null));
  }, [data?.accessToken, params?.id]);

  const property = investment?.propertyId as Property | undefined;
  const investor = investment?.investorId as User | undefined;

  if (!investment || !property) {
    return <p className="text-slate-300">Loading investment details...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-white">Investment Detail</h1>
        <div className="mt-4 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
          <p>Property: {property.title}</p>
          <p>Amount: PKR {(investment.amount || 0).toLocaleString()}</p>
          <p>Share %: {(investment.sharePercentage || 0).toFixed(2)}%</p>
          <p>Status: {investment.status}</p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Smart Exit Plan Simulator</h2>
        <ExitPlanSimulator
          investmentAmount={investment.amount || 0}
          investmentDate={investment.investmentDate}
          propertyTotalCost={property.totalCost || 0}
          hypotheticalSalePrice={property.salePrice || (property.totalCost || 0) * 1.2}
          currentMarketValue={property.salePrice || (property.totalCost || 0) * 1.15}
          sold={property.status === "sold"}
          soldDate={property.soldDate}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Document Vault</h2>
        <DocumentVault investmentId={investment._id} investorId={investor?._id} />
      </Card>
    </div>
  );
}
