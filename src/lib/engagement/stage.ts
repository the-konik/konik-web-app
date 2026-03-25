import { Stage } from "../../generated/prisma";

/**
 * Thresholds:
 *   0–5  → COLD  (Discovery)
 *   6–15 → WARM  (Decision)
 *   16+  → HOT   (Retention)
 */
export function getStage(score: number): Stage {
  if (score >= 16) return "HOT";
  if (score >= 6) return "WARM";
  return "COLD";
}
