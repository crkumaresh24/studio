import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PayloadMapper from "../../libs/PayloadMapper";
import { useState } from "react";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Component } from "./ComponentsExplorer";

interface SaveComponentProps {
  mode: "create" | "edit" | "list";
  name: string;
  setName: (name: string) => void;
  component: Component;
  onSave: (component: Component) => void;
  onBack: () => void;
}

const SaveComponent = (props: SaveComponentProps) => {
  const [component, setComponent] = useState<Component>(props.component);
  const [selectedPath, setSelectedPath] = useState<string>("");
  return (
    <Stack gap={4}>
      <Stack gap={2} direction="row">
        <IconButton size="small" onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ margin: "auto" }}>
          {props.mode === "edit" ? props.name : ""}
        </Typography>
        <Button
          onClick={(e) => {
            props.onSave(component);
          }}
          startIcon={<SaveIcon />}
          size="small"
          variant="contained"
        >
          Save Changes
        </Button>
      </Stack>
      {props.mode === "create" && (
        <TextField
          autoFocus
          label={"Component Name"}
          placeholder={"component name"}
          variant="outlined"
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
        />
      )}
      <PayloadMapper
        onlyLeafSelection
        tree={component.tree}
        setTree={(tree) =>
          setComponent({
            ...component,
            tree,
          })
        }
        selected={selectedPath}
        setSelected={setSelectedPath}
        mappedFields={component.defaultValues}
        setMappedFields={(defaultValues) =>
          setComponent({
            ...component,
            defaultValues,
          })
        }
        requiredTypes={["json", "string", "boolean", "number"]}
      />
    </Stack>
  );
};

export default SaveComponent;
