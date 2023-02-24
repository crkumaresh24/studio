import { OpenInNew } from "@mui/icons-material";
import { Select, MenuItem, Stack, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { listActions } from "../services";

interface ActionsSelectorProps {
  selectedAction: string | undefined;
  onSelect: (actionName: string) => void;
  excludes?: string[];
}

export const ActionsSelector = (props: ActionsSelectorProps) => {
  const [actions, setActions] = useState<string[]>([]);

  useEffect(() => {
    listActions(setActions, () => {});
  }, []);

  return (
    <Stack gap={2}>
      <Stack gap={1} alignItems={"center"} direction={"row"}>
        <Typography>Action</Typography>
        <IconButton
          disabled={!props.selectedAction}
          onClick={() => {
            window.open("/designer?action=" + props.selectedAction, "_blank");
          }}
          size="small"
        >
          <OpenInNew />
        </IconButton>
      </Stack>
      <Select
        labelId="actions-method-label"
        id="actions-method-select"
        value={props.selectedAction}
        onChange={(e) => {
          props.onSelect(e.target.value);
        }}
      >
        {actions
          .filter((v) => !(props.excludes || []).includes(v))
          .map((a) => (
            <MenuItem value={a}>{a}</MenuItem>
          ))}
      </Select>
    </Stack>
  );
};

export default ActionsSelector;
