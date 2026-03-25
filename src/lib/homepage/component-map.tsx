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

/**
 * Mapping from HomepageSection.sectionType → React component.
 *
 * SECURITY: Only components listed here can be rendered.
 * Unknown sectionType values are silently skipped.
 *
 * Existing components (HeroCarousel, LegacyTransitionSection)
 * are wrapped — they accept no props internally, so `data`/`media`
 * are ignored by them. This keeps them 100% untouched.
 */

// Wrapper to make existing no-prop components conform to SectionProps
function wrapNoProps(Component: ComponentType): ComponentType<SectionProps> {
  const Wrapped = (_props: SectionProps) => <Component />;
  Wrapped.displayName = `Wrapped(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}

export const COMPONENT_MAP: Record<string, ComponentType<SectionProps>> = {
  // Phase 1 — Core
  HERO_CAROUSEL: wrapNoProps(HeroCarousel),
  LEGACY_TRANSITION: wrapNoProps(LegacyTransitionSection),
  IDENTITY: IdentitySection,
  CTA: CTASection,
  PRODUCT_GRID: ProductGridSection,

  // Phase 2 — COLD/WARM stage
  LIFESTYLE: LifestyleSection,
  CATEGORY_PREVIEW: CategoryPreviewSection,
  BUNDLES: BundlesSection,
  SOCIAL_PROOF: SocialProofSection,
  COMPARISON: ComparisonSection,
  SYSTEMS: SystemsSection,

  // Phase 2 — HOT stage
  QUICK_ACTIONS: QuickActionsSection,
  USER_SYSTEMS: UserSystemsSection,
  RECOMMENDATIONS: RecommendationsSection,
  LOYALTY_STATUS: LoyaltyStatusSection,
};

/**
 * Validate that a sectionType string maps to a known component.
 */
export function isValidSectionType(type: string): boolean {
  return type in COMPONENT_MAP;
}
