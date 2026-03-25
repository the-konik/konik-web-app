"use client";

import { useEffect, useRef } from "react";
import { trackEngagement } from "@/lib/engagement/track";

/**
 * EngagementTracker — fires a "visit" event once when the homepage mounts.
 * Rendered as a hidden client component inside the server-rendered page.
 */
export function EngagementTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEngagement("visit");
  }, []);

  return null;
}
