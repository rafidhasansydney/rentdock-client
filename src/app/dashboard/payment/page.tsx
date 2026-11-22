import { PaymentStatus } from "@/components/payment-status";
export const metadata = { title: "Rental payment | RentDock" };
export default async function PaymentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return <PaymentStatus id={typeof params.checkout === "string" ? params.checkout : ""} cancelled={params.cancelled === "1"} />;
}
