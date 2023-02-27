import { OpenInNew } from "@mui/icons-material";
import { Select, MenuItem, Stack, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { listDatasources } from "../services";

interface HTTPSelectorProps {
  selectedHTTP: string | undefined;
  onSelect: (httpName: string) => void;
  excludes?: string[];
}

export const HTTPSelector = (props: HTTPSelectorProps) => {
  const [https, setHTTPs] = useState<string[]>([]);

  useEffect(() => {
    listDatasources("0", setHTTPs, () => {});
  }, []);

  return (
    <Stack gap={2}>
      <Stack gap={1} alignItems={"center"} direction={"row"}>
        <Typography>HTTP</Typography>
        <IconButton
          disabled={!props.selectedHTTP}
          onClick={() => {
            window.open("/?type=0&service=" + props.selectedHTTP, "_blank");
          }}
          size="small"
        >
          <OpenInNew />
        </IconButton>
      </Stack>
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
