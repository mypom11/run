import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | Date, locale = "ko-KR") {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatDateShort(input: string | Date, locale = "ko-KR") {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatRelative(input: string | Date, locale = "ko-KR") {
  const d = typeof input === "string" ? new Date(input) : input;
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (min < 1) return "방금";
  if (min < 60) return rtf.format(-min, "minute");
  const hr = Math.round(min / 60);
  if (hr < 24) return rtf.format(-hr, "hour");
  const day = Math.round(hr / 24);
  if (day < 30) return rtf.format(-day, "day");
  const mo = Math.round(day / 30);
  if (mo < 12) return rtf.format(-mo, "month");
  return rtf.format(-Math.round(mo / 12), "year");
}
