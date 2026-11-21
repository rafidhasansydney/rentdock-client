import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";

export const metadata = { title: "Equipment owner guide | RentDock", description: "Prepare clear equipment listings, useful photos and straightforward rental terms." };

const checklist = [
  ["Clear, current photos", "Show the complete equipment from several angles. Include accessories and photograph any visible wear. Use your own photos of the equipment you are listing."],
  ["Accurate equipment details", "Give the equipment a clear name. Include its brand, model, condition and the accessories supplied with it."],
  ["A rate with its rental period", "State the daily, weekly or monthly rate, the number of units and the location. Keep your listing information up to date."],
  ["Straightforward rental terms", "Explain collection and return arrangements, how to use the equipment safely and which accessories should be returned."],
];

export default function OwnersPage() {
  return (
    <main id="main" className="container owners-main">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Equipment owners</span></div>
      <section className="owners-hero"><div><p className="eyebrow">THE EQUIPMENT OWNER GUIDE</p><h1>Good equipment.<br />Clear expectations.</h1><p>A useful listing starts with accurate information. Help renters understand your equipment, compare its rental period and prepare for a smooth handover.</p><a className="button" href="#listing-checklist">Prepare your listing</a></div><div className="owners-hero-image"><Image src="/images/camera.png" alt="Mirrorless camera and lens" fill priority sizes="(max-width: 760px) 90vw, 42vw" /></div></section>
      <section className="owners-checklist" id="listing-checklist"><div className="section-heading"><div><p className="eyebrow">START WITH THE ESSENTIALS</p><h2>Make every detail useful.</h2></div></div><div className="owner-guide-grid">{checklist.map(([title, text]) => <article key={title}><Icon name="check" size={22} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="owner-photo-guide"><div><p className="eyebrow">YOUR PHOTOS. YOUR EQUIPMENT.</p><h2>Show what the renter receives.</h2><p>Use a well-lit, uncluttered background. Keep the entire item in the frame and add close-ups of the controls, accessories and condition. Avoid using unrelated product images.</p></div><div className="owner-photo-pair"><div><Image src="/images/projector.png" alt="Projector shown clearly from the front" fill sizes="(max-width: 760px) 43vw, 23vw" /></div><div><Image src="/images/drill.png" alt="Cordless drill shown with battery and drill bits" fill sizes="(max-width: 760px) 43vw, 23vw" /></div></div></section>
      <section className="owner-handover"><p className="eyebrow">FROM COLLECTION TO RETURN</p><h2>A better handover starts with clarity.</h2><ul><li>Confirm which equipment and accessories are included.</li><li>Check and record the condition together at collection.</li><li>Explain the controls and any handling instructions.</li><li>Agree on the return time and collection or delivery arrangements.</li><li>Check the returned equipment and accessories together.</li></ul><Link href="/equipment" className="button button-outline">Explore equipment listings</Link></section>
      <section className="owners-faq"><h2>Useful owner questions</h2><details><summary>Can an owner choose the listing photos?</summary><p>Listing images belong to the equipment record. Equipment owners supply their own photos so the listing represents the actual item, its condition and the included accessories.</p></details><details><summary>What is a daily, weekly or monthly rate?</summary><p>The rental period is the unit used with the displayed price. State the period clearly so renters can compare similar equipment and understand the terms.</p></details><details><summary>What makes a listing easier to compare?</summary><p>A clear name, accurate photos, location, rental period, rate, quantity, condition and useful rental terms help renters make an informed choice.</p></details></section>
    </main>
  );
}
