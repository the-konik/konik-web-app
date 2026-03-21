"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  COMMON_SIZES,
} from "@/lib/products/constants";
import type { ProductDTO } from "@/services/product.service";
import type { ProductCategory } from "@prisma/client";

type Mode = "create" | "edit";

export function ProductForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: ProductDTO;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial != null ? String(initial.price) : ""
  );
  const [category, setCategory] = useState<ProductCategory>(
    initial?.category ?? "T_SHIRT"
  );
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? ["S", "M", "L"]);
  const [colorsInput, setColorsInput] = useState(
    (initial?.colors ?? []).join(", ")
  );
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  function toggleSize(s: string) {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImages((prev) => [...prev, data.url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const colors = colorsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const body: Record<string, unknown> = {
      name,
      description,
      price: parseFloat(price),
      category,
      images,
      sizes,
      colors,
      stock: parseInt(stock, 10) || 0,
      featured,
      status,
      sku: sku.trim() || null,
    };
    if (slug.trim()) body.slug = slug.trim();

    try {
      const url =
        mode === "create"
          ? "/api/products"
          : `/api/products/${initial!.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      router.push("/admin/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-primary">
        {mode === "create" ? "New product" : "Edit product"}
      </h1>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-border bg-white p-6">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Slug (optional)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from name if empty"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description *</label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Price (USD) *</label>
            <input
              required
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Stock *</label>
            <input
              required
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {PRODUCT_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="active">Active (visible in shop)</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Featured
          </label>
        </div>
        <div>
          <label className="text-sm font-medium">SKU</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          />
        </div>
        <div>
          <span className="text-sm font-medium">Sizes</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {COMMON_SIZES.map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-1 rounded border border-border px-2 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  checked={sizes.includes(s)}
                  onChange={() => toggleSize(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Colors (comma-separated)</label>
          <input
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            placeholder="Black, Navy, White"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          />
        </div>

        <div>
          <span className="text-sm font-medium">Images (Cloudinary URLs)</span>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload files below — URLs are appended. Stored in `Product.images`.
          </p>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={onUploadFile}
            className="mt-2 block w-full text-sm"
          />
          {uploading && (
            <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>
          )}
          <ul className="mt-4 space-y-2">
            {images.map((url) => (
              <li
                key={url}
                className="flex items-center gap-3 rounded border border-border p-2"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-muted">
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <span className="flex-1 truncate text-xs text-muted-foreground">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="text-sm text-destructive"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-6 py-2.5 font-medium text-accent-foreground disabled:opacity-50"
        >
          {loading ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border px-6 py-2.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
