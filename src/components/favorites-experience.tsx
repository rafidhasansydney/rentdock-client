"use client";
import Link from "next/link";
import { useState } from "react";
import { accountRequest } from "@/lib/auth-client";
import { useCatalogData, type EquipmentResults } from "@/lib/catalog-client";
import { useAccount } from "./account-provider";
import { CatalogState } from "./catalog-state";
import { formatPrice, rentalUnit } from "@/lib/demo-equipment";
import { Button } from "./ui/button";

export function FavoritesExperience() {
  const { user, notify } = useAccount();
  const [page, setPage] = useState(1);
  const { data, error, status, retry } = useCatalogData<EquipmentResults>(`/favorites?page=${page}`, true);
  const [removing, setRemoving] = useState<string | null>(null);
  async function remove(id: string) {
    setRemoving(id);
    try {
      await accountRequest(`/favorites/${encodeURIComponent(id)}`, { method: "DELETE" });
      notify("Equipment removed from your favorites.");
      if (data?.items.length === 1 && page > 1) setPage(page - 1); else retry();
    } catch (failure) { notify(failure instanceof Error ? failure.message : "Your favorites could not be updated.", "error"); }
    finally { setRemoving(null); }
  }
  if (user?.role !== "customer") return <CatalogState error="Favorites are available to Customer accounts." status={403} />;
  return <><p className="eyebrow">YOUR SAVED POSSIBILITIES</p><h1 className="dashboard-title">My favorites</h1><p className="dashboard-lead">Keep the equipment you like close to hand.</p>
    {!data ? <CatalogState error={error} status={status} retry={retry} /> : data.items.length ? <><div className="data-table-wrap"><table className="data-table"><caption className="sr-only">Your favorite equipment</caption><thead><tr><th scope="col">Equipment</th><th scope="col">Category</th><th scope="col">Rental rate</th><th scope="col">Availability</th><th scope="col">Actions</th></tr></thead><tbody>{data.items.map(item => <tr key={item.id}><th scope="row"><Link href={`/equipment/${item.id}`}>{item.name}</Link><small>{item.location}</small></th><td>{item.category}</td><td>{formatPrice(item.price)}<small>per {rentalUnit(item.rentalType)}</small></td><td>{item.available ? "Available" : "Unavailable"}</td><td><div className="table-actions"><Link href={`/equipment/${item.id}`}>View details</Link><button disabled={removing !== null} onClick={() => { void remove(item.id); }}>{removing === item.id ? "Removing." : "Remove from favorites"}</button></div></td></tr>)}</tbody></table></div>{data.pages > 1 && <nav className="catalog-pagination" aria-label="Favorites pages"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {data.pages}</span><Button variant="outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</Button></nav>}</> : <div className="account-access-panel"><h2>Save something for your next project.</h2><p>Open an equipment listing and add it to your favorites.</p><Button asChild><Link href="/equipment">Explore equipment</Link></Button></div>}
  </>;
}
