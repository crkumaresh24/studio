import {
  Api,
  AutoAwesomeMotion,
  Build,
  Dataset,
  Person,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  Box,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AppMenu = () => {
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState<number>(0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const loginOpen = Boolean(anchorEl);
  const handleLoginClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLoginClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <Box gap={2} sx={{ display: "flex", alignItems: "center" }}>
            <img
              style={{ height: 35, width: 48, borderRadius: 10 }}
              src={`nocode.jpg?w=40&h=40&fit=crop&auto=format`}
              srcSet={`nocode.jpg?w=40&h=40&fit=crop&auto=format`}
              alt={"nodelogo"}
              loading="lazy"
            />
          </Box>

          <Stack margin={"auto"}>
            <Tabs
              value={selectedMenu}
              onChange={(e, i) => {
                if (i === 0) {
                  navigate("/");
                } else if (i === 1) {
                  navigate("/datasources");
                } else {
                  navigate("/actions");
                }
                setSelectedMenu(i);
              }}
              aria-label="basic tabs example"
            >
              <Tab
                icon={<AutoAwesomeMotion />}
                iconPosition="start"
                label="Containers"
              />
              <Tab icon={<Dataset />} iconPosition="start" label="Data" />
              <Tab icon={<Api />} iconPosition="start" label="Actions" />
            </Tabs>
          </Stack>

          <Stack gap={2} direction={"row"}>
            <Button startIcon={<Build />} variant="contained">
              Publish
            </Button>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Dark Mode"
            />
            <Button
              id="basic-button"
              endIcon={<Person />}
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
            handleLoginClose();
          }}
        >
          Settings
        </MenuItem>
        <MenuItem onClick={handleLoginClose}>My account</MenuItem>
        <MenuItem onClick={handleLoginClose}>Logout</MenuItem>
      </Menu>
    </Stack>
  );
};

export default AppMenu;
