import { IconButton, MenuItem, Select, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { listComponents, readComponent } from "../services";
import { DATA_VALUE } from "./ValueAssigner";
import PayloadMapper, { TreeNode } from "./PayloadMapper";
import { OpenInNew, Refresh } from "@mui/icons-material";

export interface Store {
  tree: TreeNode;
  defaultValues: Record<string, DATA_VALUE>;
}

interface StoreSelectorProps {
  name: string;
  onNameChange: (name: string) => void;
  path: string;
  onPathChange: (path: string) => void;
}

const StoreSelector = (props: StoreSelectorProps) => {
  const [tree, setTree] = useState<TreeNode>();
  const [containers, setContainers] = useState<string[]>([]);

  const refreshContainers = () => {
    listComponents(setContainers, () => {});
  };

  const refreshProps = () => {
    if (props.name) {
      readComponent(
        props.name,
        (c) => {
          setTree(c.tree);
        },
        () => {}
      );
    }
  };

  useEffect(() => {
    refreshContainers();
    refreshProps();
  }, [props.name]);

  return (
    <Stack gap={2}>
      <Stack gap={1} alignItems={"center"} direction={"row"}>
        <Typography>Component</Typography>
        <IconButton
          disabled={!props.name}
          onClick={() => {
            window.open("/components?name=" + props.name, "_blank");
          }}
          size="small"
        >
          <OpenInNew />
        </IconButton>
      </Stack>
      <Select
        labelId="component-slector"
        id="component-slector-id"
        value={props.name || ""}
        onChange={(e) => {
          if (e.target.value) {
            readComponent(
              e.target.value,
              (c) => {
                setTree(c.tree);
                props.onNameChange(e.target.value);
              },
              () => {}
            );
          }
        }}
      >
        {containers.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>
      <Stack gap={1} alignItems={"center"} direction={"row"}>
        <Typography>Property</Typography>
        <IconButton
          sx={{ marginRight: 2 }}
          onClick={() => {
            refreshProps();
          }}
          size="small"
        >
          <Refresh />
        </IconButton>
      </Stack>
      <Stack padding={1} minHeight={200} sx={{ border: "1px solid dimgrey" }}>
        {tree && props.name && (
          <PayloadMapper
            readonly
            tree={tree}
            setTree={setTree}
            selected={props.path}
            setSelected={props.onPathChange}
            mappedFields={{}}
            setMappedFields={() => {}}
            onlyTree
          />
        )}
      </Stack>
    </Stack>
  );
};

export default StoreSelector;
