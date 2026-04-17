import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageTransition } from "@/components/layout/page-transition";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/investors", label: "Investors" },
  { href: "/admin/investments", label: "Investments" },
  { href: "/admin/cheques", label: "Cheques" },
  { href: "/admin/withdrawals", label: "Withdrawals" },
  { href: "/admin/profit-sharing", label: "Profit Sharing" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/notifications/send", label: "Send Notification" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Admin Control Center" navItems={adminNav}>
      <PageTransition>{children}</PageTransition>
    </DashboardShell>
  );
}
