import { createTheme } from "@mantine/core";
import { comicFontStacks, comicThemeColors } from "@/lib/theme/comic-theme";

export const mantineComicTheme = createTheme({
  colors: comicThemeColors,
  primaryColor: "heroRed",
  defaultRadius: "md",
  fontFamily: comicFontStacks.body,
  headings: {
    fontFamily: comicFontStacks.heading,
  },
  radius: {
    xs: "0.5rem",
    sm: "0.8rem",
    md: "1rem",
    lg: "1.2rem",
    xl: "1.6rem",
  },
  components: {
    ActionIcon: {
      defaultProps: {
        radius: "md",
        variant: "filled",
      },
    },
    Alert: {
      defaultProps: {
        radius: "md",
      },
    },
    AppShell: {
      defaultProps: {
        padding: "lg",
      },
    },
    Badge: {
      defaultProps: {
        radius: "sm",
      },
    },
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    Card: {
      defaultProps: {
        radius: "lg",
        shadow: "sm",
        withBorder: true,
      },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
      },
    },
    MultiSelect: {
      defaultProps: {
        radius: "md",
      },
    },
    Paper: {
      defaultProps: {
        radius: "lg",
        shadow: "sm",
        withBorder: true,
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
      },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
      },
    },
  },
});
