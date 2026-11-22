import { OwnerGate } from "@/components/owner-gate";
export default function OwnerLayout({ children }: { children: React.ReactNode }) { return <OwnerGate>{children}</OwnerGate>; }
