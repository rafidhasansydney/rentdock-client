import Link from "next/link";
import { Brand } from "./site-header";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div><Brand /><p>The right gear for your next project.<br />Explore equipment for the time you need it.</p></div>
        <nav className="footer-links" aria-label="Footer navigation"><Link href="/equipment">Browse equipment</Link><Link href="/#how-it-works">How it works</Link><Link href="/owners">Owner guide</Link><Link href="/#rental-questions">Rental questions</Link></nav>
        <div className="footer-note"><span className="eyebrow">MORE POSSIBILITIES. LESS COMMITMENT.</span><p>For the shot.<br />For the job.<br />For whatever comes next.</p></div>
      </div>
      <div className="container footer-bottom"><span>{"\u00a9"} {new Date().getFullYear()} RentDock. All rights reserved.</span><span>Illustrative equipment images and rental rates.</span></div>
    </footer>
  );
}
