"use client";
import Link from "next/link";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";
export function OwnerGate({ children }: { children: React.ReactNode }) {
  const { user } = useAccount();
  if (user?.role !== "owner") return <div className="account-error-panel"><h1 className="dashboard-title">Owner access is required.</h1><p>This workspace is available to equipment owners.</p><Button asChild><Link href="/dashboard">Back to your account</Link></Button></div>;
  return children;
}
