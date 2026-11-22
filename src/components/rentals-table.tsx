"use client";
import Link from "next/link";
import { useState } from "react";
import { useCatalogData } from "@/lib/catalog-client";
import { bookingDate, type RentalsResult } from "@/lib/booking-client";
import { formatPrice } from "@/lib/demo-equipment";
import { CatalogState } from "./catalog-state";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";
export function RentalsTable({ owner = false }: { owner?: boolean }) {
  const { user } = useAccount();
  const [page, setPage] = useState(1);
  const { data, error, status, retry } = useCatalogData<RentalsResult>(`${owner ? "/owner" : ""}/rentals?page=${page}`, true);
  if (user?.role !== (owner ? "owner" : "customer")) return <CatalogState error="This rental view is not available for your account role." status={403} />;
  return <><p className="eyebrow">{owner ? "YOUR EQUIPMENT AT WORK" : "YOUR UPCOMING POSSIBILITIES"}</p><h1 className="dashboard-title">{owner ? "My equipment rentals" : "My rentals"}</h1><p className="dashboard-lead">Your paid rentals and their current status.</p>
    {!data ? <CatalogState error={error} status={status} retry={retry} /> : <>{data.pending.length > 0 && <section className="pending-checkouts"><h2>Unfinished checkouts</h2>{data.pending.map(attempt => <article key={attempt.id}><div><strong>{attempt.equipmentName}</strong><p>{attempt.startDate} to {attempt.endDate} · {formatPrice(attempt.amountMinor / 100)}</p></div><Button asChild variant="outline"><Link href={`/dashboard/payment?checkout=${attempt.id}`}>Resume or cancel</Link></Button></article>)}</section>}
      {data.items.length ? <div className="data-table-wrap"><table className="data-table rentals-table"><caption className="sr-only">{owner ? "Rentals of your equipment" : "Your confirmed rentals"}</caption><thead><tr>{owner && <th scope="col">Customer</th>}<th scope="col">Equipment</th><th scope="col">Rental dates</th>{!owner && <th scope="col">Booking date</th>}<th scope="col">Quantity</th><th scope="col">Total amount</th><th scope="col">Payment</th><th scope="col">Booking status</th></tr></thead><tbody>{data.items.map(item => <tr key={item.id}>{owner && <td>{item.customerName}<small>{item.customerEmail}</small><small>{item.contactNumber}</small></td>}<th scope="row">{item.equipmentName}</th><td>{item.startDate}<small>to {item.endDate}</small></td>{!owner && <td>{bookingDate(item.createdAt)}</td>}<td>{item.quantity}</td><td>{formatPrice(item.amountMinor / 100)}</td><td><span className="listing-status approved">{item.paymentStatus}</span><small>{item.transactionId}</small></td><td><span className="listing-status">{item.bookingStatus}</span></td></tr>)}</tbody></table></div> : <div className="account-access-panel"><h2>{owner ? "No paid equipment rentals yet." : "Your next rental starts here."}</h2><p>{owner ? "Confirmed payments for your equipment will appear here." : "Choose equipment and complete payment to see a confirmed booking here."}</p>{!owner && <Button asChild><Link href="/equipment">Explore equipment</Link></Button>}</div>}
      {data.pages > 1 && <nav className="catalog-pagination" aria-label="Rental pages"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {data.pages}</span><Button variant="outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</Button></nav>}
    </>}
  </>;
}
