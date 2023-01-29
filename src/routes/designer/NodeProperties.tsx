import { ContentCopy } from "@mui/icons-material";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { Node } from "reactflow";
import StoreSelector from "../../libs/StoreSelector";
import { DATA_TYPE } from "../../libs/ValueAssigner";

interface BaseNodePropertiesProps {
  node: Node;
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
      <StoreSelector />
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
              label={nodeAttribute.label}
              rows={nodeAttribute.rows}
              showCopyClipboard={nodeAttribute.enableCopyclipboard}
            />
          );
        }
        if (nodeAttribute.type === "store") {
          return (
            <ComponentSelectorAttribute
              label={nodeAttribute.label}
              showCopyClipboard={nodeAttribute.enableCopyclipboard}
            />
          );
        }
        return <></>;
      })}
    </Stack>
  );
};

export default NodeProperties;
