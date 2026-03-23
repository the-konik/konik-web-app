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
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#121212] px-6 py-24 pt-40 sm:pt-48 text-[#FFFFFF] sm:px-8 lg:px-12 lg:py-32 overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl" />
          <div className="mx-auto max-w-[1440px] relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#B8860B] mb-6">
              THE KONIK NARRATIVE
            </p>
            <h1 className="font-atmospheric text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-none max-w-4xl">
              BUILDING A <br />
              <span className="text-[#B8860B]">LEGACY LIFE</span>
            </h1>
            <p className="mt-10 text-lg sm:text-xl leading-relaxed text-[#FFFFFF]/70 max-w-2xl font-medium">
              A brand for young men who refuse to drift—who dress with intention
              and build with purpose. We bridge the gap between aesthetic and character.
            </p>
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4B5563]">
              ABOUT KONIK
            </h2>
            <p className="text-2xl sm:text-3xl font-bold leading-tight text-[#121212]">
              KONIK is a hybrid of premium clothing and digital tools—one ecosystem
              for men who want their outside to match their standards inside.
            </p>
            <p className="text-lg leading-relaxed text-[#4B5563]">
              We’re not chasing trends. We’re building a lane where style, mindset,
              and execution stay connected—so progress feels visible in the mirror
              and measurable in your life.
            </p>
          </div>
          <div className="aspect-square bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-sm p-12 flex items-center justify-center overflow-hidden group relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#B8860B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <span className="font-atmospheric text-[15vw] lg:text-[10vw] text-[#121212]/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">KONIK</span>
          </div>
        </section>

        {/* Mission */}
        <section className="border-y border-[#E5E7EB] bg-[#FFFFFF] px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4B5563] mb-10">
                OUR MISSION
              </h2>
              <p className="font-atmospheric text-4xl sm:text-6xl text-[#121212] leading-tight tracking-tight">
                HELP YOUNG MEN BUILD A <span className="text-[#B8860B]">LEGACY LIFE.</span>
              </p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-start">
           <div className="aspect-video lg:aspect-square bg-[#121212] rounded-2xl flex flex-col justify-end p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                 <div className="w-12 h-12 border border-[#B8860B]/30 rounded-full flex items-center justify-center text-[#B8860B] font-bold">V</div>
              </div>
              <p className="font-atmospheric text-2xl text-[#FFFFFF] relative z-10">THE VISION</p>
           </div>
           <div className="space-y-8 lg:pt-10">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4B5563]">
                VISION
              </h2>
              <p className="text-2xl font-bold leading-tight text-[#121212]">
                A generation of men who lead with clarity—grounded in identity,
                sharpened by discipline, and committed to growth that outlasts the
                algorithm.
              </p>
              <p className="text-lg leading-relaxed text-[#4B5563]">
                We see KONIK as the daily stack: what you wear, what you learn, and
                what you repeat—aligned so your life compounds in one direction.
              </p>
           </div>
        </section>

        {/* Philosophy */}
        <section className="bg-[#121212] px-6 sm:px-8 lg:px-12 py-24 lg:py-32 text-[#FFFFFF] relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#B8860B]/10 to-transparent pointer-events-none" />
          <div className="mx-auto max-w-[1440px] relative z-10">
            <h2 className="text-center text-[11px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">
              CORE PHILOSOPHY
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-[#FFFFFF]/70">
              Three commitments that define how we build products and show up
              for our community.
            </p>
            <ul className="mt-20 grid gap-12 sm:grid-cols-3">
              {PILLARS.map((p) => (
                <li key={p.title} className="group">
                  <div className="w-10 h-10 border-b-2 border-[#B8860B] mb-8 transform group-hover:w-20 transition-all duration-500" />
                  <h3 className="font-atmospheric text-2xl text-[#B8860B] mb-4">{p.title.toUpperCase()}</h3>
                  <p className="text-sm leading-relaxed text-[#FFFFFF]/60 font-medium">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-4xl px-6 sm:px-8 py-24 lg:py-32 text-center">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4B5563] mb-8">
            WHY KONIK EXISTS
          </h2>
          <p className="font-atmospheric text-3xl sm:text-4xl text-[#121212] mb-10 tracking-tight">
            BECAUSE HALF-MEASURES DON’T BUILD LEGACIES.
          </p>
          <div className="space-y-6 text-lg leading-relaxed text-[#4B5563] font-medium max-w-3xl mx-auto">
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
          <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="bg-[#121212] px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] shadow-xl hover:bg-[#121212]/90 transition-all"
            >
              Shop the Collection
            </Link>
            <Link
              href="/tools"
              className="border border-[#121212] bg-transparent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] hover:bg-[#F8F8F8] transition-all"
            >
              Explore Tools
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
