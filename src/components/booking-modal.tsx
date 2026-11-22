"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { accountRequest } from "@/lib/auth-client";
import { todayInDhaka, checkoutAddress, type RentalQuote, type CheckoutResult } from "@/lib/booking-client";
import { formatPrice } from "@/lib/demo-equipment";
import type { EquipmentDetails } from "@/lib/catalog-client";
import { useAccount } from "./account-provider";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function BookingModal({ item, onClose }: { item: EquipmentDetails; onClose: () => void }) {
  const { user } = useAccount();
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [form, setForm] = useState(() => ({ startDate: todayInDhaka(), endDate: todayInDhaka(), quantity: "1", contactNumber: user?.phone || "", deliveryAddress: user?.address || "", notes: "" }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");
  const [revision, setRevision] = useState(0);
  const input = { equipmentId: item.id, startDate: form.startDate, endDate: form.endDate, quantity: Number(form.quantity) };
  const body = JSON.stringify(input);
  const quoteKey = `${body}:${revision}`;
  const [result, setResult] = useState<{ key: string; quote?: RentalQuote; error?: string }>({ key: "" });
  const quote = result.key === quoteKey ? result.quote : undefined;
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      accountRequest<RentalQuote>("/booking/quote", { method: "POST", body, signal: controller.signal }).then(quote => { if (!controller.signal.aborted) setResult({ key: quoteKey, quote }); }).catch(failure => { if (!controller.signal.aborted) setResult({ key: quoteKey, error: failure instanceof Error ? failure.message : "Availability could not be checked." }); });
    }, 400);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [body, quoteKey]);
  function change(key: keyof typeof form, value: string) { setForm(current => ({ ...current, [key]: value })); setRequestId(""); setError(""); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!quote || !quote.paymentAvailable || input.quantity > quote.availableQuantity) return;
    const id = requestId || crypto.randomUUID();
    setRequestId(id); setBusy(true); setError("");
    try {
      const value = await accountRequest<CheckoutResult>("/booking/checkout", { method: "POST", body: JSON.stringify({ ...form, ...input, requestId: id, quoteVersion: quote.quoteVersion }) });
      const url = checkoutAddress(value.attempt.checkoutUrl);
      if (value.attempt.state === "open" && url) window.location.assign(url);
      else router.push(`/dashboard/payment?checkout=${value.attempt.id}`);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Checkout could not be opened."); setRevision(current => current + 1); setBusy(false); }
  }
  return <dialog ref={ref} className="booking-dialog" aria-labelledby="booking-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}><div className="booking-dialog-heading"><div><p className="eyebrow">PLAN YOUR RENTAL</p><h2 id="booking-title">Book {item.name}</h2></div><Button variant="ghost" disabled={busy} onClick={onClose} aria-label="Close booking">×</Button></div>
    <form onSubmit={submit} className="booking-form"><div className="editor-two-columns"><label htmlFor="rental-start">Rental start date<Input id="rental-start" type="date" min={todayInDhaka()} value={form.startDate} disabled={busy} required onChange={event => change("startDate", event.target.value)} /></label><label htmlFor="rental-end">Rental end date<Input id="rental-end" type="date" min={form.startDate || todayInDhaka()} value={form.endDate} disabled={busy} required onChange={event => change("endDate", event.target.value)} /></label></div>
      <div className="editor-two-columns"><label htmlFor="rental-quantity">Required quantity<Input id="rental-quantity" type="number" min="1" max={item.quantity} step="1" value={form.quantity} disabled={busy} required onChange={event => change("quantity", event.target.value)} /></label><label htmlFor="rental-contact">Contact number<Input id="rental-contact" type="tel" autoComplete="tel" maxLength={20} value={form.contactNumber} disabled={busy} required placeholder="01712 345678" onChange={event => change("contactNumber", event.target.value)} /></label></div>
      <label htmlFor="rental-address">Delivery address<textarea id="rental-address" className="rd-input" rows={2} minLength={5} maxLength={500} value={form.deliveryAddress} disabled={busy} required onChange={event => change("deliveryAddress", event.target.value)} /></label>
      <label htmlFor="rental-notes">Additional notes <span className="field-help">Optional</span><textarea id="rental-notes" className="rd-input" rows={2} maxLength={1000} value={form.notes} disabled={busy} onChange={event => change("notes", event.target.value)} /></label>
      <div className="booking-quote" aria-live="polite">{quote ? <><div><span>{quote.days} day(s), {quote.periods} rental period(s) × {input.quantity} item(s)</span><strong>{formatPrice(quote.amountMinor / 100)}</strong></div><p>{quote.availableQuantity} available for your dates.{input.quantity > quote.availableQuantity ? " Choose fewer items or different dates." : " Availability is checked again before payment."}</p>{!quote.paymentAvailable && <p role="alert">Payments are currently unavailable. Please try again later.</p>}</> : <p>{result.key === quoteKey && result.error ? result.error : "Checking price and availability…"}</p>}</div>
      <p className="field-help">Both dates count. Daily: per day; Weekly: per 7-day block; Monthly: per 30-day block. Part blocks count as a full block. Maximum 90 days. Payment is in BDT.</p>
      {error && <p className="form-error" role="alert">{error} <Link className="underlined-link" href="/dashboard/rentals">Check My rentals</Link> before starting another payment.</p>}
      <div className="owner-actions"><Button type="submit" disabled={busy || !quote?.paymentAvailable || input.quantity > (quote?.availableQuantity ?? 0)}>{busy ? "Preparing secure checkout…" : "Continue to Stripe"}</Button><Button variant="ghost" disabled={busy} onClick={onClose}>Keep browsing</Button></div>
    </form>
  </dialog>;
}
