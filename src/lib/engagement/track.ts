/**
 * Client-side engagement tracking helper.
 *
 * Stores the running score in localStorage for immediate reads,
 * then POSTs to the API to persist server-side (DB for logged-in, cookie for guests).
 */

const STORAGE_KEY = "konik_engagement_score";

export const ENGAGEMENT_DELTAS: Record<string, number> = {
  visit: 1,
  product_view: 2,
  tool_view: 3,
  add_to_cart: 5,
  purchase: 10,
  return_via_campaign: 5,
} as const;

function getLocalScore(): number {
  if (typeof window === "undefined") return 0;
  const val = localStorage.getItem(STORAGE_KEY);
  return val ? Math.max(0, parseInt(val, 10) || 0) : 0;
}

function setLocalScore(score: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(score));
}

/**
 * Track an engagement event.
 * Updates localStorage instantly and POSTs to the server.
 */
export async function trackEngagement(event: string): Promise<number> {
  const delta = ENGAGEMENT_DELTAS[event];
  if (!delta) {
    console.warn(`[engagement] Unknown event: "${event}"`);
    return getLocalScore();
  }

  const newScore = getLocalScore() + delta;
  setLocalScore(newScore);

  try {
    const res = await fetch("/api/engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
    });
    if (res.ok) {
      const data = await res.json();
      // Sync with server-authoritative score
      if (typeof data.score === "number") {
        setLocalScore(data.score);
        return data.score;
      }
    }
  } catch {
    // Silently fail — localStorage already updated
  }

  return newScore;
}
