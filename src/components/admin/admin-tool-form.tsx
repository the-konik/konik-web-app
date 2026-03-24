"use client";

import type { ToolAccessType } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ToolBrief = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  accessType: ToolAccessType;
  icon: string | null;
  published: boolean;
  featured: boolean;
  appPath: string | null;
};

type Mode = "create" | "edit";

export function AdminToolForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: ToolBrief;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [accessType, setAccessType] = useState<ToolAccessType>(
    initial?.accessType ?? "ONE_TIME"
  );
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [appPath, setAppPath] = useState(initial?.appPath ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      accessType,
      published,
      featured,
      icon: icon.trim() || null,
      appPath: appPath.trim() || null,
    };
    if (slug.trim()) body.slug = slug.trim();

    try {
      const url =
        mode === "create"
          ? "/api/admin/tools"
          : `/api/admin/tools/${initial!.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");
      router.push("/admin/tools");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (mode !== "edit" || !initial) return;
    if (!window.confirm("Delete this tool? This cannot be undone.")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/tools/${initial.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.push("/admin/tools");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold text-primary">
        {mode === "create" ? "New tool" : "Edit tool"}
      </h1>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-muted-foreground">
            Name
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Slug (optional)
          </span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from name"
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Price (USD)
          </span>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-muted-foreground">
            Description
          </span>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Access type
          </span>
          <select
            value={accessType}
            onChange={(e) =>
              setAccessType(e.target.value as ToolAccessType)
            }
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          >
            <option value="ONE_TIME">One-time purchase</option>
            <option value="SUBSCRIPTION">Subscription</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Icon (URL or key)
          </span>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-muted-foreground">
            App path / URL
          </span>
          <input
            value={appPath}
            onChange={(e) => setAppPath(e.target.value)}
            placeholder="/tools/my-app or https://…"
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Saving…" : mode === "create" ? "Create" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-border px-4 py-2 text-sm"
        >
          Cancel
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={() => void onDelete()}
            disabled={loading}
            className="ml-auto rounded border border-destructive px-4 py-2 text-sm text-destructive"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
