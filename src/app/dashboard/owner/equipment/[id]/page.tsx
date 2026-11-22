import { OwnerListingView } from "@/components/owner-listing-view";
export const metadata = { title: "Your equipment listing | RentDock" };
export default async function OwnerListingPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <OwnerListingView id={id} />; }
