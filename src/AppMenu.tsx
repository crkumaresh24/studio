import {
  ArrowDownward,
  Build,
  ManageAccounts,
  Person,
  PowerSettingsNew,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  Box,
  Menu,
  MenuItem,
  Typography,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect } from "react";
import { publish, readSettings } from "./services";
import { Settings, SnackMessage } from "./Constants";
import { StyledTab, StyledTabs } from "./App";

const AppMenu = () => {
  let page = 0;
  if (
    window.location.pathname === "/actions" ||
    window.location.pathname === "/designer"
  ) {
    page = 2;
  } else if (window.location.pathname === "/datasources") {
    page = 1;
  } else if (window.location.pathname === "/settings") {
    page = -1;
  }

  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState<number>(page);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const loginOpen = Boolean(anchorEl);
  const handleLoginClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLoginClose = () => {
    setAnchorEl(null);
  };

  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    buildPaths: [],
    apis: [],
    queries: [],
  });

  const refresh = () => {
    readSettings(setSettings, () => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSnackClose = (
    e: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackMessage(undefined);
  };

  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>AppBuilder</Typography>
          </Box>

          <Stack margin={"auto"}>
            <StyledTabs
              value={selectedMenu}
              onChange={(e, i) => {
                if (i === 0) {
                  navigate("/");
                } else if (i === 1) {
                  navigate("/components");
                } else {
                  navigate("/actions");
                }
                setSelectedMenu(i);
              }}
              aria-label="basic tabs example"
            >
              <StyledTab label="Services" />
              <StyledTab label="Components" />
              <StyledTab label="Actions" />
            </StyledTabs>
          </Stack>

          <Stack gap={2} direction={"row"}>
            <Button
              disabled={
                !settings.buildPaths || settings.buildPaths.length === 0
              }
              onClick={() => {
                publish(
                  settings.buildPaths,
                  () => {
                    setSnackMessage({
                      message: "app published successfully",
                      severity: "success",
                    });
                  },
                  () => {}
                );
              }}
              startIcon={<Build />}
              variant="contained"
            >
              Publish
            </Button>
            <Button
              id="basic-button"
              startIcon={<Person />}
              endIcon={<ArrowDownward />}
              variant="contained"
              aria-controls={loginOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={loginOpen ? "true" : undefined}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={loginOpen}
        onClose={handleLoginClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/settings");
            setSelectedMenu(-1);
            handleLoginClose();
          }}
        >
          <Stack gap={1} direction={"row"}>
            <SettingsIcon />
            Settings
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => {
            //navigate("/settings");
            setSelectedMenu(-1);
            handleLoginClose();
          }}
        >
          <Stack gap={1} direction={"row"}>
            <ManageAccounts />
            My account
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => {
            //navigate("/settings");
            setSelectedMenu(-1);
            handleLoginClose();
          }}
        >
          <Stack gap={1} direction={"row"}>
            <PowerSettingsNew />
            Logout
          </Stack>
        </MenuItem>
      </Menu>
      {snackMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackMessage.message !== undefined}
          autoHideDuration={3000}
          onClose={handleSnackClose}
        >
          <MuiAlert severity={snackMessage.severity}>
            {snackMessage.message}
          </MuiAlert>
        </Snackbar>
      )}
    </Stack>
  );
};

export default AppMenu;

/*
 <img
              style={{ height: 35, width: 48, borderRadius: 10 }}
              src={`nocode.jpg?w=40&h=40&fit=crop&auto=format`}
              srcSet={`nocode.jpg?w=40&h=40&fit=crop&auto=format`}
              alt={"nodelogo"}
              loading="lazy"
            />
 */
