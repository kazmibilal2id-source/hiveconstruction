import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/layout/session-provider";
import { HotToaster } from "@/components/layout/hot-toaster";

export const metadata: Metadata = {
  title: "Hive Construction Ventures Advisor System",
  description: "Premium real estate investment management platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <HotToaster />
      </body>
    </html>
  );
}
