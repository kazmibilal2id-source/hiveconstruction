import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageTransition } from "@/components/layout/page-transition";

const investorNav = [
  { href: "/investor/dashboard", label: "Dashboard" },
  { href: "/investor/properties", label: "Properties" },
  { href: "/investor/investments", label: "Investments" },
  { href: "/investor/cheques", label: "Security Cheques" },
  { href: "/investor/withdrawal", label: "Withdrawals" },
  { href: "/investor/notifications", label: "Notifications" },
  { href: "/investor/profile", label: "Profile" }
];

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Investor Panel" navItems={investorNav}>
      <PageTransition>{children}</PageTransition>
    </DashboardShell>
  );
}
