export function parseDate(dateString?: string | null): Date {
  if (!dateString) return new Date();
  let normalized = dateString.trim();
  if (!normalized.endsWith("Z") && !normalized.includes("+") && !/-\d{2}:?\d{2}$/.test(normalized)) {
    normalized = `${normalized.replace(" ", "T")}Z`;
  }
  return new Date(normalized);
}

export function formatRelativeTime(dateString?: string | null) {
  if (!dateString) return "Never";
  const date = parseDate(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (isNaN(date.getTime()) || diffMs < 0) return "Just now";

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
}
