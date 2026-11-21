"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";
import { useAccount } from "./account-provider";
import { authClient } from "@/lib/auth-client";

export function Brand() {
  return <Link href="/" className="brand" aria-label="RentDock home"><span className="brand-mark">r<span /></span>rentdock<span className="brand-dot">.</span></Link>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, pending, refresh, notify } = useAccount();
  const [signingOut, setSigningOut] = useState(false);
  async function logout() {
    setSigningOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Sign out failed.");
      await refresh();
      notify("You have been signed out.");
      router.push("/");
    } catch { notify("We could not sign you out. Please try again.", "error"); }
    finally { setSigningOut(false); }
  }
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container nav-inner">
          <Brand />
          <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Main navigation" id="main-navigation" onClick={() => setOpen(false)}>
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
            <Link href="/equipment" aria-current={pathname.startsWith("/equipment") ? "page" : undefined}>All equipment</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/owners" aria-current={pathname === "/owners" ? "page" : undefined}>For owners</Link>
            {!pending && (user ? <><Link href="/dashboard" className="mobile-account-link">Dashboard</Link><button className="mobile-account-link nav-text-button" disabled={signingOut} onClick={() => { void logout(); }}>Sign out</button></> : <><Link href="/login" className="mobile-account-link">Sign in</Link><Link href="/register" className="mobile-account-link">Create account</Link></>)}
          </nav>
          <div className="nav-account">{pending ? <span className="nav-account-pending" aria-label="Checking account">•••</span> : user ? <><button className="nav-text-button" onClick={() => { void logout(); }} disabled={signingOut}>{signingOut ? "Signing out…" : "Sign out"}</button><Link className="button button-small nav-action" href="/dashboard">Dashboard</Link></> : <><Link className="nav-sign-in" href="/login">Sign in</Link><Link className="button button-small nav-action" href="/register">Create account</Link></>}</div>
          <button className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </header>
    </>
  );
}
