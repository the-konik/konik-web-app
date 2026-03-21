"use client";

import type { SubscriptionPlan, SubscriptionStatus, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserBrief = { id: string; email: string | null; name: string | null; role: UserRole };

type SubRow = {
  id: string;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | string | null;
  user: UserBrief;
  plan: Pick<SubscriptionPlan, "id" | "name" | "tier">;
};

type Props = {
  subscriptions: SubRow[];
  plans: Pick<SubscriptionPlan, "id" | "name" | "tier">[];
  users: { id: string; email: string | null; name: string | null }[];
  canWrite?: boolean;
};

export function AdminSubscriptionManager({
  subscriptions,
  plans,
  users,
  canWrite = true,
}: Props) {
  const router = useRouter();
  const [assignUserId, setAssignUserId] = useState("");
  const [assignPlanId, setAssignPlanId] = useState(plans[0]?.id ?? "");
  const [assignMonths, setAssignMonths] = useState(12);
  const [assignMsg, setAssignMsg] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  async function assign() {
    setAssignMsg(null);
    if (!assignUserId || !assignPlanId) {
      setAssignMsg("Select user and plan.");
      return;
    }
    setAssigning(true);
    try {
      const res = await fetch("/api/admin/subscriptions/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: assignUserId,
          planId: assignPlanId,
          periodMonths: assignMonths,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Assign failed");
      setAssignMsg("Assigned.");
      router.refresh();
    } catch (e) {
      setAssignMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="space-y-10">
      {canWrite && (
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-primary">
          Assign subscription (comp / manual)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Creates an app subscription without Stripe. Sets billing period end
          from “months” and reconciles the user&apos;s role from all paying
          subscriptions.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="flex flex-col text-sm">
            <span className="text-muted-foreground">User</span>
            <select
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              className="mt-1 min-w-[220px] rounded-lg border border-border px-3 py-2"
            >
              <option value="">Select…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {(u.email || u.name || u.id).slice(0, 48)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-muted-foreground">Plan</span>
            <select
              value={assignPlanId}
              onChange={(e) => setAssignPlanId(e.target.value)}
              className="mt-1 min-w-[180px] rounded-lg border border-border px-3 py-2"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.tier})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-muted-foreground">Months</span>
            <input
              type="number"
              min={1}
              max={120}
              value={assignMonths}
              onChange={(e) => setAssignMonths(Number(e.target.value) || 12)}
              className="mt-1 w-24 rounded-lg border border-border px-3 py-2"
            />
          </label>
          <button
            type="button"
            disabled={assigning}
            onClick={() => void assign()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {assigning ? "…" : "Assign"}
          </button>
        </div>
        {assignMsg && (
          <p className="mt-3 text-sm text-muted-foreground">{assignMsg}</p>
        )}
      </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-primary">
          All subscriptions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upgrade changes the Stripe price when a Stripe subscription id exists
          (prorations). Cancel ends billing in Stripe or marks manual rows
          cancelled.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Plan
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Period end
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Stripe
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.map((s) => (
                <AdminSubscriptionRow
                  key={s.id}
                  row={s}
                  plans={plans}
                  canWrite={canWrite}
                  onDone={() => router.refresh()}
                />
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No subscriptions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AdminSubscriptionRow({
  row,
  plans,
  canWrite,
  onDone,
}: {
  row: SubRow;
  plans: Pick<SubscriptionPlan, "id" | "name" | "tier">[];
  canWrite: boolean;
  onDone: () => void;
}) {
  const [planId, setPlanId] = useState(row.plan.id);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const end =
    row.currentPeriodEnd == null
      ? "—"
      : new Date(row.currentPeriodEnd).toLocaleDateString();

  async function changePlan() {
    setMsg(null);
    if (planId === row.plan.id) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/subscriptions/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      onDone();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!window.confirm("Cancel this subscription for this user?")) return;
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/subscriptions/${row.id}/cancel`,
        { method: "POST" }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      onDone();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="font-medium text-primary">
          {row.user.email || row.user.name || row.user.id}
        </div>
        <div className="text-xs text-muted-foreground">
          Role: {row.user.role}
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{row.plan.name}</td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
          {row.status}
        </span>
        {row.cancelAtPeriodEnd && (
          <span className="ml-1 text-xs text-amber-700">(cancel pending)</span>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{end}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {row.stripeSubscriptionId ? "Yes" : "Manual"}
      </td>
      <td className="px-4 py-3 align-top">
        {canWrite ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="rounded border border-border px-2 py-1 text-xs"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy || planId === row.plan.id}
                onClick={() => void changePlan()}
                className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
              >
                Upgrade / change
              </button>
            </div>
            <button
              type="button"
              disabled={busy || row.status === "CANCELLED"}
              onClick={() => void cancel()}
              className="w-fit rounded border border-destructive px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              Cancel
            </button>
            {msg && <p className="text-xs text-destructive">{msg}</p>}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">View only</span>
        )}
      </td>
    </tr>
  );
}
