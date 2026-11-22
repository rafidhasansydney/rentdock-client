"use client";
import Link from "next/link";
import { useCatalogData } from "@/lib/catalog-client";
import type { OwnerSummary } from "@/lib/owner-client";
import { CatalogState } from "./catalog-state";
import { Button } from "./ui/button";
export function OwnerOverview() {
  const { data, error, retry } = useCatalogData<OwnerSummary>("/owner/summary", true);
  return <><p className="eyebrow">YOUR EQUIPMENT BUSINESS</p><h1 className="dashboard-title">Owner workspace</h1><p className="dashboard-lead">List your equipment and keep every detail in order.</p>
    <div className="owner-actions"><Button asChild><Link href="/dashboard/owner/equipment/new">Add equipment</Link></Button><Button asChild variant="outline"><Link href="/dashboard/owner/equipment">My equipment</Link></Button></div>
    {!data ? <CatalogState error={error} retry={retry} /> : <div className="owner-stat-grid">{[["Your listings", data.total], ["Pending review", data.pending], ["Approved", data.approved], ["Needs changes", data.rejected]].map(([label, count]) => <article key={label}><span>{label}</span><strong>{count}</strong></article>)}</div>}
    <div className="account-access-panel"><h2>Make your listing easy to choose.</h2><p>Use a clear photo, accurate quantity and useful rental terms. New listings and edits go through approval before appearing in the public collection.</p><Button asChild variant="ghost"><Link href="/owners">Read the owner guide</Link></Button></div>
  </>;
}
