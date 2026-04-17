import { getPublicProperties } from "@/lib/public-data";
import { PropertiesBrowser } from "@/components/features/properties-browser";

export default async function InvestorPropertiesPage() {
  const properties = await getPublicProperties();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Investment Opportunities</h1>
        <p className="text-slate-300">Browse all properties available for investment.</p>
      </div>
      <PropertiesBrowser properties={properties} hrefPrefix="/investor/properties" />
    </div>
  );
}
