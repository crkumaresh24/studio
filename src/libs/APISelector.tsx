import { Select, MenuItem, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { KeyValueEntry, Settings } from "../Constants";
import { readSettings } from "../services";

interface APISelectorProps {
  selectedAPI: KeyValueEntry | undefined;
  onSelect: (api: KeyValueEntry) => void;
  excludes?: string[];
}

export const APISelector = (props: APISelectorProps) => {
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    buildPaths: [],
    apis: [],
    queries: [],
  });

  const refresh = () => {
    readSettings(setSettings, () => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Stack gap={2}>
      <Typography>Instance</Typography>
      <Select
        labelId="actions-method-label"
        id="actions-method-select"
        value={props.selectedAPI?.key}
        onChange={(e) => {
          props.onSelect(
            settings.apis.filter((a) => a.key === e.target.value)[0]
          );
        }}
      >
        {(settings.apis || [])
          .filter((v) => !(props.excludes || []).includes(v.key))
          .map((a) => (
            <MenuItem value={a.key}>{a.key}</MenuItem>
          ))}
      </Select>
    </Stack>
  );
};

export default APISelector;
