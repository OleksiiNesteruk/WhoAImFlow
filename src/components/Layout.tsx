import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useTheme } from "../hooks/useTheme";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function Layout({ isAuth }: { isAuth: boolean }) {
  const { theme, toggleColorMode } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Header onToggleColorMode={toggleColorMode} />

        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <Sidebar isAuth={isAuth} />

          <Box
            sx={{
              flexGrow: 1,
              p: 2,
            }}
          >
            <Outlet />
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
