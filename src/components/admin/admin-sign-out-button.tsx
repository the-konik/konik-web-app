"use client";

import { signOut } from "next-auth/react";

export function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/" })}
      className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
    >
      Sign out
    </button>
  );
}
