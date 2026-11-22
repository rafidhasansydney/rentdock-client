import type { AccountRole } from "./auth-client";
import type { OwnerListing } from "./owner-client";
import type { Rental } from "./booking-client";
export type ManagedUser = { id: string; name: string; email: string; role: AccountRole; suspended: boolean; createdAt: string; version: number };
export type ManagedListing = OwnerListing & { ownerEmail: string };
export type ManagedRental = Rental & { ownerName: string; ownerEmail: string; version: number; adminNote: string; storedStatus: string };
export type ManagementResults<T> = { items: T[]; total: number; page: number; pages: number };
export type AnalyticsSummary = { users?: number; equipment: number; pendingApprovals: number; approvedEquipment: number; rejectedEquipment: number; bookings: number; completedRentals: number; revenueMinor: number; currency: "bdt"; monthly: { month: string; bookings: number; revenueMinor: number }[] };
