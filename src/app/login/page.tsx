import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Sign in | RentDock" };
export default function LoginPage() {
  return <Suspense fallback={<main id="main" className="message-page"><h1>Sign in to RentDock</h1><p role="status">Loading your account…</p></main>}><AuthForm mode="login" /></Suspense>;
}
