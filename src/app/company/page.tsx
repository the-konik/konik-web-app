import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Company | KONIK",
  description:
    "About KONIK — mission, vision, and philosophy for young men building a legacy life.",
};

const PILLARS = [
  {
    title: "Discipline",
    body: "Repeated choices that outlast motivation. We design products and tools that reward consistency, not noise.",
  },
  {
    title: "Identity",
    body: "How you show up matters. KONIK ties what you wear to who you’re becoming—signal on the outside, alignment on the inside.",
  },
  {
    title: "Growth",
    body: "Legacy is built in layers. We invest in skills, systems, and self-respect that compound over years, not weeks.",
  },
] as const;

export default function CompanyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Company
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              KONIK
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/75 sm:text-xl">
              A brand for young men who refuse to drift—who dress with intention
              and build with purpose.
            </p>
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            About KONIK
          </h2>
          <p className="mt-4 text-xl font-semibold leading-snug text-primary sm:text-2xl">
            KONIK is a hybrid of premium clothing and digital tools—one ecosystem
            for men who want their outside to match their standards inside.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            We’re not chasing trends. We’re building a lane where style, mindset,
            and execution stay connected—so progress feels visible in the mirror
            and measurable in your life.
          </p>
        </section>

        {/* Mission */}
        <section className="border-y border-border bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="border-l-4 border-accent pl-6 sm:pl-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Mission
              </h2>
              <p className="mt-4 text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
                Help young men build a legacy life.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Vision
          </h2>
          <p className="mt-4 text-xl font-semibold leading-snug text-primary sm:text-2xl">
            A generation of men who lead with clarity—grounded in identity,
            sharpened by discipline, and committed to growth that outlasts the
            algorithm.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            We see KONIK as the daily stack: what you wear, what you learn, and
            what you repeat—aligned so your life compounds in one direction.
          </p>
        </section>

        {/* Philosophy */}
        <section className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Brand philosophy
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-primary-foreground/70">
              Three commitments that define how we build products and show up
              for our community.
            </p>
            <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {PILLARS.map((p) => (
                <li key={p.title}>
                  <h3 className="text-lg font-bold text-accent">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Why KONIK exists
          </h2>
          <p className="mt-4 text-xl font-semibold text-primary sm:text-2xl">
            Because half-measures don’t build legacies.
          </p>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Too many young men are sold either empty hype or endless
              self-help—with nothing that holds them accountable day to day.
              KONIK exists to close that gap: clothing you’re proud to wear, and
              tools that keep you honest about the life you’re constructing.
            </p>
            <p>
              We started from a simple frustration—great style and real growth
              rarely lived in the same place. KONIK is that place: minimal on
              noise, heavy on standards.
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Shop the collection
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-muted transition"
            >
              Explore tools
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
