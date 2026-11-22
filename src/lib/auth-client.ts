import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({ basePath: "/api/auth", plugins: [jwtClient(), inferAdditionalFields({ user: {
  role: { type: ["customer", "owner", "admin"], required: false, defaultValue: "customer", input: false },
  phone: { type: "string", required: false },
  address: { type: "string", required: false },
} })] });

export type AccountRole = "customer" | "owner" | "admin";
export type AccountUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: AccountRole;
  phone?: string;
  address?: string;
  createdAt?: string | Date;
};

export function safeReturnPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/dashboard";
  try {
    const url = new URL(value, "https://rentdock.example");
    if (url.origin !== "https://rentdock.example" || /^\/(?:login|register|api)(?:\/|\?|$)/.test(url.pathname)) return "/dashboard";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/dashboard";
  }
}

export class AccountRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function accountRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let token: Awaited<ReturnType<typeof authClient.token>>;
  try { token = await authClient.token(); } catch {
    throw new AccountRequestError("We could not reach your account. Check your connection and try again.", 503);
  }
  if (token.error) {
    const status = token.error.status || 503;
    throw new AccountRequestError(status === 401 ? "Your session has ended. Sign in again." : "We could not reach your account. Try again shortly.", status);
  }
  if (!token.data?.token) throw new AccountRequestError("Your session has ended. Sign in again.", 401);
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token.data.token}`);
  if (typeof options.body === "string" && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      credentials: "include",
      cache: "no-store",
      headers,
    });
  } catch {
    throw new AccountRequestError("We could not reach your account. Check your connection and try again.", 503);
  }
  const payload = await response.json();
  if (!response.ok) throw new AccountRequestError(payload.error?.message ?? "The request could not be completed.", response.status);
  return payload as T;
}
