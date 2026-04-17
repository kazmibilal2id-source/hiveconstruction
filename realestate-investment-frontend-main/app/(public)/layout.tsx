import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
