"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, demoEquipment, formatPrice, rentalUnit } from "@/lib/demo-equipment";
import { useCatalogData, type Highlights } from "@/lib/catalog-client";
import { CatalogState } from "./catalog-state";
import { EquipmentCard } from "./equipment-card";
import { Icon } from "./icons";

const categoryDescriptions = ["Cameras & creator kits", "Tools for the job", "Screens & projectors", "Sound for every occasion", "Equipment that works", "Move more, with less hassle"];
const illustrationPicks = [demoEquipment[0], demoEquipment[1], demoEquipment[2]];
const rentalStories = [
  { name: "Ayesha Rahman", project: "Weekend photography", text: "A camera for a weekend shoot makes more sense than buying an entire kit.", initials: "AR" },
  { name: "Tanvir Ahmed", project: "Home improvement", text: "Finding a tool, its location and its daily rate together makes planning easier.", initials: "TA" },
  { name: "Nusrat Jahan", project: "Community event", text: "A clear equipment list takes one more thing off the event planning checklist.", initials: "NJ" },
  { name: "Fahim Hasan", project: "Creative workshop", text: "Access to the right equipment gives a small project more room to grow.", initials: "FH" },
];

export function HomeExperience() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All equipment");
  const [heroIndex, setHeroIndex] = useState(0);
  const highlights = useCatalogData<Highlights>("/equipment-highlights");
  const picks = highlights.data?.featured.slice(0, 3) ?? [];
  const heroPicks = picks.length ? picks : illustrationPicks;
  const heroEquipment = heroPicks[heroIndex % heroPicks.length];
  const featured = (highlights.data?.featured ?? []).filter(item => category === "All equipment" || item.category === category);

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location) params.set("location", location);
    router.push(`/equipment${params.size ? `?${params}` : ""}`);
  }

  return (
    <main id="main">
      <section className="hero container">
        <div className="hero-content">
          <div className="hero-kicker"><span className="kicker-line" /> EQUIPMENT RENTALS, MADE FOR BANGLADESH.</div>
          <motion.h1 initial={false} whileInView={{ opacity: [0.8, 1] }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : 0.35 }}>Big plans.<br />Rent the gear.<br /><span>Get it done.</span></motion.h1>
          <p className="hero-copy">Cameras, tools, projectors and more, from local equipment owners. Find the right gear for your project and the time you need it.</p>
          <div className="hero-actions"><a className="button" href="#discover">Find your equipment</a><a className="hero-secondary" href="#how-it-works">How renting works</a></div>
          <div className="hero-footnote"><span><Icon name="check" size={16} />Daily, weekly & monthly</span><span><Icon name="check" size={16} />Clear rental rates</span></div>
        </div>
        <div className="hero-stage">
          <div className="stage-topline"><span>GOOD GEAR. ZERO OWNERSHIP.</span><span className="stage-edition">THE RENTDOCK SELECTION</span></div>
          <div className="hero-product-visual">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div className="hero-product-image" key={heroEquipment.id} initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : -12 }} transition={{ duration: reducedMotion ? 0 : 0.18 }}>
                <Image unoptimized className="hero-image" src={heroEquipment.image} alt={heroEquipment.imageAlt} fill priority sizes="(max-width: 760px) 90vw, 50vw" />
              </motion.div>
            </AnimatePresence>
            <div className="stage-side-label">RENT IT. MAKE IT HAPPEN.</div>
          </div>
          <div className="stage-product-info" aria-live="polite"><div><span>{picks.length ? heroEquipment.category : "MORE POSSIBILITIES. LESS TO OWN."}</span><h2>{picks.length ? heroEquipment.name : "Equipment for your next project"}</h2></div>{picks.length > 0 && <p><strong>{formatPrice(heroEquipment.price)}</strong><span> / {rentalUnit(heroEquipment.rentalType)}</span></p>}</div>
          <div className="hero-picks" role="group" aria-label="Explore featured gear">{heroPicks.map((item, index) => <button className={heroIndex === index ? "hero-pick selected" : "hero-pick"} key={item.id} aria-pressed={heroIndex === index} onClick={() => setHeroIndex(index)}><Image unoptimized src={item.image} alt="" width={52} height={38} /><span>{item.category}</span></button>)}</div>
        </div>
      </section>

      <section className="search-section container" id="discover" aria-label="Find rental equipment">
        <form className="rental-search" onSubmit={search}>
          <label><span>What are you looking for?</span><div><Icon name="search" size={21} /><input type="search" placeholder="Camera, drill, projector..." value={query} onChange={event => setQuery(event.target.value)} /></div></label>
          <label className="location-field"><span>Where do you need it?</span><div><Icon name="pin" size={21} /><select aria-label="Rental location" value={location} onChange={event => setLocation(event.target.value)}><option value="">Anywhere in Bangladesh</option><option>Dhaka</option><option>Sylhet</option><option>Chattogram</option><option>Bogura</option></select></div></label>
          <button className="button search-button" type="submit"><Icon name="search" size={19} />Find equipment</button>
        </form>
        <div className="popular-searches"><span>Start with something useful:</span>{["Camera", "Drill", "Projector"].map(term => <Link href={`/equipment?q=${term}`} key={term}>{term}</Link>)}</div>
      </section>

      <section className="category-band"><div className="section container categories-section">
        <div className="section-heading"><div><p className="eyebrow">SIX WAYS TO GET STARTED</p><h2>What do you need?</h2></div><Link className="underlined-link" href="/equipment">Explore all equipment</Link></div>
        <div className="category-grid">{categories.map((item, index) => <motion.div key={item} whileHover={reducedMotion ? undefined : { y: -4 }} transition={{ duration: 0.18 }}><Link href={`/equipment?category=${encodeURIComponent(item)}`} className="category-card"><div className="category-photo"><Image src={demoEquipment[index].image} alt="" fill sizes="(max-width: 760px) 28vw, 15vw" /></div><h3>{item === "Vehicles & Transportation" ? "Transport" : item}</h3><span>{categoryDescriptions[index]}</span></Link></motion.div>)}</div>
      </div></section>

      <section className="featured-band"><div className="section container featured-section">
        <div className="section-heading"><div><p className="eyebrow">READY FOR YOUR NEXT PROJECT</p><h2>Good equipment. Great possibilities.</h2></div><Link className="underlined-link" href="/equipment">View the collection</Link></div>
        <div className="equipment-tabs" role="group" aria-label="Featured equipment category">{["All equipment", ...categories].map(item => <button key={item} className={category === item ? "tab active" : "tab"} aria-pressed={category === item} onClick={() => setCategory(item)}>{category === item && <motion.span layoutId="featured-selection" className="tab-selection" transition={{ type: "tween", duration: reducedMotion ? 0 : 0.2 }} />}<span>{item === "Vehicles & Transportation" ? "Transport" : item}</span></button>)}</div>
        {!highlights.data && <CatalogState error={highlights.error} retry={highlights.retry} />}
        {highlights.data && featured.length === 0 && <div className="catalog-state"><p>No equipment in this category yet.</p><Link href={`/equipment?category=${encodeURIComponent(category === "All equipment" ? "" : category)}`}>Browse the collection</Link></div>}
        <motion.div layout={!reducedMotion} className="equipment-grid"><AnimatePresence initial={false} mode="popLayout">{featured.map(item => <motion.div layout={!reducedMotion} key={item.id} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }}><EquipmentCard equipment={item} /></motion.div>)}</AnimatePresence></motion.div>

      </div></section>

      <section className="section container collections-section">
        <div className="section-heading"><div><p className="eyebrow">LESS SEARCHING. MORE DOING.</p><h2>Find your kind of project.</h2></div></div>
        <div className="collection-grid">
          <Link href="/equipment?category=Photography" className="collection-card collection-camera"><div><span className="collection-label">FOR THE CREATORS</span><h3>Make your next<br />great shot.</h3><p>Camera kits for a different perspective.</p><span className="collection-action">Explore photography</span></div><div className="collection-photo"><Image src="/images/camera.png" alt="Mirrorless camera kit" fill sizes="45vw" /></div></Link>
          <Link href="/equipment?category=Construction" className="collection-card collection-tools"><div><span className="collection-label">FOR THE DOERS</span><h3>Small fix.<br />Big difference.</h3><p>The right tools for the job in hand.</p><span className="collection-action">Explore construction</span></div><div className="collection-photo"><Image src="/images/drill.png" alt="Cordless drill kit" fill sizes="45vw" /></div></Link>
        </div>
      </section>

      <section className="how-section" id="how-it-works"><div className="container how-layout"><div><p className="eyebrow">SIMPLE FROM THE START</p><h2>Less buying.<br />More getting things done.</h2><p className="how-intro">Find suitable equipment, understand the rental period<br className="desktop-break" /> and plan your project with confidence.</p><Link className="button button-dark" href="/equipment">Explore equipment</Link></div><div className="steps">{[{ title: "Find the right fit", text: "Browse equipment by category and location. Compare the rate and rental period." }, { title: "Choose your time", text: "Plan your start and return dates, the quantity you need and the rental period that suits the project." }, { title: "Get on with your project", text: "Review the equipment condition, included accessories and collection or delivery arrangements." }].map((step, index) => <article className="step" key={step.title}><span className="step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></div></section>

      <section className="section container benefits-section"><div className="benefit-grid">{[{ icon: "clock", title: "Just the time you need", text: "Daily, weekly or monthly. Each rate comes with its rental period clearly shown." }, { icon: "pin", title: "Made for local projects", text: "Find equipment across Bangladesh locations, closer to where you need it." }, { icon: "sliders", title: "A clearer comparison", text: "Compare equipment, rental periods and listed availability together before you decide." }].map(benefit => <article className="benefit" key={benefit.title}><Icon name={benefit.icon as "clock" | "pin" | "sliders"} size={24} /><h3>{benefit.title}</h3><p>{benefit.text}</p></article>)}</div></section>

      <section className="recent-section"><div className="container recent-layout"><div><p className="eyebrow">RECENTLY ADDED</p><h2>New equipment.<br />Fresh possibilities.</h2><p>Something for the presentation, the playlist<br className="desktop-break" /> and the plans that bring people together.</p><Link className="underlined-link" href="/equipment">Explore recent equipment</Link></div><div className="recent-grid">{(highlights.data?.recent ?? []).map(item => <EquipmentCard equipment={item} key={item.id} />)}</div></div></section>

      <section className="section container reviews-section"><div className="section-heading"><div><p className="eyebrow">PEOPLE WITH PROJECTS</p><h2>A little gear goes a long way.</h2></div><p>Four illustrative rental stories.<br />Different projects, one practical idea.</p></div><div className="reviews-grid">{rentalStories.map(review => <article className="review" key={review.name}><span className="stars" aria-label="Illustrative rating: 5 out of 5">★★★★★</span><blockquote>“{review.text}”</blockquote><div className="review-person"><span className="avatar">{review.initials}</span><div><h3>{review.name}</h3><p>{review.project}</p></div></div></article>)}</div></section>

      <section className="container owner-section" id="for-owners"><div><p className="eyebrow">YOUR EQUIPMENT HAS MORE TO GIVE</p><h2>Between projects?<br />Put your gear to work.</h2><p>Prepare clear equipment details, choose your rental rates<br className="desktop-break" /> and set expectations for every handover.</p><Link className="button button-white" href="/owners">Read the owner guide</Link></div><div className="owner-visual"><Image src="/images/projector.png" alt="Portable projector" width={500} height={333} /><div className="owner-visual-caption"><span>A LITTLE LESS IDLE.</span><strong>A lot more possibility.</strong></div></div></section>

      <section className="container faq-section" id="rental-questions"><div><p className="eyebrow">A FEW USEFUL ANSWERS</p><h2>Before you get started.</h2></div><div className="faq-list"><details><summary>How do I find the right equipment?</summary><p>Search by equipment name, category or location. Use the catalog filters to compare rental periods, rates and listed availability, then open the equipment details.</p></details><details><summary>How are rental prices displayed?</summary><p>Each listing shows a BDT rate with its daily, weekly or monthly period. Compare the period along with the price and review the rental terms before making arrangements.</p></details><details><summary>What should equipment owners prepare?</summary><p>Prepare clear photos, an accurate description, the rental rate and period, quantity, location and terms. <Link className="underlined-link" href="/owners">Read the owner guide</Link> for a complete checklist.</p></details></div></section>
    </main>
  );
}
