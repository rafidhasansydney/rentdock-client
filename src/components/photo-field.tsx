"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { imageTypes, uploadImage } from "@/lib/image-upload";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function PhotoField({ id, value, onChange, onBusyChange, onValidityChange, authenticated = true, allowUrl = true, disabled = false, label = "Profile photo" }: {
  id: string; value: string; onChange: (value: string) => void; onBusyChange: (value: boolean) => void; onValidityChange?: (value: boolean) => void; authenticated?: boolean; allowUrl?: boolean; disabled?: boolean; label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/uploads/config", { cache: "no-store" }).then(response => response.json()).then(result => { if (active) setEnabled(Boolean(result.enabled)); }).catch(() => {});
    return () => { active = false; };
  }, []);
  async function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true); onBusyChange(true); setError("");
    try {
      const result = await uploadImage(file, authenticated);
      setBroken(false); onChange(result.url); onValidityChange?.(false);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "The image could not be uploaded."); }
    finally { setBusy(false); onBusyChange(false); }
  }
  return <fieldset className="photo-field" disabled={disabled || busy}>
    <legend>{label}</legend>
    <div className="photo-picker"><div className="photo-preview">{value.startsWith("https://") && !broken ? <Image key={value} src={value} alt={`${label} preview`} width={88} height={88} unoptimized onLoad={() => onValidityChange?.(true)} onError={() => { setBroken(true); onValidityChange?.(false); }} /> : <span>No photo</span>}</div><div><Button variant="outline" disabled={!enabled || disabled || busy} onClick={() => input.current?.click()}>{busy ? "Uploading…" : "Choose from device"}</Button><p className="field-help">JPG, PNG or WebP. Maximum 3 MB.</p></div></div>
    <input ref={input} id={`${id}-file`} type="file" accept={imageTypes.join(",")} aria-label={`Choose ${label.toLowerCase()} from device`} hidden disabled={!enabled || disabled || busy} onChange={event => { void choose(event); }} />
    {!enabled && <p className="field-help">Image upload is currently unavailable.{allowUrl ? " You can use a direct image link below." : " Please try again later."}</p>}
    {allowUrl && <label htmlFor={id}>Or use a direct image URL<Input id={id} type="url" value={value} maxLength={2048} placeholder="https://example.com/your-photo.jpg" required onChange={event => { setBroken(false); setError(""); onValidityChange?.(false); onChange(event.target.value); }} /><span className="field-help">Use the image address, rather than a Google share link or a webpage link.</span></label>}
    {broken && <p className="form-error" role="alert">This link could not load an image. Choose a photo from your device or use a working direct image address.</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <span className="sr-only" role="status">{busy ? "Uploading image" : ""}</span>
  </fieldset>;
}
