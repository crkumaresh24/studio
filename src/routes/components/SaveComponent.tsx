import { Box, Button, IconButton, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PayloadMapper from "../../libs/PayloadMapper";
import { useState } from "react";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Component } from "./ComponentsExplorer";

interface SaveComponentProps {
  name: string;
  component: Component;
  onSave: (name: string, component: Component) => void;
  onBack: () => void;
}

const SaveComponent = (props: SaveComponentProps) => {
  const [name, setName] = useState<string>(props.name);
  const [component, setComponent] = useState<Component>(props.component);
  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box gap={3} sx={{ display: "flex" }}>
        <IconButton onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Button
          onClick={(e) => {
            if (name) {
              props.onSave(name, component);
              props.onBack();
            }
          }}
          startIcon={<SaveIcon />}
          size="small"
          variant="contained"
        >
          Save
        </Button>
      </Box>
      <TextField
        variant="outlined"
        label="Name"
        placeholder="component name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <PayloadMapper
        onlyLeafSelection
        tree={component.tree}
        setTree={(tree) =>
          setComponent({
            ...component,
            tree,
          })
        }
        mappedFields={component.defaultValues}
        setMappedFields={(defaultValues) =>
          setComponent({
            ...component,
            defaultValues,
          })
        }
      />
    </Box>
  );
};

export default SaveComponent;
