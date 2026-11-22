"use client";
import Link from "next/link";
import { useState } from "react";
import { accountRequest } from "@/lib/auth-client";
import { useCatalogData } from "@/lib/catalog-client";
import { checkoutAddress, type CheckoutResult } from "@/lib/booking-client";
import { formatPrice } from "@/lib/demo-equipment";
import { CatalogState } from "./catalog-state";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "./ui/button";
export function PaymentStatus({ id, cancelled }: { id: string; cancelled: boolean }) {
  const { data, error, status, retry } = useCatalogData<CheckoutResult>(`/booking/checkouts/${encodeURIComponent(id)}`, true);
  const [confirm, setConfirm] = useState(false), [busy, setBusy] = useState(false), [failure, setFailure] = useState("");
  async function cancel() {
    setBusy(true); setFailure("");
    try { await accountRequest(`/booking/checkouts/${encodeURIComponent(id)}/cancel`, { method: "POST" }); setConfirm(false); retry(); }
    catch (error) { setFailure(error instanceof Error ? error.message : "The checkout could not be cancelled."); }
    finally { setBusy(false); }
  }
  if (!id) return <CatalogState error="Choose a checkout from My rentals." status={404} />;
  if (!data) return error ? <CatalogState error={error} status={status} retry={retry} /> : <div className="catalog-state"><h2>Checking payment status</h2><p role="status">Confirming your checkout with the payment provider.</p></div>;
  const paid = Boolean(data.rental && ["paid", "completed"].includes(data.attempt.state));
  const expired = data.attempt.state === "expired";
  const url = checkoutAddress(data.attempt.checkoutUrl);
  return <><p className="eyebrow">YOUR RENTAL PAYMENT</p><h1 className="dashboard-title">{paid ? "Your rental is confirmed." : expired ? "This checkout has ended." : cancelled ? "Payment was not completed." : "Confirming your payment"}</h1>
    <div className="payment-result"><h2>{data.attempt.equipmentName}</h2><p>{data.attempt.startDate} to {data.attempt.endDate} · {data.attempt.quantity} item(s)</p><strong className="payment-result-total">{formatPrice(data.attempt.amountMinor / 100)}</strong>
      <p>{paid ? "Stripe has confirmed your payment. Your booking and transaction are saved in My rentals." : expired ? "No new payment can be made through this checkout. You can choose new dates and check availability again." : "Your booking is confirmed only after the payment provider verifies a successful payment. Resume checkout or refresh its status."}</p>
      {data.rental && <p className="field-help">Transaction: {data.rental.transactionId}</p>}
      {failure && <p className="form-error" role="alert">{failure}</p>}
      <div className="owner-actions">{!paid && !expired && <><Button variant="outline" onClick={retry}>Refresh payment status</Button>{url && <Button asChild><a href={url}>Resume Stripe checkout</a></Button>}<Button variant="ghost" onClick={() => setConfirm(true)}>Cancel checkout</Button></>}<Button asChild variant="outline"><Link href="/dashboard/rentals">My rentals</Link></Button>{expired && <Button asChild><Link href={`/equipment/${data.attempt.equipmentId}`}>Choose another rental</Link></Button>}</div>
    </div>{confirm && <ConfirmDialog title="Cancel this checkout?" busy={busy} confirmLabel="Cancel checkout" onClose={() => setConfirm(false)} onConfirm={() => { void cancel(); }}><p>We will check Stripe first. If payment already succeeded, your confirmed rental will be kept. Otherwise, availability is released only after checkout expires.</p>{failure && <p className="form-error" role="alert">{failure}</p>}</ConfirmDialog>}
  </>;
}
