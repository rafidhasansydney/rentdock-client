"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export function CatalogState({ error, retry, status }: { error?: string; retry?: () => void; status?: number }) {
  const pathname = usePathname();
  return <div className="catalog-state" role={error ? "alert" : "status"}>
    <h2>{error ? status === 404 ? "This equipment is no longer available." : "Let's try that again." : "Finding your next possibility."}</h2>
    <p>{error || "Loading equipment…"}</p>
    {status === 401 ? <Button asChild><Link href={`/login?next=${encodeURIComponent(pathname)}`}>Sign in again</Link></Button> : error && retry && <Button onClick={retry}>Try again</Button>}
  </div>;
}
