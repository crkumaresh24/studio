import { Box, Button, IconButton, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ValueMapper, { TreeNode } from "../../libs/ValueMapper";
import { useState } from "react";
import { DATA } from "../../libs/ValueAssigner";
import BackIcon from "@mui/icons-material/ArrowBack";

interface EditComponentProps {
  name: string;
  rootNode: TreeNode;
  onSave: (node: TreeNode) => void;
  onBack: () => void;
  defaultValues: Record<string, DATA>;
  setDefaultValues: (values: Record<string, DATA>) => void;
}

const EditComponent = (props: EditComponentProps) => {
  const [stateSpec, setStateSpec] = useState<TreeNode>(props.rootNode);
  return (
    <Box
      gap={4}
      sx={{ display: "flex", flexDirection: "column", padding: 2, flex: 1 }}
    >
      <Box gap={3} sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Button
          onClick={(e) => {
            props.onSave({
              ...stateSpec,
              name: props.name,
            });
            props.onBack();
          }}
          startIcon={<SaveIcon />}
          size="small"
          variant="contained"
        >
          Update
        </Button>
        <Typography sx={{ marginLeft: "auto", marginRight: "auto" }}>
          {props.name}
        </Typography>
      </Box>
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

export default EditComponent;
