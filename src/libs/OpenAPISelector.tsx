import { Select, MenuItem, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { listDatasources } from "../services";

interface OpenAPISelectorProps {
  selectedOpenAPI: string | undefined;
  onSelect: (openAPI: string) => void;
  excludes?: string[];
}

export const OpenAPISelector = (props: OpenAPISelectorProps) => {
  const [openAPIs, setOpenAPIs] = useState<string[]>([]);

  useEffect(() => {
    listDatasources("1", setOpenAPIs, () => {});
  }, []);

  return (
    <Stack gap={2}>
      <Typography>OpenAPI</Typography>
      <Select
        labelId="actions-method-label"
        id="actions-method-select"
        value={props.selectedOpenAPI}
        onChange={(e) => {
          props.onSelect(e.target.value);
        }}
      >
        {openAPIs
          .filter((v) => !(props.excludes || []).includes(v))
          .map((a) => (
            <MenuItem value={a}>{a}</MenuItem>
          ))}
      </Select>
    </Stack>
  );
};

export default OpenAPISelector;
