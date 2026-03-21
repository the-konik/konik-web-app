/** API + UI listing lifecycle (maps to `published` + `archived` in DB). */
export type ProductListingStatus = "draft" | "active" | "archived";

export function toListingStatus(p: {
  published: boolean;
  archived: boolean;
}): ProductListingStatus {
  if (p.archived) return "archived";
  if (p.published) return "active";
  return "draft";
}

export function fromListingStatus(
  status: ProductListingStatus
): { published: boolean; archived: boolean } {
  switch (status) {
    case "active":
      return { published: true, archived: false };
    case "archived":
      return { published: false, archived: true };
    default:
      return { published: false, archived: false };
  }
}
