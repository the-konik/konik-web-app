/**
 * Shared type for all dynamically rendered homepage section components.
 * Every component in COMPONENT_MAP must accept these props.
 */
export interface SectionProps {
  /** JSON content from HomepageSection.content — shape varies per sectionType */
  data: Record<string, unknown>;
  /** Optional media URL from HomepageSection.mediaUrl */
  media?: string | null;
}
