import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Create an account | RentDock" };
export default function RegisterPage() {
  return <Suspense fallback={<main id="main" className="message-page"><h1>Create your account</h1><p role="status">Loading registration…</p></main>}><AuthForm mode="register" /></Suspense>;
}
