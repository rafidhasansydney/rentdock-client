import { SessionGate } from "@/components/session-gate";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata = { title: "Your account | RentDock", robots: { index: false, follow: false } };
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SessionGate><DashboardShell>{children}</DashboardShell></SessionGate>;
}
