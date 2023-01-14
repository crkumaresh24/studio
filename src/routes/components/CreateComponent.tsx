import { Box, Button, IconButton, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ValueMapper, { TreeNode } from "../../libs/ValueMapper";
import { useState } from "react";
import { DATA } from "../../libs/ValueAssigner";
import BackIcon from "@mui/icons-material/ArrowBack";

export interface Component {
  name: string;
  stateSpec: TreeNode[];
  defaultValues: Record<string, DATA>;
}

interface CreateComponentProps {
  rootNode: TreeNode;
  onSave: (node: TreeNode) => void;
  onBack: () => void;
  defaultValues: Record<string, DATA>;
  setDefaultValues: (values: Record<string, DATA>) => void;
}

const CreateComponent = (props: CreateComponentProps) => {
  const [name, setName] = useState<string>("");
  const [stateSpec, setStateSpec] = useState<TreeNode>(props.rootNode);
  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box gap={3} sx={{ display: "flex" }}>
        <IconButton onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Button
          onClick={(e) => {
            props.onSave({
              ...stateSpec,
              name,
            });
            props.onBack();
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
      <ValueMapper
        title="State"
        onlyLeafSelection
        store={stateSpec}
        setStore={setStateSpec}
        mappedFields={props.defaultValues}
        setMappedFields={props.setDefaultValues}
      />
    </Box>
  );
};

export default CreateComponent;
