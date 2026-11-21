"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient, safeReturnPath } from "@/lib/auth-client";
import { useAccount } from "./account-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Icon } from "./icons";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const router = useRouter();
  const search = useSearchParams();
  const next = safeReturnPath(search.get("next"));
  const { notify, refresh, user, pending } = useAccount();
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [google, setGoogle] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({ name: "", email: "", image: "" });

  useEffect(() => {
    let active = true;
    fetch("/api/auth-config", { cache: "no-store" }).then(response => response.ok ? response.json() : null).then(data => { if (active) setGoogle(Boolean(data?.google)); }).catch(() => { if (active) setGoogle(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => { if (!pending && user) router.replace(next); }, [next, pending, router, user]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (registering && (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || password.length < 6)) {
      setError("Use at least 6 characters, including an uppercase and a lowercase letter.");
      return;
    }
    if (registering && !form.image.startsWith("https://")) { setError("Use an HTTPS link for your profile photo."); return; }
    setBusy(true);
    try {
      const result = registering
        ? await authClient.signUp.email({ name: form.name.trim(), email: form.email.trim(), password, image: form.image.trim() })
        : await authClient.signIn.email({ email: form.email.trim(), password });
      if (result.error) throw new Error(result.error.message || "Check your details and try again.");
      const access = await authClient.token();
      if (access.error || !access.data?.token) throw new Error("We could not finish signing you in. Please try again.");
      await refresh();
      notify(registering ? "Your account is ready. Welcome to RentDock." : "Welcome back. You are signed in.");
      router.replace(next);
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "We could not sign you in. Please try again.";
      setError(message);
      notify(message, "error");
    } finally { setBusy(false); }
  }

  async function googleSignIn() {
    setError("");
    if (!google) { setError("Google sign-in is currently unavailable. You can continue with email."); return; }
    setBusy(true);
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/auth/complete?next=${encodeURIComponent(next)}`, errorCallbackURL: `${window.location.origin}/login?error=google` });
      if (result.error) throw new Error("Google sign-in could not start. Please try again.");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Google sign-in could not start.");
      setBusy(false);
    }
  }

  return <main id="main" className="auth-main container">
    <div className="auth-layout">
      <aside className="auth-story">
        <p className="eyebrow">MORE POSSIBILITIES. LESS TO OWN.</p>
        <h1>{registering ? <>Your next project<br />starts here.</> : <>Good to have<br />you back.</>}</h1>
        <p>Find the equipment you need, for the time you need it. Keep your account and rental journey in one place.</p>
        <div className="auth-photo"><Image src="/images/camera.png" alt="Mirrorless camera kit available on RentDock" fill sizes="(max-width: 760px) 80vw, 38vw" priority /></div>
        <div className="auth-story-footer"><Icon name="shield" size={20} /><span>One account. A world of possibilities.</span></div>
      </aside>
      <section className="auth-panel" aria-labelledby="auth-title">
        <Link href="/" className="auth-back">← Back to RentDock</Link>
        <p className="eyebrow">{registering ? "LET’S GET STARTED" : "YOUR RENTDOCK ACCOUNT"}</p>
        <h2 id="auth-title">{registering ? "Create your account" : "Sign in to RentDock"}</h2>
        <p className="auth-intro">{registering ? "A few details, then you’re ready to explore." : "Pick up where your next project left off."}</p>
        <Button variant="outline" className="google-button" onClick={googleSignIn} disabled={busy || google === null} aria-describedby={google === false ? "google-help" : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2.1H12v4.1h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.7Z" /><path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.3-2.6c-.9.6-2.1 1-3.6 1-2.7 0-5-1.8-5.8-4.2H2.8v2.7A10.4 10.4 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.2 13.7a6.1 6.1 0 0 1 0-3.4V7.6H2.8a10 10 0 0 0 0 8.8l3.4-2.7Z" /><path fill="#EA4335" d="M12 6.1c1.5 0 2.9.5 3.9 1.5l2.9-2.8A9.9 9.9 0 0 0 12 2a10.4 10.4 0 0 0-9.2 5.6l3.4 2.7A6.2 6.2 0 0 1 12 6.1Z" /></svg>
          Continue with Google
        </Button>
        {google === false && <p id="google-help" className="field-help">Google sign-in is currently unavailable. Please use email.</p>}
        <div className="auth-divider"><span>or continue with email</span></div>
        <form className="account-form" onSubmit={submit}>
          {registering && <label htmlFor="account-name">Full name<Input id="account-name" name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Your full name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} disabled={busy} /></label>}
          <label htmlFor="account-email">Email address<Input id="account-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} disabled={busy} /></label>
          {registering && <label htmlFor="account-photo">Profile photo URL<Input id="account-photo" name="image" type="url" autoComplete="url" required maxLength={2048} placeholder="https://example.com/your-photo.jpg" value={form.image} onChange={event => setForm({ ...form, image: event.target.value })} disabled={busy} /><span className="field-help">Use a direct HTTPS link to your photo.</span></label>}
          <label htmlFor="account-password">Password<span className="password-input"><Input id="account-password" name="password" type={visible ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} required minLength={registering ? 6 : undefined} maxLength={128} placeholder={registering ? "Create a password" : "Enter your password"} value={password} onChange={event => setPassword(event.target.value)} disabled={busy} aria-describedby={registering ? "password-help" : undefined} /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? "Hide" : "Show"}</button></span></label>
          {registering && <div id="password-help" className="password-rules"><span className={password.length >= 6 ? "met" : ""}>6+ characters</span><span className={/[A-Z]/.test(password) ? "met" : ""}>Uppercase</span><span className={/[a-z]/.test(password) ? "met" : ""}>Lowercase</span></div>}
          {(error || search.get("error")) && <p className="form-error" role="alert">{error || "Google sign-in was not completed. Try again or use email."}</p>}
          <Button type="submit" disabled={busy} className="account-submit">{busy ? "Please wait…" : registering ? "Create account" : "Sign in"}<span aria-hidden="true">→</span></Button>
        </form>
        <p className="auth-switch">{registering ? "Already have an account?" : "New to RentDock?"} <Link href={`${registering ? "/login" : "/register"}?next=${encodeURIComponent(next)}`}>{registering ? "Sign in" : "Create an account"}</Link></p>
      </section>
    </div>
  </main>;
}
