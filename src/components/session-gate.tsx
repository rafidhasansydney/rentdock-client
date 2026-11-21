"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";

export function SessionGate({ children }: { children: React.ReactNode }) {
  const { user, pending, error, refresh } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!pending && !error && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [error, pathname, pending, router, user]);
  if (pending) return <main id="main" className="message-page"><div className="account-loader" aria-hidden="true" /><h1>Opening your account</h1><p role="status">Checking your session…</p></main>;
  if (error && !user) return <main id="main" className="message-page"><h1>Let’s try that again.</h1><p>We could not check your account. Please check your connection and retry.</p><Button onClick={() => { void refresh(); }}>Try again</Button><Link href="/" className="account-home-link">Back to home</Link></main>;
  if (!user) return <main id="main" className="message-page"><h1>Sign in to continue</h1><p role="status">Taking you to sign in…</p></main>;
  return children;
}
