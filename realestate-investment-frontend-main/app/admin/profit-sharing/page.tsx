import { AdminProfitPanel } from "@/components/features/admin-profit-panel";

export default function AdminProfitSharingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Profit Distribution Panel</h1>
        <p className="text-slate-300">Preview payout breakdowns and publish in one click.</p>
      </div>
      <AdminProfitPanel />
    </div>
  );
}
