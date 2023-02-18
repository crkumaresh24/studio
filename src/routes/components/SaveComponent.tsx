import {
  Box,
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
  mode: "create" | "edit";
  name: string;
  component: Component;
  onSave: (name: string, component: Component) => void;
  onBack: () => void;
}

const SaveComponent = (props: SaveComponentProps) => {
  const [name, setName] = useState<string>(props.name);
  const [component, setComponent] = useState<Component>(props.component);
  const [selectedPath, setSelectedPath] = useState<string>("");
  return (
    <Stack gap={4}>
      <Stack gap={2} direction="row">
        <IconButton size="small" onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Typography sx={{ margin: "auto" }}>
          {props.mode === "edit" ? props.name : ""}
        </Typography>
        <Button
          onClick={(e) => {
            props.onSave(name, component);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      />
    </Stack>
  );
};

export default SaveComponent;
