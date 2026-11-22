"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, rentalUnit } from "@/lib/demo-equipment";
import { accountRequest } from "@/lib/auth-client";
import { useCatalogData, type EquipmentDetails } from "@/lib/catalog-client";
import { useAccount } from "./account-provider";
import { CatalogState } from "./catalog-state";
import { Icon } from "./icons";
import { Button } from "./ui/button";
import { BookingModal } from "./booking-modal";

function DetailContent({ item, initialFavorite }: { item: EquipmentDetails; initialFavorite: boolean }) {
  const { user, notify } = useAccount();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState(false);
  async function toggleFavorite() {
    setBusy(true);
    try {
      const result = await accountRequest<{ favorite: boolean }>(`/favorites/${encodeURIComponent(item.id)}`, { method: favorite ? "DELETE" : "PUT" });
      setFavorite(result.favorite);
      notify(result.favorite ? "Equipment saved to your favorites." : "Equipment removed from your favorites.");
    } catch (error) { notify(error instanceof Error ? error.message : "Your favorites could not be updated.", "error"); }
    finally { setBusy(false); }
  }
  return <>
    <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/equipment">Equipment</Link><span>/</span><span>{item.name}</span></div>
    <div className="detail-grid"><div className="detail-art"><Image src={item.image} alt={item.imageAlt || item.name} fill priority unoptimized sizes="(max-width: 760px) 90vw, 45vw" /></div>
      <div className="detail-copy"><p className="eyebrow">{item.category}</p><h1>{item.name}</h1><p className="equipment-location"><Icon name="pin" size={18} />{item.location}</p><p className="detail-price"><strong>{formatPrice(item.price)}</strong> / {rentalUnit(item.rentalType)}</p><p>{item.description}</p><span className={item.available ? "detail-status" : "detail-status muted"}>{item.available ? "In stock" : "Out of stock"}</span>
        <dl className="detail-facts"><div><dt>Rental period</dt><dd>{item.rentalType}</dd></div><div><dt>Available quantity</dt><dd>{item.quantity}{item.bookable ? " listed" : ""}</dd></div><div><dt>Condition</dt><dd>{item.condition}</dd></div><div><dt>Owner</dt><dd>{item.owner.name}</dd></div></dl>
        {item.bookable && <p className="field-help">Choose rental dates to check how many items are available for your booking.</p>}
        {item.isSample && <p className="field-help">Sample collection. Photos and rates are illustrative.</p>}
        <div className="detail-actions">{user?.role === "customer" && <Button disabled={!item.bookable || !item.available} onClick={() => setBooking(true)}>Book now</Button>}{user?.role === "customer" && <Button variant="outline" disabled={busy} aria-pressed={favorite} onClick={() => { void toggleFavorite(); }}>{busy ? "Saving…" : favorite ? "Remove from favorites" : "Add to favorites"}</Button>}<a className="underlined-link" href="#rental-information">Rental information</a></div>
      </div></div>
    <section className="detail-information" id="rental-information"><article><p className="eyebrow">KNOW WHAT IS INCLUDED</p><h2>Equipment and accessories</h2><ul>{item.included.map(accessory => <li key={accessory}>{accessory}</li>)}</ul></article><article><p className="eyebrow">PLAN A CLEAR HANDOVER</p><h2>Rental terms</h2><ul>{item.terms.map(term => <li key={term}>{term}</li>)}</ul><Link className="underlined-link" href="/owners">Equipment care and handover guide</Link></article></section>
    {booking && <BookingModal item={item} onClose={() => setBooking(false)} />}
  </>;
}
export function EquipmentDetailsExperience({ id }: { id: string }) {
  const { data, error, status, retry } = useCatalogData<{ item: EquipmentDetails; favorite: boolean }>(`/equipment/${encodeURIComponent(id)}`, true);
  return <main id="main" className="container detail-main">{data ? <DetailContent key={data.item.id} item={data.item} initialFavorite={data.favorite} /> : <CatalogState error={error} status={status} retry={retry} />}</main>;
}
