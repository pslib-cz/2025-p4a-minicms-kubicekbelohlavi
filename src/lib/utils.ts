const NON_WORD = /[^a-z0-9]+/g;
const TAGS = /<[^>]+>/g;

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(NON_WORD, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function stripHtml(value: string) {
  return value.replace(TAGS, " ").replace(/\s+/g, " ").trim();
}

export function buildExcerpt(value: string, maxLength = 180) {
  const plain = stripHtml(value);

  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, maxLength).trimEnd()}...`;
}

export function normalizePage(value?: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export function clampPage(page: number, totalPages: number) {
  if (totalPages <= 0) {
    return 1;
  }

  return Math.min(Math.max(page, 1), totalPages);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function toDatetimeLocalValue(date: string | Date) {
  const value = new Date(date);
  const tzOffset = value.getTimezoneOffset() * 60_000;

  return new Date(value.getTime() - tzOffset).toISOString().slice(0, 16);
}
