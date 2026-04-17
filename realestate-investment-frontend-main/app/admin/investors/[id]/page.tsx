"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Investment, User } from "@/lib/types";
import { Card } from "@/components/ui/card";

export default function InvestorDetailPage() {
  const params = useParams<{ id: string }>();
  const { data } = useSession();
  const [investor, setInvestor] = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    if (!data?.accessToken || !params?.id) return;

    apiRequest<{ investor: User; investments: Investment[] }>(`/investors/${params.id}`, {}, data.accessToken)
      .then((payload) => {
        setInvestor(payload.investor);
        setInvestments(payload.investments);
      })
      .catch(() => {
        setInvestor(null);
      });
  }, [data?.accessToken, params?.id]);

  if (!investor) {
    return <p className="text-slate-300">Loading investor profile...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-white">{investor.fullName}</h1>
        <div className="mt-3 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
          <p>Email: {investor.email}</p>
          <p>Phone: {investor.phone}</p>
          <p>CNIC: {investor.CNIC}</p>
          <p>Status: {investor.status}</p>
          <p className="md:col-span-2">Address: {investor.address}</p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Investment History</h2>
        <div className="space-y-2">
          {investments.map((item) => (
            <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
              Investment {item._id} — PKR {item.amount.toLocaleString()} — {item.status}
              <div className="mt-1">
                <Link href={`/admin/investments/${item._id}`} className="text-brand-gold">
                  Manage investment →
                </Link>
              </div>
            </div>
          ))}
          {!investments.length && <p className="text-sm text-slate-400">No investments found.</p>}
        </div>
      </Card>
    </div>
  );
}
