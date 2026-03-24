"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductRowActions({
  productId,
  canWrite = true,
}: {
  productId: string;
  canWrite?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this product permanently?")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Delete failed");
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (!canWrite) {
    return <span className="text-xs text-muted-foreground">View only</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="text-sm font-medium text-accent hover:underline"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={onDelete}
        className="text-sm text-destructive hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
