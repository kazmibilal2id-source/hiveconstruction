"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
}

export function DashboardShell({
  title,
  navItems,
  children
}: {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <div className="grid min-h-screen md:grid-cols-[250px_1fr]">
        <aside className="border-r border-white/10 bg-black/20 p-4">
          <h2 className="mb-6 text-lg font-semibold text-white">{title}</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white",
                  pathname === item.href && "bg-brand-gold/15 text-brand-gold"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
            Signed in as <span className="font-semibold">{data?.user?.name || data?.user?.email}</span>
          </div>
          <Button onClick={handleLogout} variant="outline" className="mt-3 w-full">
            Logout
          </Button>
        </aside>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
