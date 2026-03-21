"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TABS = [
  { key: "general" as const, label: "General" },
  { key: "payments" as const, label: "Payments" },
  { key: "tool_rules" as const, label: "Tool rules" },
];

type Props = {
  initialJson: Record<string, string>;
  canWrite: boolean;
};

export function AdminSettingsForm({ initialJson, canWrite }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("general");
  const [text, setText] = useState(initialJson);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!canWrite) return;
    setBusy(true);
    setMsg(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text[tab] || "{}");
    } catch {
      setMsg("Invalid JSON for this tab.");
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: tab, value: parsed }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg("Saved.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Store structured config as JSON (site copy, Stripe hints, gating rules).
        Invalid JSON will be rejected.
      </p>
      <textarea
        readOnly={!canWrite}
        rows={16}
        value={text[tab] ?? "{}"}
        onChange={(e) =>
          setText((prev) => ({ ...prev, [tab]: e.target.value }))
        }
        className="w-full rounded border border-border bg-muted/30 p-3 font-mono text-xs"
        spellCheck={false}
      />
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      {canWrite && (
        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          {busy ? "Saving…" : "Save tab"}
        </button>
      )}
    </div>
  );
}
