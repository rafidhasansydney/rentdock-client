"use client";
import { useEffect, useId, useRef } from "react";
import { Button } from "./ui/button";
export function ConfirmDialog({ title, children, busy, confirmLabel, onConfirm, onClose }: { title: string; children: React.ReactNode; busy: boolean; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => { const dialog = ref.current; if (dialog && !dialog.open) dialog.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="confirmation-dialog" aria-labelledby={id} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}><h2 id={id}>{title}</h2>{children}<div className="owner-actions"><Button variant="outline" disabled={busy} onClick={onClose}>Cancel</Button><Button className="button-danger" disabled={busy} onClick={onConfirm}>{busy ? "Please wait…" : confirmLabel}</Button></div></dialog>;
}
