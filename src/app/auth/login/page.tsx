import { Suspense } from "react";
import { UserLoginForm } from "@/components/auth/user-login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-primary font-bold tracking-widest uppercase">
          Loading...
        </div>
      }
    >
      <UserLoginForm />
    </Suspense>
  );
}
