import {
  createTheme,
  CssBaseline,
  styled,
  Tab,
  Tabs,
  ThemeProvider,
} from "@mui/material";
import AppMenu from "./AppMenu";
import { Outlet } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState, useEffect } from "react";
import { Settings } from "./Constants";
import { readSettings } from "./services";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
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
  return (
    <ThemeProvider theme={settings.theme === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <main>
        <AppMenu />
        <Outlet />
      </main>
    </ThemeProvider>
  );
};

export default App;
