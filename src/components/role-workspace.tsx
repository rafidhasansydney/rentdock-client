"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { accountRequest, type AccountUser, type AccountRole } from "@/lib/auth-client";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";

export function RoleWorkspace({ role }: { role: Extract<AccountRole, "owner" | "admin"> }) {
  const { user } = useAccount();
  const [result, setResult] = useState<{ account?: AccountUser; error?: string }>({});
  useEffect(() => {
    if (user?.role !== role) return;
    let active = true;
    accountRequest<{ user: AccountUser }>(`/dashboard/${role}`).then(data => { if (active) setResult({ account: data.user }); }).catch(failure => { if (active) setResult({ error: failure instanceof Error ? failure.message : "We could not open your workspace." }); });
    return () => { active = false; };
  }, [role, user?.id, user?.role]);
  if (user?.role !== role) return <div className="account-error-panel"><h1 className="dashboard-title">This workspace needs a different role.</h1><p>Your account does not have access to this page.</p><Button asChild><Link href="/dashboard">Back to your overview</Link></Button></div>;
  return <><p className="eyebrow">{role === "owner" ? "YOUR EQUIPMENT BUSINESS" : "PLATFORM ADMINISTRATION"}</p><h1 className="dashboard-title">{role === "owner" ? "Owner workspace" : "Admin workspace"}</h1>{result.error ? <p className="form-error" role="alert">{result.error}</p> : !result.account ? <p role="status">Opening your workspace…</p> : <div className="account-access-panel"><h2>Welcome, {result.account.name}.</h2><p>You are signed in with {role} access.</p><Button asChild><Link href="/dashboard/profile">Manage your profile</Link></Button></div>}</>;
}
