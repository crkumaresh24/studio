import { Refresh } from "@mui/icons-material";
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import JsonEditor from "./JsonEditor";
import StoreSelector from "./StoreSelector";

export type DATA_TYPE =
  | "string"
  | "stringList"
  | "number"
  | "boolean"
  | "json"
  | "store"
  | "context"
  | "action"
  | "http"
  | "openapi"
  | "openquery"
  | "sortType"
  | "constant"
  | "valueAssigner";

export interface DATA_VALUE {
  type: DATA_TYPE;
  value: any | undefined;
}

interface ValueAssignerProps {
  data: DATA_VALUE;
  onDataChange: (data: DATA_VALUE) => void;
  requiredTypes: DATA_TYPE[];
}

const ValueAssigner = (props: ValueAssignerProps) => {
  let changedContent: any | undefined;
  const [refershTime, setRefreshTime] = useState(new Date().getTime());
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = (event.target as HTMLInputElement).value as DATA_TYPE;
    type === "boolean"
      ? props.onDataChange({
          type,
          value: "true",
        })
      : props.onDataChange({ type, value: undefined });
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onDataChange({
      ...props.data,
      value: (event.target as HTMLInputElement).value || "",
    });
  };

  const { type } = props.data;

  useEffect(() => {
    return () => {
      if (type === "json" && changedContent) {
        props.onDataChange({
          ...props.data,
          value: changedContent,
        });
      }
    };
  }, []);

  const setJson = () => {
    if (type === "json" && changedContent) {
      try {
        console.log(changedContent);
        props.onDataChange({
          ...props.data,
          value: changedContent,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Stack key={refershTime} gap={3}>
      <RadioGroup
        row
        aria-labelledby="value-selection"
        name="value-selection-group"
        value={type}
        onChange={handleTypeChange}
      >
        <IconButton
          sx={{ marginRight: 2 }}
          onClick={() => {
            setRefreshTime(new Date().getTime());
          }}
          size="small"
        >
          <Refresh />
        </IconButton>
        {props.requiredTypes.includes("json") && (
          <FormControlLabel value="json" control={<Radio />} label="JSON" />
        )}
        {props.requiredTypes.includes("store") && (
          <FormControlLabel value="store" control={<Radio />} label="Store" />
        )}
        {props.requiredTypes.includes("string") && (
          <FormControlLabel value="string" control={<Radio />} label="String" />
        )}
        {props.requiredTypes.includes("number") && (
          <FormControlLabel value="number" control={<Radio />} label="Number" />
        )}
        {props.requiredTypes.includes("boolean") && (
          <FormControlLabel
            value="boolean"
            control={<Radio />}
            label="Boolean"
          />
        )}
        {props.requiredTypes.includes("context") && (
          <FormControlLabel
            value="context"
            control={<Radio />}
            label="Context"
          />
        )}
      </RadioGroup>
      {type === "string" && (
        <TextField
          value={props.data.value}
          onChange={handleValueChange}
          label="string value"
          variant="outlined"
        />
      )}
      {type === "number" && (
        <TextField
          value={props.data.value}
          onChange={handleValueChange}
          type="number"
          label="number value"
          variant="outlined"
        />
      )}
      {type === "boolean" && (
        <RadioGroup
          row
          aria-labelledby="boolean-value-selection"
          name="boolean-value-selection-group"
          value={props.data.value}
          onChange={handleValueChange}
        >
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>
      )}
      {type === "json" && (
        <div onBlur={setJson} className="jse-theme-dark">
          <JsonEditor
            className={"json-editor"}
            mode={"text"}
            content={{
              json: props.data.value || {},
            }}
            readOnly={false}
            onChange={(changed: any) => {
              try {
                changedContent = JSON.parse(changed.text);
              } catch (e) {
                changedContent = undefined;
              }
            }}
          />
        </div>
      )}
      {type === "store" && (
        <StoreSelector
          name={(props.data.value || {}).name || ""}
          onNameChange={(name) => {
            props.onDataChange({
              ...props.data,
              value: {
                ...(props.data.value || {}),
                name,
              },
            });
          }}
          path={(props.data.value || {}).path || ""}
          onPathChange={(path) => {
            props.onDataChange({
              ...props.data,
              value: {
                ...(props.data.value || {}),
                path,
              },
            });
          }}
        />
      )}
    </Stack>
  );
};

export default ValueAssigner;
