export const formatDate = (date, locale = "en-US") =>
  new Date(date).toLocaleDateString(locale, { year:"numeric", month:"short", day:"numeric" });

export const formatDateTime = (date, locale = "en-US") =>
  new Date(date).toLocaleString(locale, { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};
