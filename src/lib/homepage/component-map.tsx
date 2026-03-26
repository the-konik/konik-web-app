import type { ComponentType } from "react";
import type { SectionProps } from "@/types/section";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { LegacyTransitionSection } from "@/components/site/legacy-transition-section";
import { IdentitySection } from "@/components/homepage/sections/identity-section";
import { CTASection } from "@/components/homepage/sections/cta-section";
import { ProductGridSection } from "@/components/homepage/sections/product-grid-section";
import { LifestyleSection } from "@/components/homepage/sections/lifestyle-section";
import { CategoryPreviewSection } from "@/components/homepage/sections/category-preview-section";
import { BundlesSection } from "@/components/homepage/sections/bundles-section";
import { SocialProofSection } from "@/components/homepage/sections/social-proof-section";
import { ComparisonSection } from "@/components/homepage/sections/comparison-section";
import { SystemsSection } from "@/components/homepage/sections/systems-section";
import { QuickActionsSection } from "@/components/homepage/sections/quick-actions-section";
import { UserSystemsSection } from "@/components/homepage/sections/user-systems-section";
import { RecommendationsSection } from "@/components/homepage/sections/recommendations-section";
import { LoyaltyStatusSection } from "@/components/homepage/sections/loyalty-status-section";

// New components for restructured stage layouts
import { HeroCardsSection } from "@/components/homepage/sections/hero-cards-section";
import { NewArrivalsSection } from "@/components/homepage/sections/new-arrivals-section";
import { ToolTransformationSection } from "@/components/homepage/sections/tool-transformation-section";
import { LifestyleGridSection } from "@/components/homepage/sections/lifestyle-grid-section";
import { ShopOutfitSection } from "@/components/homepage/sections/shop-outfit-section";
import { ShopLegacySection } from "@/components/homepage/sections/shop-legacy-section";
import { MembershipCtaSection } from "@/components/homepage/sections/membership-cta-section";
import { SpecialOfferSection } from "@/components/homepage/sections/special-offer-section";
import { NewUpdatesSection } from "@/components/homepage/sections/new-updates-section";
import { UpcomingEventsSection } from "@/components/homepage/sections/upcoming-events-section";
import { LoyaltyAboutSection } from "@/components/homepage/sections/loyalty-about-section";

/**
 * Mapping from HomepageSection.sectionType → React component.
 *
 * SECURITY: Only components listed here can be rendered.
 * Unknown sectionType values are silently skipped.
 */

// Wrapper to make existing no-prop components conform to SectionProps
function wrapNoProps(Component: ComponentType): ComponentType<SectionProps> {
  const Wrapped = (_props: SectionProps) => <Component />;
  Wrapped.displayName = `Wrapped(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}

export const COMPONENT_MAP: Record<string, ComponentType<SectionProps>> = {
  // ── Legacy (kept for backward compatibility) ──
  HERO_CAROUSEL: wrapNoProps(HeroCarousel),
  LEGACY_TRANSITION: wrapNoProps(LegacyTransitionSection),
  IDENTITY: IdentitySection,
  CATEGORY_PREVIEW: CategoryPreviewSection,
  BUNDLES: BundlesSection,
  COMPARISON: ComparisonSection,
  LIFESTYLE: LifestyleSection,

  // ── Restructured stage layouts ──
  HERO_CARDS: HeroCardsSection,
  NEW_ARRIVALS: NewArrivalsSection,
  TOOL_TRANSFORMATION: ToolTransformationSection,
  PRODUCT_GRID: ProductGridSection,
  SOCIAL_PROOF: SocialProofSection,
  LIFESTYLE_GRID: LifestyleGridSection,
  SHOP_OUTFIT: ShopOutfitSection,
  SHOP_LEGACY: ShopLegacySection,
  MEMBERSHIP_CTA: MembershipCtaSection,
  CTA: CTASection,
  SYSTEMS: SystemsSection,

  // ── HOT stage ──
  RECOMMENDATIONS: RecommendationsSection,
  SPECIAL_OFFER: SpecialOfferSection,
  NEW_UPDATES: NewUpdatesSection,
  UPCOMING_EVENTS: UpcomingEventsSection,
  LOYALTY_ABOUT: LoyaltyAboutSection,

  // ── Dashboard / utility ──
  QUICK_ACTIONS: QuickActionsSection,
  USER_SYSTEMS: UserSystemsSection,
  LOYALTY_STATUS: LoyaltyStatusSection,
};

/**
 * Validate that a sectionType string maps to a known component.
 */
export function isValidSectionType(type: string): boolean {
  return type in COMPONENT_MAP;
}
