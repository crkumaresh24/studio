import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React from "react";

export type DATA_TYPE = "string" | "number" | "boolean" | "json" | "store" | "context";

export interface DATA {
  type: DATA_TYPE;
  value: any | undefined;
}

interface ValueAssignerProps {
  data: DATA;
  onDataChange: (data: DATA) => void;
  requiredTypes: DATA_TYPE[];
}

const ValueAssigner = (props: ValueAssignerProps) => {
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

  return (
    <Box gap={3} sx={{ display: "flex", flexDirection: "column" }}>
      <RadioGroup
        row
        aria-labelledby="value-selection"
        name="value-selection-group"
        value={type}
        onChange={handleTypeChange}
      >
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
        {props.requiredTypes.includes("json") && (
          <FormControlLabel value="json" control={<Radio />} label="String" />
        )}
        {props.requiredTypes.includes("store") && (
          <FormControlLabel value="store" control={<Radio />} label="String" />
        )}
        {props.requiredTypes.includes("context") && (
          <FormControlLabel
            value="context"
            control={<Radio />}
            label="String"
          />
        )}
      </RadioGroup>
      {type === "string" && (
        <TextField
          value={props.data.value}
          onChange={handleValueChange}
          label="string"
          variant="outlined"
        />
      )}
      {type === "number" && (
        <TextField
          value={props.data.value}
          onChange={handleValueChange}
          type={"number"}
          label="number"
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
    </Box>
  );
};

export default ValueAssigner;
