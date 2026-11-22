import { OwnerEditor } from "@/components/owner-editor";
export const metadata = { title: "Update equipment | RentDock" };
export default async function UpdateEquipmentPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <OwnerEditor id={id} />; }
