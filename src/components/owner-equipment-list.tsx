"use client";
import Link from "next/link";
import { useState } from "react";
import { useCatalogData } from "@/lib/catalog-client";
import { accountRequest } from "@/lib/auth-client";
import { formatPrice, rentalUnit } from "@/lib/demo-equipment";
import type { OwnerListing, OwnerResults } from "@/lib/owner-client";
import { useAccount } from "./account-provider";
import { CatalogState } from "./catalog-state";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "./ui/button";

export function OwnerEquipmentList() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState<OwnerListing | null>(null);
  const [busy, setBusy] = useState(false);
  const { notify } = useAccount();
  const { data, error, status, retry } = useCatalogData<OwnerResults>(`/owner/equipment?page=${page}&status=${filter}`, true);
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await accountRequest(`/owner/equipment/${encodeURIComponent(deleting.id)}?version=${deleting.version}`, { method: "DELETE" });
      notify("The equipment listing has been deleted."); setDeleting(null);
      if (data?.items.length === 1 && page > 1) setPage(page - 1); else retry();
    } catch (failure) { notify(failure instanceof Error ? failure.message : "The listing could not be deleted.", "error"); }
    finally { setBusy(false); }
  }
  return <><div className="owner-page-heading"><div><p className="eyebrow">YOUR EQUIPMENT COLLECTION</p><h1 className="dashboard-title">My equipment</h1><p className="dashboard-lead">Manage the listings you have added.</p></div><Button asChild><Link href="/dashboard/owner/equipment/new">Add equipment</Link></Button></div>
    <label className="owner-status-filter">Listing status<select className="rd-input" value={filter} onChange={event => { setFilter(event.target.value); setPage(1); }}><option value="">All listings</option><option value="pending">Pending review</option><option value="approved">Approved</option><option value="rejected">Needs changes</option></select></label>
    {!data ? <CatalogState error={error} status={status} retry={retry} /> : data.items.length ? <><div className="data-table-wrap"><table className="data-table"><caption className="sr-only">Your equipment listings</caption><thead><tr><th scope="col">Equipment</th><th scope="col">Category</th><th scope="col">Rental rate</th><th scope="col">Quantity</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>{data.items.map(item => <tr key={item.id}><th scope="row"><Link href={`/dashboard/owner/equipment/${item.id}`}>{item.name}</Link><small>{item.location}</small></th><td>{item.category}</td><td>{formatPrice(item.price)}<small>per {rentalUnit(item.rentalType)}</small></td><td>{item.availableQuantity} available<small>{item.quantity} total</small></td><td><span className={`listing-status ${item.status}`}>{item.status === "rejected" ? "Needs changes" : item.status}</span></td><td><div className="table-actions"><Link href={`/dashboard/owner/equipment/${item.id}`}>View details</Link><Link href={`/dashboard/owner/equipment/${item.id}/edit`}>Update</Link><button onClick={() => setDeleting(item)}>Delete</button></div></td></tr>)}</tbody></table></div>{data.pages > 1 && <nav className="catalog-pagination" aria-label="Your equipment pages"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {data.pages}</span><Button variant="outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</Button></nav>}</> : <div className="account-access-panel"><h2>{filter ? "No listings with this status." : "Your collection starts here."}</h2><p>{filter ? "Choose another status to see more of your equipment." : "Add the equipment you would like to rent out."}</p><Button asChild><Link href="/dashboard/owner/equipment/new">Add equipment</Link></Button></div>}
    {deleting && <ConfirmDialog title={`Delete ${deleting.name}?`} busy={busy} confirmLabel="Delete listing" onClose={() => setDeleting(null)} onConfirm={() => { void remove(); }}><p>The listing will no longer appear in your equipment or the public collection. Existing rental records will stay in your history.</p></ConfirmDialog>}
  </>;
}
