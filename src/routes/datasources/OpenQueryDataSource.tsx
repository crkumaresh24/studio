import { Box, TextField } from "@mui/material";
import { rootTree } from "../../Constants";
import { DATA } from "../../libs/ValueAssigner";
import PayloadMapper, { TreeNode } from "../../libs/PayloadMapper";

interface OpenQueryDataSourceProps {
  queryTxt: string;
  tree: TreeNode;
  defaultValues: Record<string, DATA>;
  setDefaultValues: (values: Record<string, DATA>) => void;
  onChange: (props: any) => void;
}

const OpenQueryDataSource = (props: OpenQueryDataSourceProps) => {
  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
        tree={props.tree || rootTree}
        setTree={(tree) => {
          props.onChange({
            ...props,
            tree,
          });
        }}
        mappedFields={props.defaultValues || {}}
        setMappedFields={(defaultValues) => {
          props.onChange({
            ...props,
            defaultValues,
          });
        }}
      />
    </Box>
  );
};

export default OpenQueryDataSource;
