import type { CSSProperties } from "react";
export type IconName = "search" | "pin" | "calendar" | "camera" | "drill" | "screen" | "speaker" | "truck" | "menu" | "close" | "check" | "clock" | "shield" | "chevron" | "sliders" | "box";
const paths: Record<IconName, React.ReactNode> = {
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2" /></>,
  camera: <><path d="m7 6 1.5-3h7L17 6h3a2 2 0 0 1 2 2v11H2V8a2 2 0 0 1 2-2Z" /><circle cx="12" cy="12.5" r="4" /></>,
  drill: <><path d="M3 6h13v7H3zm13 2h5m-5 3h5M8 13l-1 8h6l-2-8M3 9H1" /></>,
  screen: <><rect x="2" y="4" width="20" height="14" rx="2" /><path d="M8 22h8m-4-4v4" /></>,
  speaker: <><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="15" r="4" /><circle cx="12" cy="6.5" r="1.5" /></>,
  truck: <><path d="M2 5h12v12H2zm12 5h4l4 5v2h-8" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="18" r="3" /></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>,
  shield: <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z" /><path d="m8 11 3 3 5-5" /></>,
  chevron: <path d="m8 4 8 8-8 8" />,
  sliders: <><path d="M3 6h18M3 12h18M3 18h18" /><circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="9" cy="18" r="2" /></>,
  box: <><path d="m12 2 9 5v10l-9 5-9-5V7Z" /><path d="m3 7 9 5 9-5m-9 5v10M7 4l10 6" /></>,
};
export function Icon({ name, size = 22, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>;
}
