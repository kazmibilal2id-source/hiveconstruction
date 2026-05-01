"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Investment, User } from "@/lib/types";

interface Cheque {
  _id: string;
  chequeNumber: string;
  bankName: string;
  amount: number;
  status: string;
  issueDate: string;
  investmentId: {
    _id: string;
    amount: number;
    propertyId: {
      title: string;
    }
  }
}

export default function InvestorChequesPage() {
  const { data } = useSession();
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    investmentId: "",
    chequeNumber: "",
    bankName: "",
    amount: "",
    issueDate: ""
  });

  const load = async () => {
    if (!data?.accessToken) return;

    // Load cheques
    apiRequest<Cheque[]>("/cheques", {}, data.accessToken)
      .then(setCheques)
      .catch(err => console.error("Failed to load cheques:", err));

    // Load investments
    apiRequest<Investment[]>("/investments", {}, data.accessToken)
      .then(investmentData => {
        console.log("Fetched Investments:", investmentData);
        setInvestments(investmentData);
        if (investmentData.length > 0 && !form.investmentId) {
          setForm(prev => ({ ...prev, investmentId: investmentData[0]._id }));
        }
      })
      .catch(err => console.error("Failed to load investments:", err));
  };

  useEffect(() => {
    void load();
  }, [data?.accessToken]);

  const submitCheque = async () => {
    if (!data?.accessToken || !form.investmentId) return;

    const selectedInvestment = investments.find(i => i._id === form.investmentId);
    if (!selectedInvestment) return;

    const investorId = typeof selectedInvestment.investorId === "string" 
      ? selectedInvestment.investorId 
      : (selectedInvestment.investorId as User)._id;

    await apiRequest(
      "/cheques",
      {
        method: "POST",
        body: JSON.stringify({
          investorId,
          investmentId: form.investmentId,
          chequeNumber: form.chequeNumber,
          bankName: form.bankName,
          amount: Number(form.amount),
          issueDate: new Date(form.issueDate).toISOString(),
          status: "held"
        })
      },
      data.accessToken
    );

    setForm({ ...form, chequeNumber: "", bankName: "", amount: "", issueDate: "" });
    setIsAdding(false);
    await load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Security Cheques</h1>
          <p className="text-slate-300">List of all security cheques you have submitted for your investments.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? "Cancel" : "+ Add New Cheque"}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-brand-gold/20 bg-brand-gold/5">
          <h2 className="mb-4 text-lg font-semibold text-white">Submit New Security Cheque</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="investment">Select Investment</Label>
              <select
                id="investment"
                value={form.investmentId}
                onChange={(e) => setForm({ ...form, investmentId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                disabled={investments.length === 0}
              >
                {investments.length === 0 ? (
                  <option value="">No investments found</option>
                ) : (
                  <>
                    <option value="" disabled>Select an investment</option>
                    {investments.map((inv) => (
                      <option key={inv._id} value={inv._id} className="bg-slate-900">
                        {((inv.propertyId as any)?.title) || "Property"} - PKR {(inv.amount || 0).toLocaleString()}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {investments.length === 0 && (
                <p className="text-xs text-amber-400 mt-1">You must have an active investment to submit a security cheque.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="chequeNumber">Cheque Number</Label>
              <Input
                id="chequeNumber"
                placeholder="e.g. 12345678"
                value={form.chequeNumber}
                onChange={(e) => setForm({ ...form, chequeNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="e.g. HBL, Alfalah"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (PKR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 500000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              />
            </div>
          </div>
          <Button 
            className="mt-6 w-full md:w-auto" 
            onClick={submitCheque}
            disabled={!form.investmentId || !form.chequeNumber || !form.bankName || !form.amount || !form.issueDate}
          >
            Submit Security Cheque
          </Button>
        </Card>
      )}
      
      <div className="space-y-3">
        {cheques.length === 0 && <p className="text-slate-400 italic">No security cheques found.</p>}
        {cheques.map((cheque) => (
          <Card key={cheque._id}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold text-white">Cheque #: {cheque.chequeNumber}</p>
                <p className="text-sm text-slate-300">Bank: {cheque.bankName}</p>
                <p className="text-sm text-slate-300">Amount: PKR {(cheque.amount || 0).toLocaleString()}</p>
                {cheque.investmentId && (
                  <p className="text-xs text-slate-400 mt-1">
                    Property: {cheque.investmentId.propertyId?.title || "N/A"}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                  cheque.status === 'held' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                  {cheque.status}
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  Issued: {new Date(cheque.issueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
