import { Suspense } from "react";
import { UserRegisterForm } from "@/components/auth/user-register-form";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-primary font-bold tracking-widest uppercase">
          Loading...
        </div>
      }
    >
      <UserRegisterForm />
    </Suspense>
  );
}
