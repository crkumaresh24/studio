import { Select, MenuItem, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DATA_SOURCE_TYPE } from "../Constants";
import { listDatasources } from "../services";

interface HTTPSelectorProps {
  selectedHTTP: string | undefined;
  onSelect: (httpName: string) => void;
  excludes?: string[];
}

export const HTTPSelector = (props: HTTPSelectorProps) => {
  const [https, setHTTPs] = useState<string[]>([]);

  useEffect(() => {
    listDatasources(DATA_SOURCE_TYPE.HTTP, setHTTPs, () => {});
  }, []);

  return (
    <Stack gap={2}>
      <Typography>HTTP</Typography>
      <Select
        labelId="actions-method-label"
        id="actions-method-select"
        value={props.selectedHTTP}
        onChange={(e) => {
          props.onSelect(e.target.value);
        }}
      >
        {https
          .filter((v) => !(props.excludes || []).includes(v))
          .map((a) => (
            <MenuItem value={a}>{a}</MenuItem>
          ))}
      </Select>
    </Stack>
  );
};

export default HTTPSelector;
