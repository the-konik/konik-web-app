import Link from "next/link";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-primary text-primary-foreground">
      <PublicHeader variant="dark" />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-8 sm:py-32">
        <span className="mb-4 inline-block rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-widest text-muted-foreground">
          Clothing & Digital Tools
        </span>
        <h2 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Elevate Your Style.
          <br />
          <span className="text-accent">Sharpen Your Mind.</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          KONIK combines premium streetwear with powerful digital
          self-improvement tools — all in one platform.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/shop"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-accent/90 transition"
          >
            Browse Shop
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-white/20 px-6 py-3 font-medium hover:bg-white/5 transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
