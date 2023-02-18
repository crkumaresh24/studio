import { ContentCopy } from "@mui/icons-material";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { Node } from "reactflow";
import ActionsSelector from "../../../libs/ActionsSelector";
import HTTPSelector from "../../../libs/HTTPSelector";
import OpenAPISelector from "../../../libs/OpenAPISelector";
import OpenQuerySelector from "../../../libs/OpenQuerySelector";
import StoreSelector from "../../../libs/StoreSelector";
import { DATA_TYPE } from "../../../libs/ValueAssigner";

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
}

const NodeProperties = (props: BaseNodePropertiesProps) => {
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
            />
          );
        }
        if (nodeAttribute.type === "store") {
          return (
            <ComponentSelectorAttribute
              key={props.node.id}
              label={nodeAttribute.label}
              showCopyClipboard={nodeAttribute.enableCopyclipboard}
              value={props.node.data.value}
              onValueChange={(value) => {
                props.onNodeChange({
                  ...props.node,
                  data: {
                    ...props.node.data,
                    value,
                  },
                });
              }}
            />
          );
        }
        if (nodeAttribute.type === "action") {
          return (
            <ActionsSelector
              key={props.node.id}
              excludes={[props.actionName]}
              selectedAction={undefined}
              onSelect={(actionName: string) => {}}
            />
          );
        }
        if (nodeAttribute.type === "http") {
          return (
            <HTTPSelector
              key={props.node.id}
              selectedHTTP=""
              onSelect={() => {}}
            />
          );
        }
        if (nodeAttribute.type === "openapi") {
          return (
            <OpenAPISelector
              key={props.node.id}
              selectedOpenAPI=""
              onSelect={() => {}}
            />
          );
        }
        if (nodeAttribute.type === "openquery") {
          return (
            <OpenQuerySelector
              key={props.node.id}
              selectedOpenQuery=""
              onSelect={() => {}}
            />
          );
        }
        return <></>;
      })}
    </Stack>
  );
};

export default NodeProperties;
