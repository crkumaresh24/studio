import { FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import ValueAssigner, { DATA_TYPE, DATA_VALUE } from "./ValueAssigner";

interface ConstantValueAdditionProps {
  isConstant: boolean;
  value: DATA_VALUE;
  onChange: (isConstant: boolean, value: DATA_VALUE) => void;
  requiredTypes?: DATA_TYPE[];
}

const ConstantValueAddition = (props: ConstantValueAdditionProps) => {
  return (
    <Stack gap={2}>
      <FormControlLabel
        sx={{ alignItems: "flex-start", margin: 0 }}
        control={
          <Switch
            checked={props.isConstant}
            onChange={(e, isConstant) => {
              props.onChange(isConstant, props.value);
            }}
          />
        }
        label={"Is Constant"}
        labelPlacement="top"
      />
      {props.isConstant && (
        <Stack>
          <Typography variant="subtitle1">Constant Value</Typography>
          <ValueAssigner
            data={props.value}
            onDataChange={(value) => {
              props.onChange(props.isConstant, value);
            }}
            requiredTypes={
              props.requiredTypes || ["string", "boolean", "number"]
            }
          />
        </Stack>
      )}
    </Stack>
  );
};

export default ConstantValueAddition;
