import { AdminGate } from "@/components/management-common";
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <AdminGate>{children}</AdminGate>; }
