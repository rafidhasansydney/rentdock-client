"use client";
import Link from "next/link";
import { useState } from "react";
import type { AnalyticsSummary } from "@/lib/admin-client";
import { useCatalogData } from "@/lib/catalog-client";
import { formatPrice } from "@/lib/demo-equipment";
import { ManagementState } from "./management-common";
import { Button } from "./ui/button";
export function DashboardAnalytics({ owner = false }: { owner?: boolean }) {
  const { data, error, status, retry } = useCatalogData<AnalyticsSummary>(`/${owner ? "owner" : "admin"}/analytics`, true);
  return <><p className="eyebrow">{owner ? "YOUR EQUIPMENT BUSINESS" : "THE PLATFORM AT A GLANCE"}</p><h1 className="dashboard-title">{owner ? "Owner workspace" : "Admin workspace"}</h1><p className="dashboard-lead">{owner ? "Follow your listings, rentals and earnings." : "Keep track of the people, equipment and rentals on RentDock."}</p>
    <div className="owner-actions">{owner ? <><Button asChild><Link href="/dashboard/owner/equipment/new">Add equipment</Link></Button><Button asChild variant="outline"><Link href="/dashboard/owner/rentals">My equipment rentals</Link></Button></> : <><Button asChild><Link href="/dashboard/admin/equipment">Review equipment</Link></Button><Button asChild variant="outline"><Link href="/dashboard/admin/users">Manage users</Link></Button><Button asChild variant="outline"><Link href="/dashboard/admin/rentals">All rentals</Link></Button></>}</div>
    {!data ? <ManagementState error={error} status={status} retry={retry} /> : <><div className="owner-stat-grid analytics-stat-grid">{[...(!owner ? [["Total users", data.users || 0]] : []), [owner ? "Your listings" : "Total equipment", data.equipment], ["Total bookings", data.bookings], ["Pending approvals", data.pendingApprovals], ["Completed rentals", data.completedRentals], [owner ? "Total earnings" : "Total revenue", formatPrice(data.revenueMinor / 100)]].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div><p className="field-help">{owner ? "Earnings" : "Revenue"} shows gross paid rental amounts in BDT, before provider fees or refunds.</p><MonthlyChart data={data.monthly} owner={owner} /><div className="analytics-review-summary"><span>{data.approvedEquipment} approved listing(s)</span><span>{data.rejectedEquipment} listing(s) need changes</span><Button variant="ghost" onClick={retry}>Refresh totals</Button></div></>}
  </>;
}
function MonthlyChart({ data, owner }: { data: AnalyticsSummary["monthly"]; owner: boolean }) {
  const [metric, setMetric] = useState<"bookings" | "revenueMinor">(owner ? "revenueMinor" : "bookings");
  const max = Math.max(...data.map(row => row[metric]), 1);
  const label = (month: string) => new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });
  const display = (value: number) => metric === "revenueMinor" ? formatPrice(value / 100) : String(value);
  return <section className="analytics-chart" aria-label="Monthly rental performance"><div className="analytics-chart-heading"><div><p className="eyebrow">THE LAST SIX MONTHS</p><h2>{metric === "bookings" ? "Monthly bookings" : owner ? "Monthly earnings" : "Monthly revenue"}</h2></div><label>Show<select className="rd-input" value={metric} onChange={event => setMetric(event.target.value as typeof metric)}><option value="bookings">Bookings</option><option value="revenueMinor">{owner ? "Earnings" : "Revenue"} (BDT)</option></select></label></div>
    <div className="monthly-bars">{data.map(row => <div className="monthly-column" key={row.month}><span>{display(row[metric])}</span><div className="monthly-bar-track"><div className="monthly-bar" style={{ height: `${row[metric] / max * 100}%` }} /></div><strong>{label(row.month)}</strong></div>)}</div>
    <details className="analytics-data"><summary>View monthly figures</summary><div className="data-table-wrap"><table className="data-table"><caption className="sr-only">Monthly bookings and paid amounts</caption><thead><tr><th scope="col">Month</th><th scope="col">Bookings</th><th scope="col">Paid amount (BDT)</th></tr></thead><tbody>{data.map(row => <tr key={row.month}><th scope="row">{label(row.month)}</th><td>{row.bookings}</td><td>{formatPrice(row.revenueMinor / 100)}</td></tr>)}</tbody></table></div></details>
  </section>;
}
