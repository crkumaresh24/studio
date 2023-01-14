import { Box, AppBar, Toolbar, IconButton, Button, Link } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface AppMenuProps {}

const AppMenu = (props: AppMenuProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            gap={2}
            sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}
          >
            <Link href="/components" underline="none">
              {"COMPONENTS"}
            </Link>
            <Link href="/datasources" underline="none">
              {"DATA"}
            </Link>
            <Link href="/actions" underline="none">
              {"ACTIONS"}
            </Link>
          </Box>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppMenu;
