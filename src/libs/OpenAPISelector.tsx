import { Select, MenuItem, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DATA_SOURCE_TYPE } from "../Constants";
import { listDatasources } from "../services";

interface OpenAPISelectorProps {
  selectedOpenAPI: string | undefined;
  onSelect: (openAPI: string) => void;
  excludes?: string[];
}

export const OpenAPISelector = (props: OpenAPISelectorProps) => {
  const [openAPIs, setOpenAPIs] = useState<string[]>([]);

  useEffect(() => {
    listDatasources(DATA_SOURCE_TYPE.OPENAPI, setOpenAPIs, () => {});
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
