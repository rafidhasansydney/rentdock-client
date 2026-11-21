"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { authClient, type AccountUser } from "@/lib/auth-client";

type AccountContextValue = {
  user: AccountUser | null;
  pending: boolean;
  error: boolean;
  refresh: () => Promise<void>;
  notify: (message: string, tone?: "success" | "error") => void;
};
const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const refetch = session.refetch;
  const [notice, setNotice] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setNotice({ message, tone });
    timer.current = setTimeout(() => setNotice(null), 5000);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const refresh = useCallback(async () => { await refetch({ query: { disableCookieCache: true } }); }, [refetch]);
  const user: AccountUser | null = session.data?.user ? { ...session.data.user, role: session.data.user.role ?? "customer", phone: session.data.user.phone ?? "", address: session.data.user.address ?? "" } : null;
  return <AccountContext.Provider value={{ user, pending: session.isPending, error: Boolean(session.error), refresh, notify }}>
    {children}
    <div className="account-toast-region" aria-live="polite" aria-atomic="true">
      {notice && <div className={`account-toast ${notice.tone}`} role={notice.tone === "error" ? "alert" : "status"}><span>{notice.message}</span><button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button></div>}
    </div>
  </AccountContext.Provider>;
}

export function useAccount() {
  const account = useContext(AccountContext);
  if (!account) throw new Error("AccountProvider is required.");
  return account;
}
