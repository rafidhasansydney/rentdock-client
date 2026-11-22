"use client";
import { useState } from "react";
import { accountRequest } from "@/lib/auth-client";
import { useCatalogData } from "@/lib/catalog-client";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export function AdminPasswordSetup() {
  const { notify } = useAccount();
  const { data, error, retry } = useCatalogData<{ hasPassword: boolean }>("/profile/password", true);
  const [password, setPassword] = useState(""), [confirmation, setConfirmation] = useState(""), [busy, setBusy] = useState(false), [failure, setFailure] = useState("");
  async function save(event: React.FormEvent) {
    event.preventDefault(); setFailure("");
    if (password !== confirmation) { setFailure("The passwords do not match."); return; }
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) { setFailure("Use at least 6 characters, including an uppercase and a lowercase letter."); return; }
    setBusy(true);
    try { await accountRequest("/profile/password", { method: "POST", body: JSON.stringify({ newPassword: password }) }); setPassword(""); setConfirmation(""); retry(); notify("Email/password sign-in is now available. Google sign-in is still connected."); }
    catch (error) { setFailure(error instanceof Error ? error.message : "Your password could not be added."); }
    finally { setBusy(false); }
  }
  return <section className="account-access-panel"><h2>Email sign-in</h2>{!data ? <><p role={error ? "alert" : "status"}>{error || "Loading sign-in settings."}</p>{error && <Button variant="outline" onClick={retry}>Try again</Button>}</> : data.hasPassword ? <p>Email/password sign-in is already available for this account. Your existing password is kept.</p> : <><p>Add a password to sign in with your email as well as Google. This adds an option to your RentDock account; your Google password stays the same.</p><form className="account-form" onSubmit={save}><label htmlFor="admin-new-password">New RentDock password<Input id="admin-new-password" type="password" autoComplete="new-password" minLength={6} maxLength={128} required disabled={busy} value={password} onChange={event => setPassword(event.target.value)} /><span className="field-help">At least 6 characters with an uppercase and a lowercase letter.</span></label><label htmlFor="admin-confirm-password">Confirm password<Input id="admin-confirm-password" type="password" autoComplete="new-password" minLength={6} maxLength={128} required disabled={busy} value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>{failure && <p role="alert" className="form-error">{failure}</p>}<Button type="submit" disabled={busy}>{busy ? "Adding password." : "Add email sign-in"}</Button></form></>}</section>;
}
