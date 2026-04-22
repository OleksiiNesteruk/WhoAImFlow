import { Box } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export function Footer() {
  const theme = useMuiTheme();
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: 1,
        borderColor: "divider",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "50px",
        flexShrink: 0,
      }}
    >
      WhoAIm Game Analytics © {new Date().getFullYear()}
    </Box>
  );
}
