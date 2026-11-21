"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient, safeReturnPath } from "@/lib/auth-client";
import { useAccount } from "./account-provider";

export function GoogleCompletion() {
  const { user, pending, error, notify } = useAccount();
  const router = useRouter();
  const next = safeReturnPath(useSearchParams().get("next"));
  const id = user?.id;
  useEffect(() => {
    if (pending) return;
    let active = true;
    if (!id || error) { router.replace("/login?error=google"); return; }
    authClient.token().then(result => {
      if (!active) return;
      if (result.error || !result.data?.token) { router.replace("/login?error=google"); return; }
      notify("You are signed in. Welcome to RentDock.");
      router.replace(next);
    }).catch(() => { if (active) router.replace("/login?error=google"); });
    return () => { active = false; };
  }, [error, id, next, notify, pending, router]);
  return <main id="main" className="message-page"><div className="account-loader" aria-hidden="true" /><h1>Welcome to RentDock</h1><p role="status">Finishing your sign-in…</p></main>;
}
