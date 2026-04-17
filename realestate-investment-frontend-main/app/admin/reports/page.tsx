"use client";

import { useSession } from "next-auth/react";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const { data } = useSession();

  const download = async (path: string, filename: string) => {
    if (!data?.accessToken) return;

    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      }
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Generate Reports</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <Button onClick={() => download("/reports/investments?format=pdf", "investments-report.pdf")}>
          Investments PDF
        </Button>
        <Button variant="outline" onClick={() => download("/reports/investments?format=excel", "investments-report.xlsx")}>
          Investments Excel
        </Button>

        <Button onClick={() => download("/reports/properties?format=pdf", "properties-report.pdf")}>
          Properties PDF
        </Button>
        <Button variant="outline" onClick={() => download("/reports/properties?format=excel", "properties-report.xlsx")}>
          Properties Excel
        </Button>
      </div>
      <p className="text-sm text-slate-400">
        Profit report requires a sold property with sale price set. Use API endpoint directly with propertyId query.
      </p>
    </div>
  );
}
