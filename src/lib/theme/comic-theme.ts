export const comicThemeColors = {
  heroRed: [
    "#ffe8e7",
    "#ffd0ce",
    "#ffaba5",
    "#ff7e74",
    "#ff5648",
    "#ff3b30",
    "#e6291d",
    "#be1c12",
    "#94120c",
    "#650905",
  ],
  heroBlue: [
    "#e8f0ff",
    "#cadbff",
    "#9bbcff",
    "#699cff",
    "#427fff",
    "#2668ff",
    "#1258ff",
    "#0047e8",
    "#003fcf",
    "#0035b0",
  ],
  heroYellow: [
    "#fff8d8",
    "#fff0b2",
    "#ffe26b",
    "#ffd33d",
    "#ffcb1a",
    "#ffc400",
    "#e7af00",
    "#ca9600",
    "#9f7300",
    "#735100",
  ],
  heroInk: [
    "#edf1f7",
    "#d6dce5",
    "#aab6c8",
    "#7e90ab",
    "#5c6f8d",
    "#435775",
    "#344764",
    "#24364f",
    "#18253b",
    "#0c1424",
  ],
} as const;

export const comicFontStacks = {
  body: 'var(--font-body), "Trebuchet MS", sans-serif',
  heading: 'var(--font-heading), Impact, fantasy',
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
