import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy | KONIK",
  description: "KONIK privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <PublicHeader />

      <main className="flex-1 pt-28 sm:pt-32">
        <article className="mx-auto max-w-5xl px-6 sm:px-8 py-12 sm:py-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
            Legal
          </span>
          <h1 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight mb-3">
            PRIVACY POLICY
          </h1>
          <p className="text-sm text-[#4B5563] mb-10">
            Last updated: March 2026
          </p>

          <div className="prose-konik space-y-8 text-sm text-[#4B5563] leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us when creating an account, making a purchase, subscribing to our newsletter, or contacting customer support. This may include your name, email address, shipping address, and payment information.
              </p>
              <p className="mt-2">
                We also automatically collect certain technical information when you visit our website, such as your IP address, browser type, device information, and browsing behavior through cookies and similar technologies.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>To process and fulfill your orders, including sending order confirmations and tracking updates.</li>
                <li>To provide and maintain your access to digital tools and subscriptions.</li>
                <li>To communicate with you about products, services, offers, and promotions.</li>
                <li>To improve our website, products, and customer experience.</li>
                <li>To detect, prevent, and address technical issues or fraudulent activity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                3. Information Sharing
              </h2>
              <p>
                We do not sell your personal information. We share your information only with trusted third-party service providers who assist us in operating our website, processing payments (e.g., Stripe), fulfilling orders, and delivering marketing communications.
              </p>
              <p className="mt-2">
                These providers are contractually obligated to protect your information and may only use it to perform specific services for KONIK.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, and unauthorized disclosure or access. However, no internet transmission is entirely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                5. Your Rights
              </h2>
              <p>
                Depending on your location, you may have rights to access, correct, delete, or restrict the use of your personal information. You can manage your account information directly through your dashboard. To exercise other rights, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                6. Cookies & Tracking
              </h2>
              <p>
                We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can modify your browser settings to decline cookies, but this may affect certain features of the site.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                7. Changes to this Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated &quot;Last updated&quot; date and the updated version will be effective as soon as it is accessible.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                8. Contact Us
              </h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at{" "}
                <a
                  href="mailto:privacy@konik.com"
                  className="text-[#B8860B] font-medium hover:underline"
                >
                  privacy@konik.com
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
