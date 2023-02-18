import { Select, MenuItem, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DATA_SOURCE_TYPE } from "../Constants";
import { listDatasources } from "../services";

interface OpenQuerySelectorProps {
  selectedOpenQuery: string | undefined;
  onSelect: (httpName: string) => void;
  excludes?: string[];
}

export const OpenQuerySelector = (props: OpenQuerySelectorProps) => {
  const [openQuries, setOpenQueries] = useState<string[]>([]);

  useEffect(() => {
    listDatasources(DATA_SOURCE_TYPE.OPENQUERY, setOpenQueries, () => {});
  }, []);

  return (
    <Stack gap={2}>
      <Typography>OpenQuery</Typography>
      <Select
        labelId="actions-method-label"
        id="actions-method-select"
        value={props.selectedOpenQuery}
        onChange={(e) => {
          props.onSelect(e.target.value);
        }}
      >
        {openQuries
          .filter((v) => !(props.excludes || []).includes(v))
          .map((a) => (
            <MenuItem value={a}>{a}</MenuItem>
          ))}
      </Select>
    </Stack>
  );
};

export default OpenQuerySelector;
