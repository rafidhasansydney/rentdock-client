import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demoEquipment, formatPrice, rentalUnit } from "@/lib/demo-equipment";
import { listingDetails, rentalGuidelines } from "@/lib/equipment-details";
import { Icon } from "@/components/icons";

export const dynamicParams = false;
export function generateStaticParams() { return demoEquipment.map(item => ({ id: item.id })); }

export default async function EquipmentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = demoEquipment.find(equipment => equipment.id === id);
  const details = listingDetails[id];
  if (!item || !details) notFound();
  return (
    <main id="main" className="container detail-main">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/equipment">Equipment</Link><span>/</span><span>{item.name}</span></div>
      <div className="detail-grid">
        <div className="detail-art"><Image src={item.image} alt={item.imageAlt} fill priority sizes="(max-width: 760px) 90vw, 45vw" /></div>
        <div className="detail-copy">
          <p className="eyebrow">{item.category}</p><h1>{item.name}</h1>
          <p className="equipment-location"><Icon name="pin" size={18} />{item.location}</p>
          <p className="detail-price"><strong>{formatPrice(item.price)}</strong> / {rentalUnit(item.rentalType)}</p>
          <p>{item.description}</p>
          <span className={item.available ? "detail-status" : "detail-status muted"}>{item.available ? "Available to rent" : "Currently rented"}</span>
          <dl className="detail-facts"><div><dt>Rental period</dt><dd>{item.rentalType}</dd></div><div><dt>Available quantity</dt><dd>{item.available ? details.quantity : 0}</dd></div><div><dt>Condition</dt><dd>{details.condition}</dd></div><div><dt>Location</dt><dd>{item.location}</dd></div></dl>
          <div className="detail-actions"><a className="button" href="#rental-information">Review rental information</a><Link href="/equipment" className="underlined-link">Browse more equipment</Link></div>
        </div>
      </div>
      <section className="detail-information" id="rental-information"><article><p className="eyebrow">KNOW WHAT IS INCLUDED</p><h2>Equipment and accessories</h2><ul>{details.included.map(accessory => <li key={accessory}>{accessory}</li>)}</ul></article><article><p className="eyebrow">PLAN A CLEAR HANDOVER</p><h2>Rental guidelines</h2><ul>{rentalGuidelines.map(term => <li key={term}>{term}</li>)}</ul><Link className="underlined-link" href="/owners">Equipment care and handover guide</Link></article></section>
    </main>
  );
}
