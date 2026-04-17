"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment, Property, User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function AdminInvestmentDetailPage() {
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

    const [investmentData, chequeData] = await Promise.all([
      apiRequest<Investment>(`/investments/${params.id}`, {}, data.accessToken),
      apiRequest<Cheque[]>("/cheques", {}, data.accessToken)
    ]);

    setInvestment(investmentData);
    setCheques(chequeData);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken, params?.id]);

  const submitCheque = async () => {
    if (!data?.accessToken || !investment) return;

    await apiRequest(
      "/cheques",
      {
        method: "POST",
        body: JSON.stringify({
          investorId: (investment.investorId as User)._id,
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

  const relatedCheques = useMemo(
    () =>
      cheques.filter((item) => {
        const investmentRef =
          typeof item.investmentId === "string" ? item.investmentId : item.investmentId?._id;
        return String(investmentRef) === String(params?.id);
      }),
    [cheques, params?.id]
  );

  const property = investment?.propertyId as Property | undefined;
  const investor = investment?.investorId as User | undefined;

  if (!investment || !property || !investor) {
    return <p className="text-slate-300">Loading investment detail...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-white">Investment Detail</h1>
        <div className="mt-4 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
          <p>Investor: {investor.fullName}</p>
          <p>Property: {property.title}</p>
          <p>Amount: PKR {investment.amount.toLocaleString()}</p>
          <p>Status: {investment.status}</p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Security Cheques</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Cheque #"
            value={form.chequeNumber}
            onChange={(e) => setForm({ ...form, chequeNumber: e.target.value })}
          />
          <Input placeholder="Bank" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
          <Input placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
        </div>
        <Button className="mt-3" onClick={submitCheque}>
          Add Cheque
        </Button>
        <div className="mt-3 space-y-2 text-sm text-slate-200">
          {relatedCheques.map((item) => (
            <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-2">
              {item.chequeNumber} - {item.bankName} - PKR {item.amount} - {item.status}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Document Vault</h2>
        <DocumentVault investmentId={investment._id} investorId={investor._id} adminMode />
      </Card>
    </div>
  );
}
