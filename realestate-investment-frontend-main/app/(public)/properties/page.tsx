import { getPublicProperties } from "@/lib/public-data";
import { PropertiesBrowser } from "@/components/features/properties-browser";

export default async function PropertiesPage() {
  const properties = await getPublicProperties();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 md:px-6">
      <div>
        <h1 className="section-title text-white">Browse Properties</h1>
        <p className="text-slate-300">Search, filter, and discover high-potential investment opportunities.</p>
      </div>
      <PropertiesBrowser properties={properties} />
    </div>
  );
}
