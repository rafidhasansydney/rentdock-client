import { OwnerEditor } from "@/components/owner-editor";
export default async function EditPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <OwnerEditor id={id} administration />; }
