import { MenuItem, Select, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { listComponents, readComponent } from "../services";
import { DATA_VALUE } from "./ValueAssigner";
import PayloadMapper, { TreeNode } from "./PayloadMapper";

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

  useEffect(() => {
    refreshContainers();
    if (props.name) {
      readComponent(
        props.name,
        (c) => {
          setTree(c.tree);
        },
        () => {}
      );
    }
  }, [props.name]);

  return (
    <Stack gap={2}>
      <Typography>{"Component"}</Typography>
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
      <Typography>{"Property"}</Typography>
      <Stack padding={1} minHeight={200} sx={{ border: "1px solid dimgrey" }}>
        {tree && props.name && (
          <PayloadMapper
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
