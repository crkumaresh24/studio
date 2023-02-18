import {
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Settings, SnackMessage } from "../../Constants";
import MuiAlert from "@mui/material/Alert";
import KeyValueAddition from "../../libs/KeyValueAddition";
import { readSettings, saveSettings } from "../../services";
import SaveIcon from "@mui/icons-material/Save";

const SettingsPage = () => {
  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();
  const [loadedSettings, setLoadedSettings] = useState<Settings>();
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    buildPaths: [],
    apis: [],
    queries: [],
  });

  const refresh = () => {
    readSettings(
      (s) => {
        setLoadedSettings(s);
        setSettings(s);
      },
      () => {}
    );
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
    <Stack sx={{ maxWidth: "60%", margin: "auto" }}>
      <Paper sx={{ minHeight: "calc(100vh - 64px)", padding: 3 }}>
        <Stack gap={2}>
          <Stack direction={"row"}>
            <Typography sx={{ flex: 1 }} variant="overline">
              Settings
            </Typography>
            <Button
              onClick={(e) => {
                saveSettings(
                  settings,
                  () => {
                    setSnackMessage({
                      message: "settings saved",
                      severity: "success",
                    });
                    if (
                      loadedSettings &&
                      (loadedSettings.theme !== settings.theme ||
                        loadedSettings.buildPaths !== settings.buildPaths)
                    ) {
                      window.location.reload();
                    } else {
                      refresh();
                    }
                  },
                  (e) => {
                    setSnackMessage({
                      message: e.message,
                      severity: "error",
                    });
                  }
                );
              }}
              startIcon={<SaveIcon />}
              size="small"
              variant="contained"
            >
              Save Changes
            </Button>
          </Stack>
          <Stack gap={2}>
            <Stack>
              <Typography variant="subtitle1">Theme</Typography>
              <RadioGroup
                row
                aria-labelledby="value-selection"
                name="value-selection-group"
                value={settings.theme || "dark"}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    theme: e.target.value,
                  });
                }}
              >
                <FormControlLabel
                  value="dark"
                  control={<Radio />}
                  label="Dark"
                />
                <FormControlLabel
                  value="light"
                  control={<Radio />}
                  label="Light"
                />
              </RadioGroup>
            </Stack>

            <KeyValueAddition
              title="Publish Paths"
              onlyKey
              list={settings.buildPaths}
              onListChange={(list) => {
                setSettings({
                  ...settings,
                  buildPaths: list,
                });
              }}
            />

            <KeyValueAddition
              title="OpenAPI Instances"
              list={settings.apis}
              onListChange={(list) => {
                setSettings({
                  ...settings,
                  apis: list,
                });
              }}
            />

            <KeyValueAddition
              title="OpenQuery Instances"
              list={settings.queries}
              onListChange={(list) => {
                setSettings({
                  ...settings,
                  queries: list,
                });
              }}
            />
          </Stack>
        </Stack>
      </Paper>
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

export default SettingsPage;
