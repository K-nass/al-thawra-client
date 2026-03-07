import type { Reel } from "~/services/reelsService";

/**
 * Format a number into a compact display string (1.2K, 3.5M, etc.)
 */
export function formatCount(num: number | null | undefined): string {
  if (!num || num <= 0) return "0";
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return val % 1 === 0 ? `${val}M` : `${val.toFixed(1)}M`;
  }
  if (num >= 1_000) {
    const val = num / 1_000;
    return val % 1 === 0 ? `${val}K` : `${val.toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Parse an ISO 8601 duration or "HH:MM:SS" / "MM:SS" string into seconds.
 * Returns 0 if unparseable.
 */
export function parseDuration(duration: string | null | undefined): number {
  if (!duration) return 0;

  // "MM:SS" or "HH:MM:SS"
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
  if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);

  return 0;
}

/**
 * Format seconds into "M:SS" display.
 */
export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get a poster/thumbnail for a reel, with a gradient fallback colour.
 */
export function getVideoPoster(reel: Reel): string | undefined {
  if (reel.thumbnailUrl) return reel.thumbnailUrl;
  return undefined; // let CSS gradient handle the fallback
}

/**
 * Preload a video URL by creating a temporary link element.
 * Returns a cleanup function to remove it.
 */
export function preloadVideoUrl(url: string | null | undefined): (() => void) | null {
  if (!url || typeof document === "undefined") return null;

  // Avoid duplicate preloads
  const existing = document.querySelector(`link[href="${url}"]`);
  if (existing) return null;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = url;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);

  return () => {
    try {
      document.head.removeChild(link);
    } catch {
      // already removed
    }
  };
}

/**
 * Extract the first letter of a username for avatar fallback.
 */
export function getAvatarInitial(name: string | null | undefined): string {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

/**
 * Create a deterministic gradient from a user ID for avatar fallback.
 */
export function getAvatarGradient(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 65%, 55%) 0%, hsl(${h2}, 70%, 45%) 100%)`;
}

/**
 * Safely format a relative time string for a reel's creation date.
 */
export function getRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `منذ ${diffDays} يوم`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `منذ ${diffWeeks} أسبوع`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `منذ ${diffMonths} شهر`;

    return `منذ ${Math.floor(diffMonths / 12)} سنة`;
  } catch {
    return "";
  }
}
