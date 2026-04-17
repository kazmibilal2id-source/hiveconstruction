import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCounter } from "@/components/features/stat-counter";
import { PropertyCard } from "@/components/features/property-card";
import { InvestmentCalculator } from "@/components/features/investment-calculator";
import { getPublicProperties } from "@/lib/public-data";

export default async function LandingPage() {
  const properties = await getPublicProperties("status=available");

  return (
    <div className="space-y-20 pb-20">
      <section className="bg-hero-gradient">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-20 md:grid-cols-2 md:px-6">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
              Hive Construction Ventures Advisor System
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Build wealth through <span className="gradient-text">data-backed real-estate investment</span>.
            </h1>
            <p className="max-w-lg text-slate-300">
              A premium investment command center where investors, properties, profits, and protected exit plans all
              live in one secure place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">Start Investing</Button>
              </Link>
              <Link href="/properties">
                <Button size="lg" variant="outline">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
          <InvestmentCalculator properties={properties} />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 md:grid-cols-4 md:px-6">
        <StatCounter label="Projects Managed" value={124} />
        <StatCounter label="Capital Deployed" value={950000000} prefix="PKR " />
        <StatCounter label="Active Investors" value={680} />
        <StatCounter label="Avg ROI" value={24} suffix="%" />
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title text-white">Featured Opportunities</h2>
            <p className="text-slate-300">Curated properties with transparent stage-by-stage progress.</p>
          </div>
          <Link href="/properties" className="text-sm text-brand-gold">
            View all properties →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="glass-card p-6 md:p-8">
          <h3 className="text-2xl font-semibold text-white">How it works</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-brand-gold">1. Register & Get Verified</p>
              <p className="mt-1 text-sm text-slate-300">Your profile is reviewed and activated by our admin team.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-gold">2. Invest in Live Properties</p>
              <p className="mt-1 text-sm text-slate-300">Track construction milestones and your portfolio in real time.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-gold">3. Exit Smartly</p>
              <p className="mt-1 text-sm text-slate-300">Use simulator-driven exit plans and transparent payout formulas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
