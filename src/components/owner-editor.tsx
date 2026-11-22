"use client";
import { useCatalogData } from "@/lib/catalog-client";
import type { OwnerListing } from "@/lib/owner-client";
import { EquipmentForm } from "./equipment-form";
import { CatalogState } from "./catalog-state";
export function OwnerEditor({ id }: { id?: string }) {
  return <><p className="eyebrow">YOUR EQUIPMENT COLLECTION</p><h1 className="dashboard-title">{id ? "Update equipment" : "Add equipment"}</h1><p className="dashboard-lead">Useful details make a better rental experience.</p>{id ? <ExistingEditor id={id} /> : <EquipmentForm />}</>;
}
function ExistingEditor({ id }: { id: string }) {
  const { data, error, status, retry } = useCatalogData<{ item: OwnerListing }>(`/owner/equipment/${encodeURIComponent(id)}`, true);
  return data ? <EquipmentForm key={`${data.item.id}:${data.item.version}`} initial={data.item} /> : <CatalogState error={error} status={status} retry={retry} />;
}
