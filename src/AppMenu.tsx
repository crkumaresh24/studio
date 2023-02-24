import {
  Stack,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { AccountBox, DataObject, Settings } from "@mui/icons-material";

const AppMenu = () => {
  const navigate = useNavigate();

  return (
    <Stack>
      <Box paddingTop={1} sx={{ width: "100%", minWidth: 240, maxWidth: 360 }}>
        <nav aria-label="main mailbox folders">
          <List dense>
            <ListItem
              onClick={() => {
                navigate("/components");
              }}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Components" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/");
                }}
              >
                <ListItemIcon>
                  <DataObject />
                </ListItemIcon>
                <ListItemText primary="Services" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/actions");
                }}
              >
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Actions" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
        <Divider />
        <nav aria-label="main mailbox folders">
          <List dense>
            <ListItem
              onClick={() => {
                navigate("/settings");
              }}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <AccountBox />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
      </Box>
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
