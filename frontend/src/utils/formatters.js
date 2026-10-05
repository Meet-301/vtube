//! duration (seconds) -> "3:45" or "1:02:30"
export const formatDuration = (totalSeconds) => {
  const secs = Math.max(0, Math.floor(Number(totalSeconds) || 0));

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  const ss = String(s).padStart(2, "0");

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  }
  return `${m}:${ss}`;
};

//! date -> "5 minutes ago", "2 days ago", "3 weeks ago"
export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (isNaN(seconds)) return "";
  if (seconds < 10) return "just now";

  const units = [
    { label: "year", secs: 365 * 24 * 60 * 60 },
    { label: "month", secs: 30 * 24 * 60 * 60 },
    { label: "week", secs: 7 * 24 * 60 * 60 },
    { label: "day", secs: 24 * 60 * 60 },
    { label: "hour", secs: 60 * 60 },
    { label: "minute", secs: 60 },
    { label: "second", secs: 1 },
  ];

  for (const { label, secs } of units) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }
};

//! views -> "1.2K", "3.4M"
export const formatViews = (views) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(views || 0);