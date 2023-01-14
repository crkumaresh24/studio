import "./App.css";
import {
  Box,
  createTheme,
  CssBaseline,
  Paper,
  ThemeProvider,
} from "@mui/material";
import AppMenu from "./AppMenu";
import { Outlet } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


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
        <Box
          sx={{
            width: "70%",
            height: "calc(100vh - 64px)",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Paper
            sx={{
              height: "100%",
              padding: 2,
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </main>
    </ThemeProvider>
  );
};

export default App;
