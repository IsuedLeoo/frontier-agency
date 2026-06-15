"use client";

import { useEffect } from "react";
import { initAnalytics, trackEvent } from "@/lib/analytics";

// Expose trackEvent globally for use in event handlers
declare global {
  interface Window {
    faTrack?: (name: string, data?: Record<string, unknown>) => void;
  }
}

export default function AnalyticsScript() {
  useEffect(() => {
    initAnalytics();
    window.faTrack = trackEvent;
  }, []);

  return null;
}
