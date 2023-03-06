import {
  Button,
  createTheme,
  CssBaseline,
  Snackbar,
  Stack,
  styled,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AppMenu from "./AppMenu";
import { Outlet } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MuiAlert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import { Settings, SnackMessage } from "./Constants";
import { publish, readSettings } from "./services";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {},
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

interface StyledTabProps {
  label: string;
}

export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(0, 0, 0, 0.7)",
  "&.Mui-selected": {
    color: theme.palette.mode === "dark" ? "#fff" : "black",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

const App = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    buildPaths: [],
    apis: [],
    queries: [],
  });

  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();

  const refresh = () => {
    readSettings(
      (s) => {
        setSettings(s);
      },
      () => {}
    );
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleClose = (e: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackMessage(undefined);
  };

  return (
    <ThemeProvider theme={settings.theme === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <main>
        <Stack
          paddingLeft={4}
          paddingRight={18}
          direction={"row"}
          alignItems={"center"}
          sx={{ minHeight: 56 }}
          borderBottom={"1px solid rgb(128,128,128, 0.4)"}
        >
          <Typography variant="h6">AppStudio</Typography>
          <Button
            onClick={() => {
              publish(
                [],
                () => {
                  setSnackMessage({
                    message: "App published successfully",
                    severity: "info",
                  });
                },
                () => {}
              );
            }}
            sx={{ marginLeft: "auto" }}
            variant="contained"
          >
            Publish
          </Button>
        </Stack>
        <Stack gap={2} direction={"row"}>
          <AppMenu />
          <Outlet />
        </Stack>
      </main>
      {snackMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackMessage.message !== undefined}
          autoHideDuration={1200}
          onClose={handleClose}
        >
          <MuiAlert severity={snackMessage.severity}>
            {snackMessage.message}
          </MuiAlert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
};

export default App;
