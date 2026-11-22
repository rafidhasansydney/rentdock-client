"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/demo-equipment";
import { accountRequest } from "@/lib/auth-client";
import type { EquipmentInput, OwnerListing } from "@/lib/owner-client";
import { useAccount } from "./account-provider";
import { PhotoField } from "./photo-field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function EquipmentForm({ initial }: { initial?: OwnerListing }) {
  const router = useRouter();
  const { user, notify } = useAccount();
  const [form, setForm] = useState<EquipmentInput>(() => initial ? { name: initial.name, description: initial.description, category: initial.category, location: initial.location, price: String(initial.price), rentalType: initial.rentalType, quantity: String(initial.quantity), condition: initial.condition, brand: initial.brand, model: initial.model, image: initial.image, included: initial.included.join("\n"), terms: initial.terms.join("\n") } : { name: "", description: "", category: "", location: "", price: "", rentalType: "Daily", quantity: "1", condition: "Good", brand: "", model: "", image: "", included: "", terms: "" });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoValid, setPhotoValid] = useState(Boolean(initial?.image));
  const [error, setError] = useState("");
  const set = (key: keyof EquipmentInput, value: string) => setForm(current => ({ ...current, [key]: value }));
  const lines = (value: string) => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading || !form.image || !photoValid) { setError("Upload a working equipment photo before submitting."); return; }
    setBusy(true); setError("");
    try {
      const body = { ...form, price: Number(form.price), quantity: Number(form.quantity), included: lines(form.included), terms: lines(form.terms), ...(initial ? { version: initial.version } : {}) };
      const result = await accountRequest<{ item: OwnerListing }>(initial ? `/owner/equipment/${encodeURIComponent(initial.id)}` : "/owner/equipment", { method: initial ? "PATCH" : "POST", body: JSON.stringify(body) });
      notify(initial ? "Your changes were saved and sent for review." : "Your equipment was submitted for review.");
      router.replace(`/dashboard/owner/equipment/${result.item.id}`);
    } catch (failure) { const message = failure instanceof Error ? failure.message : "The listing could not be saved."; setError(message); notify(message, "error"); }
    finally { setBusy(false); }
  }
  const disabled = busy || uploading;
  return <form className="equipment-editor" onSubmit={save}>
    <section className="editor-section"><div className="editor-section-heading"><span>01</span><div><h2>The equipment</h2><p>Help people understand what you are offering.</p></div></div><div className="editor-fields">
      <label htmlFor="equipment-name">Equipment name<Input id="equipment-name" value={form.name} required minLength={2} maxLength={120} disabled={disabled} onChange={event => set("name", event.target.value)} placeholder="For example, a mirrorless camera kit" /></label>
      <label htmlFor="equipment-description">Description<textarea className="rd-input" id="equipment-description" value={form.description} required minLength={20} maxLength={5000} rows={4} disabled={disabled} onChange={event => set("description", event.target.value)} placeholder="Describe the equipment, its uses and what renters should know." /></label>
      <div className="editor-two-columns"><label htmlFor="equipment-category">Category<select className="rd-input" id="equipment-category" value={form.category} required disabled={disabled} onChange={event => set("category", event.target.value)}><option value="">Choose a category</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label><label htmlFor="equipment-location">Location<Input id="equipment-location" value={form.location} required minLength={2} maxLength={160} disabled={disabled} onChange={event => set("location", event.target.value)} placeholder="Area and city, Bangladesh" /></label></div>
      <div className="editor-two-columns"><label htmlFor="equipment-brand">Brand<Input id="equipment-brand" value={form.brand} required maxLength={100} disabled={disabled} onChange={event => set("brand", event.target.value)} /></label><label htmlFor="equipment-model">Model<Input id="equipment-model" value={form.model} required maxLength={100} disabled={disabled} onChange={event => set("model", event.target.value)} /></label></div>
      <label htmlFor="equipment-condition">Condition<select className="rd-input" id="equipment-condition" value={form.condition} disabled={disabled} onChange={event => set("condition", event.target.value)}>{["New", "Like new", "Good", "Fair"].map(condition => <option key={condition}>{condition}</option>)}</select></label>
    </div></section>
    <section className="editor-section"><div className="editor-section-heading"><span>02</span><div><h2>Rate and quantity</h2><p>Show a clear price for the rental period.</p></div></div><div className="editor-fields">
      <div className="editor-two-columns"><label htmlFor="equipment-price">Rental price (BDT)<Input id="equipment-price" type="number" min="0.01" max="10000000" step="0.01" value={form.price} required disabled={disabled} onChange={event => set("price", event.target.value)} /></label><label htmlFor="equipment-period">Rental period<select className="rd-input" id="equipment-period" value={form.rentalType} disabled={disabled} onChange={event => set("rentalType", event.target.value)}>{["Daily", "Weekly", "Monthly"].map(period => <option key={period}>{period}</option>)}</select></label></div>
      <label htmlFor="equipment-quantity">Available quantity<Input id="equipment-quantity" type="number" min="1" max="10000" step="1" value={form.quantity} required disabled={disabled} onChange={event => set("quantity", event.target.value)} /></label>
    </div></section>
    <section className="editor-section"><div className="editor-section-heading"><span>03</span><div><h2>Photo and rental details</h2><p>Give renters a clear picture before they book.</p></div></div><div className="editor-fields">
      <PhotoField id="equipment-photo" label="Equipment photo" value={form.image} allowUrl={false} disabled={busy} onBusyChange={setUploading} onValidityChange={setPhotoValid} onChange={image => set("image", image)} />
      <label htmlFor="equipment-included">Included equipment and accessories<textarea className="rd-input" id="equipment-included" rows={3} maxLength={10000} value={form.included} disabled={disabled} onChange={event => set("included", event.target.value)} placeholder="One accessory per line" /><span className="field-help">Optional. Up to 20 lines.</span></label>
      <label htmlFor="equipment-terms">Rental terms and conditions<textarea className="rd-input" id="equipment-terms" rows={4} required maxLength={10000} value={form.terms} disabled={disabled} onChange={event => set("terms", event.target.value)} placeholder="Collection, care and return requirements, one per line" /></label>
    </div></section>
    <div className="listing-submission-note"><strong>Submitted by {user?.name}</strong><span>{user?.email}</span><p>{initial ? "Saving changes sends this listing back for approval." : "Your listing starts as Pending and appears in the public collection after approval."}</p></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="owner-actions"><Button type="submit" disabled={disabled || !form.image || !photoValid}>{busy ? "Saving…" : initial ? "Save and submit for review" : "Submit equipment"}</Button><Button asChild variant="ghost"><Link href="/dashboard/owner/equipment">Cancel</Link></Button></div>
  </form>;
}
