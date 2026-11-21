import { SessionGate } from "@/components/session-gate";
import { EquipmentDetailsExperience } from "@/components/equipment-details-experience";
export const metadata = { title: "Equipment details | RentDock" };
export default async function EquipmentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SessionGate><EquipmentDetailsExperience id={id} /></SessionGate>;
}
