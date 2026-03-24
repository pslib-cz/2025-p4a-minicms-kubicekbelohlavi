const ISSUE_FORMATTER = new Intl.DateTimeFormat("cs-CZ", {
  month: "long",
  year: "numeric",
});

function getCzechPlural(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "článek";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "články";
  }

  return "článků";
}

export function formatIssueLabel(date: string | Date) {
  return ISSUE_FORMATTER.format(new Date(date));
}

export function formatArticleCount(count: number) {
  return `${count} ${getCzechPlural(count)}`;
}

export function formatPanelNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}
