"use client";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { type Equipment, formatPrice, rentalUnit } from "@/lib/demo-equipment";
import { useAccount } from "./account-provider";

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const { user, pending } = useAccount();
  const destination = `/equipment/${equipment.id}`;
  const href = user || pending ? destination : `/login?next=${encodeURIComponent(destination)}`;
  return (
    <article className="equipment-card">
      <Link href={href} className="equipment-image" aria-label={`View ${equipment.name}`}>
        <Image src={equipment.image} alt={equipment.imageAlt || equipment.name} fill unoptimized sizes="(max-width: 600px) 90vw, (max-width: 1100px) 44vw, 30vw" />
        <span className={equipment.available ? "availability" : "availability unavailable"}>{equipment.available ? "In stock" : "Out of stock"}</span>
        <span className="equipment-view">Explore equipment</span>
      </Link>
      <div className="equipment-info">
        <span className="equipment-category">{equipment.category}</span>
        <h3><Link href={href}>{equipment.name}</Link></h3>
        <p className="equipment-location"><Icon name="pin" size={15} />{equipment.location}</p>
        <div className="equipment-bottom">
          <p><strong>{formatPrice(equipment.price)}</strong><span> / {rentalUnit(equipment.rentalType)}</span></p>
          <Link href={href} className="details-link" aria-label={`View details for ${equipment.name}`}>View details</Link>
        </div>
      </div>
    </article>
  );
}
