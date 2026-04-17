export type UserRole = "admin" | "investor" | "visitor";
export type UserStatus = "pending" | "active" | "blocked";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  CNIC: string;
  address: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  area: number;
  totalCost: number;
  companyContribution: number;
  images: string[];
  status: "available" | "under_construction" | "sold" | "purchased";
  constructionStage: string;
  purchaseDate?: string;
  soldDate?: string;
  salePrice?: number;
  timeline?: Array<{ stage: string; date: string; note?: string }>;
  valueHistory?: Array<{ date: string; value: number }>;
}

export interface Investment {
  _id: string;
  investorId: User | string;
  propertyId: Property | string;
  amount: number;
  sharePercentage: number;
  investmentDate: string;
  status: "active" | "withdrawn" | "completed";
  profitReceived: number;
  exitType: "normal" | "early" | "loss_protected";
}

export interface NotificationItem {
  _id: string;
  recipientId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
