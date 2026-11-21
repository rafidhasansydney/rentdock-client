"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";

export function Brand() {
  return <Link href="/" className="brand" aria-label="RentDock home"><span className="brand-mark">r<span /></span>rentdock<span className="brand-dot">.</span></Link>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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
          </nav>
          <Link className="button button-small nav-action" href="/equipment">Browse equipment</Link>
          <button className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </header>
    </>
  );
}
