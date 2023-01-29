import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import AppMenu from "./AppMenu";
import { Outlet } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <AppMenu />
        <Outlet />
      </main>
    </ThemeProvider>
  );
};

export default App;
