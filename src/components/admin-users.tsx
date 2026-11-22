"use client";
import { useState } from "react";
import { accountRequest, type AccountRole } from "@/lib/auth-client";
import { useCatalogData } from "@/lib/catalog-client";
import { bookingDate } from "@/lib/booking-client";
import type { ManagedUser, ManagementResults } from "@/lib/admin-client";
import { useAccount } from "./account-provider";
import { ConfirmDialog } from "./confirm-dialog";
import { ManagementPages, ManagementState } from "./management-common";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export function AdminUsers() {
  const { user, notify } = useAccount();
  const [q, setQ] = useState(""), [search, setSearch] = useState(""), [role, setRole] = useState(""), [state, setState] = useState(""), [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ManagedUser | null>(null), [nextRole, setNextRole] = useState<AccountRole>("customer"), [suspended, setSuspended] = useState(false), [busy, setBusy] = useState(false), [failure, setFailure] = useState("");
  const params = new URLSearchParams({ page: String(page), q: search, role, state });
  const { data, error, status, retry } = useCatalogData<ManagementResults<ManagedUser>>(`/admin/users?${params}`, true);
  function open(item: ManagedUser) { setSelected(item); setNextRole(item.role); setSuspended(item.suspended); setFailure(""); }
  async function save() {
    if (!selected) return;
    setBusy(true); setFailure("");
    try { await accountRequest(`/admin/users/${selected.id}`, { method: "PATCH", body: JSON.stringify({ role: nextRole, suspended, version: selected.version }) }); setSelected(null); retry(); notify("Account access updated. The user must sign in again."); }
    catch (error) { setFailure(error instanceof Error ? error.message : "Account access could not be saved."); retry(); }
    finally { setBusy(false); }
  }
  return <><p className="eyebrow">PEOPLE ON RENTDOCK</p><h1 className="dashboard-title">All users</h1><p className="dashboard-lead">Manage roles and account access.</p>
    <form className="management-filters" onSubmit={event => { event.preventDefault(); setSearch(q); setPage(1); }}><label>Search users<Input value={q} maxLength={100} onChange={event => setQ(event.target.value)} placeholder="Name or email" /></label><label>Role<select className="rd-input" value={role} onChange={event => { setRole(event.target.value); setPage(1); }}><option value="">All roles</option>{["customer", "owner", "admin"].map(value => <option key={value}>{value}</option>)}</select></label><label>Access<select className="rd-input" value={state} onChange={event => { setState(event.target.value); setPage(1); }}><option value="">All accounts</option><option value="active">Active</option><option value="suspended">Suspended</option></select></label><Button type="submit">Search</Button></form>
    {!data ? <ManagementState error={error} status={status} retry={retry} /> : <><p className="management-count">{data.total} registered account{data.total === 1 ? "" : "s"}</p><div className="data-table-wrap"><table className="data-table"><caption className="sr-only">Registered users and access</caption><thead><tr>{["Name", "Email", "Role", "Registered", "Access", "Actions"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{data.items.map(item => <tr key={item.id}><th scope="row">{item.name}{item.id === user?.id && <small>Your account</small>}</th><td>{item.email}</td><td><span className="listing-status">{item.role}</span></td><td>{bookingDate(item.createdAt)}</td><td>{item.suspended ? "Suspended" : "Active"}</td><td><Button variant="outline" disabled={item.id === user?.id} onClick={() => open(item)}>Manage</Button></td></tr>)}{!data.items.length && <tr><td colSpan={6}>No users match these filters.</td></tr>}</tbody></table></div><ManagementPages page={page} pages={data.pages} onPage={setPage} /></>}
    {selected && <ConfirmDialog title={`Manage ${selected.name}`} busy={busy} confirmLabel="Save account access" onClose={() => setSelected(null)} onConfirm={save}><div className="management-dialog-fields"><p>{selected.email}</p><label>Account role<select className="rd-input" value={nextRole} disabled={busy} onChange={event => setNextRole(event.target.value as AccountRole)}>{["customer", "owner", "admin"].map(value => <option key={value}>{value}</option>)}</select></label><label className="management-checkbox"><input type="checkbox" checked={suspended} disabled={busy} onChange={event => setSuspended(event.target.checked)} />Suspend access</label><p className="field-help">Saving ends this user&apos;s sessions. Owner listings and open checkouts must be resolved before changing a role. Existing paid rental history is retained.</p>{failure && <p role="alert" className="form-error">{failure} Close and reopen this account if its details changed.</p>}</div></ConfirmDialog>}
  </>;
}
