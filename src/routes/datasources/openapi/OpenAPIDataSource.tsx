import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getRootTree,
  jsonToTree,
  oneLevelJSONToTree,
  Settings,
} from "../../../Constants";
import { parseSwaggerSpec } from "../../../libs/SwaggerParser";
import { DATA_VALUE } from "../../../libs/ValueAssigner";
import PayloadMapper, { TreeNode } from "../../../libs/PayloadMapper";

interface OpenAPIDataSourceProps {
  apiID: string;
  operationId: string;
  controllerId: string;
  headersTree: TreeNode;
  headersDefaultValues: Record<string, DATA_VALUE>;
  pathsTree: TreeNode;
  pathsDefaultValues: Record<string, DATA_VALUE>;
  paramsTree: TreeNode;
  paramsDefaultValues: Record<string, DATA_VALUE>;
  bodyTree: TreeNode;
  bodyDefaultValues: Record<string, DATA_VALUE>;
  onChange: (props: any) => void;
  settings: Settings;
  mode: "create" | "edit";
}

const OpenAPIDataSource = (props: OpenAPIDataSourceProps) => {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("header");
  const [schema, setSchema] = useState<any | undefined>();

  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setSelectedPath("");
    setSelectedTab(newValue);
  };
  const [parsedSwagger, setParsedSwagger] = useState<any>({});

  const getSchema = (
    spec: any,
    apiID: string,
    controllerId: string,
    operationId: string
  ) => {
    return apiID && controllerId && operationId
      ? ((spec[apiID] || {})[controllerId] || {})[operationId]
      : {};
  };

  useEffect(() => {
    parseSwaggerSpec(
      props.settings.apis || [],
      (parsed) => {
        setParsedSwagger(parsed);
        setSchema(
          getSchema(parsed, props.apiID, props.controllerId, props.operationId)
        );
      },
      () => {
        console.error("swagger parse error");
        setParsedSwagger({});
      }
    );
  }, []);

  useEffect(() => {
    props.onChange({
      ...props,
      schema,
    });
  }, [schema]);

  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box gap={1} sx={{ display: "flex" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">API ID</InputLabel>
          <Select
            labelId="http-method-label"
            id="http=method-select"
            value={props.apiID}
            disabled={props.mode === "edit"}
            label="API ID"
            onChange={(e) => {
              props.onChange({
                ...props,
                apiID: e.target.value,
              });
              setSchema(
                getSchema(
                  parsedSwagger,
                  e.target.value,
                  props.controllerId,
                  props.operationId
                )
              );
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
            disabled={props.mode === "edit"}
            label="Controller"
            onChange={(e) => {
              props.onChange({
                ...props,
                controllerId: e.target.value,
              });
              setSchema(
                getSchema(
                  parsedSwagger,
                  props.apiID,
                  e.target.value,
                  props.operationId
                )
              );
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
            disabled={props.mode === "edit"}
            label="Operation"
            onChange={(e) => {
              props.onChange({
                ...props,
                operationId: e.target.value,
              });
              setSchema(
                getSchema(
                  parsedSwagger,
                  props.apiID,
                  props.controllerId,
                  e.target.value
                )
              );
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
          tree={
            schema && schema["header"]
              ? oneLevelJSONToTree(schema["header"], "header")
              : getRootTree("header")
          }
          setTree={() => {}}
          selected={selectedPath}
          setSelected={setSelectedPath}
          readonly
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
          tree={
            schema && schema["path"]
              ? oneLevelJSONToTree(schema["path"], "path")
              : getRootTree("path")
          }
          setTree={() => {}}
          selected={selectedPath}
          setSelected={setSelectedPath}
          readonly
          mappedFields={props.pathsDefaultValues || {}}
          setMappedFields={(pathsDefaultValues) => {
            props.onChange({
              ...props,
              pathsDefaultValues,
            });
          }}
        />
      )}
      {selectedTab === "query" && (
        <PayloadMapper
          levels={1}
          tree={
            schema && schema["query"]
              ? oneLevelJSONToTree(schema["query"], "query")
              : getRootTree("query")
          }
          setTree={() => {}}
          selected={selectedPath}
          setSelected={setSelectedPath}
          readonly
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
          tree={
            schema
              ? jsonToTree(schema["body"], getRootTree("request"))
              : getRootTree("request")
          }
          setTree={() => {}}
          selected={selectedPath}
          setSelected={setSelectedPath}
          readonly
          mappedFields={props.bodyDefaultValues || {}}
          setMappedFields={(bodyDefaultValues) => {
            props.onChange({
              ...props,
              bodyDefaultValues,
              bodyTree: schema
                ? jsonToTree(schema["body"], getRootTree("request"))
                : getRootTree("request"),
            });
          }}
        />
      )}
    </Box>
  );
};

export default OpenAPIDataSource;
