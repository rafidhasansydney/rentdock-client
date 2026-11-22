"use client";
import Image from "next/image";
import Link from "next/link";
import { useCatalogData } from "@/lib/catalog-client";
import { formatPrice, rentalUnit } from "@/lib/demo-equipment";
import type { OwnerListing } from "@/lib/owner-client";
import { CatalogState } from "./catalog-state";
import { Button } from "./ui/button";
export function OwnerListingView({ id, administration = false }: { id: string; administration?: boolean }) {
  const { data, error, status, retry } = useCatalogData<{ item: OwnerListing }>(`/${administration ? "admin" : "owner"}/equipment/${encodeURIComponent(id)}`, true);
  if (!data) return <CatalogState error={error} status={status} retry={retry} />;
  const item = data.item;
  return <><Link className="underlined-link" href={`/dashboard/${administration ? "admin" : "owner"}/equipment`}>Back to equipment</Link><div className="owner-page-heading"><div><p className="eyebrow">YOUR LISTING</p><h1 className="dashboard-title">{item.name}</h1><span className={`listing-status ${item.status}`}>{item.status === "rejected" ? "Needs changes" : item.status}</span></div><Button asChild variant="outline"><Link href={`/dashboard/${administration ? "admin" : "owner"}/equipment/${item.id}/edit`}>Update equipment</Link></Button></div>
    {item.status === "pending" && <p className="listing-notice">Your listing is awaiting approval. You can review its details here while it is not yet in the public collection.</p>}
    {item.rejectionReason && <p className="form-error">Review feedback: {item.rejectionReason}</p>}
    <div className="owner-listing-layout"><div className="owner-listing-photo"><Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width:760px) 90vw,40vw" /></div><div className="owner-listing-information"><h2>{formatPrice(item.price)} <span>/ {rentalUnit(item.rentalType)}</span></h2><p>{item.description}</p><dl className="detail-facts">{[["Category", item.category], ["Location", item.location], ["Available quantity", item.availableQuantity], ["Total quantity", item.quantity], ["Condition", item.condition], ["Brand", item.brand], ["Model", item.model], ["Owner", item.ownerName]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div></div>
    <div className="owner-listing-terms"><section><h2>Included equipment</h2>{item.included?.length ? <ul>{item.included.map(value => <li key={value}>{value}</li>)}</ul> : <p>No additional accessories listed.</p>}</section><section><h2>Rental terms</h2><ul>{(item.terms || []).map(value => <li key={value}>{value}</li>)}</ul></section></div>
  </>;
}
