"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AccountRequestError, accountRequest, type AccountUser } from "@/lib/auth-client";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PhotoField } from "./photo-field";

function ProfileForm({ initial }: { initial: AccountUser }) {
  const [form, setForm] = useState({ name: initial.name, image: initial.image || "", phone: initial.phone || "", address: initial.address || "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photoFailed, setPhotoFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoValid, setPhotoValid] = useState(true);
  const { notify, refresh } = useAccount();
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading || !photoValid) { setError("Choose a working profile photo before saving."); return; }
    setBusy(true);
    setError("");
    try {
      await accountRequest<{ user: AccountUser }>("/profile", { method: "PATCH", body: JSON.stringify(form) });
      await refresh();
      notify("Your profile has been updated.");
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "Your profile could not be saved.";
      setError(message);
      notify(message, "error");
    } finally { setBusy(false); }
  }
  return <div className="profile-layout">
    <aside className="profile-summary"><div className="profile-avatar">{form.image.startsWith("https://") && !photoFailed ? <Image src={form.image} alt="Your profile photo" width={104} height={104} unoptimized onError={() => setPhotoFailed(true)} /> : <span>{form.name.slice(0, 1).toUpperCase()}</span>}</div><h2>{form.name}</h2><p>{initial.email}</p><span className="profile-role">{initial.role}</span></aside>
    <form className="account-form profile-form" onSubmit={save}>
      <div><h2>Personal details</h2><p className="field-help">Keep your contact details ready for your next rental.</p></div>
      <label htmlFor="profile-name">Full name<Input id="profile-name" autoComplete="name" value={form.name} minLength={2} maxLength={80} required disabled={busy} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
      <label htmlFor="profile-email">Email address<Input id="profile-email" type="email" value={initial.email} readOnly aria-describedby="profile-email-help" /><span id="profile-email-help" className="field-help">Your sign-in email is linked to your account.</span></label>
      <PhotoField id="profile-photo" value={form.image} disabled={busy} onBusyChange={setUploading} onValidityChange={setPhotoValid} onChange={image => { setForm(current => ({ ...current, image })); setPhotoFailed(false); }} />
      <label htmlFor="profile-phone">Phone number<Input id="profile-phone" type="tel" autoComplete="tel" value={form.phone} placeholder="01712 345678" maxLength={20} disabled={busy} onChange={event => setForm({ ...form, phone: event.target.value })} /></label>
      <label htmlFor="profile-address">Address<textarea id="profile-address" className="rd-input" autoComplete="street-address" value={form.address} maxLength={500} rows={3} placeholder="Your address in Bangladesh" disabled={busy} onChange={event => setForm({ ...form, address: event.target.value })} /></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <Button type="submit" disabled={busy || uploading || !photoValid} className="profile-save">{busy ? "Saving…" : "Save changes"}</Button>
    </form>
  </div>;
}

export function ProfileEditor() {
  const { user } = useAccount();
  const [state, setState] = useState<{ profile?: AccountUser; error?: string }>({});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    accountRequest<{ user: AccountUser }>("/profile").then(data => { if (active) setState({ profile: data.user }); }).catch(failure => {
      if (active) setState({ error: failure instanceof AccountRequestError ? failure.message : "We could not load your profile." });
    });
    return () => { active = false; };
  }, [user?.id, attempt]);
  return <><p className="eyebrow">YOUR ACCOUNT DETAILS</p><h1 className="dashboard-title">My profile</h1><p className="dashboard-lead">A little about you. Always in your control.</p>
    {state.profile ? <ProfileForm key={state.profile.id} initial={state.profile} /> : state.error ? <div className="account-error-panel"><p role="alert">{state.error}</p><Button onClick={() => { setState({}); setAttempt(attempt + 1); }}>Try again</Button></div> : <p role="status" className="account-loading">Loading your profile…</p>}
  </>;
}
