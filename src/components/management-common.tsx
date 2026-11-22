"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";
export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user } = useAccount();
  return user?.role === "admin" ? children : <div className="account-error-panel"><h1 className="dashboard-title">Admin access is required.</h1><p>Sign in with an Admin account to manage RentDock.</p><Button asChild><Link href="/dashboard">Back to your account</Link></Button></div>;
}
export function ManagementState({ error, status, retry }: { error?: string; status?: number; retry?: () => void }) {
  const path = usePathname();
  return <div className="catalog-state" role={error ? "alert" : "status"}><h2>{error ? "We could not complete your request." : "Getting everything ready."}</h2><p>{error || "Loading your workspace."}</p>{status === 401 ? <Button asChild><Link href={`/login?next=${encodeURIComponent(path)}`}>Sign in again</Link></Button> : error && retry && <Button onClick={retry}>Try again</Button>}</div>;
}
export function ManagementPages({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  return pages > 1 && <nav className="catalog-pagination" aria-label="Table pages"><Button variant="outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</Button><span>Page {page} of {pages}</span><Button variant="outline" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</Button></nav>;
}
