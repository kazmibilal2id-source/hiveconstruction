import { Property } from "@/lib/types";
import { API_BASE } from "@/lib/api";

const fallbackProperties: Property[] = [
  {
    _id: "sample-1",
    title: "Emerald Residency",
    description: "Prime urban residential block with high rental demand and protected downside.",
    location: "Lahore",
    area: 2400,
    totalCost: 12000000,
    companyContribution: 3000000,
    images: [],
    status: "available",
    constructionStage: "Structure"
  },
  {
    _id: "sample-2",
    title: "The Opal Heights",
    description: "Mixed-use tower project with staged release and strong yield profile.",
    location: "Islamabad",
    area: 3000,
    totalCost: 16000000,
    companyContribution: 4500000,
    images: [],
    status: "under_construction",
    constructionStage: "Foundation"
  }
];

export async function getPublicProperties(query = ""): Promise<Property[]> {
  try {
    const response = await fetch(`${API_BASE}/properties${query ? `?${query}` : ""}`, {
      cache: "no-store"
    });
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      return fallbackProperties;
    }

    return payload.data as Property[];
  } catch {
    return fallbackProperties;
  }
}

export async function getPublicPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(`${API_BASE}/properties/${id}`, {
      cache: "no-store"
    });
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      return null;
    }

    return payload.data as Property;
  } catch {
    return null;
  }
}
