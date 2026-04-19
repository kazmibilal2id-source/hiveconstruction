import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPropertyById } from "@/lib/public-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyTimeline } from "@/components/features/property-timeline";
import { getImageUrl } from "@/lib/utils";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPublicPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 md:px-6">
      {property.images?.[0] && (
        <div className="h-[400px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(property.images[0])}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="glass-card space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{property.title}</h1>
            <Badge>{property.status.replace("_", " ")}</Badge>
          </div>
          <p className="text-slate-300">{property.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <p>Location: {property.location}</p>
            <p>Area: {property.area} sqft</p>
            <p>Total Cost: PKR {(property.totalCost || 0).toLocaleString()}</p>
            <p>Company Contribution: PKR {(property.companyContribution || 0).toLocaleString()}</p>
          </div>
          <Link href="/register">
            <Button>Invest in this Property</Button>
          </Link>
        </div>

        <div className="glass-card p-6">
          <h2 className="mb-3 text-lg font-semibold text-white">Construction Timeline</h2>
          <PropertyTimeline currentStage={property.constructionStage} timeline={property.timeline} />
        </div>
      </div>
    </div>
  );
}
