import { OwnerListingView } from "@/components/owner-listing-view";
export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <OwnerListingView id={id} administration />; }
