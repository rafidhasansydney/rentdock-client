import { Suspense } from "react";
import { CatalogExperience } from "@/components/catalog-experience";
export const metadata = { title: "Browse equipment | RentDock" };
export default function EquipmentPage() {
  return <Suspense fallback={<main id="main" className="message-page"><h1>Finding your next possibility.</h1><p role="status">Loading equipment.</p></main>}><CatalogExperience /></Suspense>;
}
