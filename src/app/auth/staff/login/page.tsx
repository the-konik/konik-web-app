import { Suspense } from "react";
import { LoginForm } from "../../login/login-form";

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-primary text-primary-foreground">
          Loading…
        </div>
      }
    >
      <LoginForm variant="staff" />
    </Suspense>
  );
}
