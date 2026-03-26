import { Suspense } from "react";
import { StaffLoginForm } from "@/components/auth/staff-login-form";

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted text-primary font-bold tracking-widest uppercase">
          Loading...
        </div>
      }
    >
      <StaffLoginForm />
    </Suspense>
  );
}
