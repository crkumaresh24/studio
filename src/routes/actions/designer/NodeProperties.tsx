import { ContentCopy } from "@mui/icons-material";
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Node } from "reactflow";
import ActionsSelector from "../../../libs/ActionsSelector";
import ConstantValueAddition from "../../../libs/ConstantValueAddition";
import HTTPSelector from "../../../libs/HTTPSelector";
import OpenAPISelector from "../../../libs/OpenAPISelector";
import OpenQuerySelector from "../../../libs/OpenQuerySelector";
import StoreSelector from "../../../libs/StoreSelector";
import StringListAddition from "../../../libs/StringListAddition";
import ValueAssigner, { DATA_TYPE } from "../../../libs/ValueAssigner";

interface BaseNodePropertiesProps {
  actionName: string;
  node: Node;
  onNodeChange: (node: Node) => void;
}

interface TextAttributeProps {
  label: string;
  placeholder?: string;
  readonly?: boolean;
  rows?: number;
  value?: string;
  onValueChange?: (newValue: string) => void;
  showCopyClipboard?: boolean;
  type?: string;
}

const TextAttribute = (props: TextAttributeProps) => {
  return (
    <Stack gap={1}>
      <Stack alignItems={"center"} gap={1} direction={"row"}>
        <Typography>{props.label}</Typography>
        {props.showCopyClipboard && (
          <IconButton size="small">
            <ContentCopy />
          </IconButton>
        )}
      </Stack>
      <TextField
        placeholder={props.placeholder}
        multiline={props.rows ? props.rows > 1 : false}
        type={props.type || "text"}
        rows={props.rows}
        value={props.value}
        onChange={(e) => {
          !props.readonly &&
            props.onValueChange &&
            props.onValueChange(e.target.value);
        }}
      />
    </Stack>
  );
};

interface ComponentSelectorAttributeProps {
  label: string;
  showCopyClipboard?: boolean;
  value?: any;
  onValueChange?: (newValue: any) => void;
}

const ComponentSelectorAttribute = (props: ComponentSelectorAttributeProps) => {
  return (
    <Stack gap={2}>
      <Stack alignItems={"center"} gap={1} direction={"row"}>
        <Typography>{props.label}</Typography>
        {props.showCopyClipboard && (
          <IconButton size="small">
            <ContentCopy />
          </IconButton>
        )}
      </Stack>
      <StoreSelector
        name={(props.value || {}).name || ""}
        onNameChange={(name) => {
          props.onValueChange &&
            props.onValueChange({
              ...(props.value || {}),
              name,
            });
        }}
        path={(props.value || {}).path || ""}
        onPathChange={(path) => {
          props.onValueChange &&
            props.onValueChange({
              ...(props.value || {}),
              path,
            });
        }}
      />
    </Stack>
  );
};

interface NodeAttibute {
  key: string;
  label: string;
  type: DATA_TYPE;
  rows?: number;
  enableCopyclipboard?: boolean;
  prop: string;
  requiredTypes?: DATA_TYPE[];
}

const NodeProperties = (props: BaseNodePropertiesProps) => {
  const setNodeProp = (key: string, value?: any) => {
    props.onNodeChange({
      ...props.node,
      data: {
        ...(props.node.data || {}),
        props: {
          ...(props.node.data.props || {}),
          [key]: value,
        },
      },
    });
  };

  return (
    <Stack gap={2} padding={2}>
      <TextAttribute
        label="Action Id"
        value={props.node.id}
        showCopyClipboard
        readonly
      />
      {(props.node.data.attributes || []).map((nodeAttribute: NodeAttibute) => {
        if (nodeAttribute.type === "string") {
          return (
            <TextAttribute
              key={props.node.id}
              label={nodeAttribute.label}
              rows={nodeAttribute.rows}
              showCopyClipboard={nodeAttribute.enableCopyclipboard}
              value={props.node.data.props[nodeAttribute.prop || "value"]}
              onValueChange={(value) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "number") {
          return (
            <TextAttribute
              key={props.node.id}
              label={nodeAttribute.label}
              type="number"
              rows={nodeAttribute.rows}
              showCopyClipboard={nodeAttribute.enableCopyclipboard}
              value={props.node.data.props[nodeAttribute.prop || "value"]}
              onValueChange={(value) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "boolean") {
          return (
            <FormControlLabel
              sx={{ alignItems: "flex-start", margin: 0 }}
              control={
                <Switch
                  checked={props.node.data.props[nodeAttribute.prop || "value"]}
                  onChange={(e, value) => {
                    setNodeProp(nodeAttribute.prop || "value", value);
                  }}
                />
              }
              label={nodeAttribute.label}
              labelPlacement="top"
            />
          );
        }
        if (nodeAttribute.type === "constant") {
          return (
            <ConstantValueAddition
              key={props.node.id}
              value={
                props.node.data.props[nodeAttribute.prop || "value"] || {
                  type: "string",
                  value: "",
                }
              }
              isConstant={
                props.node.data.props[nodeAttribute.prop || "isConstant"] ||
                false
              }
              onChange={(isConstant, value) => {
                setNodeProp(nodeAttribute.prop || "isConstant", isConstant);
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "store") {
          return (
            <ComponentSelectorAttribute
              key={props.node.id}
              label={nodeAttribute.label}
              showCopyClipboard={nodeAttribute.enableCopyclipboard}
              value={props.node.data.props[nodeAttribute.prop || "value"]}
              onValueChange={(value) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "action") {
          return (
            <ActionsSelector
              key={props.node.id}
              excludes={[props.actionName]}
              selectedAction={
                props.node.data.props[nodeAttribute.prop || "value"]
              }
              onSelect={(value: string) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "http") {
          return (
            <HTTPSelector
              key={props.node.id}
              selectedHTTP={
                props.node.data.props[nodeAttribute.prop || "value"]
              }
              onSelect={(value: string) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "openapi") {
          return (
            <OpenAPISelector
              key={props.node.id}
              selectedOpenAPI={
                props.node.data.props[nodeAttribute.prop || "value"]
              }
              onSelect={(value: string) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "openquery") {
          return (
            <OpenQuerySelector
              key={props.node.id}
              selectedOpenQuery={
                props.node.data.props[nodeAttribute.prop || "value"]
              }
              onSelect={(value: string) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "stringList") {
          return (
            <StringListAddition
              title={nodeAttribute.label}
              list={props.node.data.props[nodeAttribute.prop || "value"]}
              onListChange={(value) => {
                setNodeProp(nodeAttribute.prop || "value", value);
              }}
            />
          );
        }
        if (nodeAttribute.type === "sortType") {
          return (
            <Stack>
              <Typography variant="subtitle1">Sort</Typography>
              <RadioGroup
                row
                aria-labelledby="sortType-value-selection"
                name="sortType-value-selection-group"
                value={props.node.data.props[nodeAttribute.prop || "value"]}
                onChange={(e, value) => {
                  setNodeProp(nodeAttribute.prop || "value", value);
                }}
              >
                <FormControlLabel value="asc" control={<Radio />} label="Asc" />
                <FormControlLabel
                  value="desc"
                  control={<Radio />}
                  label="Desc"
                />
              </RadioGroup>
            </Stack>
          );
        }
        if (nodeAttribute.type === "valueAssigner") {
          return (
            <Stack>
              <Typography variant="subtitle1">Value</Typography>
              <ValueAssigner
                data={
                  props.node.data.props[nodeAttribute.prop || "value"] || {
                    type: "string",
                    value: "",
                  }
                }
                onDataChange={(value) => {
                  setNodeProp(nodeAttribute.prop || "value", value);
                }}
                requiredTypes={
                  nodeAttribute.requiredTypes || [
                    "store",
                    "string",
                    "boolean",
                    "number",
                  ]
                }
              />
            </Stack>
          );
        }
        return <></>;
      })}
    </Stack>
  );
};

export default NodeProperties;
