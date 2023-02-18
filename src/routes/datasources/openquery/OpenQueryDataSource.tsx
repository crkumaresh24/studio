import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { getRootTree, Settings } from "../../../Constants";
import { DATA_VALUE } from "../../../libs/ValueAssigner";
import PayloadMapper, { TreeNode } from "../../../libs/PayloadMapper";
import { useState } from "react";

interface OpenQueryDataSourceProps {
  queryId: string;
  queryTxt: string;
  tree: TreeNode;
  defaultValues: Record<string, DATA_VALUE>;
  setDefaultValues: (values: Record<string, DATA_VALUE>) => void;
  settings: Settings;
  mode: "create" | "edit";
  onChange: (props: any) => void;
}

const OpenQueryDataSource = (props: OpenQueryDataSourceProps) => {
  const [selectedPath, setSelectedPath] = useState<string>("");
  return (
    <Stack gap={4} direction="column">
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Query ID</InputLabel>
        <Select
          labelId="query-id-label"
          id="query-id-select"
          value={props.queryId}
          label="Query ID"
          onChange={(e) => {
            props.onChange({
              ...props,
              queryId: e.target.value,
            });
          }}
        >
          {(props.settings.queries || []).map((entry) => (
            <MenuItem key={entry.key} value={entry.key}>{entry.key}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label={"Query"}
        placeholder={"sql query text"}
        multiline
        value={props.queryTxt}
        onChange={(e) => {
          props.onChange({
            ...props,
            queryTxt: e.target.value,
          });
        }}
        rows={9}
      />
      <PayloadMapper
        levels={1}
        tree={props.tree || getRootTree("params")}
        setTree={(tree) => {
          props.onChange({
            ...props,
            tree,
          });
        }}
        selected={selectedPath}
        setSelected={setSelectedPath}
        mappedFields={props.defaultValues || {}}
        setMappedFields={(defaultValues) => {
          props.onChange({
            ...props,
            defaultValues,
          });
        }}
      />
    </Stack>
  );
};

export default OpenQueryDataSource;
