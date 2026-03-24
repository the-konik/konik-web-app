"use client";

import type { UserRole, StaffRole } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";

const USER_ROLES: UserRole[] = [
  "GUEST",
  "USER",
  "SUBSCRIBER",
  "PREMIUM",
  "VIP",
  "ADMIN",
];

const STAFF_ROLES: (StaffRole | "")[] = [
  "",
  "SUPER_ADMIN",
  "ADMIN",
  "SALES",
  "SHIPPING",
  "MARKETING",
];

type Props = {
  userId: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  staffRole: StaffRole | null;
  canEditUser: boolean;
  canAssignStaff: boolean;
  tools: { id: string; name: string }[];
};

export function AdminUserRow({
  userId,
  name,
  email,
  role: initialRole,
  staffRole: initialStaff,
  canEditUser,
  canAssignStaff,
  tools,
}: Props) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [staffRole, setStaffRole] = useState<StaffRole | "">(
    initialStaff ?? ""
  );
  const [toolId, setToolId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveRole() {
    setMsg(null);
    setBusy(true);
    try {
      const body: { role?: UserRole; staffRole?: StaffRole | null } = {};
      if (role !== initialRole) body.role = role;
      if (canAssignStaff) {
        const nextStaff = staffRole === "" ? null : staffRole;
        if (nextStaff !== (initialStaff ?? null)) {
          body.staffRole = nextStaff;
        }
      }
      if (Object.keys(body).length === 0) {
        setMsg("No changes.");
        return;
      }
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function grantTool() {
    if (!toolId) return;
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/tool-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, source: "MANUAL_GRANT" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg("Tool access granted.");
      setToolId("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  if (!canEditUser) {
    return (
      <tr>
        <td className="px-6 py-4 font-medium text-primary">{name || "—"}</td>
        <td className="px-6 py-4 text-muted-foreground">{email}</td>
        <td className="px-6 py-4 text-xs">{initialRole}</td>
        <td className="px-6 py-4 text-xs text-muted-foreground">
          {initialStaff ?? "—"}
        </td>
        <td className="px-6 py-4 text-xs text-muted-foreground">View only</td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-6 py-4 font-medium text-primary">{name || "—"}</td>
      <td className="px-6 py-4 text-muted-foreground">{email}</td>
      <td className="px-6 py-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="rounded border border-border px-2 py-1 text-xs"
        >
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4">
        {canAssignStaff ? (
          <select
            value={staffRole}
            onChange={(e) =>
              setStaffRole((e.target.value || "") as StaffRole | "")
            }
            className="rounded border border-border px-2 py-1 text-xs"
          >
            {STAFF_ROLES.map((r) => (
              <option key={r || "none"} value={r}>
                {r || "— none —"}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-muted-foreground">
            {initialStaff ?? "—"}
          </span>
        )}
      </td>
      <td className="px-6 py-4 align-top">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void saveRole()}
            className="w-fit rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
          >
            Save role
          </button>
          <div className="flex flex-wrap items-center gap-1">
            <select
              value={toolId}
              onChange={(e) => setToolId(e.target.value)}
              className="max-w-[140px] rounded border border-border px-1 py-1 text-xs"
            >
              <option value="">Grant tool…</option>
              {tools.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={busy || !toolId}
              onClick={() => void grantTool()}
              className="rounded border border-border px-2 py-1 text-xs"
            >
              Grant
            </button>
          </div>
          {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
        </div>
      </td>
    </tr>
  );
}
