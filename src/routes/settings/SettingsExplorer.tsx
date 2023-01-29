import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { readSettings, saveSettings } from "../../services";

interface API {
  apiId: string;
  apiURL: string;
}

interface Settings {
  buildPaths: string[];
  apis: API[];
}

const SettingsExplorer = () => {
  const [newBuildPath, setNewBuildPath] = useState<string>("");
  const [newAPI, setNewAPI] = useState<API>({
    apiId: "",
    apiURL: "",
  });
  const [showAddBuildPath, setShowAddBuildPath] = useState<boolean>();
  const [showAddAPI, setShowAddAPI] = useState<boolean>();
  const [settings, setSettings] = useState<Settings>({
    buildPaths: [],
    apis: [],
  });

  const save = (newSettings: Settings) => {
    saveSettings(newSettings, refresh, () => {});
  };

  const refresh = () => {
    readSettings(
      (s) => {
        setSettings(s);
        setNewBuildPath("");
        setShowAddBuildPath(false);
        setShowAddAPI(false);
        setNewAPI({
          apiId: "",
          apiURL: "",
        });
      },
      () => {}
    );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Stack sx={{ maxWidth: "60%", margin: "auto" }}>
      <Paper sx={{ minHeight: "calc(100vh - 64px)", padding: 3 }}>
        <Stack gap={2}>
          <Typography>{"Settings"}</Typography>
          <Box>
            <Box>
              <Stack gap={1} alignItems={"center"} direction={"row"}>
                <Typography>{"Build Paths"}</Typography>
                <IconButton onClick={() => setShowAddBuildPath(true)}>
                  <Add />
                </IconButton>
              </Stack>
              {showAddBuildPath && (
                <Stack gap={2} direction={"row"}>
                  <TextField
                    autoFocus
                    size="small"
                    value={newBuildPath}
                    onChange={(e) => setNewBuildPath(e.target.value)}
                  ></TextField>
                  <Button
                    onClick={() => {
                      save({
                        ...settings,
                        buildPaths: [...settings.buildPaths, newBuildPath],
                      });
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setNewBuildPath("");
                      setShowAddBuildPath(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
              <List dense>
                {settings.buildPaths.map((b) => {
                  return (
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <IconButton
                          onClick={() => {
                            save({
                              ...settings,
                              buildPaths: settings.buildPaths.filter(
                                (a) => a !== b
                              ),
                            });
                          }}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemButton>
                        <ListItemText primary={<Typography>{b}</Typography>} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            <Box>
              <Stack gap={1} alignItems={"center"} direction={"row"}>
                <Typography>{"APIs"}</Typography>
                <IconButton onClick={() => setShowAddAPI(true)}>
                  <Add />
                </IconButton>
              </Stack>
              {showAddAPI && (
                <Stack gap={2} direction={"row"}>
                  <TextField
                    autoFocus
                    size="small"
                    value={newAPI.apiId}
                    onChange={(e) =>
                      setNewAPI({
                        ...newAPI,
                        apiId: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="small"
                    value={newAPI.apiURL}
                    onChange={(e) =>
                      setNewAPI({
                        ...newAPI,
                        apiURL: e.target.value,
                      })
                    }
                  />
                  <Button
                    onClick={() => {
                      save({
                        ...settings,
                        apis: [...(settings.apis || []), newAPI],
                      });
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setNewAPI({
                        apiId: "",
                        apiURL: "",
                      });
                      setShowAddAPI(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
              <List dense>
                {(settings.apis || []).map((b) => {
                  return (
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <IconButton
                          onClick={() => {
                            save({
                              ...settings,
                              apis: settings.apis.filter(
                                (a) => a.apiId !== b.apiId
                              ),
                            });
                          }}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemButton>
                        <ListItemText
                          primary={
                            <Typography>{b.apiId + "," + b.apiURL}</Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SettingsExplorer;
