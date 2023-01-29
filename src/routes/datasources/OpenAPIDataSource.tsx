import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { rootTree } from "../../Constants";
import { parseSwaggerSpec } from "../../libs/SwaggerParser";
import { DATA } from "../../libs/ValueAssigner";
import PayloadMapper, { TreeNode } from "../../libs/PayloadMapper";

interface OpenAPIDataSourceProps {
  apiID: string;
  operationId: string;
  controllerId: string;
  tree: TreeNode;
  defaultValues: Record<string, DATA>;
  onChange: (props: any) => void;
}

const OpenAPIDataSource = (props: OpenAPIDataSourceProps) => {
  const [parsedSwagger, setParsedSwagger] = useState<any>({});
  useEffect(() => {
    parseSwaggerSpec(
      [
        {
          apiId: "test1",
          apiURL: "http://localhost:9091/v2/api-docs",
        },
      ],
      setParsedSwagger,
      () => {
        console.error("swagger parse error");
        setParsedSwagger({});
      }
    );
  }, []);

  console.log(parseSwaggerSpec);

  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box gap={2} sx={{ display: "flex" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">API ID</InputLabel>
          <Select
            labelId="http-method-label"
            id="http=method-select"
            value={props.apiID}
            label="API ID"
            onChange={(e) => {
              props.onChange({
                ...props,
                apiID: e.target.value,
              });
            }}
          >
            {(Object.keys(parsedSwagger) || []).map((apiId) => (
              <MenuItem value={apiId}>{apiId}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Controller
          </InputLabel>
          <Select
            labelId="http-method-label"
            id="http=method-select"
            value={props.controllerId}
            label="Controller"
            onChange={(e) => {
              props.onChange({
                ...props,
                controllerId: e.target.value,
              });
            }}
          >
            {(
              Object.keys(
                props.apiID ? parsedSwagger[props.apiID] || [] || {} : []
              ) || []
            ).map((controller) => (
              <MenuItem value={controller}>{controller}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Operation
          </InputLabel>
          <Select
            labelId="http-method-label"
            id="http=method-select"
            value={props.operationId}
            label="Operation"
            onChange={(e) => {
              props.onChange({
                ...props,
                operationId: e.target.value,
              });
            }}
          >
            {(
              Object.keys(
                props.apiID && props.controllerId
                  ? (parsedSwagger[props.apiID] || {})[props.controllerId] || []
                  : []
              ) || []
            ).map((operation) => (
              <MenuItem value={operation}>{operation}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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

export default OpenAPIDataSource;
