"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type DiscountRow = {
  id: string;
  code: string;
  description: string | null;
  percentOff: number | null;
  amountOff: string | null;
  currency: string;
  active: boolean;
  maxRedemptions: number | null;
  redeemCount: number;
  startsAt: string | null;
  endsAt: string | null;
};

export type CampaignRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

function toIsoFromLocal(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

type Props = {
  discountCodes: DiscountRow[];
  campaigns: CampaignRow[];
  canWrite: boolean;
};

export function AdminMarketingPanel({
  discountCodes,
  campaigns,
  canWrite,
}: Props) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Create discount
  const [dcCode, setDcCode] = useState("");
  const [dcDesc, setDcDesc] = useState("");
  const [dcKind, setDcKind] = useState<"percent" | "amount">("percent");
  const [dcPercent, setDcPercent] = useState("10");
  const [dcAmount, setDcAmount] = useState("5");
  const [dcCurrency, setDcCurrency] = useState("usd");
  const [dcMax, setDcMax] = useState("");
  const [dcStarts, setDcStarts] = useState("");
  const [dcEnds, setDcEnds] = useState("");

  // Create campaign
  const [cpName, setCpName] = useState("");
  const [cpSlug, setCpSlug] = useState("");
  const [cpDesc, setCpDesc] = useState("");
  const [cpStarts, setCpStarts] = useState("");
  const [cpEnds, setCpEnds] = useState("");

  async function createDiscount(e: React.FormEvent) {
    e.preventDefault();
    if (!canWrite) return;
    setBusy(true);
    setMsg(null);
    try {
      const body: Record<string, unknown> = {
        code: dcCode.trim(),
        description: dcDesc.trim() || null,
        currency: dcCurrency,
        active: true,
        maxRedemptions: dcMax ? parseInt(dcMax, 10) : null,
        startsAt: toIsoFromLocal(dcStarts),
        endsAt: toIsoFromLocal(dcEnds),
      };
      if (dcKind === "percent") {
        body.percentOff = parseInt(dcPercent, 10);
        body.amountOff = null;
      } else {
        body.amountOff = parseFloat(dcAmount);
        body.percentOff = null;
      }
      const res = await fetch("/api/admin/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      setDcCode("");
      setDcDesc("");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function patchDiscount(id: string, patch: Record<string, unknown>) {
    if (!canWrite) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!canWrite) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cpName.trim(),
          slug: cpSlug.trim(),
          description: cpDesc.trim() || null,
          active: true,
          startsAt: toIsoFromLocal(cpStarts),
          endsAt: toIsoFromLocal(cpEnds),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      setCpName("");
      setCpSlug("");
      setCpDesc("");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function patchCampaign(id: string, patch: Record<string, unknown>) {
    if (!canWrite) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      {msg && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {msg}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Discount codes</h2>
        {canWrite && (
          <form
            onSubmit={(e) => void createDiscount(e)}
            className="grid gap-3 rounded-xl border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <input
              required
              placeholder="CODE"
              value={dcCode}
              onChange={(e) => setDcCode(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm uppercase"
            />
            <input
              placeholder="Description"
              value={dcDesc}
              onChange={(e) => setDcDesc(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm sm:col-span-2"
            />
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={dcKind === "percent"}
                  onChange={() => setDcKind("percent")}
                />
                % off
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={dcKind === "amount"}
                  onChange={() => setDcKind("amount")}
                />
                Fixed amount
              </label>
            </div>
            {dcKind === "percent" ? (
              <input
                type="number"
                min={1}
                max={100}
                value={dcPercent}
                onChange={(e) => setDcPercent(e.target.value)}
                className="rounded border border-border px-3 py-2 text-sm"
              />
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={dcAmount}
                  onChange={(e) => setDcAmount(e.target.value)}
                  className="w-full rounded border border-border px-3 py-2 text-sm"
                />
                <input
                  value={dcCurrency}
                  onChange={(e) => setDcCurrency(e.target.value)}
                  className="w-20 rounded border border-border px-2 py-2 text-sm"
                />
              </div>
            )}
            <input
              type="number"
              min={1}
              placeholder="Max redemptions"
              value={dcMax}
              onChange={(e) => setDcMax(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              value={dcStarts}
              onChange={(e) => setDcStarts(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              value={dcEnds}
              onChange={(e) => setDcEnds(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground sm:col-span-2 lg:col-span-1"
            >
              Create code
            </button>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Off</th>
                <th className="px-4 py-2">Redeems</th>
                <th className="px-4 py-2">Active</th>
                {canWrite && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {discountCodes.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {c.percentOff != null
                      ? `${c.percentOff}%`
                      : c.amountOff != null
                        ? `${c.currency} ${c.amountOff}`
                        : "—"}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {c.redeemCount}
                    {c.maxRedemptions != null ? ` / ${c.maxRedemptions}` : ""}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        c.active
                          ? "text-green-700"
                          : "text-muted-foreground line-through"
                      }
                    >
                      {c.active ? "Yes" : "No"}
                    </span>
                  </td>
                  {canWrite && (
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void patchDiscount(c.id, { active: !c.active })
                        }
                        className="text-xs text-primary underline"
                      >
                        Toggle active
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Campaigns</h2>
        {canWrite && (
          <form
            onSubmit={(e) => void createCampaign(e)}
            className="grid gap-3 rounded-xl border border-border bg-white p-4 sm:grid-cols-2"
          >
            <input
              required
              placeholder="Campaign name"
              value={cpName}
              onChange={(e) => setCpName(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="slug-url"
              value={cpSlug}
              onChange={(e) => setCpSlug(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={cpDesc}
              onChange={(e) => setCpDesc(e.target.value)}
              rows={2}
              className="rounded border border-border px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              type="datetime-local"
              value={cpStarts}
              onChange={(e) => setCpStarts(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              value={cpEnds}
              onChange={(e) => setCpEnds(e.target.value)}
              className="rounded border border-border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Create campaign
            </button>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Active</th>
                {canWrite && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    {c.slug}
                  </td>
                  <td className="px-4 py-2">{c.active ? "Yes" : "No"}</td>
                  {canWrite && (
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void patchCampaign(c.id, { active: !c.active })
                        }
                        className="text-xs text-primary underline"
                      >
                        Toggle active
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
