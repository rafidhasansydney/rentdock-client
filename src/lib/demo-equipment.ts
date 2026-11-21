export const categories = ["Photography", "Construction", "Electronics", "Events", "Agriculture", "Vehicles & Transportation"] as const;
export type Category = typeof categories[number];
export type Equipment = {
  id: string;
  name: string;
  category: Category;
  location: string;
  price: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  available: boolean;
  image: string;
  imageAlt: string;
  description: string;
};
export const demoEquipment: Equipment[] = [
  { id: "sony-a7-iv", name: "Mirrorless Camera Kit", category: "Photography", location: "Dhanmondi, Dhaka", price: 2500, rentalType: "Daily", available: true, image: "/images/camera.png", imageAlt: "Black mirrorless camera with a zoom lens", description: "A full-frame mirrorless camera kit for portraits, events and creative projects." },
  { id: "cordless-drill", name: "Cordless Drill Kit", category: "Construction", location: "Mirpur, Dhaka", price: 450, rentalType: "Daily", available: true, image: "/images/drill.png", imageAlt: "Yellow and black cordless drill with battery and drill bits", description: "A portable cordless drill for furniture assembly and practical projects." },
  { id: "portable-projector", name: "Portable HD Projector", category: "Electronics", location: "Zindabazar, Sylhet", price: 1200, rentalType: "Daily", available: true, image: "/images/projector.png", imageAlt: "White portable projector with a glass lens", description: "Bring presentations, workshops and movie nights to a bigger screen." },
  { id: "pa-speaker", name: "Portable PA Speaker", category: "Events", location: "Agrabad, Chattogram", price: 3500, rentalType: "Weekly", available: false, image: "/images/speaker.png", imageAlt: "Black portable professional PA speaker", description: "Portable sound equipment for workshops and small gatherings." },
  { id: "irrigation-pump", name: "Irrigation Water Pump", category: "Agriculture", location: "Shibganj, Bogura", price: 1800, rentalType: "Weekly", available: true, image: "/images/pump.png", imageAlt: "Red and white irrigation water pump in a protective metal frame", description: "A compact water pump for seasonal work and irrigation projects." },
  { id: "cargo-van", name: "Compact Cargo Van", category: "Vehicles & Transportation", location: "Uttara, Dhaka", price: 45000, rentalType: "Monthly", available: true, image: "/images/van.png", imageAlt: "Compact white cargo delivery van", description: "A practical cargo vehicle for equipment and supply transport." },
];
export function formatPrice(price: number) { return `BDT ${new Intl.NumberFormat("en-BD").format(price)}`; }
export function rentalUnit(type: Equipment["rentalType"]) { return type === "Daily" ? "day" : type === "Weekly" ? "week" : "month"; }
