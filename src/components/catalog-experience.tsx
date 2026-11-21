"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { categories, demoEquipment } from "@/lib/demo-equipment";
import { EquipmentCard } from "./equipment-card";
import { Icon } from "./icons";
export function CatalogExperience() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";
  const [searchDraft, setSearchDraft] = useState<{ source: string; value: string }>({ source: query, value: query });
  const search = searchDraft.source === query ? searchDraft.value : query;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const type = searchParams.get("type") ?? "";
  const availability = searchParams.get("availability") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  }
  function clear() { setSearchDraft({ source: "", value: "" }); router.replace(pathname, { scroll: false }); }
  const results = demoEquipment.filter(item => (!query || `${item.name} ${item.category} ${item.location}`.toLowerCase().includes(query.toLowerCase())) && (!category || item.category === category) && (!location || item.location.includes(location)) && (!type || item.rentalType === type) && (!availability || item.available === (availability === "available")) && (!maxPrice || item.price <= Number(maxPrice)));
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  if (sort === "newest") results.reverse();
  const activeFilters = [["q", query], ["category", category], ["location", location], ["type", type], ["availability", availability], ["maxPrice", maxPrice ? `Up to BDT ${maxPrice}` : ""]].filter(([, value]) => value);
  return <main id="main" className="catalog-main container"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>All equipment</span></div><div className="catalog-heading"><div><p className="eyebrow">YOUR NEXT POSSIBILITY</p><h1>Find the right <em>equipment.</em></h1><p>For the project you’re planning. For the time you need.</p></div></div><form className="catalog-search" onSubmit={event => { event.preventDefault(); update("q", search.trim()); }}><Icon name="search" /><input type="search" aria-label="Search equipment" placeholder="Search equipment, category or location" value={search} onChange={event => setSearchDraft({ source: query, value: event.target.value })} /><button className="button" type="submit">Search</button></form><div className="catalog-toolbar"><p role="status"><strong>{results.length}</strong> {results.length === 1 ? "equipment option" : "equipment options"}</p><div><button className="filter-toggle button button-outline" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(!filtersOpen)}><Icon name="sliders" size={18} />Filters</button><label className="sort-label">Sort by<select value={sort} onChange={event => update("sort", event.target.value)}><option value="newest">Recently added</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div></div><div className="catalog-layout"><aside className={filtersOpen ? "catalog-filters open" : "catalog-filters"} id="catalog-filters" aria-label="Equipment filters"><div className="filter-heading"><h2>Find your fit</h2><button onClick={clear}>Reset</button></div><label>Category<select aria-label="Category" value={category} onChange={event => update("category", event.target.value)}><option value="">All categories</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label><label>Location<select aria-label="Location" value={location} onChange={event => update("location", event.target.value)}><option value="">Anywhere in Bangladesh</option>{["Dhaka", "Sylhet", "Chattogram", "Bogura"].map(value => <option key={value}>{value}</option>)}</select></label><label>Rental period<select aria-label="Rental period" value={type} onChange={event => update("type", event.target.value)}><option value="">All periods</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label><label>Availability<select aria-label="Availability" value={availability} onChange={event => update("availability", event.target.value)}><option value="">All listings</option><option value="available">Available</option><option value="unavailable">Rented out</option></select></label><label>Maximum rate<select aria-label="Maximum rate" value={maxPrice} onChange={event => update("maxPrice", event.target.value)}><option value="">Any price</option><option value="1000">Up to BDT 1,000</option><option value="2500">Up to BDT 2,500</option><option value="5000">Up to BDT 5,000</option></select></label><p className="filter-help">Compare the rental period along with the rate. Daily, weekly and monthly prices cover different lengths of time.</p><button className="button mobile-done" onClick={() => setFiltersOpen(false)}>Show {results.length} {results.length === 1 ? "result" : "results"}</button></aside><section className="catalog-results" aria-label="Equipment results">{activeFilters.length > 0 && <div className="filter-chips">{activeFilters.map(([key, value]) => <button key={key} onClick={() => update(key, "")} aria-label={`Remove ${value} filter`}>{value}<Icon name="close" size={14} /></button>)}</div>}{results.length ? <div className="equipment-grid catalog-grid">{results.map(item => <EquipmentCard key={item.id} equipment={item} />)}</div> : <div className="empty-state"><Icon name="search" size={36} /><h2>No equipment in this selection.</h2><p>Try a different search or clear a filter to explore more possibilities.</p><button className="button" onClick={clear}>Clear all filters</button></div>}</section></div></main>;
}
