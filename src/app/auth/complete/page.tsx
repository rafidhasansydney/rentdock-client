import { Suspense } from "react";
import { GoogleCompletion } from "@/components/google-completion";

export const metadata = { title: "Signing in | RentDock", robots: { index: false, follow: false } };
export default function AuthCompletePage() {
  return <Suspense fallback={<main id="main" className="message-page"><p role="status">Finishing your sign-in…</p></main>}><GoogleCompletion /></Suspense>;
}
