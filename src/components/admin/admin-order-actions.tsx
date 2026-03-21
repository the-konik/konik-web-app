"use client";

import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { useState } from "react";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

type Props = {
  orderId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  canWrite?: boolean;
};

export function AdminOrderActions({
  orderId,
  orderStatus: initialO,
  paymentStatus: initialP,
  canWrite = true,
}: Props) {
  const [orderStatus, setOrderStatus] = useState(initialO);
  const [paymentStatus, setPaymentStatus] = useState(initialP);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const dirty =
    orderStatus !== initialO || paymentStatus !== initialP;

  async function save() {
    setMessage(null);
    const body: {
      orderStatus?: OrderStatus;
      paymentStatus?: PaymentStatus;
    } = {};
    if (orderStatus !== initialO) body.orderStatus = orderStatus;
    if (paymentStatus !== initialP) body.paymentStatus = paymentStatus;
    if (Object.keys(body).length === 0) {
      setMessage("No changes.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMessage("Saved.");
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  if (!canWrite) {
    return (
      <div className="text-xs text-muted-foreground">
        {initialO} / {initialP}
        <span className="mt-1 block text-[10px]">View only</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
          className="rounded border border-border bg-white px-2 py-1 text-xs"
          aria-label="Fulfillment status"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
          className="rounded border border-border bg-white px-2 py-1 text-xs"
          aria-label="Payment status"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        disabled={!dirty || saving}
        onClick={() => void save()}
        className="rounded bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
      >
        {saving ? "…" : "Apply"}
      </button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
