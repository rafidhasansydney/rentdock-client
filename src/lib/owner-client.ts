import type { Equipment, Category } from "./demo-equipment";
export type ListingStatus = "pending" | "approved" | "rejected";
export type OwnerListing = Equipment & {
  status: ListingStatus; quantity: number; availableQuantity: number; condition: string; brand: string; model: string; terms: string[]; included: string[]; version: number; ownerName: string; rejectionReason?: string; createdAt: string;
};
export type OwnerResults = { items: OwnerListing[]; total: number; page: number; pages: number; limit: number };
export type OwnerSummary = { total: number; pending: number; approved: number; rejected: number };
export type EquipmentInput = { name: string; description: string; category: Category | ""; location: string; price: string; rentalType: "Daily" | "Weekly" | "Monthly"; quantity: string; condition: string; brand: string; model: string; image: string; included: string; terms: string };
