import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
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
