import { createTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { grey } from "@mui/material/colors";
declare module "@mui/material/styles" {
  interface PaletteOptions {
    scrollbarColor?: string;
  }
  interface Palette {
    scrollbarColor: string;
  }
}
export const useTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        paper: mode === "light" ? grey[100] : grey[900],
      },
      scrollbarColor:
        mode === "dark"
          ? `${grey[700]} ${grey[900]}`
          : `${grey[400]} ${grey[200]}`,
    },
  });

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  return { theme, toggleColorMode, mode };
};
