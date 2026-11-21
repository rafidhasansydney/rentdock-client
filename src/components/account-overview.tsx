"use client";

import Link from "next/link";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";
import { Icon } from "./icons";

export function AccountOverview() {
  const { user } = useAccount();
  const firstName = user?.name.split(" ")[0] || "there";
  return <>
    <p className="eyebrow">YOUR RENTDOCK SPACE</p><h1 className="dashboard-title">Welcome, {firstName}.</h1><p className="dashboard-lead">The right equipment can make your next idea happen.</p>
    <div className="account-welcome"><div><p className="eyebrow">MAKE ROOM FOR YOUR NEXT PROJECT</p><h2>More doing.<br />Less owning.</h2><p>Explore equipment across Bangladesh and find the right fit for what you have in mind.</p><Button asChild><Link href="/equipment">Explore equipment <span aria-hidden="true">→</span></Link></Button></div><Icon name="box" size={130} /></div>
    <div className="account-overview-grid"><article><Icon name="shield" /><h2>Your account, in one place.</h2><p>Keep your profile photo, contact number and address up to date.</p><Link href="/dashboard/profile" className="underlined-link">Manage your profile</Link></article><article><Icon name="camera" /><h2>Find your next possibility.</h2><p>Compare equipment by category, location and rental period.</p><Link href="/equipment" className="underlined-link">Browse the collection</Link></article></div>
  </>;
}
