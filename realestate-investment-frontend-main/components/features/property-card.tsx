import Link from "next/link";
import { Property } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

export function PropertyCard({ property, hrefPrefix = "/properties" }: { property: Property; hrefPrefix?: string }) {
  return (
    <div className="glass-card overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-glow">
      <div className="h-44 bg-gradient-to-br from-amber-600/30 to-slate-900/80">
        {property.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getImageUrl(property.images[0])} alt={property.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{property.title}</h3>
          <Badge>{property.status.replace("_", " ")}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-slate-300">{property.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <p>Location: {property.location}</p>
          <p>Area: {property.area} sqft</p>
          <p>Cost: PKR {(property.totalCost || 0).toLocaleString()}</p>
          <p>Stage: {property.constructionStage}</p>
        </div>
        <Link href={`${hrefPrefix}/${property._id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </div>
    </div>
  );
}
