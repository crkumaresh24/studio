import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { rootTree } from "../../Constants";
import { DATA } from "../../libs/ValueAssigner";
import PayloadMapper, { TreeNode } from "../../libs/PayloadMapper";

interface HTTPDataSourceProps {
  method: string;
  url: string;
  headersTree: TreeNode;
  headersDefaultValues: Record<string, DATA>;
  pathsTree: TreeNode;
  pathsDefaultValues: Record<string, DATA>;
  paramsTree: TreeNode;
  paramsDefaultValues: Record<string, DATA>;
  bodyTree: TreeNode;
  bodyDefaultValues: Record<string, DATA>;
  onChange: (props: any) => void;
}

const HTTPDataSource = (props: HTTPDataSourceProps) => {
  const [selectedTab, setSelectedTab] = useState("header");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box gap={2} sx={{ display: "flex" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Method</InputLabel>
          <Select
            labelId="http-method-label"
            id="http=method-select"
            value={props.method || "get"}
            label="Method"
            onChange={(e) => {
              props.onChange({
                ...props,
                method: e.target.value,
              });
            }}
          >
            <MenuItem value={"get"}>GET</MenuItem>
            <MenuItem value={"post"}>POST</MenuItem>
            <MenuItem value={"put"}>PUT</MenuItem>
            <MenuItem value={"delete"}>DELETE</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          autoFocus
          label={"URL"}
          placeholder={"http://localhost"}
          value={props.url || "http://"}
          onChange={(e) => {
            props.onChange({
              ...props,
              url: e.target.value,
            });
          }}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="header" label="Headers" />
          <Tab value="path" label="Path" />
          <Tab value="query" label="Query Params" />
          <Tab value="body" label="Request Body" />
        </Tabs>
      </Box>
      {selectedTab === "header" && (
        <PayloadMapper
          levels={1}
          tree={props.headersTree || rootTree}
          setTree={(headersTree) => {
            props.onChange({
              ...props,
              headersTree,
            });
          }}
          mappedFields={props.headersDefaultValues || {}}
          setMappedFields={(headersDefaultValues) => {
            props.onChange({
              ...props,
              headersDefaultValues,
            });
          }}
        />
      )}
      {selectedTab === "path" && (
        <PayloadMapper
          levels={1}
          tree={props.pathsTree || rootTree}
          setTree={(pathsTree) => {
            props.onChange({
              ...props,
              pathsTree,
            });
          }}
          mappedFields={props.paramsDefaultValues || {}}
          setMappedFields={(paramsDefaultValues) => {
            props.onChange({
              ...props,
              paramsDefaultValues,
            });
          }}
        />
      )}
      {selectedTab === "query" && (
        <PayloadMapper
          levels={1}
          tree={props.paramsTree || rootTree}
          setTree={(paramsTree) => {
            props.onChange({
              ...props,
              paramsTree,
            });
          }}
          mappedFields={props.paramsDefaultValues || {}}
          setMappedFields={(paramsDefaultValues) => {
            props.onChange({
              ...props,
              paramsDefaultValues,
            });
          }}
        />
      )}
      {selectedTab === "body" && (
        <PayloadMapper
          tree={props.bodyTree || rootTree}
          setTree={(bodyTree) => {
            props.onChange({
              ...props,
              bodyTree,
            });
          }}
          mappedFields={props.bodyDefaultValues || {}}
          setMappedFields={(bodyDefaultValues) => {
            props.onChange({
              ...props,
              bodyDefaultValues,
            });
          }}
        />
      )}
    </Box>
  );
};

export default HTTPDataSource;
