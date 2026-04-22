import AnalyticsIcon from "@mui/icons-material/Analytics";
import TableChartIcon from "@mui/icons-material/TableChart";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isActive}
        component={Link}
        to={to}
        sx={{
          "&.Mui-selected": {
            backgroundColor: "rgba(25, 118, 210, 0.12)",
            borderRight: "4px solid #1976d2",
          },
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}

export function Sidebar({ isAuth }: { isAuth: boolean }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/summary");
    window.location.reload();
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "240px",
        overflow: "auto",
        borderRight: 1,
        borderColor: "divider",
        backgroundColor: theme.palette.background.paper,
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navigation Menu */}
      <List sx={{ py: 1 }}>
        <NavItem
          to="/summary"
          icon={<AnalyticsIcon />}
          label="Feedback Summary"
        />
        {isAuth && (
          <>
            <NavItem
              to="/table"
              icon={<TableChartIcon />}
              label="Feedback Table"
            />
            <NavItem
              to="/game-stats"
              icon={<SportsEsportsIcon />}
              label="Game Statistics"
            />
          </>
        )}
      </List>

      {!isAuth ? (
        <NavItem to="/login" icon={<LoginIcon />} label="Login" />
      ) : (
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      )}
    </Box>
  );
}
