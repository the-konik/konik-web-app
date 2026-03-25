import { COMPONENT_MAP, isValidSectionType } from "@/lib/homepage/component-map";
import type { HomepageSection } from "@/generated/prisma";

interface SectionRendererProps {
  sections: HomepageSection[];
}

/**
 * SectionRenderer — dynamically renders homepage sections from DB data.
 *
 * Server component. Maps each section's `sectionType` to a React component
 * via COMPONENT_MAP, passing `content` as `data` and `mediaUrl` as `media`.
 *
 * Unknown sectionType values are silently skipped (security boundary).
 */
export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        if (!isValidSectionType(section.sectionType)) return null;

        const Component = COMPONENT_MAP[section.sectionType];
        if (!Component) return null;

        return (
          <Component
            key={section.id}
            data={section.content as Record<string, unknown>}
            media={section.mediaUrl}
          />
        );
      })}
    </>
  );
}
