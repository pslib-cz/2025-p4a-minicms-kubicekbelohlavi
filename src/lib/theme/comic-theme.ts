export const comicThemeColors = {
  heroRed: [
    "#ffe5e5",
    "#ffcccc",
    "#ff9999",
    "#ff6666",
    "#ff3333",
    "#e23636",
    "#c02020",
    "#9b1515",
    "#750e0e",
    "#500808",
  ],
  heroBlue: [
    "#e8edff",
    "#c5d0ff",
    "#8fa3ff",
    "#5976e6",
    "#3354cc",
    "#1b3a8c",
    "#152e70",
    "#102254",
    "#0a1638",
    "#050b1c",
  ],
  heroYellow: [
    "#fffbe5",
    "#fff7cc",
    "#ffef99",
    "#ffe766",
    "#ffdf33",
    "#ffd700",
    "#e6c200",
    "#b39700",
    "#806c00",
    "#4d4100",
  ],
  heroInk: [
    "#f5f5f5",
    "#ebebeb",
    "#d6d6d6",
    "#c2c2c2",
    "#adadad",
    "#999999",
    "#ff2d95",
    "#e22680",
    "#1a1a1a",
    "#0a0a12",
  ],
} as const;

export const comicFontStacks = {
  body: 'var(--font-body), "Segoe UI", "Arial Unicode MS", sans-serif',
  heading: 'var(--font-heading), "Arial Black", sans-serif',
} as const;

export const comicLibraryRecommendations = [
  {
    adopt: true,
    name: "Mantine",
    note:
      "Already installed, stable 8.x theme API, and covers the dashboard UI without adding new dependencies.",
  },
  {
    adopt: true,
    name: "next/font/google",
    note:
      "Built into Next.js and lets the comic fonts ship through CSS variables with no extra runtime package.",
  },
  {
    adopt: false,
    name: "rough-notation",
    note:
      "Useful for comic callouts, but the latest npm release is 0.5.1 from 2022, so it is too stale for the core theme.",
  },
  {
    adopt: false,
    name: "wired-elements",
    note:
      "The current npm line is 3.0.0-rc.6 and adoption is low, so it is not a good production fit here.",
  },
] as const;
