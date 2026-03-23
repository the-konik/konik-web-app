import type { Metadata } from "next";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | KONIK",
  description: "KONIK terms of service and conditions of use.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <PublicHeader />

      <main className="flex-1 pt-28 sm:pt-32">
        <article className="mx-auto max-w-3xl px-6 sm:px-8 py-12 sm:py-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
            Legal
          </span>
          <h1 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight mb-3">
            TERMS &amp; CONDITIONS
          </h1>
          <p className="text-sm text-[#4B5563] mb-10">
            Last updated: March 2026
          </p>

          <div className="prose-konik space-y-8 text-sm text-[#4B5563] leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using KONIK&apos;s website, mobile applications,
                and services (collectively, the &quot;Services&quot;), you agree
                to be bound by these Terms and Conditions. If you do not agree,
                please do not use our Services.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                2. Products &amp; Pricing
              </h2>
              <p>
                All product descriptions, pricing, and availability are subject
                to change without notice. We make every effort to display
                accurate product colors and images, but we cannot guarantee that
                your device&apos;s display accurately reflects the actual product.
              </p>
              <p className="mt-2">
                KONIK reserves the right to limit quantities purchased per
                person, household, or order. We may also refuse or cancel orders
                at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                3. Digital Products &amp; Subscriptions
              </h2>
              <p>
                Digital tools and subscription services are provided &quot;as
                is.&quot; Access to subscription-based tools is contingent on
                maintaining an active subscription. One-time purchases provide
                lifetime access subject to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                4. User Accounts
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities under your account.
                You must notify us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                5. Payment Terms
              </h2>
              <p>
                All payments are processed securely through Stripe. By providing
                payment information, you represent that you are authorized to use
                the payment method. All prices are in USD unless otherwise
                stated.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                6. Intellectual Property
              </h2>
              <p>
                All content on KONIK, including text, graphics, logos, images,
                and software, is the property of KONIK and protected by
                intellectual property laws. You may not reproduce, distribute, or
                create derivative works without explicit written permission.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                KONIK shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of our
                Services. Our total liability shall not exceed the amount paid
                for the specific product or service giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                8. Governing Law
              </h2>
              <p>
                These terms shall be governed by and construed in accordance
                with the laws of Sri Lanka, without regard to conflict of law
                principles.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                9. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Continued use of the
                Services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                10. Contact
              </h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a
                  href="mailto:legal@konik.com"
                  className="text-[#B8860B] font-medium hover:underline"
                >
                  legal@konik.com
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
