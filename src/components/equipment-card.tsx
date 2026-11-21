import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { type Equipment, formatPrice, rentalUnit } from "@/lib/demo-equipment";

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <article className="equipment-card">
      <Link href={`/equipment/${equipment.id}`} className="equipment-image" aria-label={`View ${equipment.name}`}>
        <Image src={equipment.image} alt={equipment.imageAlt} fill sizes="(max-width: 600px) 90vw, (max-width: 1100px) 44vw, 30vw" />
        <span className={equipment.available ? "availability" : "availability unavailable"}>{equipment.available ? "Available to rent" : "Currently rented"}</span>
        <span className="equipment-view">Explore equipment</span>
      </Link>
      <div className="equipment-info">
        <span className="equipment-category">{equipment.category}</span>
        <h3><Link href={`/equipment/${equipment.id}`}>{equipment.name}</Link></h3>
        <p className="equipment-location"><Icon name="pin" size={15} />{equipment.location}</p>
        <div className="equipment-bottom">
          <p><strong>{formatPrice(equipment.price)}</strong><span> / {rentalUnit(equipment.rentalType)}</span></p>
          <Link href={`/equipment/${equipment.id}`} className="details-link" aria-label={`View details for ${equipment.name}`}>View details</Link>
        </div>
      </div>
    </article>
  );
}
