import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  useTheme as useMuiTheme,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

type HeaderProps = {
  onToggleColorMode: () => void;
};

export function Header({ onToggleColorMode }: HeaderProps) {
  const theme = useMuiTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}
    >
      <Toolbar sx={{ height: "100%" }}>
        <SportsEsportsIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WhoAIm Game Dashboard
        </Typography>

        <IconButton onClick={onToggleColorMode} color="inherit">
          {theme.palette.mode === "light" ? (
            <DarkModeIcon />
          ) : (
            <LightModeIcon />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
