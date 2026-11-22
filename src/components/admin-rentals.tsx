"use client";
import { useState } from "react";
import { accountRequest } from "@/lib/auth-client";
import { useCatalogData } from "@/lib/catalog-client";
import { formatPrice } from "@/lib/demo-equipment";
import { bookingDate, todayInDhaka } from "@/lib/booking-client";
import type { ManagedRental, ManagementResults } from "@/lib/admin-client";
import { useAccount } from "./account-provider";
import { ConfirmDialog } from "./confirm-dialog";
import { ManagementPages, ManagementState } from "./management-common";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export function AdminRentals() {
  const { notify } = useAccount();
  const [q, setQ] = useState(""), [search, setSearch] = useState(""), [filter, setFilter] = useState(""), [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ManagedRental | null>(null), [action, setAction] = useState("note"), [note, setNote] = useState(""), [busy, setBusy] = useState(false), [failure, setFailure] = useState("");
  const params = new URLSearchParams({ page: String(page), q: search, status: filter });
  const { data, error, status, retry } = useCatalogData<ManagementResults<ManagedRental>>(`/admin/rentals?${params}`, true);
  function open(item: ManagedRental) { setSelected(item); setNote(item.adminNote); setAction("note"); setFailure(""); }
  async function save() {
    if (!selected) return;
    setBusy(true); setFailure("");
    try { await accountRequest(`/admin/rentals/${selected.id}`, { method: "PATCH", body: JSON.stringify({ action, note, version: selected.version }) }); setSelected(null); retry(); notify("Rental management details saved."); }
    catch (error) { setFailure(error instanceof Error ? error.message : "The rental could not be updated."); retry(); }
    finally { setBusy(false); }
  }
  const today = todayInDhaka();
  return <><p className="eyebrow">RENTALS ACROSS RENTDOCK</p><h1 className="dashboard-title">All rentals</h1><p className="dashboard-lead">Monitor paid bookings and record rental handovers.</p>
    <form className="management-filters" onSubmit={event => { event.preventDefault(); setSearch(q); setPage(1); }}><label>Search rentals<Input value={q} maxLength={100} onChange={event => setQ(event.target.value)} placeholder="Equipment, customer or Owner" /></label><label>Booking status<select className="rd-input" value={filter} onChange={event => { setFilter(event.target.value); setPage(1); }}><option value="">All statuses</option>{["confirmed", "ongoing", "completed"].map(value => <option key={value}>{value}</option>)}</select></label><Button type="submit">Search</Button></form>
    {!data ? <ManagementState error={error} status={status} retry={retry} /> : <><p className="management-count">{data.total} rental{data.total === 1 ? "" : "s"}</p><div className="data-table-wrap"><table className="data-table admin-rentals-table"><caption className="sr-only">All paid rental bookings</caption><thead><tr>{["Customer", "Owner", "Equipment", "Rental dates", "Quantity", "Amount", "Payment", "Booking status", "Actions"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{data.items.map(item => <tr key={item.id}><th scope="row">{item.customerName}<small>{item.customerEmail}</small><small>{item.contactNumber}</small></th><td>{item.ownerName}<small>{item.ownerEmail}</small></td><td>{item.equipmentName}<small>Booked {bookingDate(item.createdAt)}</small></td><td>{item.startDate}<small>to {item.endDate}</small></td><td>{item.quantity}</td><td>{formatPrice(item.amountMinor / 100)}</td><td><span className="listing-status approved">{item.paymentStatus}</span><small>{item.transactionId}</small></td><td><span className="listing-status">{item.bookingStatus}</span></td><td><Button variant="outline" onClick={() => open(item)}>Manage</Button></td></tr>)}{!data.items.length && <tr><td colSpan={9}>No rentals match these filters.</td></tr>}</tbody></table></div><ManagementPages page={page} pages={data.pages} onPage={setPage} /></>}
    {selected && <ConfirmDialog title="Manage rental" busy={busy} confirmLabel="Save rental update" onConfirm={save} onClose={() => setSelected(null)}><div className="management-dialog-fields"><strong>{selected.equipmentName}</strong><p>{selected.startDate} to {selected.endDate} · {selected.quantity} item(s)</p><dl className="management-rental-details"><dt>Delivery address</dt><dd>{selected.deliveryAddress}</dd><dt>Customer notes</dt><dd>{selected.notes || "No notes supplied."}</dd><dt>Booking reference</dt><dd>{selected.id}</dd></dl><label>Update<select className="rd-input" value={action} disabled={busy} onChange={event => setAction(event.target.value)}><option value="note">Save internal note</option><option value="start" disabled={selected.storedStatus !== "confirmed" || selected.startDate > today || selected.endDate < today}>Record equipment handover</option><option value="complete" disabled={!["confirmed", "ongoing"].includes(selected.storedStatus) || selected.endDate >= today}>Complete ended rental</option></select></label><label>Internal Admin note<textarea className="rd-input" rows={3} maxLength={500} value={note} disabled={busy} onChange={event => setNote(event.target.value)} /></label><p className="field-help">Internal notes are visible to Admins. Handovers are recorded during rental dates; completion is available after the end date. Paid amounts and transactions are kept as recorded.</p>{failure && <p role="alert" className="form-error">{failure} Close and reopen the rental if it changed.</p>}</div></ConfirmDialog>}
  </>;
}
