"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment, Property, User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExitPlanSimulator } from "@/components/features/exit-plan-simulator";
import { DocumentVault } from "@/components/features/document-vault";

interface Cheque {
  _id: string;
  chequeNumber: string;
  bankName: string;
  amount: number;
  issueDate: string;
  status: string;
  investmentId: string | { _id: string };
}

export default function InvestorInvestmentDetailPage() {
  const params = useParams<{ id: string }>();
  const { data } = useSession();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [form, setForm] = useState({
    chequeNumber: "",
    bankName: "",
    amount: "",
    issueDate: ""
  });

  const load = async () => {
    if (!data?.accessToken || !params?.id) return;

    try {
      const [investmentData, chequeData] = await Promise.all([
        apiRequest<Investment>(`/investments/${params.id}`, {}, data.accessToken),
        apiRequest<Cheque[]>("/cheques", {}, data.accessToken)
      ]);
      setInvestment(investmentData);
      setCheques(chequeData);
    } catch (error) {
      console.error("Failed to load data", error);
      setInvestment(null);
    }
  };

  useEffect(() => {
    void load();
  }, [data?.accessToken, params?.id]);

  const submitCheque = async () => {
    if (!data?.accessToken || !investment) return;

    const investorId = typeof investment.investorId === "string" 
      ? investment.investorId 
      : (investment.investorId as User)._id;

    await apiRequest(
      "/cheques",
      {
        method: "POST",
        body: JSON.stringify({
          investorId,
          investmentId: investment._id,
          chequeNumber: form.chequeNumber,
          bankName: form.bankName,
          amount: Number(form.amount),
          issueDate: new Date(form.issueDate).toISOString(),
          status: "held"
        })
      },
      data.accessToken
    );

    setForm({ chequeNumber: "", bankName: "", amount: "", issueDate: "" });
    await load();
  };

  const relatedCheques = (cheques || []).filter((item) => {
    const investmentRef =
      typeof item.investmentId === "string" ? item.investmentId : item.investmentId?._id;
    return String(investmentRef) === String(params?.id);
  });

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

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Security Cheques</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Cheque #"
            value={form.chequeNumber}
            onChange={(e) => setForm({ ...form, chequeNumber: e.target.value })}
          />
          <Input 
            placeholder="Bank" 
            value={form.bankName} 
            onChange={(e) => setForm({ ...form, bankName: e.target.value })} 
          />
          <Input 
            placeholder="Amount" 
            type="number"
            value={form.amount} 
            onChange={(e) => setForm({ ...form, amount: e.target.value })} 
          />
          <Input 
            type="date" 
            value={form.issueDate} 
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })} 
          />
        </div>
        <Button className="mt-3" onClick={submitCheque} disabled={!form.chequeNumber || !form.bankName || !form.amount || !form.issueDate}>
          Submit Cheque
        </Button>
        <div className="mt-3 space-y-2 text-sm text-slate-200">
          {relatedCheques.length === 0 && <p className="text-slate-400 italic">No security cheques submitted yet.</p>}
          {relatedCheques.map((item) => (
            <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-2">
               <span className="font-medium">{item.chequeNumber}</span> - {item.bankName} - PKR {(item.amount || 0).toLocaleString()} - <span className="capitalize text-teal-400">{item.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
