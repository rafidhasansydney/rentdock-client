import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
const geist = localFont({ src: "./fonts/geist-latin.woff2", display: "swap", variable: "--font-geist", weight: "100 900" });
export const metadata: Metadata = { title: "RentDock | Equipment rentals in Bangladesh", description: "Rent equipment for your next project in Bangladesh." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable}><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
