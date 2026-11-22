"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "./account-provider";
import { Icon } from "./icons";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = useAccount();
  const pathname = usePathname();
  const role = user?.role ?? "customer";
  const links = [{ href: "/dashboard", label: "Overview" }, { href: "/dashboard/profile", label: "My profile" }];
  if (role === "customer") links.push({ href: "/dashboard/rentals", label: "My rentals" }, { href: "/dashboard/favorites", label: "My favorites" });
  if (role === "owner") links.push({ href: "/dashboard/owner", label: "Owner workspace" }, { href: "/dashboard/owner/equipment", label: "My equipment" }, { href: "/dashboard/owner/equipment/new", label: "Add equipment" }, { href: "/dashboard/owner/rentals", label: "My equipment rentals" });
  if (role === "admin") links.push({ href: "/dashboard/admin", label: "Admin workspace" });
  return <main id="main" className="dashboard-main">
    <aside className="dashboard-sidebar">
      <div className="dashboard-identity"><span className="account-monogram">{user?.name?.slice(0, 1).toUpperCase()}</span><div><strong>{user?.name}</strong><span className="account-role">{role}</span></div></div>
      <p className="dashboard-nav-label">YOUR ACCOUNT</p>
      <nav aria-label="Dashboard navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}<span aria-hidden="true">↗</span></Link>)}</nav>
      <Link href="/equipment" className="dashboard-browse"><Icon name="box" size={20} /><span>Find your next rental</span><span aria-hidden="true">→</span></Link>
    </aside>
    <section className="dashboard-content">{children}</section>
  </main>;
}
