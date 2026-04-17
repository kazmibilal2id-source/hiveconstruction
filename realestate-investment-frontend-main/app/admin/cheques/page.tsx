"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";

interface Cheque {
  _id: string;
  chequeNumber: string;
  bankName: string;
  amount: number;
  status: string;
  issueDate: string;
}

export default function AdminChequesPage() {
  const { data } = useSession();
  const [cheques, setCheques] = useState<Cheque[]>([]);

  useEffect(() => {
    if (!data?.accessToken) return;

    apiRequest<Cheque[]>("/cheques", {}, data.accessToken)
      .then(setCheques)
      .catch(() => setCheques([]));
  }, [data?.accessToken]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Security Cheques</h1>
      <div className="space-y-3">
        {cheques.map((cheque) => (
          <Card key={cheque._id}>
            <p className="font-semibold text-white">{cheque.chequeNumber}</p>
            <p className="text-sm text-slate-300">{cheque.bankName}</p>
            <p className="text-sm text-slate-300">Amount: PKR {cheque.amount.toLocaleString()}</p>
            <p className="text-xs text-slate-400">
              {cheque.status} • {new Date(cheque.issueDate).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
