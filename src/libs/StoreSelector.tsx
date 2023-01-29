import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { readStore } from "../services";
import { DATA } from "./ValueAssigner";
import PayloadMapper, { TreeNode } from "./PayloadMapper";

export interface Store {
  tree: TreeNode;
  defaultValues: Record<string, DATA>;
}

const StoreSelector = () => {
  const [store, setStore] = useState<Store>();
  const [component, setComponent] = useState("");
  const refreshStore = () => {
    readStore(setStore, () => {});
  };
  useEffect(() => {
    refreshStore();
  }, []);

  return (
    <Stack gap={2}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Component</InputLabel>
        <Select
          labelId="http-method-label"
          id="http=method-select"
          value={component}
          label="Component"
          onChange={(e) => {
            setComponent(e.target.value);
          }}
        >
          {store &&
            (store.tree.children || []).map((t) => (
              <MenuItem value={t.id}>{t.name}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <Typography>{"Props Selector"}</Typography>
      {store?.tree && component && (
        <PayloadMapper
          tree={
            (store?.tree.children || []).filter((c) => c.id === component)[0]
          }
          setTree={(tree) =>
            setStore({
              ...store,
              tree,
            })
          }
          mappedFields={{}}
          setMappedFields={() => {}}
          onlyTree
        />
      )}
    </Stack>
  );
};

export default StoreSelector;
