"use client";
import Link from "next/link";
import { useState } from "react";
import { accountRequest } from "@/lib/auth-client";
import { useCatalogData } from "@/lib/catalog-client";
import { formatPrice } from "@/lib/demo-equipment";
import type { ManagedListing, ManagementResults } from "@/lib/admin-client";
import type { ListingStatus } from "@/lib/owner-client";
import { useAccount } from "./account-provider";
import { ConfirmDialog } from "./confirm-dialog";
import { ManagementPages, ManagementState } from "./management-common";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export function AdminEquipment() {
  const { notify } = useAccount();
  const [q, setQ] = useState(""), [search, setSearch] = useState(""), [filter, setFilter] = useState(""), [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ManagedListing | null>(null), [action, setAction] = useState<ListingStatus | "delete">("approved"), [reason, setReason] = useState(""), [busy, setBusy] = useState(false), [failure, setFailure] = useState("");
  const params = new URLSearchParams({ page: String(page), q: search, status: filter });
  const { data, error, status, retry } = useCatalogData<ManagementResults<ManagedListing>>(`/admin/equipment?${params}`, true);
  function open(item: ManagedListing, action: ListingStatus | "delete") { setSelected(item); setAction(action); setReason(item.rejectionReason || ""); setFailure(""); }
  async function save() {
    if (!selected) return;
    if (action === "rejected" && reason.trim().length < 5) { setFailure("Give the Owner a reason of at least 5 characters."); return; }
    setBusy(true); setFailure("");
    try {
      await accountRequest(action === "delete" ? `/admin/equipment/${selected.id}?version=${selected.version}` : `/admin/equipment/${selected.id}/review`, { method: action === "delete" ? "DELETE" : "PATCH", ...(action !== "delete" ? { body: JSON.stringify({ status: action, reason, version: selected.version }) } : {}) });
      notify(action === "delete" ? "Listing archived. Rental history is kept." : "Listing review saved."); setSelected(null); retry();
    } catch (error) { setFailure(error instanceof Error ? error.message : "The listing could not be updated."); retry(); }
    finally { setBusy(false); }
  }
  return <><p className="eyebrow">THE RENTDOCK COLLECTION</p><h1 className="dashboard-title">All equipment</h1><p className="dashboard-lead">Review submissions and keep rental listings accurate.</p>
    <form className="management-filters" onSubmit={event => { event.preventDefault(); setSearch(q); setPage(1); }}><label>Search equipment<Input value={q} maxLength={100} onChange={event => setQ(event.target.value)} placeholder="Equipment, Owner or location" /></label><label>Review status<select className="rd-input" value={filter} onChange={event => { setFilter(event.target.value); setPage(1); }}><option value="">All statuses</option>{["pending", "approved", "rejected"].map(value => <option key={value}>{value}</option>)}</select></label><Button type="submit">Search</Button></form>
    {!data ? <ManagementState error={error} status={status} retry={retry} /> : <><p className="management-count">{data.total} listing{data.total === 1 ? "" : "s"}</p><div className="data-table-wrap"><table className="data-table admin-equipment-table"><caption className="sr-only">All equipment and review actions</caption><thead><tr>{["Equipment", "Owner", "Rental price", "Quantity", "Status", "Actions"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{data.items.map(item => <tr key={item.id}><th scope="row">{item.name}<small>{item.category} · {item.location}</small></th><td>{item.ownerName}<small>{item.ownerEmail || "Illustrative sample"}</small></td><td>{formatPrice(item.price)}<small>{item.rentalType}</small></td><td>{item.quantity}</td><td><span className={`listing-status ${item.status}`}>{item.status}</span>{item.rejectionReason && <small>{item.rejectionReason}</small>}</td><td><div className="management-row-actions"><Button asChild variant="outline"><Link href={`/dashboard/admin/equipment/${item.id}`}>View details</Link></Button><Button asChild variant="outline"><Link href={`/dashboard/admin/equipment/${item.id}/edit`}>Update</Link></Button>{item.status !== "approved" && <Button variant="outline" onClick={() => open(item, "approved")}>Approve</Button>}{item.status !== "rejected" && <Button variant="outline" onClick={() => open(item, "rejected")}>Reject</Button>}{item.status !== "pending" && <Button variant="ghost" onClick={() => open(item, "pending")}>Return to pending</Button>}<Button variant="ghost" onClick={() => open(item, "delete")}>Delete</Button></div></td></tr>)}{!data.items.length && <tr><td colSpan={6}>No listings match these filters.</td></tr>}</tbody></table></div><ManagementPages page={page} pages={data.pages} onPage={setPage} /></>}
    {selected && <ConfirmDialog title={action === "delete" ? "Delete this listing?" : `Set listing to ${action}?`} busy={busy} confirmLabel={action === "delete" ? "Delete listing" : "Save review"} onConfirm={save} onClose={() => setSelected(null)}><div className="management-dialog-fields"><strong>{selected.name}</strong><p>{action === "delete" ? "This removes the listing from the collection and keeps existing rental history. Active rentals must finish first." : "Only approved listings appear in the public collection. Existing paid rentals keep their original agreed details."}</p>{action === "rejected" && <label>Reason for rejection<textarea className="rd-input" rows={4} minLength={5} maxLength={500} value={reason} disabled={busy} onChange={event => setReason(event.target.value)} /></label>}{failure && <p role="alert" className="form-error">{failure} Close and reopen the listing if it changed.</p>}</div></ConfirmDialog>}
  </>;
}
