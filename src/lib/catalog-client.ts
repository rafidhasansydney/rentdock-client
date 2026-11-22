"use client";

import { useEffect, useState } from "react";
import { accountRequest } from "./auth-client";
import type { Equipment } from "./demo-equipment";

export type EquipmentResults = { items: Equipment[]; total: number; page: number; pages: number; limit: number };
export type EquipmentDetails = Equipment & { quantity: number; condition: string; included: string[]; terms: string[]; owner: { name: string }; isSample?: boolean; bookable?: boolean };
export type Highlights = { featured: Equipment[]; recent: Equipment[] };

export function useCatalogData<T>(path: string, authenticated = false) {
  const [attempt, setAttempt] = useState(0);
  const key = `${path}:${attempt}`;
  const [result, setResult] = useState<{ key: string; data?: T; error?: string; status?: number }>({ key: "" });
  useEffect(() => {
    const controller = new AbortController();
    const request = authenticated ? accountRequest<T>(path, { signal: controller.signal }) : fetch(`/api${path}`, { signal: controller.signal, cache: "no-store", credentials: "include" }).then(async response => {
      const body = await response.json();
      if (!response.ok) throw Object.assign(new Error(body.error?.message || "Equipment could not be loaded."), { status: response.status });
      return body as T;
    });
    request.then(data => { if (!controller.signal.aborted) setResult({ key, data }); }).catch(failure => {
      if (!controller.signal.aborted) setResult({ key, error: failure instanceof Error ? failure.message : "Equipment could not be loaded. Please retry.", status: failure.status });
    });
    return () => controller.abort();
  }, [authenticated, key, path]);
  return { data: result.key === key ? result.data : undefined, error: result.key === key ? result.error : undefined, status: result.key === key ? result.status : undefined, loading: result.key !== key, retry: () => setAttempt(value => value + 1) };
}
