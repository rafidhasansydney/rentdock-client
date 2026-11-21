"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/demo-equipment";
import { useCatalogData, type EquipmentResults } from "@/lib/catalog-client";
import { EquipmentCard } from "./equipment-card";
import { CatalogState } from "./catalog-state";
import { Icon } from "./icons";

export function CatalogExperience() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const [draft, setDraft] = useState({ source: query, value: query });
  const search = draft.source === query ? draft.value : query;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const { data, error, status, retry } = useCatalogData<EquipmentResults>(`/equipment?${params.toString()}`);
  function update(values: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    if (!Object.hasOwn(values, "page")) next.delete("page");
    for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key); }
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }
  function clear() { setDraft({ source: "", value: "" }); router.replace(pathname, { scroll: false }); }
  const chips = ["q", "category", "location", "type", "availability", "minPrice", "maxPrice"].map(key => [key, params.get(key) || ""]).filter(([, value]) => value);
  const filters = [
    { key: "category", label: "Category", all: "All categories", values: [...categories] },
    { key: "location", label: "Location", all: "Anywhere in Bangladesh", values: ["Dhaka", "Sylhet", "Chattogram", "Bogura"] },
    { key: "type", label: "Rental period", all: "All periods", values: ["Daily", "Weekly", "Monthly"] },
  ];
  return <main id="main" className="catalog-main container">
    <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>All equipment</span></div>
    <div className="catalog-heading"><div><p className="eyebrow">YOUR NEXT POSSIBILITY</p><h1>Find the right <em>equipment.</em></h1><p>For the project you’re planning. For the time you need.</p></div></div>
    <form className="catalog-search" onSubmit={event => { event.preventDefault(); update({ q: search.trim() }); }}><Icon name="search" /><input type="search" aria-label="Search equipment" maxLength={100} placeholder="Search equipment, category or location" value={search} onChange={event => setDraft({ source: query, value: event.target.value })} /><button className="button" type="submit">Search</button></form>
    <div className="catalog-toolbar"><p role="status">{data ? <><strong>{data.total}</strong> {data.total === 1 ? "equipment option" : "equipment options"}</> : error ? "Equipment unavailable" : "Finding equipment…"}</p><div><button className="filter-toggle button button-outline" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(!filtersOpen)}><Icon name="sliders" size={18} />Filters</button><label className="sort-label">Sort by<select value={params.get("sort") || "newest"} onChange={event => update({ sort: event.target.value })}><option value="newest">Recently added</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div></div>
    <div className="catalog-layout">
      <aside className={filtersOpen ? "catalog-filters open" : "catalog-filters"} id="catalog-filters" aria-label="Equipment filters">
        <div className="filter-heading"><h2>Find your fit</h2><button onClick={clear}>Reset</button></div>
        {filters.map(filter => <label key={filter.key}>{filter.label}<select aria-label={filter.label} value={params.get(filter.key) || ""} onChange={event => update({ [filter.key]: event.target.value })}><option value="">{filter.all}</option>{filter.values.map(value => <option key={value}>{value}</option>)}</select></label>)}
        <label>Availability<select aria-label="Availability" value={params.get("availability") || ""} onChange={event => update({ availability: event.target.value })}><option value="">All listings</option><option value="available">In stock</option><option value="unavailable">Out of stock</option></select></label>
        <form className="price-filter" key={`${minPrice}:${maxPrice}`} onSubmit={event => { event.preventDefault(); const values = new FormData(event.currentTarget); update({ minPrice: String(values.get("minPrice") || ""), maxPrice: String(values.get("maxPrice") || "") }); }}>
          <label>Minimum rate<input className="rd-input" aria-label="Minimum rate" name="minPrice" type="number" min="0" max="1000000000" step="any" defaultValue={minPrice} placeholder="BDT 0" /></label>
          <label>Maximum rate<input className="rd-input" aria-label="Maximum rate" name="maxPrice" type="number" min="0" max="1000000000" step="any" defaultValue={maxPrice} placeholder="Any price" /></label>
          <button className="button button-outline" type="submit">Apply price range</button>
        </form>
        <p className="filter-help">Compare the rental period along with the rate. Final availability depends on your rental dates.</p><button className="button mobile-done" onClick={() => setFiltersOpen(false)}>Show results</button>
      </aside>
      <section className="catalog-results" aria-label="Equipment results">
        {chips.length > 0 && <div className="filter-chips">{chips.map(([key, value]) => <button key={key} onClick={() => update({ [key]: "" })} aria-label={`Remove ${value} filter`}>{value}<Icon name="close" size={14} /></button>)}</div>}
        {!data ? <CatalogState error={error} status={status} retry={retry} /> : data.items.length ? <><div className="equipment-grid catalog-grid">{data.items.map(item => <EquipmentCard key={item.id} equipment={item} />)}</div>{data.pages > 1 && <nav className="catalog-pagination" aria-label="Equipment results pages"><button className="button button-outline" disabled={data.page <= 1} onClick={() => update({ page: String(data.page - 1) })}>Previous</button><span>Page {data.page} of {data.pages}</span><button className="button button-outline" disabled={data.page >= data.pages} onClick={() => update({ page: String(data.page + 1) })}>Next</button></nav>}</> : <div className="empty-state"><Icon name="search" size={36} /><h2>No equipment in this selection.</h2><p>Try a different search or clear a filter to explore more possibilities.</p><button className="button" onClick={clear}>Clear all filters</button></div>}
      </section>
    </div>
  </main>;
}
